// Run this once to add sample cars: node seed.js
const Database = require('better-sqlite3');
const db = new Database('inventory.db');

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    price INTEGER NOT NULL,
    mileage INTEGER,
    color TEXT,
    description TEXT,
    image TEXT,
    drivetrain TEXT,
    transmission TEXT,
    engine TEXT,
    fuel_type TEXT,
    body_style TEXT,
    vin TEXT,
    highlights TEXT,
    featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS car_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    car_interest TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    read INTEGER DEFAULT 0
  )
`);

const cars = [
  {
    year: 2021, make: 'Toyota', model: 'Camry SE', price: 22500, mileage: 34000,
    color: 'Silver', body_style: 'Sedan', drivetrain: 'FWD', transmission: 'Automatic',
    engine: '2.5L 4-Cylinder', fuel_type: 'Gasoline',
    description: 'This 2021 Toyota Camry SE is in excellent condition with only 34,000 miles. One-owner vehicle with a clean CarFax report. Features include backup camera, Apple CarPlay, Android Auto, and Toyota Safety Sense suite. Great on gas with an EPA-estimated 28 city / 39 highway MPG.',
    highlights: 'Clean title, one owner with full service history\nApple CarPlay and Android Auto\nToyota Safety Sense 2.5+ suite\nExcellent fuel economy — 28/39 MPG',
    featured: 1
  },
  {
    year: 2020, make: 'Honda', model: 'Civic LX', price: 18900, mileage: 41000,
    color: 'Black', body_style: 'Sedan', drivetrain: 'FWD', transmission: 'CVT',
    engine: '2.0L 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Well maintained 2020 Honda Civic LX with clean CarFax. Perfect commuter car with Honda Sensing safety features. Reliable, fuel-efficient, and ready to go.',
    highlights: 'Honda Sensing safety suite included\nClean CarFax, no accidents\n30/38 MPG city/highway\nBluetooth, backup camera, adaptive cruise',
    featured: 1
  },
  {
    year: 2019, make: 'Nissan', model: 'Altima SV', price: 17500, mileage: 52000,
    color: 'White', body_style: 'Sedan', drivetrain: 'FWD', transmission: 'CVT',
    engine: '2.5L 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Loaded 2019 Nissan Altima SV with blind spot monitoring, heated seats, and a power sunroof. Excellent condition inside and out.',
    highlights: 'Blind spot monitoring and rear cross traffic alert\nHeated front seats\nPower sunroof\nRemote engine start',
    featured: 0
  },
  {
    year: 2022, make: 'Chevrolet', model: 'Malibu LT', price: 21000, mileage: 28000,
    color: 'Blue', body_style: 'Sedan', drivetrain: 'FWD', transmission: 'CVT',
    engine: '1.5L Turbo 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Like-new 2022 Chevrolet Malibu LT with only 28,000 miles. Turbocharged engine delivers great performance and fuel economy. Loaded with tech features.',
    highlights: 'Only 28,000 miles — like new condition\nTurbocharged engine with great fuel economy\n8-inch touchscreen with Apple CarPlay\nLane keep assist and forward collision alert',
    featured: 1
  },
  {
    year: 2020, make: 'Toyota', model: 'Corolla LE', price: 19200, mileage: 38000,
    color: 'Gray', body_style: 'Sedan', drivetrain: 'FWD', transmission: 'CVT',
    engine: '1.8L 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Toyota reliability at a great price. This 2020 Corolla LE comes with Toyota Safety Sense 2.0, automatic climate control, and an 8-inch touchscreen.',
    highlights: 'Toyota Safety Sense 2.0 standard\nAutomatic climate control\n31/40 MPG — outstanding fuel economy\nLow miles for the year',
    featured: 0
  },
  {
    year: 2018, make: 'Honda', model: 'Accord Sport', price: 20500, mileage: 55000,
    color: 'Red', body_style: 'Sedan', drivetrain: 'FWD', transmission: 'Automatic',
    engine: '1.5L Turbo 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Sporty and fun to drive. This 2018 Honda Accord Sport features a turbocharged engine, leather-trimmed seats, sunroof, and Honda Sensing.',
    highlights: '1.5L Turbo with 192 hp — fun to drive\nLeather-trimmed sport seats\nPower sunroof\nHonda Sensing standard',
    featured: 0
  },
  {
    year: 2021, make: 'Hyundai', model: 'Elantra SEL', price: 19800, mileage: 31000,
    color: 'White', body_style: 'Sedan', drivetrain: 'FWD', transmission: 'CVT',
    engine: '2.0L 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Bold new design with cutting-edge tech. This 2021 Hyundai Elantra SEL features wireless Apple CarPlay, lane keeping assist, and a spacious interior.',
    highlights: 'Wireless Apple CarPlay and Android Auto\nLane keeping assist and forward collision avoidance\n33/43 MPG — class-leading fuel economy\nRemaining factory warranty',
    featured: 0
  },
  {
    year: 2019, make: 'Chevrolet', model: 'Equinox LT', price: 19500, mileage: 48000,
    color: 'Black', body_style: 'SUV', drivetrain: 'AWD', transmission: 'Automatic',
    engine: '1.5L Turbo 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Spacious and versatile SUV with AWD. This 2019 Chevrolet Equinox LT has heated seats, remote start, and plenty of cargo room for the family.',
    highlights: 'All-Wheel Drive for Florida storms\nHeated front seats\nRemote start\n7-inch touchscreen with Apple CarPlay',
    featured: 0
  },
  {
    year: 2020, make: 'Nissan', model: 'Rogue SV', price: 21500, mileage: 42000,
    color: 'Silver', body_style: 'SUV', drivetrain: 'FWD', transmission: 'CVT',
    engine: '2.5L 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Family-friendly SUV with tons of features. ProPilot Assist, panoramic sunroof, and Apple CarPlay make this Rogue SV a great daily driver.',
    highlights: 'ProPilot Assist semi-autonomous driving\nPanoramic power sunroof\nApple CarPlay and Android Auto\nSpacioud cargo area — 39.3 cu ft',
    featured: 0
  },
  {
    year: 2017, make: 'Toyota', model: 'RAV4 XLE', price: 18800, mileage: 67000,
    color: 'Blue', body_style: 'SUV', drivetrain: 'FWD', transmission: 'Automatic',
    engine: '2.5L 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Reliable and popular SUV with great resale value. This RAV4 XLE features a sunroof, dual-zone climate control, and Toyota Safety Sense.',
    highlights: 'Toyota reliability — built to last\nPower sunroof\nDual-zone automatic climate control\nToyota Safety Sense P standard',
    featured: 0
  },
  {
    year: 2021, make: 'Kia', model: 'Forte LXS', price: 17900, mileage: 29000,
    color: 'Gray', body_style: 'Sedan', drivetrain: 'FWD', transmission: 'CVT',
    engine: '2.0L 4-Cylinder', fuel_type: 'Gasoline',
    description: 'Excellent value with modern features. This 2021 Kia Forte LXS comes with an 8-inch touchscreen, wireless charging, and forward collision avoidance.',
    highlights: '8-inch touchscreen display\nWireless phone charging\nForward collision avoidance assist\nRemaining factory warranty — 10yr/100k powertrain',
    featured: 0
  },
  {
    year: 2019, make: 'Ford', model: 'Escape SE', price: 17200, mileage: 51000,
    color: 'White', body_style: 'SUV', drivetrain: 'FWD', transmission: 'Automatic',
    engine: '1.5L EcoBoost Turbo', fuel_type: 'Gasoline',
    description: 'Versatile and practical SUV with EcoBoost engine. SYNC 3 infotainment system with Apple CarPlay and a spacious interior make this a great family vehicle.',
    highlights: 'EcoBoost turbocharged engine\nSYNC 3 with Apple CarPlay and Android Auto\nRear parking sensors\nFold-flat 60/40 rear seats',
    featured: 0
  },
];

const stmt = db.prepare(`
  INSERT INTO cars (year, make, model, price, mileage, color, description, image, featured,
                    drivetrain, transmission, engine, fuel_type, body_style, highlights)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insert = db.transaction((cars) => {
  for (const car of cars) {
    stmt.run(
      car.year, car.make, car.model, car.price, car.mileage, car.color,
      car.description, null, car.featured,
      car.drivetrain, car.transmission, car.engine, car.fuel_type,
      car.body_style, car.highlights
    );
  }
});

insert(cars);
console.log(`Seeded ${cars.length} sample cars into the database.`);
console.log('Run "node server.js" to start the website.');
db.close();
