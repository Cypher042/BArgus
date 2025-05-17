package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Username string `bson:"username" json:"username"`
	Password string `bson:"password" json:"password"`
	Uid      string `bson:"uid" json:"uid"`
}

type Price struct {
	Value     float64   `bson:"value"`
	Timestamp time.Time `bson:"timestamp"`
}

type Product struct {
	ID             primitive.ObjectID `bson:"_id,omitempty"`
	ProductURL     string             `bson:"product_url"`
	ProductName    string             `bson:"product_name"`
	ImageURL       string             `bson:"image_url"`
	Specifications []string           `bson:"specifications"`
	PriceHistory   []Price            `bson:"price_history"`
	MinPrice       float64            `bson:"min_price"`
	MaxPrice       float64            `bson:"max_price"`
}
