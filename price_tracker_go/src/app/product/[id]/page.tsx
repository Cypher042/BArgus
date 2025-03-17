import ProductDetail from '@/app/components/ProductDetail';

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail productId={params.id} />
      </div>
    </main>
  );
}