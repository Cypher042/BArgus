package main
import (
	"log"
	"time"

	// "backend/amazon"
	// "backend/flipkart"
	// "backend/mongo"
)

type ProductURL struct {
	URL      string `bson:"url"`
	Platform string `bson:"platform"`
}

type Scheduler struct {
	db        *mongo.MongoDB
	products  []ProductURL
	interval  time.Duration
	stopChan  chan bool
	isRunning bool
}

func NewScheduler(db *mongo.MongoDB, products []ProductURL) *Scheduler {
	return &Scheduler{
		db:        db,
		products:  products,
		interval:  30 * time.Minute,
		stopChan:  make(chan bool),
		isRunning: false,
	}
}

func (s *Scheduler) Start() {
	if s.isRunning {
		return
	}

	s.isRunning = true
	go s.run()
}

func (s *Scheduler) Stop() {
	if !s.isRunning {
		return
	}

	s.stopChan <- true
	s.isRunning = false
}

func (s *Scheduler) run() {
	// Run immediately on start
	s.updatePrices()

	ticker := time.NewTicker(s.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.updatePrices()
		case <-s.stopChan:
			return
		}
	}
}

func (s *Scheduler) updatePrices() {
	for _, product := range s.products {
		var price string
		var err error

		switch product.Platform {
		case "flipkart":
			price, err = ScrapePriceFlipkart(product.URL)
		// Add cases for other platforms (Amazon, Walmart) here
		default:
			log.Printf("Unknown platform: %s", product.Platform)
			continue
		}

		if err != nil {
			log.Printf("Error scraping %s: %v", product.URL, err)
			continue
		}

		record := mongo.PriceRecord{
			ProductURL: product.URL,
			Price:      price,
			Platform:   product.Platform,
			Timestamp:  time.Now(),
		}

		err = s.db.InsertPrice(record)
		if err != nil {
			log.Printf("Error saving price for %s: %v", product.URL, err)
		}
	}
}
