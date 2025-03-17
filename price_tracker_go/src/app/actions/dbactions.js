'use server'
import { checkConnection, client} from "../../../pages/api/mongo"

export async function fetchDB(){
    try {
         await checkConnection();
         const db = client.db('price_tracker')
        // Perform database operations
        const results = await db.collection('cypher').find().toArray()

        // Convert MongoDB documents to plain objects
        const plainResults = results.map(doc => ({
            ...doc,
            _id: doc._id.toString(), // Convert ObjectId to string
            price_history: doc.price_history.map(ph => ({
                value: ph.value,
                timestamp: ph.timestamp.toISOString() // Convert Date to ISO string
            }))
        }))

        return plainResults
    } catch (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch data from database')
    }
}