package scraper

import (
	"fmt"
	"strings"

	"github.com/Cypher042/BArgus/backend/models"
)

func ScrapeProductDetails(productURL string) (*models.Product, error) {
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

		filledProduct := &models.Product{
			ProductURL:     productURL,
			ProductName:    name,
			ImageURL:       imageURL,
			Specifications: specs,
			PriceHistory:   []models.Price{},
			MinPrice:       0,
			MaxPrice:       0,
		}
		return filledProduct, nil
	}else if strings.Contains(productURL, "amazon") {
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

		filledProduct := &models.Product{
			ProductURL:     productURL,
			ProductName:    name,
			ImageURL:       imageURL,
			Specifications: specs,
			PriceHistory:   []models.Price{},
			MinPrice:       0,
			MaxPrice:       0,
		}
		return filledProduct, nil
	}else if strings.Contains(productURL, "flipkart") {
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

		filledProduct := &models.Product{
			ProductURL:     productURL,
			ProductName:    name,
			ImageURL:       imageURL,
			Specifications: specs,
			PriceHistory:   []models.Price{},
			MinPrice:       0,
			MaxPrice:       0,
		}
		return filledProduct, nil
	}
	// return nil, fmt.Errorf("unsupported vendor or invalid URL: %s", productURL)
	return nil, fmt.Errorf("unsupported vendor or invalid URL: %s", productURL)
}
