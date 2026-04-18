const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();
const PORT = 3001;
const SECRET_KEY = "mysecretkey";

app.use(cors());
app.use(express.json());

const users = [
  { id: 1, username: "admin", password: "123456", role: "admin" },
  { id: 2, username: "user", password: "123456", role: "user" }
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!foundUser) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    role: foundUser.role,
    username: foundUser.username
  });
});

app.get("/api/user", authMiddleware, roleMiddleware(["user", "admin"]), (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}, this is user data.`,
    role: req.user.role
  });
});

app.get("/api/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}, this is admin-only data.`,
    role: req.user.role
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});