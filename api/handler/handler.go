package handler

import (
	"context"
	"log"
	"strings"

	"github.com/Cypher042/BArgus/api/models"
	"github.com/Cypher042/BArgus/api/utils"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "OK", "message": "API is running"})
}

func RegisterUser(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON"})
	}

	user.Username = strings.TrimSpace(user.Username)
	user.Password = strings.ToLower(strings.TrimSpace(user.Password))

	log.Println(user)
	if user.Username == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Username cannot be empty"})
	}
	if user.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Password cannot be empty"})
	}
	collection := utils.DB.Collection(user.Username)

	var existingUser models.User
	err := collection.FindOne(context.TODO(), bson.M{"username": user.Username}).Decode(&existingUser)
	if err == nil {
		return c.Status(400).JSON(fiber.Map{"error": "User already exists"})
	}
	// Insert the new user
	_, err = collection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Println(err)
		return c.Status(500).JSON(fiber.Map{"error": "Could not create user"})
	}
	return c.JSON(fiber.Map{"message": "User registered successfully"})
}

func LoginUser(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON"})
	}

	collection := utils.DB.Collection(user.Username)
	var stored models.User
	err := collection.FindOne(context.TODO(), bson.M{"username": user.Username}).Decode(&stored)
	if err != nil || stored.Password != user.Password {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid username or password"})
	}

	return c.JSON(fiber.Map{"message": "Login successful"})
}

func AddURL(c *fiber.Ctx) error {
	username := c.Params("username")
	collection := utils.DB.Collection(username)

	body := new(struct {
		URL string `json:"url"`
	})
	if err := c.BodyParser(body); err != nil || body.URL == "" {
		return c.Status(400).JSON(fiber.Map{"error": "URL is required"})
	}

	var existing models.Product
	err := collection.FindOne(context.TODO(), bson.M{"product_url": body.URL}).Decode(&existing)
	if err == nil {
		return c.Status(400).JSON(fiber.Map{"error": "URL already exists"})
	}

	product := models.Product{
		ProductURL:     body.URL,
		ImageURL:       "",
		ProductName:    "",
		Specifications: []string{},
		MaxPrice:       0,
		MinPrice:       0,
		PriceHistory:   []models.Price{},
	}

	result, err := collection.InsertOne(context.TODO(), product)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Insert failed"})
	}

	return c.Status(201).JSON(fiber.Map{"inserted_id": result.InsertedID})
}

func GetUserProds(c *fiber.Ctx) error {
	username := c.Params("username")
	collection := utils.DB.Collection(username)

	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch products"})
	}

	var products []models.Product
	if err := cursor.All(context.TODO(), &products); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Cursor error"})
	}

	return c.JSON(products)
}

func GetPriceHistory(c *fiber.Ctx) error {
	username := c.Params("username")
	idParam := c.Params("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID"})
	}

	collection := utils.DB.Collection(username)
	var product models.Product
	err = collection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&product)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	return c.JSON(product.PriceHistory)
}
