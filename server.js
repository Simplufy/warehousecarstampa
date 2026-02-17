const express = require('express');
const Database = require('better-sqlite3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
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

// Add new columns to existing cars table if they don't exist
const cols = db.prepare("PRAGMA table_info(cars)").all().map(c => c.name);
const newCols = [
  ['drivetrain', 'TEXT'], ['transmission', 'TEXT'], ['engine', 'TEXT'],
  ['fuel_type', 'TEXT'], ['body_style', 'TEXT'], ['vin', 'TEXT'], ['highlights', 'TEXT']
];
for (const [col, type] of newCols) {
  if (!cols.includes(col)) {
    db.exec(`ALTER TABLE cars ADD COLUMN ${col} ${type}`);
  }
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Image upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

// Helper: attach images to car object
function attachImages(car) {
  if (!car) return car;
  const images = db.prepare('SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order').all(car.id);
  car.images = images.map(i => i.image_path);
  return car;
}

// ============ API ROUTES ============

// Get all cars (public)
app.get('/api/cars', (req, res) => {
  const cars = db.prepare('SELECT * FROM cars ORDER BY featured DESC, created_at DESC').all();
  cars.forEach(attachImages);
  res.json(cars);
});

// Get single car with all images
app.get('/api/cars/:id', (req, res) => {
  const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });
  attachImages(car);
  res.json(car);
});

// Add a car (admin) — supports multiple images
app.post('/api/cars', upload.array('images', 20), (req, res) => {
  const { year, make, model, price, mileage, color, description, featured,
          drivetrain, transmission, engine, fuel_type, body_style, vin, highlights } = req.body;
  if (!year || !make || !model || !price) {
    return res.status(400).json({ error: 'Year, make, model, and price are required' });
  }

  const mainImage = req.files && req.files.length > 0 ? '/uploads/' + req.files[0].filename : null;

  const stmt = db.prepare(`
    INSERT INTO cars (year, make, model, price, mileage, color, description, image, featured,
                      drivetrain, transmission, engine, fuel_type, body_style, vin, highlights)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    parseInt(year), make.trim(), model.trim(), parseInt(price),
    mileage ? parseInt(mileage) : null, color?.trim() || null,
    description?.trim() || null, mainImage, featured ? 1 : 0,
    drivetrain?.trim() || null, transmission?.trim() || null,
    engine?.trim() || null, fuel_type?.trim() || null,
    body_style?.trim() || null, vin?.trim() || null,
    highlights?.trim() || null
  );

  // Save all uploaded images
  if (req.files && req.files.length > 0) {
    const imgStmt = db.prepare('INSERT INTO car_images (car_id, image_path, sort_order) VALUES (?, ?, ?)');
    req.files.forEach((file, i) => {
      imgStmt.run(result.lastInsertRowid, '/uploads/' + file.filename, i);
    });
  }

  res.json({ id: result.lastInsertRowid, message: 'Car added!' });
});

// Update a car
app.put('/api/cars/:id', upload.array('images', 20), (req, res) => {
  const existing = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Car not found' });

  const { year, make, model, price, mileage, color, description, featured,
          drivetrain, transmission, engine, fuel_type, body_style, vin, highlights } = req.body;

  let mainImage = existing.image;

  // If new images uploaded, add them
  if (req.files && req.files.length > 0) {
    mainImage = '/uploads/' + req.files[0].filename;
    const maxOrder = db.prepare('SELECT MAX(sort_order) as mx FROM car_images WHERE car_id = ?').get(req.params.id);
    const startOrder = (maxOrder?.mx ?? -1) + 1;
    const imgStmt = db.prepare('INSERT INTO car_images (car_id, image_path, sort_order) VALUES (?, ?, ?)');
    req.files.forEach((file, i) => {
      imgStmt.run(req.params.id, '/uploads/' + file.filename, startOrder + i);
    });
  }

  // Update main image to first available if we have images
  const firstImg = db.prepare('SELECT image_path FROM car_images WHERE car_id = ? ORDER BY sort_order LIMIT 1').get(req.params.id);
  if (firstImg) mainImage = firstImg.image_path;

  db.prepare(`
    UPDATE cars SET year=?, make=?, model=?, price=?, mileage=?, color=?, description=?,
    image=?, featured=?, drivetrain=?, transmission=?, engine=?, fuel_type=?, body_style=?, vin=?, highlights=?
    WHERE id=?
  `).run(
    parseInt(year), make.trim(), model.trim(), parseInt(price),
    mileage ? parseInt(mileage) : null, color?.trim() || null,
    description?.trim() || null, mainImage, featured ? 1 : 0,
    drivetrain?.trim() || null, transmission?.trim() || null,
    engine?.trim() || null, fuel_type?.trim() || null,
    body_style?.trim() || null, vin?.trim() || null,
    highlights?.trim() || null,
    req.params.id
  );
  res.json({ message: 'Car updated!' });
});

// Delete a single image from a car
app.delete('/api/cars/:id/images/:imageId', (req, res) => {
  const img = db.prepare('SELECT * FROM car_images WHERE id = ? AND car_id = ?').get(req.params.imageId, req.params.id);
  if (!img) return res.status(404).json({ error: 'Image not found' });

  const imgPath = path.join(__dirname, img.image_path);
  if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  db.prepare('DELETE FROM car_images WHERE id = ?').run(req.params.imageId);

  // Update main image
  const first = db.prepare('SELECT image_path FROM car_images WHERE car_id = ? ORDER BY sort_order LIMIT 1').get(req.params.id);
  db.prepare('UPDATE cars SET image = ? WHERE id = ?').run(first ? first.image_path : null, req.params.id);

  res.json({ message: 'Image deleted' });
});

// Get images for a car
app.get('/api/cars/:id/images', (req, res) => {
  const images = db.prepare('SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order').all(req.params.id);
  res.json(images);
});

// Delete a car
app.delete('/api/cars/:id', (req, res) => {
  const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });

  // Delete all image files
  const images = db.prepare('SELECT image_path FROM car_images WHERE car_id = ?').all(req.params.id);
  for (const img of images) {
    const imgPath = path.join(__dirname, img.image_path);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }
  if (car.image && !images.find(i => i.image_path === car.image)) {
    const imgPath = path.join(__dirname, car.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  db.prepare('DELETE FROM car_images WHERE car_id = ?').run(req.params.id);
  db.prepare('DELETE FROM cars WHERE id = ?').run(req.params.id);
  res.json({ message: 'Car deleted!' });
});

// ============ CONTACT FORM ============

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message, car_interest } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  db.prepare(`
    INSERT INTO contact_messages (name, email, phone, message, car_interest)
    VALUES (?, ?, ?, ?, ?)
  `).run(name.trim(), email.trim(), phone?.trim() || null, message.trim(), car_interest?.trim() || null);
  res.json({ message: 'Thank you! We\'ll get back to you soon.' });
});

// Get contact messages (admin)
app.get('/api/messages', (req, res) => {
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  res.json(messages);
});

// Mark message as read
app.put('/api/messages/:id/read', (req, res) => {
  db.prepare('UPDATE contact_messages SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Marked as read' });
});

// Delete message
app.delete('/api/messages/:id', (req, res) => {
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  res.json({ message: 'Message deleted' });
});

// ============ PAGE ROUTES ============

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/car/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'car.html'));
});

app.get('/inventory', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Warehouse Cars Tampa running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
