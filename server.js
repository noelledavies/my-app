const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');
const fs = require('fs');
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

app.get('/api/entries', (req, res) => {
  db.all('SELECT * FROM entries', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.use(express.json()); // make sure this is included

app.post('/api/entries', (req, res) => {
  const {
    model_num, voltage_req, source, wattage,
    lumen_level, color_temp_k, driver_req,
    dimensions, mounting_type, luminaire_type
  } = req.body;

  const query = `
    INSERT INTO entries (
      model_num, voltage_req, source, wattage,
      lumen_level, color_temp_k, driver_req,
      dimensions, mounting_type, luminaire_type
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    model_num, voltage_req, source, wattage,
    lumen_level, color_temp_k, driver_req,
    dimensions, mounting_type, luminaire_type
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error('Insert error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Entry added', id: this.lastID });
  });
});

app.post('/api/selections', (req, res) => {
  const options = req.body;

  const stmt = db.prepare(`
    INSERT INTO selections (type, field_name, option_name, dependent)
    VALUES (?, ?, ?, ?)
  `);

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    for (const opt of options) {
      stmt.run([opt.type, opt.field_name, opt.option_name, opt.dependent]);
    }
    db.run("COMMIT", err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ status: "success", inserted: options.length });
    });
  });

  stmt.finalize();
});

app.post('/api/pdfs', (req, res) => {
  const options = req.body;

  const stmt = db.prepare(`
    INSERT INTO pdfs (type, spec_sheet, manufacturer)
    VALUES (?, ?, ?)
  `);

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    for (const opt of options) {
      stmt.run([opt.type, opt.spec_sheet, opt.manufacturer]);
    }
    db.run("COMMIT", err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ status: "success", inserted: options.length });
    });
  });

  stmt.finalize();
});

app.get('/api/export-entries', (req, res) => {
  db.all('SELECT * FROM entries', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Convert rows to worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entries');

    // Write to a buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers to trigger download
    res.setHeader('Content-Disposition', 'attachment; filename=entries.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
