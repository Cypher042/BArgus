package handler

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/Cypher042/BArgus/api/config"
	"github.com/Cypher042/BArgus/api/models"
	"github.com/Cypher042/BArgus/api/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
	"golang.org/x/crypto/bcrypt"
)

func createToken(uid string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"uid": uid,
			"exp": time.Now().Add(time.Hour * 24).Unix(),
		},
	)
	tokenString, err := token.SignedString([]byte(config.JWT_SECRET))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
func HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "OK", "message": "API is running"})
}

func RegisterUser(c *fiber.Ctx) error {
	
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON"})
	}
	
	if hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost); err != nil {
		return (err)
	} else {
		user.Password = string(hashedPassword)
	}
	user.Username = strings.TrimSpace(user.Username)
	user.Uid = uuid.New().String()

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
	// Compare the hashed password
	if(err != nil){
		return c.Status(401).JSON(fiber.Map{"error": "Invalid username or password"})
	}
    if err := bcrypt.CompareHashAndPassword([]byte(stored.Password), []byte(user.Password)); err != nil {
        return c.Status(401).JSON(fiber.Map{"error": "Invalid username or password"})
    }

    uid := stored.Uid
	if jwtString, err := createToken(uid); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error" : "Error while logging in"})
	} else {
		cookie := &fiber.Cookie{
			Name:     "token",
			Value:    jwtString,
			Expires:  time.Now().Add(24 * time.Hour),
			HTTPOnly: true,
			Secure:   false,
			SameSite: fiber.CookieSameSiteLaxMode,
			Path:     "/",
		}
		c.Cookie(cookie)
		uid_cookie := &fiber.Cookie{
			Name:     "uid",
			Value:    uid,
			HTTPOnly: false,
			Secure:   false,
			Path:     "/",
		}
		c.Cookie(uid_cookie)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Login successful"})
	}

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
		PID : uuid.New().String(),
		ProductURL:     body.URL,
		ImageURL:       "",
		ProductName:    "",
		Specifications: []string{},
		MaxPrice:       0,
		MinPrice:       0,
		PriceHistory:   []models.Price{},
	}

	_, err = collection.InsertOne(context.TODO(), product)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Insert failed"})
	}

	return c.Status(201).JSON(fiber.Map{"inserted_id": product.PID})

}

func GetUserProds(c *fiber.Ctx) error {
	username := c.Params("username")
	collection := utils.DB.Collection(username)

	filter := bson.M{
        "username": bson.M{
            "$exists": false,
        },
    }

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch products"})
	}
	for cursor.Next(context.TODO()) {
		var result bson.M
		if err := cursor.Decode(&result); err != nil {
			log.Println("Error decoding document:", err)
			continue
		}
		log.Println(result)
	}
	var products []models.Product
	if err := cursor.All(context.TODO(), &products); err != nil {
		log.Println("Error decoding cursor:", err)
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
