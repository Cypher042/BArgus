'use client'
import { useState, useEffect } from 'react';
import { fetchDB } from '../actions/dbactions';
import Image from 'next/image';

const Fetch = () => {
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
    <div className="grid grid-cols-1 gap-8">
      {items.map((item) => (
        <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Image Section */}
            <div className="relative h-[300px] w-full">
              <Image
                src={item.image_url}
                alt={item.product_name}
                fill
                className="object-contain"
              />
            </div>

            {/* Product Info Section */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">{item.product_name}</h2>

              {/* Price History */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Current Price</h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{item.price_history[item.price_history.length - 1].value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(item.price_history[item.price_history.length - 1].timestamp).toLocaleDateString()}
                </p>
              </div>

              {/* Product Link */}
              <div>
                <a
                  href={item.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Amazon
                </a>
              </div>

              {/* Specifications */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Specifications</h3>
                <ul className="list-disc list-inside space-y-2">
                  {item.specifications.map((spec, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Price History Chart Section */}
          <div className="border-t p-6">
            <h3 className="font-semibold mb-4">Price History</h3>
            <div className="space-y-2">
              {item.price_history.map((price, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{new Date(price.timestamp).toLocaleDateString()}</span>
                  <span className="font-semibold">₹{price.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Fetch;
