import { useState, type FormEvent } from 'react';
import { apiCreateUser, apiDeleteUser, apiGetUsers, apiUpdateUser } from '../../api';
import { useAsyncData } from '../../hooks/useAsyncData';
import { ApiError } from '../../api/client';
import Flash from '../Flash';
import type { Role } from '../../types';

export default function AdminUsers() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const { data, loading, reload } = useAsyncData(apiGetUsers);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await apiCreateUser({
        name,
        email,
        password,
        age: age ? Number(age) : undefined,
        role,
      });
      setName('');
      setEmail('');
      setPassword('');
      setAge('');
      setOk('User created');
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Create failed');
    }
  };

  const changeRole = async (id: string, newRole: Role) => {
    setError(null);
    try {
      await apiUpdateUser(id, { role: newRole });
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed');
    }
  };

  const remove = async (id: string) => {
    setError(null);
    try {
      await apiDeleteUser(id);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  return (
    <section className="card admin-section">
      <Flash error={error} ok={ok} />
      <form className="stack-form" onSubmit={create}>
        <h4>Add user</h4>
        <div className="form-grid">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} minLength={6} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label>
            Age
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
        </div>
        <button className="btn btn-primary">Add user</button>
      </form>

      {loading ? (
        <div className="page-loading">Loading…</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.age ?? '—'}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value as Role)}
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="row-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}>
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