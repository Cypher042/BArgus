package routes

import (
	"log"

	"github.com/Cypher042/BArgus/api/handler"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func Setup(app *fiber.App) {

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://34.100.248.83:5173/, http://localhost:8000, http://localhost:3000",
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))
	//Public routes
	app.Get("/", handler.HealthCheck) // check if the API is working
	app.Post("/login_user", handler.LoginUser) // Login - Input => Username, Password; Output => json with sucess/failed option.
	app.Post("/register_user", handler.RegisterUser) // Register - Input => Username, Password; Output => Json with success msg/error


	log.Println("Starting Scraper")

	// Protected ones
	protected := app.Group("/api", handler.JWTMiddleware)

	protected.Get("/user/:username", handler.GetUserProds) // Params - Username; Output => JSON of Products
	protected.Post("/user/:username/add_url", handler.AddURL) // Params - Username ; Input => URL ; Output => Json with success/fail
	protected.Get("/:username/prices/:id", handler.GetPriceHistory) //Params - username , Prod ID ; Output = > Array of Products

	protected.Get("/predict/:username/:product_id", func(c *fiber.Ctx) error {  // Work in Progresss
		return c.JSON(fiber.Map{
			"message": "Prediction will be handled via Python microservice.",
		})
	})
}
