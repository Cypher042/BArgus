package utils

import (
	"context"
	"github.com/Cypher042/BArgus/api/config"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var MongoClient *mongo.Client
var DB *mongo.Database
var Users *mongo.Collection
var Games *mongo.Collection

func Connect() func() {
	Client, err := mongo.Connect(options.Client().ApplyURI(config.MONGO_URI))
	if err != nil {
		panic(err)
	}

	DB = Client.Database("ThePriceTracker")
	// Users = DB.Collection("users")
	// Games = DB.Collection("games")
	return func() {
		if err := Client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}
}
