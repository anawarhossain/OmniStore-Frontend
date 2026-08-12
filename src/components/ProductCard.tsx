import { Link } from 'react-router-dom';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const out = product.status === 'OUT_OF_STOCK' || product.stock <= 0;
  return (
    <div className="card product-card">
      <div className="product-card-head">
        <h3>{product.title}</h3>
        <span className={`role role-${product.status.toLowerCase()}`}>
          {product.status}
        </span>
      </div>
      <p className="product-desc">{product.description || 'No description'}</p>
      <div className="product-meta">
        <span className="category-badge">{product.category.name}</span>
        <span>Stock: {product.stock}</span>
      </div>
      <div className="product-card-foot">
        <strong className="price">${product.price.toFixed(2)}</strong>
        <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm">
          View
        </Link>
      </div>
      {out && (
        <p className="error-text">Currently unavailable</p>
      )}
    </div>
  );
}