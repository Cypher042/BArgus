// app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

async function getProductAndPrices(username: string, id: string) {
  const [productRes, pricesRes] = await Promise.all([
    fetch(`http://localhost:8000/api/user/${username}`,{
        credentials:"include",
        method:"GET",
        headers: {
            content :"application/json"
        }
    }),
    fetch(`http://localhost:8000/api/${username}/prices/${id}`,{
        credentials:"include",
        method:"GET",
        headers: {
            content :"application/json"
        }
    }),
  ]);

  if (!productRes.ok) return null;

  const userData = await productRes.json();
  const product = userData.products.find((p: any) => p.id === id);
  const priceHistory = await pricesRes.json();

  return { product, priceHistory };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [username, setUsername] = useState(""); 
  const { id } = params;
  const data = await getProductAndPrices(username, id);

  if (!data) return notFound();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const { product, priceHistory } = data;
  const { image, name, price, link, ...rest } = product;

  const latestPrice = priceHistory && priceHistory.length > 0
    ? priceHistory[priceHistory.length - 1].price
    : null;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-pink-500 hover:underline text-sm">← Back</Link>
        <h1 className="text-3xl font-bold">{name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="relative h-64 md:h-96">
            <Image src={image} alt={name} fill className="object-contain rounded-xl" />
          </CardContent>
        </Card>

        <Card className="bg-[#121212]">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">
                Price: {latestPrice !== null ? `$${latestPrice}` : <span className="text-gray-400">No price data</span>}
              </h2>
              <p className="text-sm text-blue-400 break-words">
                <a href={link} target="_blank" rel="noopener noreferrer" className="underline">Product Link</a>
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#ff00e0" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a1a1a]">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(rest).map(([key, value]) => (
            <div key={key}>
              <h4 className="uppercase text-gray-400 text-xs">{key}</h4>
              <p className="text-white text-sm break-words">{String(value)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

