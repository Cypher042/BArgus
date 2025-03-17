'use client'
import { useState, useEffect } from 'react';
import { fetchDB } from '../actions/dbactions';
import Image from 'next/image';
import Link from 'next/link';

const ProductList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      const data = await fetchDB();
      setItems(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link href={`/product/${item._id}`} key={item._id}>
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer">
            <div className="relative h-48 w-full">
              <Image
                src={item.image_url}
                alt={item.product_name}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                {item.product_name}
              </h2>
              <p className="text-xl font-bold text-green-600">
                ₹{item.price_history[item.price_history.length - 1].value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(item.price_history[item.price_history.length - 1].timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;