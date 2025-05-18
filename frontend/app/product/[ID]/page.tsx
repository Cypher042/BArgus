// app/product/[producturl]/page.tsx
"use client"
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from "chart.js";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

type PriceEntry = {
  Value: number;
  Timestamp: string;
};

type Product = {
  ProductName: string;
    params: { ID: string };
  ImageURL?: string;
  [key: string]: any;

};

async function getProductData(username: string| null, ID: string): Promise<{
  product: Product | null;
  priceHistory: PriceEntry[] | null;
}> {
  try {

    const productRes = await fetch(`http://localhost:8000/api/user/${username}`, {
      cache: "no-store",
    });
    const productList: Product[] = await productRes.json();
    const product = productList.find((p) => p.ID === ID);

    if (!product) return { product: null, priceHistory: null };

    const priceRes = await fetch(
      `http://localhost:8000/api/${username}/prices/${ID}`,
      { cache: "no-store" }
    );
    const priceHistory: PriceEntry[] = await priceRes.json();

    return { product, priceHistory };
  } catch (err) {
    return { product: null, priceHistory: null };
  }
}

export default async function ProductPage({
  params,
}: {
  params: { ID: string };
}) {
   const [displayUsername, setDisplayUsername] = useState<string|null>(null);

   useEffect(() => {
     const storedUsername = sessionStorage.getItem("username");
     if (storedUsername) {
       setDisplayUsername(storedUsername);
      }
    }, []);

  const { product, priceHistory } = await getProductData(displayUsername, params.ID);
    if (!product) return notFound();

  const productName = product.ProductName;
  const productLink = product.ProductURL;

  const chartData = {
    labels: priceHistory?.map((p) => new Date(p.Timestamp).toLocaleDateString()) ?? [],
    datasets: [
      {
        label: "Price (₹)",
        data: priceHistory?.map((p) => p.Value) ?? [],
        fill: false,
        borderColor: "#db2777",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{productName}</h1>
      <a
        href={productLink}
        className="text-pink-500 text-sm underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Original Product
      </a>

      <Separator className="my-6" />

      {/* Product Info */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex gap-6">
            <img
              src={product.ImageURL || "/placeholder-image.jpg"}
              alt={productName}
              className="w-36 h-36 rounded-md object-cover border"
            />
            <div className="flex-1 space-y-2 text-sm">
              {Object.entries(product).map(([key, value]) =>
                key === "PriceHistory" || key === "ImageURL" ? null : (
                  <div key={key} className="flex justify-between border-b py-1">
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground max-w-[60%] text-right break-all">
                      {typeof value === "string" || typeof value === "number"
                        ? value
                        : JSON.stringify(value)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price History Graph */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Price History</h2>
        {priceHistory?.length ? (
          <div className="bg-muted p-4 rounded-md">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No price history available.</p>
        )}
      </div>
    </div>
  );
}
