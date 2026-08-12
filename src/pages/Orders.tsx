import { useState, type FormEvent } from 'react';
import {
  apiCreateOrder,
  apiDeleteOrder,
  apiGetOrders,
  apiGetProducts,
  apiUpdateOrder,
} from '../api';
import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { ApiError } from '../api/client';
import type { Order, OrderStatus, Product } from '../types';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export default function Orders() {
  const { user } = useAuth();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: orders, loading, error, reload } = useAsyncData(apiGetOrders);
  const { data: products } = useAsyncData(apiGetProducts);

  const availableProducts = (products ?? []).filter(
    (p: Product) => p.status !== 'OUT_OF_STOCK' && p.stock > 0
  );

  const createOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError(null);
    setFormOk(null);
    setSubmitting(true);
    try {
      await apiCreateOrder({
        userId: user.id,
        productId,
        quantity: Number(quantity),
      });
      setFormOk('Order placed successfully');
      reload();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (id: string, status: OrderStatus) => {
    try {
      await apiUpdateOrder(id, { status });
      reload();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to update order.');
    }
  };

  const removeOrder = async (id: string) => {
    try {
      await apiDeleteOrder(id);
      reload();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to delete order.');
    }
  };

  return (
    <main className="container">
      <h1>My Orders</h1>
      {error && <p className="error-text">{error}</p>}

      <form className="card order-form" onSubmit={createOrder}>
        <h3>Place a new order</h3>
        <div className="review-fields">
          <label>
            Product
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Select a product…</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — ${p.price.toFixed(2)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </label>
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Placing…' : 'Place order'}
          </button>
        </div>
        {formOk && <p className="ok-text">{formOk}</p>}
      </form>

      {loading ? (
        <div className="page-loading">Loading…</div>
      ) : (orders ?? []).length === 0 ? (
        <p className="muted">No orders yet.</p>
      ) : (
        <div className="card table-card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((o: Order) => (
                <tr key={o.id}>
                  <td>{o.product.title}</td>
                  <td>{o.quantity}</td>
                  <td>${(o.product.price * o.quantity).toFixed(2)}</td>
                  <td>
                    {user?.role === 'ADMIN' ? (
                      <select
                        value={o.status}
                        onChange={(e) =>
                          changeStatus(o.id, e.target.value as OrderStatus)
                        }
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`role role-${o.status.toLowerCase()}`}>
                        {o.status}
                      </span>
                    )}
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeOrder(o.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}