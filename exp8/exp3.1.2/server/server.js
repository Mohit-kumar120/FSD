const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = 3001;
const SECRET_KEY = "mysecretkey";

app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123456") {
    const token = jwt.sign(
      { id: 1, username: "admin" },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}`,
    user: req.user
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});