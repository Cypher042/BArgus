"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const AddUrl = () => {
  const [url, setUrl] = useState<string>("");
  const router = useRouter();

  async function handleAddUrl(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent page reload

    const username = sessionStorage.getItem("username");
    if (!username) {
        toast.error("Please log in to add a URL");
      // Optionally, redirect to login page or show a modal
      router.push("/login");
      console.error("Username not found in sessionStorage");
      return;
    }

    try {
      const response = await fetch(`http://20.2.89.187:8000/api/user/${username}/add_url`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ url }), // Send the URL
      });

      if (!response.ok) {
        throw new Error("Failed to add URL");
      }


      setUrl("");
      toast.success("🎉 Added to Watchlist!", {
        description: "We'll track the price and alert you on drops 📉",
      });
      console.log("URL added successfully!");
    } catch (err) {
      console.error("Error adding URL:", err);
    }
  }

  return (
    <section className="w-full bg-background mt-24 px-4">
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Side */}
          <div className="text-left md:max-w-[50%] space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
              Ready to Explore?
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Add your product to the watchlist and get notified when there is a price drop.
            </p>
          </div>

          {/* Form Side */}
          <form
            onSubmit={handleAddUrl}
            className="w-full md:w-[50%] flex flex-col md:flex-row items-center gap-4"
          >
            <input
              type="url"
              placeholder="Enter product URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow px-4 py-3 rounded-md text-foreground bg-background border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit" size="lg" className="h-12 w-full md:w-auto">
              Add Product
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddUrl;
