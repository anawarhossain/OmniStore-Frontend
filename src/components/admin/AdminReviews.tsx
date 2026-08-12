import { useState } from 'react';
import { apiDeleteReview, apiGetReviews } from '../../api';
import { useAsyncData } from '../../hooks/useAsyncData';
import { ApiError } from '../../api/client';
import Flash from '../Flash';

export default function AdminReviews() {
  const [error, setError] = useState<string | null>(null);
  const { data, loading, reload } = useAsyncData(apiGetReviews);

  const remove = async (id: string) => {
    setError(null);
    try {
      await apiDeleteReview(id);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  return (
    <section className="card admin-section">
      <Flash error={error} />
      {loading ? (
        <div className="page-loading">Loading…</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => (
              <tr key={r.id}>
                <td>{r.product.title}</td>
                <td>{r.user.name}</td>
                <td>{'★'.repeat(r.rating)} ({r.rating}/5)</td>
                <td>{r.comment ?? '—'}</td>
                <td className="row-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>
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