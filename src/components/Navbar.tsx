import { type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          🛒 OmniStore
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Products
          </NavLink>
          {user && (
            <NavLink to="/orders" end>
              My Orders
            </NavLink>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" end>
              Admin
            </NavLink>
          )}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <span className="user-chip">
                {user.name}
                <small className={`role role-${user.role.toLowerCase()}`}>
                  {user.role}
                </small>
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}