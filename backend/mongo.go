package main

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type PriceRecord struct {
	ProductURL string    `bson:"product_url"`
	Price      string    `bson:"price"`
	Platform   string    `bson:"platform"`
	Timestamp  time.Time `bson:"timestamp"`
}

type MongoDB struct {
	client     *mongo.Client
	database   *mongo.Database
	collection *mongo.Collection
}

func NewMongoDB(uri string) (*MongoDB, error) {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}

	// Ping the database to verify connection
	err = client.Ping(context.Background(), nil)
	if err != nil {
		return nil, err
	}

	database := client.Database("price_tracker")
	collection := database.Collection("price_history")

	// Create indexes
	_, err = collection.Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys: bson.D{
				{Key: "product_url", Value: 1},
				{Key: "timestamp", Value: -1},
			},
		},
	)
	if err != nil {
		return nil, err
	}

	return &MongoDB{
		client:     client,
		database:   database,
		collection: collection,
	}, nil
}

func (m *MongoDB) InsertPrice(record PriceRecord) error {
	_, err := m.collection.InsertOne(context.Background(), record)
	return err
}

func (m *MongoDB) GetPriceHistory(productURL string) ([]PriceRecord, error) {
	var records []PriceRecord

	cursor, err := m.collection.Find(
		context.Background(),
		bson.M{"product_url": productURL},
		options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}),
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	err = cursor.All(context.Background(), &records)
	return records, err
}

func (m *MongoDB) Close() {
	m.client.Disconnect(context.Background())
}
