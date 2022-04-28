const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db.json');
// const index = require('./public/index.html');

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/database', (req, res) => {
    // console.log(database);
    res.json(database);
    // res.json(database);

    console.info(`${req.method} request received to get reviews`);
});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
