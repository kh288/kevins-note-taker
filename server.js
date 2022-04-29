const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db.json');
const { randomUUID } = require('crypto');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

var PORT = process.env.PORT || 3001;

// Set the default to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

// notes brings them to the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Get information for the database json
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        error ? console.log(error) : res.json(JSON.parse(data));
    });
});

// POST request to add a review
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);

    const {
        title,
        text
    } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: randomUUID(),
        };

        // Obtain existing reviews
        fs.readFile('./db/db.json', 'utf8', (error, data) => {
        if (error) {
            console.error(error);
        } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);

            // Add a new review
            parsedNotes.push(newNote);
            reviews = parsedNotes;
            
            fs.writeFile('./db/db.json', 
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

// Delete Note
app.delete('/api/notes/:id', (req, res) => {
    // Get the id from the request params
    let noteId = req.params.id;
    // Read file to overwrite with an edited version
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        if (error) {
            console.log(error);
        }
        let noteData = JSON.parse(data);
        // Use the filter method to create a new array with all but the id we want to isolate out
        var filteredNoteData = noteData.filter(function (note) {
            return note.id != noteId;
        })
        // Write to notes to the file
        fs.writeFile('./db/db.json', JSON.stringify(filteredNoteData, null, 4), (error) => {
            error ? console.log(error) : console.log("Note Deleted!");
        });
    });
    res.end();
});

// Announce port that its listening to
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
