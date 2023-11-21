const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// API routes
app.get("/api/notes", (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); // Generate a unique ID for the note
    const notes = readNotes();
    notes.push(newNote);
    writeNotes(notes);
    res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
    // Receive a query parameter containing the id of a note to delete
    const noteIdToDelete = req.params.id;
    let notes = readNotes();
    notes = notes.filter(note => note.id !== noteIdToDelete);
    writeNotes(notes);
    res.json({ success: true, message: "Note deleted successfully" });
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

function readNotes() {
    // Read the db.json file and return all saved notes as an array
    const notesData = fs.readFileSync(path.join(__dirname, "db/db.json"), "utf8");
    return JSON.parse(notesData);
}

function writeNotes(notes) {
    // Write the notes array to the db.json file
    fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes), "utf8");
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
