# Experiment 2.3.1 — Full Stack Integration (MERN)
## React-Express Integration with Axios

---

## Course Outcomes Mapped
| Code | Outcome |
|------|---------|
| CO3 | Implement RESTful APIs and integrate databases (MongoDB/MySQL) with a backend server using Node.js and Express.js |
| CO4 | Debug, test, and optimize full-stack applications by analyzing performance and security aspects |
| CO5 | Design and deploy a full-stack web application with front-end, back-end, authentication, and database integration |

---

## Aim
Connect a React frontend to fetch data from an Express API using Axios, demonstrating full MERN stack integration.

---

## Objectives
1. Create RESTful API endpoints in Express
2. Develop React components for data display
3. Implement Axios for HTTP requests
4. Handle loading and error states
5. Style UI with Bootstrap

---

## Hardware / Software Requirements
- **Runtime:** Node.js 18+
- **Backend:** Express 4.18+, Mongoose 8+
- **Database:** MongoDB (local) or MongoDB Atlas (cloud)
- **Frontend:** React 18+, Axios 1.6+, Bootstrap 5.3+, Bootstrap Icons 1.11+
- **Tools:** VS Code, Postman, MongoDB Compass / Atlas

---

## Project Structure

```
Experiment_2.3.1/
├── backend/
│   ├── server.js          ← Express server, Mongoose models, all routes
│   ├── package.json
│   └── .env               ← PORT, MONGO_URI
│
└── frontend/
    ├── package.json
    └── src/
        ├── index.js               ← React entry point
        ├── App.jsx                ← Root component (Navbar, Hero, ProductList, Footer)
        ├── App.css                ← Custom styles
        ├── services/
        │   └── api.js             ← Axios instance + interceptors + productAPI
        └── components/
            ├── Navbar.jsx         ← Bootstrap navigation bar
            ├── ProductList.jsx    ← Fetches data, manages state, search/filter UI
            └── ProductCard.jsx    ← Individual product card with star rating
```

---

## Theory

### MERN Stack
MERN stands for **MongoDB, Express, React, Node.js** — a JavaScript-only full-stack combination where:
- **MongoDB** stores documents as JSON-like objects (flexible schema)
- **Express** provides a lightweight HTTP server framework on Node.js
- **React** builds the declarative, component-based frontend SPA
- **Node.js** is the JavaScript runtime powering the backend

### RESTful API Design
REST (Representational State Transfer) defines stateless HTTP-based interactions:

| Method | Endpoint           | Action           | Status |
|--------|--------------------|------------------|--------|
| GET    | /api/products      | Fetch all        | 200    |
| GET    | /api/products/:id  | Fetch one        | 200    |
| POST   | /api/products      | Create new       | 201    |
| PUT    | /api/products/:id  | Update existing  | 200    |
| DELETE | /api/products/:id  | Delete           | 200    |

### Axios
Axios is a promise-based HTTP client for JavaScript that:
- Works in both browser and Node.js environments
- Supports request/response **interceptors** for global auth headers or error handling
- Automatically parses JSON responses
- Provides built-in timeout and cancellation support
- Simplifies error handling compared to the native `fetch` API

### React State Management for Async Data
```javascript
const [products, setProducts] = useState([]);   // data
const [loading, setLoading]   = useState(true); // UI state
const [error, setError]       = useState(null); // error state

useEffect(() => {
  fetchProducts(); // runs on mount and when deps change
}, [activeCategory]);
```

---

## Implementation

### Step 1 — Backend Setup

```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose cors dotenv
npm install --save-dev nodemon
```

Create `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/productsdb
```

### Step 2 — Express Server (server.js)
Key sections:
1. **Middleware** — `cors()`, `express.json()`
2. **Mongoose connection** — `mongoose.connect(MONGO_URI)`
3. **Product schema** — name, description, price, category, stock, rating
4. **Seed function** — inserts 6 sample products if collection is empty
5. **5 RESTful routes** — GET all, GET one, POST, PUT, DELETE

### Step 3 — Frontend Setup

```bash
npx create-react-app frontend
cd frontend
npm install axios bootstrap bootstrap-icons
```

### Step 4 — Axios Service (src/services/api.js)
```javascript
const API = axios.create({ baseURL: 'http://localhost:5000/api', timeout: 10000 });
// Attach token in request interceptor
// Normalize errors in response interceptor
export const productAPI = { getAll, getById, create, update, remove };
```

### Step 5 — React Components
- **Navbar.jsx** — Bootstrap navbar with brand and links
- **ProductList.jsx** — manages state, calls `productAPI.getAll()`, search + filter
- **ProductCard.jsx** — renders individual product with star rating, price, stock

### Step 6 — Add proxy to package.json
```json
"proxy": "http://localhost:5000"
```
This proxies `/api/...` calls from React dev server to Express — no CORS issues during development.

---

## Running the Application

### Terminal 1 — Start Backend
```bash
cd backend
npm run dev
# ✅ MongoDB connected successfully
# 🌱 Database seeded with sample products
# 🚀 Express server running at http://localhost:5000
```

### Terminal 2 — Start Frontend
```bash
cd frontend
npm start
# React app opens at http://localhost:3000
```

---

## Testing with Postman

| Request | URL | Body |
|---------|-----|------|
| GET | `http://localhost:5000/api/products` | — |
| GET | `http://localhost:5000/api/products/:id` | — |
| POST | `http://localhost:5000/api/products` | `{"name":"Tablet","description":"10-inch display","price":399,"category":"Electronics","stock":20,"rating":4.2}` |
| PUT | `http://localhost:5000/api/products/:id` | `{"price":349}` |
| DELETE | `http://localhost:5000/api/products/:id` | — |
| GET | `http://localhost:5000/api/health` | — |

### Sample GET /api/products Response
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "65a1f2...",
      "name": "Wireless Headphones",
      "description": "Premium noise-cancelling over-ear headphones with 30hr battery.",
      "price": 299.99,
      "category": "Electronics",
      "stock": 45,
      "rating": 4.8,
      "createdAt": "2024-01-12T10:30:00.000Z"
    }
  ]
}
```

---

## Expected Output

1. **Responsive product grid** — 3 columns on desktop, 2 on tablet, 1 on mobile
2. **Loading spinner** — shown while Axios GET request is in-flight
3. **Error alert** — shown if server is unreachable, with Retry button
4. **Category filter pills** — filters products client-side by category
5. **Search bar** — live search across name and description fields
6. **Low stock badge** — shown when stock < 10

---

## Key Concepts Demonstrated

### CO3 — RESTful API + MongoDB Integration
- All 5 HTTP methods implemented (GET, POST, PUT, DELETE, GET by ID)
- Mongoose schema with validation (`required`, `min`, `max`, `trim`)
- Optional query parameter filtering: `GET /api/products?category=Electronics`

### CO4 — Debug, Test, Optimize
- Axios **interceptors** for centralized error normalization
- `try/catch/finally` pattern with loading state always reset in `finally`
- `useCallback` + dependency array prevents stale closure bugs
- Postman collection for systematic API testing

### CO5 — Full-Stack Deployment Readiness
- Environment variables via `.env` (never hardcode secrets)
- CORS configured for specific origin
- Proxy configured in React to avoid CORS during development
- Seed function ensures app works immediately after `npm install`

---

## Viva Questions

**Q1. What is the difference between `axios` and `fetch`?**
Axios automatically parses JSON, has request/response interceptors, supports timeout, and provides better error objects. `fetch` requires manual `.json()` parsing and doesn't reject on 4xx/5xx status codes.

**Q2. Why do we need CORS middleware in Express?**
Browsers enforce the Same-Origin Policy — they block requests from `localhost:3000` to `localhost:5000` by default. The `cors` package adds the necessary `Access-Control-Allow-Origin` header.

**Q3. What does `useCallback` do in ProductList?**
It memoizes the `fetchProducts` function so it maintains a stable reference between renders. Without it, listing `fetchProducts` in `useEffect`'s dependency array would cause an infinite loop.

**Q4. What is Mongoose and why use it over the MongoDB driver directly?**
Mongoose adds schema validation, type casting, middleware (pre/post hooks), and a cleaner Query API on top of the native MongoDB driver. It enforces structure on MongoDB's schema-less documents.

**Q5. What HTTP status codes does the API return and why?**
- `200 OK` — successful GET/PUT/DELETE
- `201 Created` — successful POST
- `400 Bad Request` — validation failure
- `404 Not Found` — document doesn't exist
- `500 Internal Server Error` — unexpected server failure

---

## Conclusion

This experiment successfully demonstrates full MERN stack integration. The Express backend exposes a RESTful API that performs CRUD operations on MongoDB via Mongoose. The React frontend uses Axios with interceptors to make HTTP requests, manages loading/error/data states with React Hooks, and renders a responsive Bootstrap UI. The application follows industry best practices including environment variables, CORS configuration, centralized API service, and graceful error handling.
