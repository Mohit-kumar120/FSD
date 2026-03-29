const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const transferRoutes = require("./routes/transferRoutes");

const app = express();

app.use(express.json());

// Routes
app.use("/api", transferRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});