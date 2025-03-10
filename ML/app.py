from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
import prophet
from config import MONGODB_URI

app = FastAPI()

@app.get("/predict/{username}/{product_id}")
async def predict(username: str, product_id: str, days: int = 7):
    try:
        # Connect to MongoDB and get historical data
        client = MongoClient(MONGODB_URI)
        db = client['price_tracker']
        collection = db[username]       
        
        # Fetch historical data for the specific product using ObjectId
        print(product_id)
        cursor = collection.aggregate([
            {'$match': {'_id': ObjectId(product_id)}},
            {'$unwind': '$price_history'},
            {'$project': {
                'value': '$price_history.value',
                'timestamp': '$price_history.timestamp',
                '_id': 0
            }}
        ])
        print(product_id)
        
        # Convert to DataFrame and check if any data was found
        # df = pd.DataFrame(list(cursor))
        # if df.empty:
        #     raise HTTPException(
        #         status_code=404,
        #         detail=f"No data found for product_id: {product_id} in user {username}'s collection"
        #     )
            
        # # Convert to DataFrame and prepare for Prophet
        df = pd.DataFrame(list(cursor))
        print(df)
        ts = df[['timestamp', 'value']]  # Specify the desired column order
        ts.columns = ['ds', 'y']
        df = ts
        df['ds'] = pd.to_datetime(df['ds'])
        
        print(df)
        # Train model and make predictions
        model = prophet.Prophet()
        model.fit(df)
        future = model.make_future_dataframe(periods=days, include_history=True)
        forecast = model.predict(future)
        
        # Get latest predictions
        predictions = forecast.tail(days)
        
        return {
            "product_id": product_id,
            "predictions": [
                {
                    "date": row['ds'].strftime("%Y-%m-%d"),
                    "price": row['yhat']
                } for _, row in predictions.iterrows()
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}