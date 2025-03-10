package main

import (
	// "fmt"
	// "time"
	"log"
	// "context"
	"fmt"
	"strings"
)

func scrapeProductDetails(productURL string) (*Product, error) {
	if strings.Contains(productURL, "amazon") {
		// Get product name
		fmt.Println(productURL)
		name, err := ScrapeNameAmazon(productURL)
		if err != nil {
			return nil, fmt.Errorf("failed to scrape name: %v", err)
		}

		// Get image URL
		imageURL, err := ScrapeImageURLAmazon(productURL)
		if err != nil {
			return nil, fmt.Errorf("failed to scrape image URL: %v", err)
		}

		// Get specifications
		specs, err := ScrapeFeatureListAmazon(productURL)
		if err != nil {
			return nil, fmt.Errorf("failed to scrape specifications: %v", err)
		}

		filledProduct := &Product{
			ProductURL:     productURL,
			ProductName:    name,
			ImageURL:       imageURL,
			Specifications: specs,
			PriceHistory:   []Price{},
			MinPrice:       0,
			MaxPrice:       0,
		}
		return filledProduct, nil
	}
	if strings.Contains(productURL, "flipkart") {
		// Get product name
		name, err := ScrapeNameFlipkart(productURL)
		if err != nil {
			return nil, fmt.Errorf("failed to scrape name: %v", err)
		}

		// Get image URL
		imageURL, err := ScrapeImageURLFlipkart(productURL)
		if err != nil {
			return nil, fmt.Errorf("failed to scrape image URL: %v", err)
		}

		// Get specifications
		specs, err := ScrapeHighlightsFlipkart(productURL)
		if err != nil {
			return nil, fmt.Errorf("failed to scrape specifications: %v", err)
		}

		filledProduct := &Product{
			ProductURL:     productURL,
			ProductName:    name,
			ImageURL:       imageURL,
			Specifications: specs,
			PriceHistory:   []Price{},
			MinPrice:       0,
			MaxPrice:       0,
		}
		return filledProduct, nil
	}
	// return nil, fmt.Errorf("unsupported vendor or invalid URL: %s", productURL)
	return nil, fmt.Errorf("unsupported vendor or invalid URL: %s", productURL)
}

func main() {
	// Initialize MongoDB connection
	// mongoURI := "mongodb://localhost:27017"
	db, err := NewMongoDB(MongoURI, "cypher")
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer db.Close()

	// Update prices
	fmt.Println("Starting price update...")
	err = db.UpdateIncompleteRecords()
	
	if err != nil {
		log.Fatalf("Failed to update prices: %v", err)
	}
	err = db.UpdatePrices()
	if err != nil {
		log.Fatalf("Failed to update prices: %v", err)
	}
	fmt.Println("Price update completed!")
}
