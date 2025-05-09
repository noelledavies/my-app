const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./db.sqlite');

// Allow the app to parse JSON
app.use(express.json());

// Serve static files from "public" folder (if you add an index.html later)
app.use(express.static('public'));

// Tells express to serve files from the pdfs/ folder at the /pdfs route
app.use('/pdfs', express.static('pdfs'));

// Tells express to serve files from the pdfs/ folder at the /pdfs route
//app.use('/selections', express.static('selections'));


// Endpoint to get list of PDFs
app.get('/api/pdfs', (req, res) => {
  db.all('SELECT * FROM pdfs', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint to get dropdown options for a PDF by ID
app.get('/api/selections', (req, res) => {
  db.all('SELECT * FROM selections', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/unique_selections', (req, res) => {
  db.all('SELECT DISTINCT field_name, type FROM selections', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/mn-rules', (req, res) => {
  db.all('SELECT type, field_name, in_mn FROM mn', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
