import { useState } from 'react';
import AdminProducts from '../components/admin/AdminProducts';
import AdminCategories from '../components/admin/AdminCategories';
import AdminUsers from '../components/admin/AdminUsers';
import AdminOrders from '../components/admin/AdminOrders';
import AdminReviews from '../components/admin/AdminReviews';

type Tab = 'products' | 'categories' | 'users' | 'orders' | 'reviews';

const TABS: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'users', label: 'Users' },
  { id: 'orders', label: 'Orders' },
  { id: 'reviews', label: 'Reviews' },
];

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('products');

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'tab-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'products' && <AdminProducts />}
      {tab === 'categories' && <AdminCategories />}
      {tab === 'users' && <AdminUsers />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'reviews' && <AdminReviews />}
    </main>
  );
}