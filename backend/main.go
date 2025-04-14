package main

import (
	"context"
	"log"

	"github.com/Cypher042/BArgus/backend/database"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func main() {
	// Initialize MongoDB connection
	disconnect := database.Connect()
	defer disconnect()

	log.Println("Listing all collections...")
	collections, err := database.DB.ListCollectionNames(context.TODO(), bson.M{})
	log.Println(collections)
	if err != nil {
		log.Fatalf("Error listing collections: %v", err)
	}

	for _, collectionName := range collections {

		log.Printf("Processing collection: %s", collectionName)
		// Example: Call UpdateIncompleteRecords for each collection
		err := database.UpdateIncompleteRecords(collectionName)
		if err != nil {
			log.Printf("Error updating incomplete records for collection %s: %v", collectionName, err)
		}

		// Example: Call UpdatePrices for each collection
		err = database.UpdatePrices(collectionName)
		if err != nil {
			log.Printf("Error updating prices for collection %s: %v", collectionName, err)
		}
	}

	log.Println("Finished processing all collections.")

}
