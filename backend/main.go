package main

import (
	"fmt"
	"time"
)

func scrape() {
	fmt.Println("Scraping data at", time.Now())
}

func main() {
	ticker := time.NewTicker(30 * time.Minute)
	defer ticker.Stop()

	scrape()

	for range ticker.C {
		scrape()
	}
}
