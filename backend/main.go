package main

import (
	"log"
	"fmt"
	"strings"
	"github.com/Cypher042/BArgus/backend/scraper"
	"github.com/Cypher042/BArgus/backend/models"
	"github.com/Cypher042/BArgus/backend/database"
)


func main() {
	// Initialize MongoDB connection
	// mongoURI := "mongodb://localhost:27017"

	disconnect := database.Connect()
	defer disconnect()
	log.Println("Starting Scraping..")


}
