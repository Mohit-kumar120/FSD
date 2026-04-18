/**
 * ============================================================
 *  Experiment 3.1.3 — Role-Based Access Control (RBAC)
 *  Single-file full-stack server (Express + MongoDB/Mongoose)
 *  Run: node index.js
 * ============================================================
 */

require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const cors       = require('cors');
const path       = require('path');

const app = express();

// ─── Config ──────────────────────────────────────────────────────────────────
const PORT       = process.env.PORT        || 5000;
const MONGO_URI  = process.env.MONGO_URI   || 'mongodb://localhost:27017/rbac_experiment';
const JWT_SECRET = process.env.JWT_SECRET  || 'rbac_secret_key_2024';
const JWT_EXPIRY = process.env.JWT_EXPIRES_IN || '7d';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════════════════════════════════
//  MODEL  —  User + Roles + Permissions
// ═══════════════════════════════════════════════════════════════════════════════

const ROLES = { ADMIN: 'admin', MANAGER: 'manager', EDITOR: 'editor', VIEWER: 'viewer' };

const PERMISSIONS = {
  admin:   ['user:read','user:write','user:delete','content:read','content:write','content:delete','report:read','report:write','settings:read','settings:write','audit:read'],
  manager: ['user:read','content:read','content:write','content:delete','report:read','report:write','settings:read'],
  editor:  ['content:read','content:write','report:read'],
  viewer:  ['content:read','report:read']
};

const ROLE_LEVELS = { admin: 4, manager: 3, editor: 2, viewer: 1 };

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true,
               match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'] },
  password:  { type: String, required: true, minlength: 6, select: false },
  role:      { type: String, enum: Object.values(ROLES), default: ROLES.VIEWER },
  isActive:  { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword  = function (p)    { return bcrypt.compare(p, this.password); };
userSchema.methods.getPermissions   = function ()     { return PERMISSIONS[this.role] || []; };
userSchema.methods.hasPermission    = function (perm) { return (PERMISSIONS[this.role] || []).includes(perm); };

const User = mongoose.model('User', userSchema);

// ═══════════════════════════════════════════════════════════════════════════════
//  MIDDLEWARE  —  Auth / Role Guards
// ═══════════════════════════════════════════════════════════════════════════════

/** Verify JWT and attach req.user */
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    const user    = await User.findById(decoded.id).select('+password');
    if (!user)       return res.status(401).json({ success: false, error: 'User not found.' });
    if (!user.isActive) return res.status(403).json({ success: false, error: 'Account is deactivated.' });
    req.user = user;
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.';
    res.status(401).json({ success: false, error: msg });
  }
};

/** Allow only specific roles */
const authorizeRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ success: false, error: `Access denied. Required: ${roles.join(', ')}`, userRole: req.user?.role });
  next();
};

/** Allow roles at or above a minimum level */
const authorizeMinLevel = (minRole) => (req, res, next) => {
  const userLvl = ROLE_LEVELS[req.user?.role] || 0;
  const reqLvl  = ROLE_LEVELS[minRole] || 0;
  if (userLvl < reqLvl)
    return res.status(403).json({ success: false, error: `Insufficient privileges. Minimum: ${minRole}`, userRole: req.user?.role });
  next();
};

/** Allow only users whose role has the given permission string */
const authorizePermission = (permission) => (req, res, next) => {
  if (!(PERMISSIONS[req.user?.role] || []).includes(permission))
    return res.status(403).json({ success: false, error: `Missing permission: ${permission}`, userRole: req.user?.role });
  next();
};

// ─── JWT helper ───────────────────────────────────────────────────────────────
const genToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTES  —  /api/auth
// ═══════════════════════════════════════════════════════════════════════════════

const authRouter = express.Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ success: false, error: existing.email === email ? 'Email already registered.' : 'Username already taken.' });

    const safeRole  = ['viewer','editor'].includes(role) ? role : 'viewer';
    const user      = await User.create({ username, email, password, role: safeRole });
    res.status(201).json({ success: true, token: genToken(user._id), user: { id: user._id, username: user.username, email: user.email, role: user.role, permissions: user.getPermissions() } });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ success: false, error: Object.values(err.errors).map(e => e.message).join(', ') });
    res.status(500).json({ success: false, error: 'Registration failed.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    if (!user.isActive)
      return res.status(403).json({ success: false, error: 'Account deactivated. Contact admin.' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, token: genToken(user._id), user: { id: user._id, username: user.username, email: user.email, role: user.role, permissions: user.getPermissions(), lastLogin: user.lastLogin } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', authenticate, (req, res) => {
  res.json({ success: true, user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role, permissions: req.user.getPermissions(), isActive: req.user.isActive, lastLogin: req.user.lastLogin, createdAt: req.user.createdAt } });
});

// POST /api/auth/seed  — create demo users
authRouter.post('/seed', async (req, res) => {
  const seeds = [
    { username: 'admin',    email: 'admin@rbac.com',   password: 'admin123',   role: 'admin'   },
    { username: 'manager1', email: 'manager@rbac.com', password: 'manager123', role: 'manager' },
    { username: 'editor1',  email: 'editor@rbac.com',  password: 'editor123',  role: 'editor'  },
    { username: 'viewer1',  email: 'viewer@rbac.com',  password: 'viewer123',  role: 'viewer'  }
  ];
  const results = [];
  for (const s of seeds) {
    const exists = await User.findOne({ email: s.email });
    if (!exists) { const u = await User.create(s); results.push({ username: u.username, role: u.role, created: true }); }
    else           results.push({ username: exists.username, role: exists.role, created: false });
  }
  res.json({ success: true, message: 'Seed complete', users: results });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTES  —  /api/admin   (admin only)
// ═══════════════════════════════════════════════════════════════════════════════

const adminRouter = express.Router();
adminRouter.use(authenticate, authorizeRole('admin'));

// GET /api/admin/dashboard
adminRouter.get('/dashboard', async (req, res) => {
  try {
    const totalUsers  = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const roleStats   = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('username email role createdAt isActive');
    res.json({ success: true, data: { stats: { totalUsers, activeUsers, inactiveUsers: totalUsers - activeUsers }, roleDistribution: roleStats, recentUsers } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/admin/users
adminRouter.get('/users', authorizePermission('user:read'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive, search } = req.query;
    const q = {};
    if (role) q.role = role;
    if (isActive !== undefined) q.isActive = isActive === 'true';
    if (search) q.$or = [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const users = await User.find(q).select('-password').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await User.countDocuments(q);
    res.json({ success: true, data: users, pagination: { total, page: +page, limit: +limit, pages: Math.ceil(total / limit) } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// POST /api/admin/users
adminRouter.post('/users', authorizePermission('user:write'), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!Object.values(ROLES).includes(role)) return res.status(400).json({ success: false, error: 'Invalid role.' });
    const user = await User.create({ username, email, password, role, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'User created', data: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ success: false, error: Object.values(err.errors).map(e => e.message).join(', ') });
    if (err.code === 11000)             return res.status(400).json({ success: false, error: 'Username or email already exists.' });
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/users/:id
adminRouter.put('/users/:id', authorizePermission('user:write'), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ success: false, error: 'Cannot modify your own account here.' });
    const { role, isActive } = req.body;
    const updates = {};
    if (role && Object.values(ROLES).includes(role)) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, message: 'User updated', data: user });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// DELETE /api/admin/users/:id
adminRouter.delete('/users/:id', authorizePermission('user:delete'), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ success: false, error: 'Cannot delete your own account.' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, message: `User "${user.username}" deleted` });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/admin/audit
adminRouter.get('/audit', authorizePermission('audit:read'), (req, res) => {
  const data = Object.keys(PERMISSIONS).map(role => ({
    role, level: ROLE_LEVELS[role], permissionCount: PERMISSIONS[role].length, permissions: PERMISSIONS[role]
  }));
  res.json({ success: true, data });
});

// GET /api/admin/settings
adminRouter.get('/settings', authorizePermission('settings:read'), (req, res) => {
  res.json({ success: true, data: { appName: 'RBAC System', version: '1.0.0', roles: Object.values(ROLES), permissions: PERMISSIONS, jwtExpiry: JWT_EXPIRY } });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTES  —  /api/manager   (manager+)
// ═══════════════════════════════════════════════════════════════════════════════

const managerRouter = express.Router();
managerRouter.use(authenticate, authorizeMinLevel('manager'));

// GET /api/manager/dashboard
managerRouter.get('/dashboard', async (req, res) => {
  try {
    const teamMembers = await User.find({ role: { $in: ['editor','viewer'] } }).select('username email role isActive lastLogin').sort({ createdAt: -1 });
    res.json({ success: true, data: { teamSize: teamMembers.length, teamMembers, managerInfo: { username: req.user.username, role: req.user.role } } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET /api/manager/reports
managerRouter.get('/reports', authorizePermission('report:read'), (req, res) => {
  res.json({ success: true, data: [
    { id: 1, title: 'Monthly Activity Report',   date: new Date().toISOString(),                        status: 'published' },
    { id: 2, title: 'User Engagement Q4',         date: new Date(Date.now()-86400000*7).toISOString(),  status: 'draft'     },
    { id: 3, title: 'Content Performance',        date: new Date(Date.now()-86400000*14).toISOString(), status: 'published' }
  ]});
});

// POST /api/manager/reports
managerRouter.post('/reports', authorizePermission('report:write'), (req, res) => {
  const { title, content } = req.body;
  res.status(201).json({ success: true, message: 'Report created', data: { id: Date.now(), title, content, createdBy: req.user.username, createdAt: new Date() } });
});

// GET /api/manager/content
managerRouter.get('/content', authorizePermission('content:read'), (req, res) => {
  res.json({ success: true, data: [
    { id: 1, title: 'Welcome Article',  type: 'article', author: 'editor1',  status: 'published' },
    { id: 2, title: 'Product Update',   type: 'post',    author: 'editor1',  status: 'draft'     },
    { id: 3, title: 'Q4 Review',        type: 'report',  author: 'manager1', status: 'published' }
  ]});
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTES  —  /api/users   (any authenticated user)
// ═══════════════════════════════════════════════════════════════════════════════

const usersRouter = express.Router();
usersRouter.use(authenticate);

// GET /api/users/profile
usersRouter.get('/profile', (req, res) => {
  res.json({ success: true, data: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role, permissions: req.user.getPermissions(), isActive: req.user.isActive, lastLogin: req.user.lastLogin, createdAt: req.user.createdAt } });
});

// GET /api/users/content
usersRouter.get('/content', authorizePermission('content:read'), (req, res) => {
  res.json({ success: true, data: [
    { id: 1, title: 'Getting Started with RBAC',        category: 'Security',     readTime: '5 min',  published: true  },
    { id: 2, title: 'Role Hierarchy Best Practices',    category: 'Architecture', readTime: '8 min',  published: true  },
    { id: 3, title: 'JWT Authentication Deep Dive',     category: 'Security',     readTime: '10 min', published: false }
  ]});
});

// POST /api/users/content
usersRouter.post('/content', authorizePermission('content:write'), (req, res) => {
  const { title, body, category } = req.body;
  res.status(201).json({ success: true, message: 'Content created', data: { id: Date.now(), title, body, category, author: req.user.username, createdAt: new Date() } });
});

// DELETE /api/users/content/:id
usersRouter.delete('/content/:id', authorizePermission('content:delete'), (req, res) => {
  res.json({ success: true, message: `Content ${req.params.id} deleted` });
});

// GET /api/users/permissions
usersRouter.get('/permissions', (req, res) => {
  res.json({ success: true, data: { role: req.user.role, permissions: PERMISSIONS[req.user.role] || [], allRolePermissions: PERMISSIONS } });
});

// ─── Mount all routers ────────────────────────────────────────────────────────
app.use('/api/auth',    authRouter);
app.use('/api/admin',   adminRouter);
app.use('/api/manager', managerRouter);
app.use('/api/users',   usersRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Serve React SPA for all non-API routes
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ═══════════════════════════════════════════════════════════════════════════════
//  START SERVER
// ═══════════════════════════════════════════════════════════════════════════════
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected →', MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀  Server running  →  http://localhost:${PORT}`);
      console.log(`📁  Serving React   →  http://localhost:${PORT}/`);
      console.log(`🔑  API base        →  http://localhost:${PORT}/api`);
      console.log(`\n  Demo seed:  POST http://localhost:${PORT}/api/auth/seed`);
    });
  })
  .catch(err => { console.error('❌  MongoDB error:', err.message); process.exit(1); });
