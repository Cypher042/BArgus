from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
import prophet as pp
from config import MONGODB_URI

app = FastAPI()

@app.get("/predict/{username}/{product_id}")
async def predict(username: str, product_id: str, days: int = 7):
    try:
        # Connect to MongoDB and get historical data
        client = MongoClient(MONGODB_URI)
        db = client['ThePriceTracker']
        collection = db[username]       
        
        # Fetch historical data for the specific product using ObjectId
        print(product_id)
        cursor = collection.aggregate([
            {'$match': {'_id': product_id}},
            {'$unwind': '$price_history'},
            {'$project': {
                'value': '$price_history.value',
                'timestamp': '$price_history.timestamp',
                '_id': 0
            }}
        ])
        # print(list(cursor))
        
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
        best_params = {'changepoint_prior_scale': 0.05459000531305852, 'changepoint_range': 0.6579683709175497, 'daily_seasonality': True, 'growth': 'linear', 'interval_width': 0.8033028876267627, 'n_changepoints': 450, 'seasonality_mode': 'multiplicative', 'seasonality_prior_scale': 5.999503574189418, 'uncertainty_samples': 1000, 'weekly_seasonality': False, 'yearly_seasonality': False}

        # Train model and make predictions
        model = pp.Prophet(
        changepoint_prior_scale=best_params['changepoint_prior_scale'],
        changepoint_range=best_params['changepoint_range'],
        daily_seasonality=best_params['daily_seasonality'],
        growth=best_params['growth'],
        interval_width=best_params['interval_width'],
        n_changepoints=best_params['n_changepoints'],
        seasonality_mode=best_params['seasonality_mode'],
        seasonality_prior_scale=best_params['seasonality_prior_scale'],
        uncertainty_samples=best_params['uncertainty_samples'],
        weekly_seasonality=best_params['weekly_seasonality'],
        yearly_seasonality=best_params['yearly_seasonality']
        )        
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

@app.get("/")
async def health_check():
    return {"status": "healthy"}
