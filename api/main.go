package main

import (
	"log"

	"github.com/Cypher042/BArgus/api/utils"
	"github.com/Cypher042/BArgus/api/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	log.Println("Connecting to DB.")
	disconnect := utils.Connect()
	defer disconnect()
	log.Println("Starting Server...")
	app := fiber.New(fiber.Config{
		StrictRouting:     true,
		AppName:           "BArgus",
		EnablePrintRoutes: true,
	})
	routes.Setup(app)
	app.Listen("0.0.0.0:8000")
}
