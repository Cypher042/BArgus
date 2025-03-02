package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/gocolly/colly"
)

func ScrapePriceFlipkart(url string) (string, error) {
	scraper := colly.NewCollector()

	var price string

	scraper.OnHTML("div.Nx9bqj.CxhGGd", func(e *colly.HTMLElement) {
		price = e.Text
		cleanPrice := strings.TrimSpace(price)
		cleanPrice = strings.ReplaceAll(cleanPrice, "₹", "")
		cleanPrice = strings.ReplaceAll(cleanPrice, ",", "")
		price = cleanPrice
	})

	scraper.OnError(func(r *colly.Response, err error) {
		log.Println("Error:", err)
	})

	scraper.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
	})

	err := scraper.Visit(url)
	if err != nil {
		log.Fatalf("Error visiting URL: %v", err)
	}
	if price == "" {
		return "", fmt.Errorf("price not found on Amazon page")
	}
	return price, err
}

func main() {
	url := "https://www.flipkart.com/oppo-enco-buds-2-28-hours-battery-life-deep-noise-cancellation-bluetooth-headset/p/itm3344fa26518ed"
	price, err := ScrapePriceFlipkart(url)
	if err != nil {
		log.Fatalf("Error scraping Flipkart: %v", err)
	}
	fmt.Println(price)
}
