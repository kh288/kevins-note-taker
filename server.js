const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db.json');
const { randomUUID } = require('crypto');

var PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// POST request to add a review
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
        title,
        text,
        id: randomUUID(),
    };

    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new review
        parsedNotes.push(newNote);
        reviews = parsedNotes;
        
        fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
                writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
            );
        }
    });

        const response = {
        status: 'success',
        body: newNote,
        };

        console.log(response);
        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
