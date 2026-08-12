import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiCreateReview, apiDeleteReview, apiGetProduct, apiGetReviews } from '../api';
import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { ApiError } from '../api/client';
import type { Review } from '../types';

function Stars({ rating }: { rating: number }) {
  return <span className="stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>;
}

export default function ProductDetail() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: product, loading: pLoading, error: pError } = useAsyncData(
    () => apiGetProduct(id),
    [id]
  );
  const {
    data: reviews,
    loading: rLoading,
    error: rError,
    reload: reloadReviews,
    setData: setReviews,
  } = useAsyncData(() => apiGetReviews(id), [id]);

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const created = await apiCreateReview({ rating, comment, productId: id });
      setReviews([created, ...(reviews ?? [])]);
      setComment('');
      setRating(5);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Failed to post review.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const removeReview = async (reviewId: string) => {
    try {
      await apiDeleteReview(reviewId);
      reloadReviews();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Failed to delete review.'
      );
    }
  };

  if (pLoading) return <div className="page-loading">Loading…</div>;
  if (pError || !product) {
    return (
      <div className="container">
        <p className="error-text">{pError || 'Product not found'}</p>
        <Link to="/">← Back to products</Link>
      </div>
    );
  }

  return (
    <main className="container">
      <Link to="/" className="back-link">← Back to products</Link>

      <section className="card product-detail">
        <div>
          <span className="category-badge">{product.category.name}</span>
          <span className={`role role-${product.status.toLowerCase()}`}>{product.status}</span>
        </div>
        <h1>{product.title}</h1>
        <p className="product-desc">{product.description || 'No description'}</p>
        <div className="product-meta">
          <strong className="price">${product.price.toFixed(2)}</strong>
          <span>Stock: {product.stock}</span>
          <span>ID: {product.id}</span>
        </div>
      </section>

      <section className="card reviews-section">
        <h2>Reviews ({reviews?.length ?? 0})</h2>
        {rError && <p className="error-text">{rError}</p>}

        {user ? (
          <form className="review-form" onSubmit={submitReview}>
            <div className="review-fields">
              <label>
                Rating
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Comment
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts…"
                />
              </label>
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post review'}
              </button>
            </div>
            {formError && <p className="error-text">{formError}</p>}
          </form>
        ) : (
          <p className="error-text">
            <Link to="/login">Log in</Link> to post a review.
          </p>
        )}

        {rLoading ? (
          <div className="page-loading">Loading reviews…</div>
        ) : (reviews ?? []).length === 0 ? (
          <p className="muted">No reviews yet.</p>
        ) : (
          <ul className="review-list">
            {(reviews ?? []).map((r: Review) => (
              <li key={r.id} className="review-item">
                <div className="review-head">
                  <strong>{r.user.name}</strong>
                  <Stars rating={r.rating} />
                  <span className="role role-customer">{r.rating}/5</span>
                  {user && (user.id === r.userId || user.role === 'ADMIN') && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeReview(r.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                {r.comment && <p>{r.comment}</p>}
                <small className="muted">
                  {new Date(r.createdAt).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}