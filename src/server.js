const express = require("express");
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const app = express();

const port = 3000;
const staticPath = path.join(__dirname, 'public');

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'html/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});