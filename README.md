# 🛒 OmniStore Frontend

A modern e-commerce store frontend built with **React 19**, **TypeScript**, and **Vite**, backed by a REST API. Customers can browse products, post reviews, and manage orders, while admins get a full dashboard to manage products, categories, users, orders, and reviews.

## ✨ Features

- **Product catalog** – browse products, filter by category, view pricing and stock
- **Product detail pages** – descriptions, availability status, and user reviews
- **Reviews** – logged-in users can rate (1–5 stars) and comment on products
- **Authentication** – register, login, and JWT-based session persisted in `localStorage`
- **Orders** – customers place and cancel orders; admins can update order status
- **Admin dashboard** – full CRUD for products, categories, users, orders, and reviews
- **Role-based routing** – protected routes for authenticated users and admins only

## 🧰 Tech Stack

| Layer       | Technology          |
| ----------- | ------------------- |
| UI          | React 19            |
| Language    | TypeScript 5        |
| Build tool  | Vite                |
| Routing     | React Router 6      |
| Styling     | Plain CSS (`src/index.css`) |

## 📁 Project Structure

```
├── src/
│   ├── api/                  # REST client + typed API functions
│   │   ├── client.ts         # fetch wrapper, token storage, ApiError
│   │   └── index.ts          # typed endpoints (auth, users, products, …)
│   ├── components/
│   │   ├── admin/            # Admin CRUD tables (products, orders, …)
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProtectedRoute.tsx  # Protected / Admin route guards
│   │   └── Flash.tsx
│   ├── context/
│   │   └── AuthContext.tsx   # auth state + login/register/logout
│   ├── hooks/
│   │   └── useAsyncData.ts   # data fetching hook (loading/error/reload)
│   ├── pages/
│   │   ├── Home.tsx          # product catalog + category filter
│   │   ├── ProductDetail.tsx # product info + reviews
│   │   ├── Login.tsx / Register.tsx
│   │   ├── Orders.tsx        # customer order management
│   │   └── Dashboard.tsx     # admin dashboard with tabs
│   ├── App.tsx               # router setup
│   ├── types.ts              # shared TypeScript types
│   └── main.tsx
├── .env.example              # environment variable template
├── index.html
├── vite.config.ts            # dev server + /api proxy
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (18+)
- An OmniStore **backend server** running (the dev proxy expects it at `http://localhost:5000`)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start the dev server (http://localhost:5173)
npm run dev
```

### Environment Variables

Only variables prefixed with `VITE_` are exposed to the browser.

| Variable         | Default   | Description                                   |
| ---------------- | --------- | --------------------------------------------- |
| `VITE_API_URL`   | `/api`    | Backend API base URL (proxied in development) |
| `VITE_APP_NAME`  | OmniStore | App name shown in the browser title           |

When deploying, point `VITE_API_URL` to your live backend during the build (it must end in `/api` with no trailing slash).

### Production Build

```bash
npm run build    # type-check + bundle for production
npm run preview  # preview the production build locally
```

## 🔌 Available Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Vite dev server                |
| `npm run build`    | Type-check with `tsc` then build with Vite |
| `npm run preview`  | Preview the built output locally         |

## 🔐 API Endpoints Used

Resource groups exposed through `src/api/index.ts`:

| Resource    | Methods used                                      |
| ----------- | ------------------------------------------------- |
| `/auth`     | register, login, me (current user)                |
| `/users`    | list, get, create, update, delete                 |
| `/categories` | list, get, create, update, delete               |
| `/products` | list, get, create, update, delete                 |
| `/orders`   | list, get, create, update, delete                 |
| `/reviews`  | list, get, create, update, delete                 |

Authenticated requests send an `Authorization: Bearer <token>` header.

## 🌍 Deployment

This project is configured for static hosting (e.g., Netlify):

- `public/_redirects` rewrites all routes to `index.html` so client-side routing works on refresh
- Build with `npm run build` and deploy the `dist/` directory
- Set `VITE_API_URL` to your deployed backend URL before building

## 📄 License

This project is for educational/demonstration purposes. Use it freely.