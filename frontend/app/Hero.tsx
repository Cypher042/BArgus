"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { encode } from 'js-base64';
import Slider from "react-slick";
import { Button } from "@/components/ui/button";

interface Product {
  ID:string;
  ProductURL: string;
  ProductName: string;
  ImageURL: string;
  Specifications: string[] | null;
  PriceHistory: { Value: number; Timestamp: string }[] | null;
  MinPrice: number;
  MaxPrice: number;
}

export default function Hero() {
  const [displayUsername, setDisplayUsername] = useState<string | null>(null);
  const [listOfProducts, setListOfProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setDisplayUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (displayUsername) {
      fetchProducts();
    }
  }, [displayUsername]);

  function isValidProduct(product: Product): boolean {
    return (
      typeof product.ProductURL === "string" &&
      product.ProductURL.trim() !== "" &&
      typeof product.ProductName === "string" &&
      product.ProductName.trim() !== ""
    );
  }

  async function fetchProducts() {
    try {
      
      setLoading(true);
      const authToken = sessionStorage.getItem("authToken");
      const result = await fetch(
        `http://20.2.89.187:8000/api/user/${displayUsername}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
          credentials: "include",
        }
      );

      if (!result.ok) {
        if (result.status === 401) {
          sessionStorage.removeItem("username");
          sessionStorage.removeItem("authToken");
          window.location.href = "/login";
          return;
        }
        const errorData = await result.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Product list error: ${result.status}`
        );
      }

      const data = await result.json();
      const filtered = Array.isArray(data) ? data.filter(isValidProduct) : [];
      setListOfProducts(filtered);
    } catch (err) {
      // toast.error(
      //   err instanceof Error
      //     ? err.message
      //     : "Failed to fetch products. Please try again."
      // );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getLatestPrice(
    priceHistory: { Value: number; Timestamp: string }[] | null
  ) {
    if (!priceHistory || priceHistory.length === 0) return null;
    return priceHistory[priceHistory.length - 1];
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {displayUsername ? `${displayUsername}'s Products` : "Your Products"}
      </h1>

      {loading ? (
        <div className="text-center">Please sign-in to see your products</div>
      ) : listOfProducts.length === 0 ? (
        <div className="text-center text-muted-foreground ">
          <p className="text-lg text-muted-foreground m-2">
             No products found.</p>


        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background rounded-md">
            <thead className="text-left text-muted-foreground border-b">
              <tr className="text-sm">
                <th className="p-4">Product</th>
                <th className="p-4">Latest Price</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4">Price Trend</th>
              </tr>
            </thead>
            <tbody>
              {listOfProducts.map((product, index) => {
                const latestPrice = getLatestPrice(product.PriceHistory);
                return (
                  <tr
                    key={index}
                    className="hover:bg-muted cursor-pointer transition"
                    onClick={() =>
                      router.push(`/product/${product.ID}`)
                    }
                  >
                    <td className="p-4 flex items-center gap-4">
                      <Image
                        src={product.ImageURL || "/placeholder-image.jpg"}
                        alt={product.ProductName}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                      <span className="font-medium line-clamp-1 max-w-[200px]">
                        {product.ProductName}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-semibold">
                      {latestPrice
                        ? `₹${latestPrice.Value.toLocaleString()}`
                        : "N/A"}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {latestPrice ? formatDate(latestPrice.Timestamp) : "N/A"}
                    </td>
                    <td className="p-4">
                      {/* Placeholder for mini chart */}
                      <div className="h-8 w-24 bg-muted rounded" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
