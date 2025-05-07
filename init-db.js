const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  // remove tables for reset
  db.run("DROP TABLE IF EXISTS options");
  db.run("DROP TABLE IF EXISTS selections");
  db.run("DROP TABLE IF EXISTS pdfs");


  // create tables
  db.run(`
    CREATE TABLE pdfs (
      type TEXT PRIMARY KEY,
      spec_sheet TEXT,
      manufacturer TEXT
    )
  `);
  
  db.run(`
    CREATE TABLE selections (
      type INTEGER, 
      field_name TEXT
    )
  `);

  db.run(`
    CREATE TABLE options (
      field_name TEXT, 
      option_name TEXT,
      dependent TEXT
      )
  `);



  // spare table creation 
  // db.run(`
  
  //   `);

  db.run("INSERT INTO pdfs (type, spec_sheet, manufacturer) VALUES ('FA.pdf', 'pdf_folder/FA.pdf', 'Lithonia');");
  db.run("INSERT INTO pdfs (type, spec_sheet, manufacturer) VALUES ('FB.pdf', 'pdf_folder/FB.pdf', 'Lithonia');");

  db.run(`INSERT INTO selections (type, field_name) VALUES 
    ('FA.pdf', 'series'), 
    ('FA.pdf', 'lumens'), 
    ('FA.pdf', 'lens'), 
    ('FA.pdf', 'voltage'), 
    ('FA.pdf', 'driver'), 
    ('FA.pdf', 'color_temp'), 
    ('FA.pdf', 'light_interface'), 
    ('FA.pdf', 'control'),
    ('FA.pdf', 'finish'), 
    ('FA.pdf', 'wattage'), 
    ('FA.pdf', 'lumen_level'), 
    ('FA.pdf', 'color_temp_k'), 
    ('FA.pdf', 'driver_req'), 
    ('FA.pdf', 'dimensions'), 
    ('FA.pdf', 'mounting type'), 
    ('FA.pdf', 'luminaire_type'), 
    ('FA.pdf', 'notes'); 
  `);
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('series', 'BLWP2'), 
    ('series', 'BLWP4'), 
    ('series', 'BLWP8');
  `);
  db.run(`INSERT INTO options (field_name, option_name, dependent) VALUES 
    ('lumens', '8L', 'BLWP2' ), 
    ('lumens', '20L', 'BLWP2'), 
    ('lumens', '33L', 'BLWP2'), 
    ('lumens', '40L', 'BLWP2'), 
    ('lumens', '48L', 'BLWP2'),
    ('lumens', '8LHE', 'BLWP2' ), 
    ('lumens', '20LHE', 'BLWP2'), 
    ('lumens', '33LHE', 'BLWP2'), 
    ('lumens', '40LHE', 'BLWP2'), 
    ('lumens', '48LHE', 'BLWP2'),
    ('lumens', '15L', 'BLWP4' ), 
    ('lumens', '20L', 'BLWP4'), 
    ('lumens', '30L', 'BLWP4'), 
    ('lumens', '40L', 'BLWP4'), 
    ('lumens', '48L', 'BLWP4'),
    ('lumens', '60L', 'BLWP4'), 
    ('lumens', '72L', 'BLWP4'), 
    ('lumens', '85L', 'BLWP4'), 
    ('lumens', '100L', 'BLWP4'),
    ('lumens', '15LHE', 'BLWP4' ), 
    ('lumens', '20LHE', 'BLWP4'), 
    ('lumens', '30LHE', 'BLWP4'), 
    ('lumens', '40LHE', 'BLWP4'), 
    ('lumens', '48LHE', 'BLWP4'),
    ('lumens', '60LHE', 'BLWP4'), 
    ('lumens', '72LHE', 'BLWP4'), 
    ('lumens', '85LHE', 'BLWP4'), 
    ('lumens', '100LHE', 'BLWP4'),
    ('lumens', '40L', 'BLWP8'), 
    ('lumens', '60L', 'BLWP8'),
    ('lumens', '80L', 'BLWP8'), 
    ('lumens', '100L', 'BLWP8'), 
    ('lumens', '140L', 'BLWP8'), 
    ('lumens', '180L', 'BLWP8'),
    ('lumens', '200L', 'BLWP8'),
    ('lumens', '40LHE', 'BLWP8'), 
    ('lumens', '60LHE', 'BLWP8'),
    ('lumens', '80LHE', 'BLWP8'), 
    ('lumens', '100LHE', 'BLWP8'), 
    ('lumens', '140LHE', 'BLWP8'), 
    ('lumens', '180LHE', 'BLWP8'),
    ('lumens', '200LHE', 'BLWP8');
  `);
});

db.close();