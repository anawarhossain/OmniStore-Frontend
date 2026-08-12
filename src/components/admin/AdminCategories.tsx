import { useState, type FormEvent } from 'react';
import {
  apiCreateCategory,
  apiDeleteCategory,
  apiGetCategories,
  apiUpdateCategory,
} from '../../api';
import { useAsyncData } from '../../hooks/useAsyncData';
import { ApiError } from '../../api/client';
import Flash from '../Flash';
import type { Category } from '../../types';

export default function AdminCategories() {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const { data, loading, reload } = useAsyncData(apiGetCategories);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await apiCreateCategory({ name });
      setName('');
      setOk('Category created');
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Create failed');
    }
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setEditName(c.name);
  };

  const saveEdit = async (id: string) => {
    setError(null);
    try {
      await apiUpdateCategory(id, { name: editName });
      setEditingId(null);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed');
    }
  };

  const remove = async (id: string) => {
    setError(null);
    try {
      await apiDeleteCategory(id);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  return (
    <section className="card admin-section">
      <Flash error={error} ok={ok} />
      <form className="inline-form" onSubmit={create}>
        <input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn btn-primary">Add</button>
      </form>
      {loading ? (
        <div className="page-loading">Loading…</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((c) => (
              <tr key={c.id}>
                {editingId === c.id ? (
                  <>
                    <td>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </td>
                    <td>{c.id}</td>
                    <td className="row-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => saveEdit(c.id)}>
                        Save
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{c.name}</td>
                    <td className="muted">{c.id}</td>
                    <td className="row-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(c)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}