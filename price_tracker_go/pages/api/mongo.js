"use server"
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://cypher:saxsux@myclust.y1ydu.mongodb.net/?retryWrites=true&w=majority&appName=MyClust";
//Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let isConnected = false;

async function connect(){
    try{
        await client.connect();
        console.log("Connect to Database");
        isConnected = true ;
    }catch(error){
        console.error("Failed to connect to database : ".error);
    }
}


async function checkConnection() {
    if (!isConnected) {
      await connect();
    }
  }

  module.exports =   {checkConnection, client};

