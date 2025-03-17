'use client'
import { useState, useEffect } from 'react';
import { fetchDB } from '../actions/dbactions';
import Image from 'next/image';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      const data = await fetchDB();
      const foundProduct = data.find(item => item._id === productId);
      if (!foundProduct) {
        throw new Error('Product not found');
      }
      setProduct(foundProduct);
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
  }, [productId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!product) return <div className="text-center p-4">Product not found</div>;

  // Prepare data for the chart
  const chartData = {
    labels: product.price_history.map(ph =>
      new Date(ph.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Price (₹)',
        data: product.price_history.map(ph => ph.value),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price History Trend',
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Products
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6 p-6">
        {/* Image Section */}
        <div className="relative h-[300px] w-full">
          <Image
            src={product.image_url}
            alt={product.product_name}
            fill
            className="object-contain"
          />
        </div>

        {/* Product Info Section */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">{product.product_name}</h2>

          {/* Price History */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Current Price</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{product.price_history[product.price_history.length - 1].value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(product.price_history[product.price_history.length - 1].timestamp).toLocaleDateString()}
            </p>
          </div>

          {/* Product Link */}
          <div>
            <a
              href={product.product_url}
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
              {product.specifications.map((spec, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Price History Graph Section */}
      <div className="border-t p-6">
        <h3 className="font-semibold mb-6">Price History</h3>
        <div className="h-[400px] mb-8">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Price History Table */}
        <div className="mt-8">
          <h4 className="font-semibold mb-4">Detailed Price History</h4>
          <div className="space-y-2">
            {product.price_history.map((price, idx) => (
              <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                <span>{new Date(price.timestamp).toLocaleDateString()}</span>
                <span className="font-semibold">₹{price.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;