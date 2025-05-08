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
    ('FA.pdf', 'voltage_req'),  
    ('FA.pdf', 'source'), 
    ('FA.pdf', 'wattage'), 
    ('FA.pdf', 'lumen_level'), 
    ('FA.pdf', 'color_temp_k'), 
    ('FA.pdf', 'driver_req'), 
    ('FA.pdf', 'dimensions'), 
    ('FA.pdf', 'mounting_type'), 
    ('FA.pdf', 'luminaire_type'), 
    ('FA.pdf', 'notes'); 
  `);
  // series
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('series', 'BLWP2'), 
    ('series', 'BLWP4'), 
    ('series', 'BLWP8');
  `);
  // lumens
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
  // lens
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('lens', 'ADP'), 
    ('lens', 'ADSM'),
    ('lens', 'SDP'), 
    ('lens', 'SDSM'),
    ('lens', 'PDSM'), 
    ('lens', 'ADPT'), 
    ('lens', 'ADSMT'),
    ('lens', 'SDPT'), 
    ('lens', 'SDSMT'),
    ('lens', 'PDSMT');
  `);

  // voltage
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('voltage', 'MVOLT'), 
    ('voltage', '120'),
    ('voltage', '277'), 
    ('voltage', '347');
  `);

  // driver
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('driver', 'EZ1'), 
    ('driver', 'GZ1'),
    ('driver', 'GZ10'), 
    ('driver', 'SLD');
  `);

  // color temp
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('color_temp', 'LP830'), 
    ('color_temp', 'LP835'),
    ('color_temp', 'LP840'), 
    ('color_temp', 'LP850'),
    ('color_temp', 'LP930'),
    ('color_temp', 'LP935'),
    ('color_temp', 'LP940'),
    ('color_temp', 'LP950');
  `);

  // light_interface
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('light_interface', 'N80'), 
    ('light_interface', 'N80EMG'),
    ('light_interface', 'N100'), 
    ('light_interface', 'N100EMG'),
    ('light_interface', 'NLTAIR2');
  `);

  // control
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('control', 'null'),
    ('control', 'NES7'), 
    ('control', 'NESPDT7'),
    ('control', 'NES7ADCX'), 
    ('control', 'NESPDT7ADCX'),
    ('control', 'RES7'),
    ('control', 'RES7PDT'), 
    ('control', 'RIO'),
    ('control', 'RES7EM'), 
    ('control', 'RES7PDTEM'),
    ('control', 'RIOEM'),
    ('control', 'MSD7ADCX'),
    ('control', 'MSDPDT7ADCX'), 
    ('control', 'JOT'),
    ('control', 'JOTVTX15');
  `);

  // finish
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('finish', 'WH'), 
    ('finish', 'PAF'),
    ('finish', 'DNA');
  `);

  // voltage_req
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('voltage_req', '120V');
  `);

  // source
  db.run(`INSERT INTO options (field_name, option_name) VALUES 
    ('source', 'INTEGRATED LED'),
    ('source', 'LED LAMP');
  `);

// wattage
db.run(`INSERT INTO options (field_name, option_name) VALUES 
  ('wattage', '74W');
`);

// driver_req
db.run(`INSERT INTO options (field_name, option_name) VALUES 
  ('driver_req', '0-10V DIMMING'),
  ('driver_req', 'LINE VOLTAGE DIMMING'),
  ('driver_req', 'STANDARD NON-DIMMING'),
  ('driver_req', 'INTEGRATED IN LAMP');
`);

// dimensions
db.run(`INSERT INTO options (field_name, option_name) VALUES 
  ('dimensions', '2''-0" LONG'),
  ('dimensions', '4''-0" LONG'),
  ('dimensions', '8''-0" LONG');
`);

// mounting_type
db.run(`INSERT INTO options (field_name, option_name) VALUES 
  ('mounting_type', 'SURFACE'), 
  ('mounting_type', 'WALL'),
  ('mounting_type', 'SUSPENDED'),
  ('mounting_type', 'RECESSED'), 
  ('mounting_type', 'AT GRADE'),
  ('mounting_type', 'MIXED');
`);

// luminaire_type
db.run(`INSERT INTO options (field_name, option_name) VALUES 
  ('luminaire_type', 'LINEAR LUMINAIRE'), 
  ('luminaire_type', 'LINEAR WRAP LUMINAIRE'),
  ('luminaire_type', 'VANITY LUMINAIRE'),
  ('luminaire_type', 'VOLUMETRIC LUMINAIRE'), 
  ('luminaire_type', 'FLAT PANEL LUMINAIRE'),
  ('luminaire_type', 'WAFER DOWNLIGHT LUMINAIRE'),
  ('luminaire_type', 'DOWNLIGHT LUMINAIRE'),
  ('luminaire_type', 'SCONCE LUMINAIRE'),
  ('luminaire_type', 'UPLIGHT LUMINAIRE'),
  ('luminaire_type', 'AREA/FLOOD LUMINAIRE');
`);

});

db.close();