import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { productURL } = req.body;

    if (!productURL) {
      return res.status(400).json({ message: "Product URL is required" });
    }

    // Replace with your Go backend URL
    const backendURL = "http://localhost:5000/scrape"; // Change this if needed

    // Forward the request to the Go backend
    const response = await axios.post(backendURL, { productURL });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error scraping product", error: error.message });
  }
}
