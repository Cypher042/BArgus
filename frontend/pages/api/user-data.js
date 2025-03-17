import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectToDatabase } from "../../lib/db";
import mongoose from "mongoose";

const UserData = mongoose.models.UserData || mongoose.model("UserData", new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    data: mongoose.Schema.Types.Mixed,
}, { timestamps: true }));

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();
    const userId = session.user.id;

    if (req.method === "GET") {
        const userData = await UserData.findOne({ userId });
        return res.status(200).json(userData || { message: "No data found" });
    }

    if (req.method === "POST") {
        const { data } = req.body;
        await UserData.findOneAndUpdate({ userId }, { data }, { upsert: true });
        return res.status(201).json({ message: "User data updated" });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
