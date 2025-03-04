package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Price struct {
	Value     float64   `bson:"value"`
	Timestamp time.Time `bson:"timestamp"`
}

type Product struct {
	ProductURL     string  `bson:"product_url"`
	ProductName    string  `bson:"product_name"`
	ImageURL       string  `bson:"image_url"`
	Specifications string  `bson:"specifications"`
	PriceHistory   []Price `bson:"price_history"`
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
	collection := database.Collection("{username}")

	// Create indexes
	_, err = collection.Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys: bson.D{
				{Key: "product_url", Value: 1},
			},
			Options: options.Index().SetUnique(true),
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

func (m *MongoDB) UpsertProduct(product Product) error {
	filter := bson.M{"product_url": product.ProductURL}
	update := bson.M{"$set": product}
	opts := options.Update().SetUpsert(true)

	_, err := m.collection.UpdateOne(context.Background(), filter, update, opts)
	return err
}

func (m *MongoDB) AddPrice(productURL string, price float64) error {
	newPrice := Price{
		Value:     price,
		Timestamp: time.Now(),
	}

	filter := bson.M{"product_url": productURL}
	update := bson.M{"$push": bson.M{"price_history": newPrice}}

	_, err := m.collection.UpdateOne(context.Background(), filter, update)
	return err
}

func (m *MongoDB) GetProduct(productURL string) (*Product, error) {
	var product Product

	err := m.collection.FindOne(
		context.Background(),
		bson.M{"product_url": productURL},
	).Decode(&product)

	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (m *MongoDB) Close() {
	m.client.Disconnect(context.Background())
}

// func main() {

// 	db, err := NewMongoDB(MongoURI)
// 	if err != nil {
// 		log.Fatalf("Failed to connect to MongoDB: %v", err)
// 	}
// 	defer db.Close()

// 	testProduct := Product{
// 		ProductURL:  "https://example.com/test-product",
// 		ProductName: "Test Product",
// 		ImageURL:    "https://example.com/test-image.jpg",
// 		Specifications: "yoo",
// 		PriceHistory: []Price{},
// 	}

// 	fmt.Println("Inserting test product...")
// 	err = db.UpsertProduct(testProduct)
// 	if err != nil {
// 		log.Fatalf("Failed to insert product: %v", err)
// 	}

// 	fmt.Println("Adding prices...")
// 	prices := []float64{99.99, 89.99, 79.99}
// 	for _, price := range prices {
// 		err = db.AddPrice(testProduct.ProductURL, price)
// 		if err != nil {
// 			log.Fatalf("Failed to add price: %v", err)
// 		}
// 		time.Sleep(1 * time.Second) 
// 	}

// 	fmt.Println("Retrieving product...")
// 	product, err := db.GetProduct(testProduct.ProductURL)
// 	if err != nil {
// 		log.Fatalf("Failed to get product: %v", err)
// 	}

// 	fmt.Printf("\nRetrieved Product:\n")
// 	fmt.Printf("URL: %s\n", product.ProductURL)
// 	fmt.Printf("Name: %s\n", product.ProductName)
// 	fmt.Printf("Image: %s\n", product.ImageURL)
// 	fmt.Printf("Specifications: %+v\n", product.Specifications)
// 	fmt.Printf("\nPrice History:\n")
// 	for _, price := range product.PriceHistory {
// 		fmt.Printf("Price: $%.2f at %s\n", price.Value, price.Timestamp.Format(time.RFC3339))
// 	}
// }
