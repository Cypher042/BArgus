import mongoose from "mongoose";
import { connectToDatabase } from "../../lib/db";

const getUserCollection = (userId) => {
    const schema = new mongoose.Schema(
        {
            data: mongoose.Schema.Types.Mixed,
            createdAt: { type: Date, default: Date.now },
        },
        { collection: `user_${userId}` }
    );

    return mongoose.models[`user_${userId}`] || mongoose.model(`user_${userId}`, schema);
};

const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    userId: { type: String, unique: true, required: true }
}));

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectToDatabase();
        const { username } = req.body; // Get username from request body

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        let user = await User.findOne({ username });

        if (!user) {
            user = await User.create({ username, userId: new mongoose.Types.ObjectId().toString() });

            const UserCollection = getUserCollection(user.userId);
            await UserCollection.create({ data: "Welcome document!" });

            return res.status(201).json({ message: "User registered, collection created!", user });
        }

        const UserCollection = getUserCollection(user.userId);
        const documents = await UserCollection.find();

        return res.status(200).json({ message: "User exists, fetched collection!", documents });

    } catch (error) {
        console.error("Error handling user login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
