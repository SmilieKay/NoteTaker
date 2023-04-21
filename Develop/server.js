const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;

// Set up Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API routes
app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    newNote.id = uuidv4();
    notes.push(newNote);
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    fs.writeFile('db/db.json', JSON.stringify(updatedNotes), (err) => {
      if (err) throw err;
      res.json({ ok: true });
    });
  });
});

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
