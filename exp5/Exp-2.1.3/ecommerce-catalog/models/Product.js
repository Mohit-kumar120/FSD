const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: String
}, { _id: false });

const variantSchema = new mongoose.Schema({
    sku: { type: String, required: true },
    color: String,
    price: Number,
    stock: Number
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },

    variants: [variantSchema],   // Nested schema
    reviews: [reviewSchema],     // Nested schema

    avgRating: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

/* INDEXES */
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ "variants.sku": 1 });

/* STOCK UPDATE METHOD */
productSchema.methods.updateStock = function(sku, quantity) {
    const variant = this.variants.find(v => v.sku === sku);
    if (!variant) throw new Error("Variant not found");
    variant.stock -= quantity;
    return this.save();
};

/* 🔥 AGGREGATION FOR AVG RATING */
productSchema.methods.calculateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.avgRating = 0;
    } else {
        const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
        this.avgRating = total / this.reviews.length;
    }
};

module.exports = mongoose.model("Product", productSchema);