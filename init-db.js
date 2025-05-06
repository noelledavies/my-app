const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS pdfs (id INTEGER PRIMARY KEY, name TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS dropdown_options (id INTEGER PRIMARY KEY, pdf_id INTEGER, option_text TEXT)');

  db.run("INSERT INTO pdfs (name) VALUES ('example1.pdf'), ('example2.pdf')");
  db.run("INSERT INTO dropdown_options (pdf_id, option_text) VALUES (1, 'Option A'), (1, 'Option B'), (2, 'Option X')");
});

db.close();