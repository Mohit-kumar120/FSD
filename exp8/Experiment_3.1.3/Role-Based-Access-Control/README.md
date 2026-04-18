# Experiment 3.1.3 — Role-Based Access Control (RBAC)

## Overview
Full-stack RBAC implementation with React 18, Express 4, and MongoDB (Mongoose 7.6+).

## Role Hierarchy
```
Admin (L4)   → Full access: users, content, reports, settings, audit
Manager (L3) → Team, content, reports, settings (read)
Editor (L2)  → Content (read/write), reports (read)
Viewer (L1)  → Content (read only)
```

## Project Structure
```
rbac-experiment/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── models/
│   │   └── User.js            # User schema + role/permission definitions
│   ├── middleware/
│   │   └── auth.js            # JWT auth + RBAC middleware
│   └── routes/
│       ├── auth.js            # Login, register, /me, seed
│       ├── admin.js           # Admin-only: users, dashboard, audit, settings
│       ├── manager.js         # Manager+: team, reports, content
│       └── users.js           # Authenticated: profile, content, permissions
├── public/
│   └── index.html             # Single-file React app (all-in-one)
├── package.json
├── .env.example
└── README.md
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Start MongoDB
Make sure MongoDB is running locally, or update MONGO_URI with your Atlas connection string.

### 4. Start the server
```bash
npm start          # production
npm run dev        # development (with nodemon)
```

### 5. Initialize demo users
Open the app at `http://localhost:5000`, then click **"Initialize Demo Accounts in DB"**
or make a POST request to `/api/auth/seed`.

## Demo Accounts
| Role    | Email               | Password     |
|---------|---------------------|--------------|
| Admin   | admin@rbac.com      | admin123     |
| Manager | manager@rbac.com    | manager123   |
| Editor  | editor@rbac.com     | editor123    |
| Viewer  | viewer@rbac.com     | viewer123    |

## API Endpoints

### Auth
| Method | Endpoint         | Access  | Description              |
|--------|-----------------|---------|--------------------------|
| POST   | /api/auth/login  | Public  | Login, returns JWT token |
| POST   | /api/auth/register | Public | Register new user       |
| GET    | /api/auth/me     | Auth    | Get current user info    |
| POST   | /api/auth/seed   | Public  | Seed demo accounts       |

### Admin (admin only)
| Method | Endpoint              | Permission   | Description         |
|--------|-----------------------|--------------|---------------------|
| GET    | /api/admin/dashboard  | user:read    | System stats        |
| GET    | /api/admin/users      | user:read    | List all users      |
| POST   | /api/admin/users      | user:write   | Create user         |
| PUT    | /api/admin/users/:id  | user:write   | Update role/status  |
| DELETE | /api/admin/users/:id  | user:delete  | Delete user         |
| GET    | /api/admin/audit      | audit:read   | Role audit log      |
| GET    | /api/admin/settings   | settings:read| App config          |

### Manager (manager+)
| Method | Endpoint              | Permission   | Description     |
|--------|-----------------------|--------------|-----------------|
| GET    | /api/manager/dashboard| -            | Team overview   |
| GET    | /api/manager/reports  | report:read  | View reports    |
| POST   | /api/manager/reports  | report:write | Create report   |
| GET    | /api/manager/content  | content:read | View content    |

### Users (all authenticated)
| Method | Endpoint             | Permission      | Description     |
|--------|----------------------|-----------------|-----------------|
| GET    | /api/users/profile   | -               | My profile      |
| GET    | /api/users/content   | content:read    | Browse content  |
| POST   | /api/users/content   | content:write   | Create content  |
| DELETE | /api/users/content/:id| content:delete | Delete content  |
| GET    | /api/users/permissions| -              | My permissions  |

## RBAC Middleware
```javascript
// Require specific roles
router.use(authenticate, authorizeRole('admin', 'manager'));

// Require minimum hierarchy level
router.use(authenticate, authorizeMinLevel('manager'));

// Require specific permission
router.get('/data', authenticate, authorizePermission('report:read'), handler);
```

## Frontend Features
- JWT stored in localStorage, sent as Bearer token
- Route guarding via AuthContext (hasRole, hasMinRole, hasPermission)
- Role-based sidebar navigation (menu items shown/hidden by permission)
- Admin dashboard with user stats and recent activity
- Full user CRUD (create, edit role, toggle active, delete)
- Permission matrix visualization
- Role hierarchy diagram
