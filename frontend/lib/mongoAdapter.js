import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import  connectToDatabase from "./db"

export default async function mongoAdapter() {
    const { db } = await connectToDatabase(); 
    return MongoDBAdapter(db);
}
