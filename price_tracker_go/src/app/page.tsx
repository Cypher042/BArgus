import ProductList from "./components/ProductList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Price Tracker</h1>
        <ProductList />
      </div>
    </main>
  );
}
