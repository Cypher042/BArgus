package notifservice

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Cypher042/BArgus/backend/models"
)

func SendNotification(product *models.Product) {

	currprice := strconv.FormatFloat(product.PriceHistory[len(product.PriceHistory)-1].Value, 'f', -1, 64)
	req, _ := http.NewRequest("POST", "https://ntfy.sh/thepricetracker" ,strings.NewReader("Now Availaible at " + currprice))
	req.Header.Set("Click", "https://home.nest.com/")
	req.Header.Set("Title", product.ProductName)
	req.Header.Set("Attach", product.ProductURL)
	// req.Header.Set("Email", "phil@example.com")
	http.DefaultClient.Do(req)

}


