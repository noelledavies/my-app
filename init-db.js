const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  // remove tables for reset
  db.run("DROP TABLE IF EXISTS entries");
  db.run("DROP TABLE IF EXISTS selections");
  db.run("DROP TABLE IF EXISTS pdfs");
  db.run("DROP TABLE IF EXISTS mn");


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
      field_name TEXT,
      option_name TEXT,
      dependent TEXT
    )
  `);

  db.run(`
    CREATE TABLE mn (
      type INTEGER, 
      field_name TEXT,
      in_mn INTEGER
    )
  `);

  db.run(`
    CREATE TABLE entries (
      model_num TEXT,
      voltage_req TEXT,
      source TEXT,
      wattage TEXT,
      lumen_level TEXT,
      color_temp_k TEXT,
      driver_req TEXT,
      dimensions TEXT,
      mounting_type TEXT,
      luminaire_type
    )
  `);// add value to table to associate with table containing schedules 
  // spare table creation 
  // db.run(`
  
  //   `);

  db.run("INSERT INTO pdfs (type, spec_sheet, manufacturer) VALUES ('FA.pdf', 'pdf_folder/FA.pdf', 'Lithonia');");
  db.run("INSERT INTO pdfs (type, spec_sheet, manufacturer) VALUES ('FB.pdf', 'pdf_folder/FB.pdf', 'Lithonia');");

  db.run(`INSERT INTO selections (type, field_name, option_name, dependent) VALUES 
    ('FA.pdf', 'series', 'BLWP2', NULL), 
    ('FA.pdf', 'series', 'BLWP4', NULL), 
    ('FA.pdf', 'series', 'BLWP8', NULL), 
    ('FA.pdf','lumens', '8L', 'BLWP2' ), 
    ('FA.pdf','lumens', '20L', 'BLWP2'), 
    ('FA.pdf','lumens', '33L', 'BLWP2'), 
    ('FA.pdf','lumens', '40L', 'BLWP2'), 
    ('FA.pdf','lumens', '48L', 'BLWP2'),
    ('FA.pdf','lumens', '8LHE', 'BLWP2' ), 
    ('FA.pdf','lumens', '20LHE', 'BLWP2'), 
    ('FA.pdf','lumens', '33LHE', 'BLWP2'), 
    ('FA.pdf','lumens', '40LHE', 'BLWP2'), 
    ('FA.pdf','lumens', '48LHE', 'BLWP2'),
    ('FA.pdf','lumens', '15L', 'BLWP4' ), 
    ('FA.pdf','lumens', '20L', 'BLWP4'), 
    ('FA.pdf','lumens', '30L', 'BLWP4'), 
    ('FA.pdf','lumens', '40L', 'BLWP4'), 
    ('FA.pdf','lumens', '48L', 'BLWP4'),
    ('FA.pdf','lumens', '60L', 'BLWP4'), 
    ('FA.pdf','lumens', '72L', 'BLWP4'), 
    ('FA.pdf','lumens', '85L', 'BLWP4'), 
    ('FA.pdf','lumens', '100L', 'BLWP4'),
    ('FA.pdf','lumens', '15LHE', 'BLWP4' ), 
    ('FA.pdf','lumens', '20LHE', 'BLWP4'), 
    ('FA.pdf','lumens', '30LHE', 'BLWP4'), 
    ('FA.pdf','lumens', '40LHE', 'BLWP4'), 
    ('FA.pdf','lumens', '48LHE', 'BLWP4'),
    ('FA.pdf','lumens', '60LHE', 'BLWP4'), 
    ('FA.pdf','lumens', '72LHE', 'BLWP4'), 
    ('FA.pdf','lumens', '85LHE', 'BLWP4'), 
    ('FA.pdf','lumens', '100LHE', 'BLWP4'),
    ('FA.pdf','lumens', '40L', 'BLWP8'), 
    ('FA.pdf','lumens', '60L', 'BLWP8'),
    ('FA.pdf','lumens', '80L', 'BLWP8'), 
    ('FA.pdf','lumens', '100L', 'BLWP8'), 
    ('FA.pdf','lumens', '140L', 'BLWP8'), 
    ('FA.pdf','lumens', '180L', 'BLWP8'),
    ('FA.pdf','lumens', '200L', 'BLWP8'),
    ('FA.pdf','lumens', '40LHE', 'BLWP8'), 
    ('FA.pdf','lumens', '60LHE', 'BLWP8'),
    ('FA.pdf','lumens', '80LHE', 'BLWP8'), 
    ('FA.pdf','lumens', '100LHE', 'BLWP8'), 
    ('FA.pdf','lumens', '140LHE', 'BLWP8'), 
    ('FA.pdf','lumens', '180LHE', 'BLWP8'),
    ('FA.pdf','lumens', '200LHE', 'BLWP8'),
    ('FA.pdf','lens', 'ADP', NULL), 
    ('FA.pdf','lens', 'ADSM', NULL),
    ('FA.pdf','lens', 'SDP', NULL), 
    ('FA.pdf','lens', 'SDSM', NULL),
    ('FA.pdf','lens', 'PDSM', NULL), 
    ('FA.pdf','lens', 'ADPT', NULL), 
    ('FA.pdf','lens', 'ADSMT', NULL),
    ('FA.pdf','lens', 'SDPT', NULL), 
    ('FA.pdf','lens', 'SDSMT', NULL),
    ('FA.pdf','lens', 'PDSMT', NULL),
    ('FA.pdf','voltage', 'MVOLT', NULL), 
    ('FA.pdf','voltage', '120', NULL),
    ('FA.pdf','voltage', '277', NULL), 
    ('FA.pdf','voltage', '347', NULL), 
    ('FA.pdf','driver', 'EZ1', NULL), 
    ('FA.pdf','driver', 'GZ1', NULL),
    ('FA.pdf','driver', 'GZ10', NULL), 
    ('FA.pdf','driver', 'SLD', NULL), 
    ('FA.pdf','color_temp', 'LP830', NULL), 
    ('FA.pdf','color_temp', 'LP835', NULL),
    ('FA.pdf','color_temp', 'LP840', NULL), 
    ('FA.pdf','color_temp', 'LP850', NULL),
    ('FA.pdf','color_temp', 'LP930', NULL),
    ('FA.pdf','color_temp', 'LP935', NULL),
    ('FA.pdf','color_temp', 'LP940', NULL),
    ('FA.pdf','color_temp', 'LP950', NULL),
    ('FA.pdf','light_interface', 'N80', NULL), 
    ('FA.pdf','light_interface', 'N80EMG', NULL),
    ('FA.pdf','light_interface', 'N100', NULL), 
    ('FA.pdf','light_interface', 'N100EMG', NULL),
    ('FA.pdf','light_interface', 'NLTAIR2', NULL), 
    ('FA.pdf','control', NULL, NULL),
    ('FA.pdf','control', 'NES7', NULL), 
    ('FA.pdf','control', 'NESPDT7', NULL),
    ('FA.pdf','control', 'NES7ADCX', NULL), 
    ('FA.pdf','control', 'NESPDT7ADCX', NULL),
    ('FA.pdf','control', 'RES7', NULL),
    ('FA.pdf','control', 'RES7PDT', NULL), 
    ('FA.pdf','control', 'RIO', NULL),
    ('FA.pdf','control', 'RES7EM', NULL), 
    ('FA.pdf','control', 'RES7PDTEM', NULL),
    ('FA.pdf','control', 'RIOEM', NULL),
    ('FA.pdf','control', 'MSD7ADCX', NULL),
    ('FA.pdf','control', 'MSDPDT7ADCX', NULL), 
    ('FA.pdf','control', 'JOT', NULL),
    ('FA.pdf','control', 'JOTVTX15', NULL),
    ('FA.pdf','finish', 'WH', NULL), 
    ('FA.pdf','finish', 'PAF', NULL),
    ('FA.pdf','finish', 'DNA', NULL),
    ('FA.pdf','voltage_req', '120V', NULL),
    ('FA.pdf','source', 'INTEGRATED LED', NULL),
    ('FA.pdf','source', 'LED LAMP', NULL),
    ('FA.pdf','wattage', '74W', NULL),
    ('FA.pdf', 'lumen_level', NULL, NULL), 
    ('FA.pdf', 'color_temp_k', NULL, NULL), 
    ('FA.pdf','driver_req', '0-10V DIMMING', NULL),
    ('FA.pdf','driver_req', 'LINE VOLTAGE DIMMING', NULL),
    ('FA.pdf','driver_req', 'STANDARD NON-DIMMING', NULL),
    ('FA.pdf','driver_req', 'INTEGRATED IN LAMP', NULL),
    ('FA.pdf','dimensions', '2''-0" LONG', NULL),
    ('FA.pdf','dimensions', '4''-0" LONG', NULL),
    ('FA.pdf','dimensions', '8''-0" LONG', NULL), 
    ('FA.pdf','mounting_type', 'SURFACE', NULL), 
    ('FA.pdf','mounting_type', 'WALL', NULL),
    ('FA.pdf','mounting_type', 'SUSPENDED', NULL),
    ('FA.pdf','mounting_type', 'RECESSED', NULL), 
    ('FA.pdf','mounting_type', 'AT GRADE', NULL),
    ('FA.pdf','mounting_type', 'MIXED', NULL), 
    ('FA.pdf','luminaire_type', 'LINEAR LUMINAIRE', NULL), 
    ('FA.pdf','luminaire_type', 'LINEAR WRAP LUMINAIRE', NULL),
    ('FA.pdf','luminaire_type', 'VANITY LUMINAIRE', NULL),
    ('FA.pdf','luminaire_type', 'VOLUMETRIC LUMINAIRE', NULL), 
    ('FA.pdf','luminaire_type', 'FLAT PANEL LUMINAIRE', NULL),
    ('FA.pdf','luminaire_type', 'WAFER DOWNLIGHT LUMINAIRE', NULL),
    ('FA.pdf','luminaire_type', 'DOWNLIGHT LUMINAIRE', NULL),
    ('FA.pdf','luminaire_type', 'SCONCE LUMINAIRE', NULL),
    ('FA.pdf','luminaire_type', 'UPLIGHT LUMINAIRE', NULL),
    ('FA.pdf','luminaire_type', 'AREA/FLOOD LUMINAIRE', NULL);
  `);

  db.run(`INSERT INTO mn (type, field_name, in_mn) VALUES 
    ('FA.pdf', 'series', 1), 
    ('FA.pdf','lumens', 1), 
    ('FA.pdf','lens', 1),   
    ('FA.pdf','voltage', 0), 
    ('FA.pdf','driver', 1), 
    ('FA.pdf','color_temp', 1), 
    ('FA.pdf','light_interface', 1), 
    ('FA.pdf','control', 1),
    ('FA.pdf','finish', 1), 
    ('FA.pdf','voltage_req', 0),
    ('FA.pdf','source', 0),
    ('FA.pdf','wattage', 0),
    ('FA.pdf', 'lumen_level', 0), 
    ('FA.pdf', 'color_temp_k', 0), 
    ('FA.pdf','driver_req', 0),
    ('FA.pdf','dimensions', 0),
    ('FA.pdf','mounting_type', 0), 
    ('FA.pdf','luminaire_type', 0);
  `);

});

db.close();