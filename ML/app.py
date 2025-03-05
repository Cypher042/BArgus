from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import pandas as pd
import prophet

app = FastAPI()

@app.post("/predict")
async def predict(url: str, days: int = 7):
    try:
        # Connect to MongoDB and get historical data
        client = MongoClient('mongodb://localhost:27017/')
        db = client['price_tracker']
        collection = db['cypher']
        
        # Fetch historical data for the specific URL
        cursor = collection.aggregate([
            {'$match': {'product_url': url}},
            {'$unwind': '$price_history'},
            {'$project': {
                'value': '$price_history.value',
                'timestamp': '$price_history.timestamp',
                '_id': 0
            }}
        ])
        
        # Convert to DataFrame and prepare for Prophet
        df = pd.DataFrame(list(cursor))
        df.columns = ['y', 'ds']
        df['ds'] = pd.to_datetime(df['ds'])
        
        # Train model and make predictions
        model = prophet.Prophet()
        model.fit(df)
        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)
        
        # Get latest predictions
        predictions = forecast.tail(days)
        
        return {
            "url": url,
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