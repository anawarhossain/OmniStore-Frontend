import { useState } from 'react';
import { apiGetCategories, apiGetProducts } from '../api';
import { useAsyncData } from '../hooks/useAsyncData';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useAsyncData(apiGetProducts);
  const { data: categories } = useAsyncData(apiGetCategories);

  const filtered = activeCategory
    ? products?.filter((p) => p.categoryId === activeCategory) ?? []
    : products ?? [];

  return (
    <main className="container">
      <section className="hero">
        <h1>Welcome to OmniStore</h1>
        <p>
          Browse our catalogue, read reviews, and place orders — all managed
          live from your React frontend.
        </p>
      </section>

      <div className="category-chips">
        <button
          className={`chip ${activeCategory === null ? 'chip-active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {(categories ?? []).map((c) => (
          <button
            key={c.id}
            className={`chip ${
              activeCategory === c.id ? 'chip-active' : ''
            }`}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {productsError && <p className="error-text">{productsError}</p>}
      {productsLoading ? (
        <div className="page-loading">Loading products…</div>
      ) : filtered.length === 0 ? (
        <p className="error-text">No products found.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}