package notifservice

import (
	"net/http"
	"strings"

	"github.com/Cypher042/BArgus/backend/models"
)

func SendNotification(product *models.Product) {

	req, _ := http.NewRequest("POST", "https://ntfy.sh/thepricetracker",
		strings.NewReader(`There's someone at the door. 🐶

	Please check if it's a good boy or a hooman. 
	Doggies have been known to ring the doorbell.`))
	req.Header.Set("Click", "https://home.nest.com/")
	// req.Header.Set("Attach", "https://nest.com/view/yAxkasd.jpg")
	// req.Header.Set("Actions", "http, Open door, https://api.nest.com/open/yAxkasd, clear=true")
	// req.Header.Set("Email", "phil@example.com")
	http.DefaultClient.Do(req)

}
