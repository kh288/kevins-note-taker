const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db.json');
const { randomUUID } = require('crypto');

var PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        error ? console.log(error) : res.json(JSON.parse(data));
    });
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

        // res.json(parsedNotes);
        console.log(response);
        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});

// DELETE Route for a specific tip
app.delete('/api/notes:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        const result = json.filter((id) => id.id !== noteId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', JSON.stringify(result));
  
        // Respond to the DELETE request
        res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

// // Delete Note
// app.delete('/api/notes:id', (req, res) => {
//     // Assign an id to a temp variable
//     let id = req.params.id;
//     // Read the db.json
//     fs.readFile('.db/db.json', 'utf-8', (error, data) => {
//         if (error) {
//             console.log(error);
//         }
//         let noteData = JSON.parse(data);
//         for (var i = 0; i < noteData.length; i++) {
//             if (id === noteData[i].id) {
//                 noteData.splice(i, 2);
//                 fs.writeFile('.db/db.json', JSON.stringify(noteData, null, 4), (error) => {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         console.log('Deleted Note');
//                     }
//                 });
//             }
//         }

//     });
//     res.end();
// });


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
