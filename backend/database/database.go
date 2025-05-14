package database

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/Cypher042/BArgus/backend/config"
	"github.com/Cypher042/BArgus/backend/models"
	"github.com/Cypher042/BArgus/backend/notifservice"
	"github.com/Cypher042/BArgus/backend/scraper"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var Client *mongo.Client
var DB *mongo.Database

// var User *mongo.Collection
// var Games *mongo.Collection

func Connect() func() {
	Client, err := mongo.Connect(options.Client().ApplyURI(config.MONGO_URI))
	if err != nil {
		panic(err)
	}

	DB = Client.Database("ThePriceTracker")

	return func() {
		if err := Client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}
}

func UpsertProduct(product models.Product, user string) error {
	// 1. Try to find an existing product with the same URL
	var existingProduct models.Product

	collection := DB.Collection(user)

	err := collection.FindOne(
		context.Background(),
		bson.M{"product_url": product.ProductURL},
	).Decode(&existingProduct)

	// 2. Handle potential errors from the find operation
	if err != nil && err != mongo.ErrNoDocuments {
		return fmt.Errorf("error checking existing product: %v", err)
	}

	// 3. If product exists, preserve its price history
	if err != mongo.ErrNoDocuments {
		product.PriceHistory = existingProduct.PriceHistory
		// Initialize min/max from existing product
		// product.MinPrice = existingProduct.MinPrice
		// product.MaxPrice = existingProduct.MaxPrice
	}

	filter := bson.M{"product_url": product.ProductURL}
	update := bson.M{"$set": product}
	opts := options.UpdateOne().SetUpsert(true)
	opts.SetUpsert(true)

	_, err = collection.UpdateOne(context.Background(), filter, update, opts)
	return err
}

// func AddPrice(productURL string, price float64) error {
// 	newPrice := Price{
// 		Value:     price,
// 		Timestamp: time.Now(),
// 	}

// 	filter := bson.M{"product_url": productURL}
// 	update := bson.M{"$push": bson.M{"price_history": newPrice}}

// 	_, err := m.collection.UpdateOne(context.Background(), filter, update)
// 	return err
// }

// func GetProduct(productURL string) (*models.Product, error) {
// 	var product models.Product

// 	err := m.collection.FindOne(
// 		context.Background(),
// 		bson.M{"product_url": productURL},
// 	).Decode(&product)

// 	if err != nil {
// 		return nil, err
// 	}
// 	return &product, nil
// }

func UpdatePrices(user string) error {
	// Get all products
	collection := DB.Collection(user)
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return fmt.Errorf("failed to find products: %v", err)
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var product models.Product
		if err := cursor.Decode(&product); err != nil {
			log.Printf("Error decoding product: %v\n", err)
			continue
		}

		var currentPrice float64
		var err error
		var sendnotif bool = false

		if strings.Contains(product.ProductURL, "flipkart") {
			priceStr, err := scraper.ScrapePriceFlipkart(product.ProductURL)
			if err != nil {
				log.Printf("Error scraping Flipkart price for %s: %v\n", product.ProductURL, err)
				continue
			}
			currentPrice, err = strconv.ParseFloat(priceStr, 64)
			if err != nil {
				log.Printf("Error parsing price %s: %v\n", priceStr, err)
				continue
			}
		} else if strings.Contains(product.ProductURL, "amazon") {
			priceStr, err := scraper.ScrapePriceAmazon(product.ProductURL)
			fmt.Println(priceStr)
			if err != nil {
				log.Printf("Error scraping Amazon price for %s: %v\n", product.ProductURL, err)
				continue
			}
			currentPrice, err = strconv.ParseFloat(priceStr, 64)
			if err != nil {
				log.Printf("Error parsing price %s: %v\n", priceStr, err)
				continue
			}
		} else {
			log.Printf("Unsupported vendor for URL: %s\n", product.ProductURL)
			continue
		}
			
			// currentPrice := int(product.PriceHistory[len(product.PriceHistory)-1].Value)
		if product.MinPrice == 0 || currentPrice < product.MinPrice {
			product.MinPrice = currentPrice
			sendnotif = true
			
		}
		if product.MaxPrice == 0 || currentPrice > product.MaxPrice {
			product.MaxPrice = currentPrice
		}

		newPrice := models.Price{
			Value:     currentPrice,
			Timestamp: time.Now(),
		}

		update := bson.M{
			"$push": bson.M{
				"price_history": newPrice,
			},
			"$set": bson.M{
				"min_price": product.MinPrice,
				"max_price": product.MaxPrice,
			},
		}

		_, err = collection.UpdateOne(
			context.Background(),
			bson.M{"product_url": product.ProductURL},
			update,
		)
		if err != nil {
			log.Printf("Error updating price for %s: %v\n", product.ProductURL, err)
			continue
		}
		if (sendnotif){
			notifservice.SendNotification(&product)
		}

		fmt.Printf("Updated price for %s: %.2f\n", product.ProductName, currentPrice)
	}
	return nil
}

func UpdateIncompleteRecords(user string) error {

	collection := DB.Collection(user)
	fmt.Println("\nProcessing incomplete records...")
	cursor, err := collection.Find(context.Background(), bson.M{
		"$or": []bson.M{
			{"product_name": ""},
			{"product_name": bson.M{"$exists": false}},
			{"image_url": ""},
			{"image_url": bson.M{"$exists": false}},
			{"specifications": bson.M{"$size": 0}},
			{"specifications": bson.M{"$exists": false}},
		},
	})
	if err != nil {
		log.Fatalf("Could not find incomplete records: %v", err)
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var product models.Product
		if err := cursor.Decode(&product); err != nil {
			log.Printf("Error decoding product: %v\n", err)
			continue
		}

		url := (product.ProductURL)

		updatedProduct, err := scraper.ScrapeProductDetails(url)

		if err != nil {
			log.Printf("Error updating product %s: %v\n", product.ProductURL, err)
			continue
		}

		err = UpsertProduct(*updatedProduct, user)
		if err != nil {
			log.Printf("Error updating product %s: %v\n", product.ProductURL, err)
			continue
		}
		fmt.Printf("Successfully updated product: %s\n", product.ProductURL)
	}
	return nil
}

func Close() {
	Client.Disconnect(context.Background())
}
