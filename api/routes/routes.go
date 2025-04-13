package routes

import (
	"log"

	"github.com/Cypher042/BArgus/api/handler"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func Setup(app *fiber.App) {

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://34.100.248.83:5173/",
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))
	// utils.InitMongo("mongodb://localhost:27017", "price_tracker")
	log.Println("Starting Scraper")
	app.Get("/", handler.HealthCheck)
	app.Post("/register_user", handler.RegisterUser)
	app.Post("/login_user", handler.LoginUser)
	app.Get("/user/:username", handler.GetUserProds)
	app.Post("/user/:username/add_url", handler.AddURL)
	app.Get("/:username/prices/:id", handler.GetPriceHistory)

	// Prediction stub
	app.Get("/predict/:username/:product_id", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Prediction will be handled via Python microservice.",
		})
	})
}
