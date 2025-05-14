package handler

import (
    "github.com/Cypher042/BArgus/api/config"
    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v5"
    "log"
)

func JWTMiddleware(c *fiber.Ctx) error {
    // Get the token from the cookie
    tokenString := c.Cookies("token")
    if tokenString == "" {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized: No token provided"})
    }

    // Parse and validate the token
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // Ensure the signing method is correct
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid signing method")
        }
        return []byte(config.JWT_SECRET), nil
    })

    if err != nil || !token.Valid {
        log.Println("Invalid token:", err)
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized: Invalid token"})
    }

    // Extract claims and set them in the context (optional)
    if claims, ok := token.Claims.(jwt.MapClaims); ok {
        c.Locals("uid", claims["uid"])
    } else {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized: Invalid claims"})
    }

    // Proceed to the next handler
    return c.Next()
}