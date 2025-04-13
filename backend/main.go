package main

import (
	"log"
	"github.com/Cypher042/BArgus/backend/database"
)


func main() {
	// Initialize MongoDB connection
	// mongoURI := "mongodb://localhost:27017"

	disconnect := database.Connect()
	defer disconnect()
	log.Println("Starting Scraping..")

	err := database.UpdateIncompleteRecords("cypher")

	log.Println(err)
	log.Println("starting price update")

	log.Println(database.UpdatePrices("cypher"))


}
