import { useState } from 'react';
import { apiDeleteOrder, apiGetOrders, apiUpdateOrder } from '../../api';
import { useAsyncData } from '../../hooks/useAsyncData';
import { ApiError } from '../../api/client';
import Flash from '../Flash';
import type { Order, OrderStatus } from '../../types';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrders() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const { data, loading, reload } = useAsyncData(apiGetOrders);

  const changeStatus = async (id: string, status: OrderStatus) => {
    setError(null);
    try {
      await apiUpdateOrder(id, { status });
      setOk('Order status updated');
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed');
    }
  };

  const remove = async (id: string) => {
    setError(null);
    setOk(null);
    try {
      await apiDeleteOrder(id);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  return (
    <section className="card admin-section">
      <Flash error={error} ok={ok} />
      {loading ? (
        <div className="page-loading">Loading…</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o: Order) => (
              <tr key={o.id}>
                <td>{o.user.name}</td>
                <td>{o.product.title}</td>
                <td>{o.quantity}</td>
                <td>${(o.product.price * o.quantity).toFixed(2)}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="row-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => remove(o.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}