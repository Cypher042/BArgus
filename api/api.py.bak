from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from config import MongoURI
import pandas as pd
import prophet


app = Flask(__name__)
client = MongoClient(MongoURI)
db = client['price_tracker']
# collection = db['cypher']

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "OK", "message": "API is running"}), 200


@app.route('/user/<username>', methods=['GET'])
def get_userProds(username):
	collection_name = f'{username}'
	print(collection_name)
	if collection_name not in db.list_collection_names():
		return jsonify({'error': 'user not found'}), 404
	
	collection = db[collection_name]
	prices = list(collection.find())
	for price in prices:
		price['_id'] = str(price['_id'])
	return jsonify(prices)


@app.route('/user/<username>/add_url', methods=['POST'])
def addurl(username):
	collection_name = f'{username}'

	if collection_name not in db.list_collection_names():
		return jsonify({'error': 'user not found'}), 404

	data = request.get_json()
	url = data.get("url")

	if not url:
		return jsonify({"error": "Username is required"}), 400
	collection = db[collection_name]

	existing_record = collection.find_one({"product_url": url})

	if existing_record:
		return jsonify({"error": "URL already exists"})

	empty_record = {
    "product_url": f"{url}",
    "image_url": "",
    "price_history": [],
    "product_name": "",
    "specifications": [],
    "max_price": 0,
    "min_price": 0
	}

	result = collection.insert_one(empty_record)

	return jsonify({"inserted_id": str(result.inserted_id)}), 201



@app.route('/create_user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get("username")
    
    if not username:
        return jsonify({"error": "Username is required"}), 400

    if username in db.list_collection_names():
        return jsonify({"error": f"Collection '{username}' already exists"}), 400

   
    collection_name = db[username]
    collection_name.insert_one({"message": "User collection created"})

    return jsonify({"message": f"Collection '{username}' created successfully"})


@app.route('/<username>/prices/<id>', methods=['GET'])
def get_price(id, username):
	collection = db[f'{username}']
	price = collection.find_one({'_id': ObjectId(id)})
	if price:
		price['_id'] = str(price['_id'])
	return jsonify(price['price_history'])

@app.get("/predict/<username>/<product_id>")
def predict(username, product_id):
    try:
        # Connect to MongoDB and get historical data
	date = 7
        client = MongoClient(MongoURI)
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
        

        df = pd.DataFrame(list(cursor))
        print(df)
        ts = df[['timestamp', 'value']]  # Specify the desired column order
        ts.columns = ['ds', 'y']
        df = ts
        df['ds'] = pd.to_datetime(df['ds'])
        
        print(df)

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
        raise(e)

if __name__ == '__main__':
	app.run(debug=True)
