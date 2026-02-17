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
    featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

const cars = [
  { year: 2021, make: 'Toyota', model: 'Camry SE', price: 22500, mileage: 34000, color: 'Silver', description: 'Clean title, one owner. Backup camera, Apple CarPlay, great on gas.', featured: 1 },
  { year: 2020, make: 'Honda', model: 'Civic LX', price: 18900, mileage: 41000, color: 'Black', description: 'Well maintained, clean CarFax. Perfect commuter car.', featured: 1 },
  { year: 2019, make: 'Nissan', model: 'Altima SV', price: 17500, mileage: 52000, color: 'White', description: 'Loaded with features. Blind spot monitoring, heated seats.', featured: 0 },
  { year: 2022, make: 'Chevrolet', model: 'Malibu LT', price: 21000, mileage: 28000, color: 'Blue', description: 'Like new condition. Turbocharged engine, great fuel economy.', featured: 1 },
  { year: 2020, make: 'Toyota', model: 'Corolla LE', price: 19200, mileage: 38000, color: 'Gray', description: 'Toyota reliability at a great price. Safety Sense included.', featured: 0 },
  { year: 2018, make: 'Honda', model: 'Accord Sport', price: 20500, mileage: 55000, color: 'Red', description: 'Sport trim with 1.5T engine. Leather-trimmed seats, sunroof.', featured: 0 },
  { year: 2021, make: 'Hyundai', model: 'Elantra SEL', price: 19800, mileage: 31000, color: 'White', description: 'Bold new design. Wireless CarPlay, lane keep assist.', featured: 0 },
  { year: 2019, make: 'Chevrolet', model: 'Equinox LT', price: 19500, mileage: 48000, color: 'Black', description: 'Spacious SUV with AWD. Heated seats, remote start.', featured: 0 },
  { year: 2020, make: 'Nissan', model: 'Rogue SV', price: 21500, mileage: 42000, color: 'Silver', description: 'Family-friendly SUV. ProPilot Assist, panoramic sunroof.', featured: 0 },
  { year: 2017, make: 'Toyota', model: 'RAV4 XLE', price: 18800, mileage: 67000, color: 'Blue', description: 'Reliable SUV with great resale value. Sunroof, dual climate.', featured: 0 },
  { year: 2021, make: 'Kia', model: 'Forte LXS', price: 17900, mileage: 29000, color: 'Gray', description: 'Excellent value. 8-inch touchscreen, wireless charging.', featured: 0 },
  { year: 2019, make: 'Ford', model: 'Escape SE', price: 17200, mileage: 51000, color: 'White', description: 'Versatile SUV with EcoBoost engine. SYNC 3 infotainment.', featured: 0 },
];

const stmt = db.prepare(`
  INSERT INTO cars (year, make, model, price, mileage, color, description, image, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insert = db.transaction((cars) => {
  for (const car of cars) {
    stmt.run(car.year, car.make, car.model, car.price, car.mileage, car.color, car.description, null, car.featured);
  }
});

insert(cars);
console.log(`Seeded ${cars.length} sample cars into the database.`);
console.log('Run "node server.js" to start the website.');
db.close();
