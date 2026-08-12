import { useState, type FormEvent } from 'react';
import {
  apiCreateProduct,
  apiDeleteProduct,
  apiGetCategories,
  apiGetProducts,
  apiUpdateProduct,
} from '../../api';
import { useAsyncData } from '../../hooks/useAsyncData';
import { ApiError } from '../../api/client';
import Flash from '../Flash';
import type { Category, Product, ProductStatus } from '../../types';

const STATUSES: ProductStatus[] = ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'];

interface Draft {
  title: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  status: ProductStatus;
}

const emptyDraft = (categories: Category[]): Draft => ({
  title: '',
  description: '',
  price: '',
  stock: '0',
  categoryId: categories[0]?.id ?? '',
  status: 'ACTIVE',
});

export default function AdminProducts() {
  const [draft, setDraft] = useState<Draft>(() => emptyDraft([]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft>(() => emptyDraft([]));
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const { data: products, loading, reload } = useAsyncData(apiGetProducts);
  const { data: categories } = useAsyncData(apiGetCategories);

  const setDraftField = (field: keyof Draft, value: string) =>
    setDraft((d) => ({ ...d, [field]: value }));

  const setEditField = (field: keyof Draft, value: string) =>
    setEdit((d) => ({ ...d, [field]: value }));

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await apiCreateProduct({
        title: draft.title,
        description: draft.description || undefined,
        price: Number(draft.price),
        stock: Number(draft.stock || 0),
        categoryId: draft.categoryId,
        status: draft.status,
      });
      setDraft(emptyDraft(categories ?? []));
      setOk('Product created');
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Create failed');
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEdit({
      title: p.title,
      description: p.description ?? '',
      price: String(p.price),
      stock: String(p.stock),
      categoryId: p.categoryId,
      status: p.status,
    });
  };

  const saveEdit = async (id: string) => {
    setError(null);
    try {
      await apiUpdateProduct(id, {
        title: edit.title,
        description: edit.description || undefined,
        price: Number(edit.price),
        stock: Number(edit.stock || 0),
        categoryId: edit.categoryId,
        status: edit.status,
      });
      setEditingId(null);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed');
    }
  };

  const remove = async (id: string) => {
    setError(null);
    try {
      await apiDeleteProduct(id);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;

  return (
    <section className="card admin-section">
      <Flash error={error} ok={ok} />
      <form className="stack-form" onSubmit={create}>
        <h4>Add product</h4>
        <div className="form-grid">
          <label>
            Title
            <input value={draft.title} onChange={(e) => setDraftField('title', e.target.value)} required />
          </label>
          <label>
            Price
            <input type="number" step="0.01" min={0} value={draft.price} onChange={(e) => setDraftField('price', e.target.value)} required />
          </label>
          <label>
            Stock
            <input type="number" min={0} value={draft.stock} onChange={(e) => setDraftField('stock', e.target.value)} />
          </label>
          <label>
            Category
            <select
              value={draft.categoryId}
              onChange={(e) => setDraftField('categoryId', e.target.value)}
              required
            >
              <option value="">Select…</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={draft.status} onChange={(e) => setDraftField('status', e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description
            <input value={draft.description} onChange={(e) => setDraftField('description', e.target.value)} />
          </label>
        </div>
        <button className="btn btn-primary">Add product</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(products ?? []).map((p) =>
            editingId === p.id ? (
              <tr key={p.id}>
                <td><input value={edit.title} onChange={(e) => setEditField('title', e.target.value)} /></td>
                <td><input type="number" step="0.01" value={edit.price} onChange={(e) => setEditField('price', e.target.value)} /></td>
                <td><input type="number" value={edit.stock} onChange={(e) => setEditField('stock', e.target.value)} /></td>
                <td>
                  <select value={edit.categoryId} onChange={(e) => setEditField('categoryId', e.target.value)}>
                    {(categories ?? []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select value={edit.status} onChange={(e) => setEditField('status', e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="row-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => saveEdit(p.id)}>Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.category.name}</td>
                <td><span className={`role role-${p.status.toLowerCase()}`}>{p.status}</span></td>
                <td className="row-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </section>
  );
}