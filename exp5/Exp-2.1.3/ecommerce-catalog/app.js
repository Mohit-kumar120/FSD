const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* CREATE PRODUCT */
app.post("/products", async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

/* ADD REVIEW */
app.post("/products/:id/review", async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.reviews.push(req.body);
    product.calculateAverageRating();
    await product.save();
    res.json(product);
});

/* STOCK UPDATE */
app.post("/products/:id/stock", async (req, res) => {
    const product = await Product.findById(req.params.id);
    await product.updateStock(req.body.sku, req.body.quantity);
    res.json(product);
});

/* AGGREGATION EXAMPLE */
app.get("/products/stats", async (req, res) => {
    const stats = await Product.aggregate([
        { $unwind: "$variants" },
        {
            $group: {
                _id: "$category",
                totalProducts: { $sum: 1 },
                avgPrice: { $avg: "$variants.price" }
            }
        }
    ]);
    res.json(stats);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});