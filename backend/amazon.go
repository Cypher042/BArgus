package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/gocolly/colly"
)

func ScrapePriceAmazon(url string) (string, error) {
	scraper := colly.NewCollector(
	)


	var price string

	scraper.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
		r.Headers.Set("Accept-Language", "en-IN,en;q=0.9,hi;q=0.8")
		r.Headers.Set("X-Forwarded-For", "103.211.212.105")
		r.Headers.Set("Cookie", "session=idk; region=IN")
		r.Headers.Set("Referer", "https://www.google.co.in/")
	})

	scraper.OnHTML("span.a-price", func(e *colly.HTMLElement) {
		if e.Index == 5 {
			priceWhole := e.ChildText("span.a-price-whole")
			price = strings.ReplaceAll(priceWhole, ",", "") 
		}
	})

	scraper.OnError(func(r *colly.Response, err error) {
		log.Println("Error:", err)
	})

	err := scraper.Visit(url)

	if price == "" {
		return "", fmt.Errorf("price not found on Amazon page")
	}
	return price, err
}

// func main() {

// 	url := "https://www.amazon.in/ASUS-39-62cm-i7-13620H-GeForce-FX507VV-LP287W/dp/B0D25TQNN7/?_encoding=UTF8&pd_rd_w=WrI3M&content-id=amzn1.sym.509965a2-791b-4055-b876-943397d37ed3%3Aamzn1.symc.fc11ad14-99c1-406b-aa77-051d0ba1aade&pf_rd_p=509965a2-791b-4055-b876-943397d37ed3&pf_rd_r=ZQMF83301D8XKZRZ8H4F&pd_rd_wg=JBufz&pd_rd_r=5d101b91-19da-4411-927d-f08389d02650&ref_=pd_hp_d_atf_ci_mcx_mr_ca_hp_atf_d"
// 	url = "https://www.amazon.in/OnePlus-Wireless-Earbuds-Drivers-Playback/dp/B0C8JB3G5W/?_encoding=UTF8&pd_rd_w=TYjAs&content-id=amzn1.sym.2c8720d9-6d29-4ec6-934b-42b530789226&pf_rd_p=2c8720d9-6d29-4ec6-934b-42b530789226&pf_rd_r=ZQMF83301D8XKZRZ8H4F&pd_rd_wg=JBufz&pd_rd_r=5d101b91-19da-4411-927d-f08389d02650&ref_=pd_hp_d_atf_dealz_cs&th=1"
// 	url = "https://www.amazon.in/gp/product/B007921JYI?smid=ADG8Y7G1FAWCV&almBrandId=ctnow&psc=1&fpw=alm"
// 	// url = "https://www.amazon.in/Portable-Mechanical-Keyboard-MageGee-Backlit/dp/B098LG3N6R/?_encoding=UTF8&pd_rd_w=ysc0G&content-id=amzn1.sym.bb373a5c-8802-4d94-ac0d-fa11d27d41b3&pf_rd_p=bb373a5c-8802-4d94-ac0d-fa11d27d41b3&pf_rd_r=ZQMF83301D8XKZRZ8H4F&pd_rd_wg=CiwuT&pd_rd_r=90d48b15-1801-4811-8f6e-625765a04641&ref_=pd_hp_d_btf_cr_cartx"
// 	// url = "https://www.amazon.in/Logitech-M331-Silent-Wireless-Mouse/dp/B01M5H4B4N/261-8651419-6199515?pd_rd_w=ORrFb&content-id=amzn1.sym.aef73018-e935-4f38-8aa6-34add793f754&pf_rd_p=aef73018-e935-4f38-8aa6-34add793f754&pf_rd_r=F3CMYCVREX065ZPXVR4V&pd_rd_wg=b3vCk&pd_rd_r=958564e4-9887-4405-9a0f-7c0f1c994f34&pd_rd_i=B01M5H4B4N&psc=1"
// 	url = "https://www.amazon.in/Logitech-Receiver-Wireless-Technology-Compatible/dp/B09LQ461ZV/261-8651419-6199515?pd_rd_w=ORrFb&content-id=amzn1.sym.aef73018-e935-4f38-8aa6-34add793f754&pf_rd_p=aef73018-e935-4f38-8aa6-34add793f754&pf_rd_r=F3CMYCVREX065ZPXVR4V&pd_rd_wg=b3vCk&pd_rd_r=958564e4-9887-4405-9a0f-7c0f1c994f34&pd_rd_i=B09LQ461ZV&psc=1"
// 	price, err := ScrapePriceAmazon(url)
// 	if err != nil {

// 		log.Fatalf("Error scraping Flipkart: %v", err)
// 	}

// 	fmt.Println(price)
// }
