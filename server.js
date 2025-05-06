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

// Endpoint to get list of PDFs
app.get('/api/pdfs', (req, res) => {
  db.all('SELECT * FROM pdfs', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint to get dropdown options for a PDF by ID
app.get('/api/pdfs/:id/options', (req, res) => {
  const pdfId = req.params.id;
  db.all('SELECT * FROM dropdown_options WHERE pdf_id = ?', [pdfId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
