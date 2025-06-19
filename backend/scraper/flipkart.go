package scraper

import (
	"fmt"
	"log"
	"strings"

	"github.com/gocolly/colly"
)
func ScrapePriceFlipkart(url string) (string, error) {
	// scraper := colly.NewCollector()
	scraper := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"),
		colly.AllowURLRevisit(),
		colly.MaxDepth(1),
	)

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
		return "", fmt.Errorf("Error visiting URL: %v", err)
	}
	if price == "" {
		return "", fmt.Errorf("price not found on Flipkart page")
	}
	return price, err
}


func ScrapeImageURLFlipkart(url string) (string, error) {
	scraper := colly.NewCollector()

	var imageURL string

	scraper.OnHTML("img.DByuf4.IZexXJ.jLEJ7H", func(e *colly.HTMLElement) {
		imageURL = e.Attr("src")
	})

	scraper.OnError(func(r *colly.Response, err error) {
		log.Println("Error:", err)
	})

	scraper.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
		r.Headers.Set("Accept-Language", "en-IN,en;q=0.9,hi;q=0.8")
		r.Headers.Set("X-Forwarded-For", "103.211.212.105")
		r.Headers.Set("Cookie", "session=idkbro; region=IN")
		r.Headers.Set("Referer", "https://www.google.co.in/")
	})

	err := scraper.Visit(url)
	if err != nil {
		return "", fmt.Errorf("error visiting URL: %v", err)
	}
	if imageURL == "" {
		return "", fmt.Errorf("image URL not found on Flipkart page")
	}
	return imageURL, nil
}

func ScrapeHighlightsFlipkart(url string) ([]string, error) {
	scraper := colly.NewCollector()

	var highlights []string

	scraper.OnHTML("div.xFVion ul li", func(e *colly.HTMLElement) {
		text := strings.TrimSpace(e.Text)
		if text != "" {
			highlights = append(highlights, text)
		}
	})

	scraper.OnError(func(r *colly.Response, err error) {
		log.Println("Error:", err)
	})

	scraper.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
	})

	err := scraper.Visit(url)
	if err != nil {
		return nil, fmt.Errorf("error visiting URL: %v", err)
	}
	if len(highlights) == 0 {
		return nil, fmt.Errorf("highlights not found on Flipkart page")
	}
	return highlights, nil
}

func ScrapeNameFlipkart(url string) (string, error) {
	scraper := colly.NewCollector()

	var productName string

	// Scrape the product name (Flipkart typically uses span.B_NuCI for product titles)
	scraper.OnHTML("span.VU-ZEz", func(e *colly.HTMLElement) {
		productName = strings.TrimSpace(e.Text)
	})

	scraper.OnError(func(r *colly.Response, err error) {
		log.Println("Error:", err)
	})

	scraper.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
		r.Headers.Set("Accept-Language", "en-IN,en;q=0.9,hi;q=0.8")
		r.Headers.Set("X-Forwarded-For", "103.211.212.105")
		r.Headers.Set("Cookie", "session=idkbro; region=IN")
		r.Headers.Set("Referer", "https://www.google.co.in/")
	})

	err := scraper.Visit(url)
	if err != nil {
		return "", fmt.Errorf("error visiting URL: %v", err)
	}

	if productName == "" {
		return "", fmt.Errorf("product name not found on Flipkart page")
	}

	return productName, nil
}

// func main() {
// 	url := "https://www.flipkart.com/oppo-enco-buds-2-28-hours-battery-life-deep-noise-cancellation-bluetooth-headset/p/itm3344fa26518ed"
// 	// url = "https://www.flipkart.com/mezokart-com-silicone-press-stud-earbuds-pouch-oppo-enco-air-2/p/itm0b9d69a73b71a"
// 	price, err := ScrapePriceFlipkart(url)
// 	if err != nil {
// 		log.Fatalf("Error scraping Flipkart: %v", err)
// 	}
// 	fmt.Println(price)

// 	imageURL, err := ScrapeImageURLFlipkart(url)
// 	if err != nil {
// 		log.Fatalf("Error scraping Flipkart image: %v", err)
// 	}
// 	fmt.Println("Product Image URL:", imageURL)

// 	highlights, err := ScrapeHighlightsFlipkart(url)
// 	if err != nil {
// 		log.Fatalf("Error scraping Flipkart highlights: %v", err)
// 	}
// 	fmt.Println("Product Highlights:")
// 	for i, highlight := range highlights {
// 		fmt.Printf("%d. %s\n", i+1, highlight)
// 	}
// 	// fmt.Println(len(highlights))

// }

// func main() {
// 	url := "https://www.flipkart.com/oppo-enco-buds-2-28-hours-battery-life-deep-noise-cancellation-bluetooth-headset/p/itm3344fa26518ed"

// 	name, err := ScrapeNameFlipkart(url)
// 	if err != nil {
// 		log.Fatalf("Error scraping name: %v", err)
// 	}
// 	fmt.Printf("Product Name: %s\n", name)
// }
