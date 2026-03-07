const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

let cards = [
  { id: 1, suit: "hearts", value: "ace", collection: "classic" }
];

app.get("/cards", (req, res) => {
  res.json(cards);
});

app.post("/cards", (req, res) => {
  const { suit, value, collection } = req.body;

  const newCard = {
    id: Date.now(),
    suit,
    value,
    collection
  };

  cards.push(newCard);
  res.status(201).json(newCard);
});

module.exports.handler = serverless(app);
