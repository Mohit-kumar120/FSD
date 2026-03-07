const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json()); // body parser

const startServer = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/productDB");
    console.log("MongoDB Connected");

    app.use("/api/products", productRoutes);

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });

  } catch (error) {
    console.log(error.message);
  }
};

startServer();