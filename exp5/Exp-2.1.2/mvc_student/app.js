const express = require('express');
const app = express();
const studentRoutes = require('./routes/studentRoutes');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/', studentRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});