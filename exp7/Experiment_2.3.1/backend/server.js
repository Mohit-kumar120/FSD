// server.js - Main Express Server
// Experiment 2.3.1: React-Express Integration with Axios

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/productsdb';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ─── Product Schema & Model ───────────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    category:    { type: String, required: true },
    stock:       { type: Number, default: 0 },
    image:       { type: String, default: '' },
    rating:      { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

// ─── Seed Data (runs once if collection is empty) ─────────────────────────────
async function seedDatabase() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const sampleProducts = [
      { name: 'Wireless Headphones',  description: 'Premium noise-cancelling over-ear headphones with 30hr battery.',  price: 299.99, category: 'Electronics', stock: 45, rating: 4.8 },
      { name: 'Mechanical Keyboard',  description: 'TKL layout with Cherry MX switches and RGB backlighting.',          price: 149.99, category: 'Electronics', stock: 30, rating: 4.6 },
      { name: 'Running Shoes',        description: 'Lightweight breathable shoes for long-distance running.',           price: 89.99,  category: 'Sports',      stock: 60, rating: 4.5 },
      { name: 'Coffee Maker',         description: 'Programmable 12-cup drip coffee maker with thermal carafe.',        price: 59.99,  category: 'Kitchen',     stock: 25, rating: 4.3 },
      { name: 'Yoga Mat',             description: 'Non-slip eco-friendly TPE mat, 6mm thick with carry strap.',        price: 34.99,  category: 'Sports',      stock: 80, rating: 4.7 },
      { name: 'Desk Lamp',            description: 'LED adjustable arm lamp with USB charging port and dimmer.',        price: 44.99,  category: 'Home',        stock: 55, rating: 4.4 },
    ];
    await Product.insertMany(sampleProducts);
    console.log('🌱 Database seeded with sample products');
  }
}
seedDatabase();

// ─── RESTful API Routes ───────────────────────────────────────────────────────

// GET /api/products — fetch all products (with optional category filter)
app.get('/api/products', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/products/:id — fetch single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// POST /api/products — create a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// PUT /api/products/:id — update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update failed', error: error.message });
  }
});

// DELETE /api/products/:id — delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date() });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
