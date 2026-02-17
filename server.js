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
    featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

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

// ============ API ROUTES ============

// Get all cars (public)
app.get('/api/cars', (req, res) => {
  const cars = db.prepare('SELECT * FROM cars ORDER BY featured DESC, created_at DESC').all();
  res.json(cars);
});

// Get single car
app.get('/api/cars/:id', (req, res) => {
  const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });
  res.json(car);
});

// Add a car (admin)
app.post('/api/cars', upload.single('image'), (req, res) => {
  const { year, make, model, price, mileage, color, description, featured } = req.body;
  if (!year || !make || !model || !price) {
    return res.status(400).json({ error: 'Year, make, model, and price are required' });
  }
  const image = req.file ? '/uploads/' + req.file.filename : null;
  const stmt = db.prepare(`
    INSERT INTO cars (year, make, model, price, mileage, color, description, image, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    parseInt(year), make.trim(), model.trim(), parseInt(price),
    mileage ? parseInt(mileage) : null, color?.trim() || null,
    description?.trim() || null, image, featured ? 1 : 0
  );
  res.json({ id: result.lastInsertRowid, message: 'Car added!' });
});

// Update a car
app.put('/api/cars/:id', upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Car not found' });

  const { year, make, model, price, mileage, color, description, featured } = req.body;
  let image = existing.image;
  if (req.file) {
    // Delete old image if it exists
    if (existing.image) {
      const oldPath = path.join(__dirname, existing.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    image = '/uploads/' + req.file.filename;
  }

  db.prepare(`
    UPDATE cars SET year=?, make=?, model=?, price=?, mileage=?, color=?, description=?, image=?, featured=?
    WHERE id=?
  `).run(
    parseInt(year), make.trim(), model.trim(), parseInt(price),
    mileage ? parseInt(mileage) : null, color?.trim() || null,
    description?.trim() || null, image, featured ? 1 : 0,
    req.params.id
  );
  res.json({ message: 'Car updated!' });
});

// Delete a car
app.delete('/api/cars/:id', (req, res) => {
  const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });

  // Delete image file
  if (car.image) {
    const imgPath = path.join(__dirname, car.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  db.prepare('DELETE FROM cars WHERE id = ?').run(req.params.id);
  res.json({ message: 'Car deleted!' });
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve main pages
app.get('/inventory', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Warehouse Cars Tampa running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
