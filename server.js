const express = require('express');
const Database = require('better-sqlite3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const helpers = require('./lib/seo-helpers');
const seoContent = require('./lib/seo-content');
const evergreenContent = require('./lib/evergreen-content');

const app = express();
const PORT = process.env.PORT || 3000;

// ============ EJS SETUP ============
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============ DATABASE SETUP ============
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

const queries = require('./lib/db-queries')(db);

// ============ MIDDLEWARE ============
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

// ============ RENDER HELPER ============
function renderPage(res, page, data) {
  const body = new Promise((resolve, reject) => {
    res.app.render(`pages/${page}`, data, (err, html) => {
      if (err) return reject(err);
      resolve(html);
    });
  });
  body.then(html => {
    res.render('layouts/base', { ...data, body: html });
  }).catch(err => {
    console.error('Render error:', err);
    res.status(500).send('Server error');
  });
}

// ============ SHARED DATA ============
function getInternalLinkData() {
  const makes = queries.getDistinctMakes();
  const bodyStyles = queries.getDistinctBodyStyles();
  const priceRanges = [15000, 20000, 25000, 30000];
  const relatedGuides = [
    { slug: 'best-used-suvs-tampa', name: 'Best Used SUVs' },
    { slug: 'best-used-cars-under-15000', name: 'Best Cars Under $15K' },
    { slug: 'used-car-buying-guide-tampa', name: 'Buying Guide' },
    { slug: 'best-first-cars-tampa', name: 'Best First Cars' }
  ];
  return { relatedMakes: makes, relatedBodyStyles: bodyStyles, priceRanges, relatedGuides };
}

// ============ API ROUTES ============

app.get('/api/cars', (req, res) => {
  res.json(queries.getAllCars());
});

app.get('/api/cars/:id', (req, res) => {
  const car = queries.getCarById(req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });
  res.json(car);
});

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
  if (req.files && req.files.length > 0) {
    const imgStmt = db.prepare('INSERT INTO car_images (car_id, image_path, sort_order) VALUES (?, ?, ?)');
    req.files.forEach((file, i) => {
      imgStmt.run(result.lastInsertRowid, '/uploads/' + file.filename, i);
    });
  }
  res.json({ id: result.lastInsertRowid, message: 'Car added!' });
});

app.put('/api/cars/:id', upload.array('images', 20), (req, res) => {
  const existing = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Car not found' });
  const { year, make, model, price, mileage, color, description, featured,
          drivetrain, transmission, engine, fuel_type, body_style, vin, highlights } = req.body;
  let mainImage = existing.image;
  if (req.files && req.files.length > 0) {
    mainImage = '/uploads/' + req.files[0].filename;
    const maxOrder = db.prepare('SELECT MAX(sort_order) as mx FROM car_images WHERE car_id = ?').get(req.params.id);
    const startOrder = (maxOrder?.mx ?? -1) + 1;
    const imgStmt = db.prepare('INSERT INTO car_images (car_id, image_path, sort_order) VALUES (?, ?, ?)');
    req.files.forEach((file, i) => {
      imgStmt.run(req.params.id, '/uploads/' + file.filename, startOrder + i);
    });
  }
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

app.delete('/api/cars/:id/images/:imageId', (req, res) => {
  const img = db.prepare('SELECT * FROM car_images WHERE id = ? AND car_id = ?').get(req.params.imageId, req.params.id);
  if (!img) return res.status(404).json({ error: 'Image not found' });
  const imgPath = path.join(__dirname, img.image_path);
  if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  db.prepare('DELETE FROM car_images WHERE id = ?').run(req.params.imageId);
  const first = db.prepare('SELECT image_path FROM car_images WHERE car_id = ? ORDER BY sort_order LIMIT 1').get(req.params.id);
  db.prepare('UPDATE cars SET image = ? WHERE id = ?').run(first ? first.image_path : null, req.params.id);
  res.json({ message: 'Image deleted' });
});

app.get('/api/cars/:id/images', (req, res) => {
  const images = db.prepare('SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order').all(req.params.id);
  res.json(images);
});

app.delete('/api/cars/:id', (req, res) => {
  const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });
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

// ============ CONTACT API ============

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message, car_interest } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  db.prepare(`INSERT INTO contact_messages (name, email, phone, message, car_interest) VALUES (?, ?, ?, ?, ?)`)
    .run(name.trim(), email.trim(), phone?.trim() || null, message.trim(), car_interest?.trim() || null);
  res.json({ message: "Thank you! We'll get back to you soon." });
});

app.get('/api/messages', (req, res) => {
  res.json(db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all());
});

app.put('/api/messages/:id/read', (req, res) => {
  db.prepare('UPDATE contact_messages SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Marked as read' });
});

app.delete('/api/messages/:id', (req, res) => {
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  res.json({ message: 'Message deleted' });
});

// ============ ROBOTS.TXT ============

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${helpers.BASE_URL}/sitemap.xml
`);
});

// ============ SITEMAP.XML ============

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  const cars = queries.getAllCars();
  const makes = queries.getDistinctMakes();
  const models = queries.getDistinctModels();
  const bodyStyles = queries.getDistinctBodyStyles();
  const years = queries.getDistinctYears();
  const validPrices = [5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000, 35000, 40000];
  const allAreas = evergreenContent.getAllAreas();
  const allGuides = evergreenContent.getAllGuides();
  const allComparisons = evergreenContent.getAllComparisons();
  const allServices = evergreenContent.getAllServicePages();
  const predefinedMakeModels = seoContent.getAllPredefinedMakeModels();

  function url(path, freq, priority) {
    return `  <url><loc>${helpers.absoluteUrl(path)}</loc><changefreq>${freq}</changefreq><priority>${priority}</priority></url>\n`;
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  xml += url('/', 'daily', '1.0');
  xml += url('/inventory', 'daily', '0.9');
  xml += url('/browse', 'weekly', '0.8');
  xml += url('/contact', 'monthly', '0.6');

  // Car detail pages
  cars.forEach(car => { xml += url(helpers.carUrl(car), 'weekly', '0.8'); });

  // Make pages — include all predefined makes (always indexed for SEO)
  const sitemapMakes = new Set();
  makes.forEach(m => sitemapMakes.add(m.make));
  predefinedMakeModels.forEach(m => sitemapMakes.add(m.make));
  for (const make of sitemapMakes) {
    xml += url(helpers.makeUrl(make), 'daily', '0.9');
  }

  // Make+Model pages — DB models with inventory + all predefined models
  const addedMakeModels = new Set();
  models.forEach(m => {
    const count = queries.getCarsByMakeModel(m.make, m.model).length;
    if (count > 0) {
      xml += url(helpers.makeModelUrl(m.make, m.model), 'daily', '0.8');
      addedMakeModels.add(`${m.make}|${m.model}`);
    }
  });
  // Add all predefined make+model pages not already included
  predefinedMakeModels.forEach(m => {
    const key = `${m.make}|${m.model}`;
    if (!addedMakeModels.has(key)) {
      xml += url(helpers.makeModelUrl(m.make, m.model), 'weekly', '0.7');
    }
  });

  // Body style pages
  bodyStyles.forEach(bs => {
    const count = queries.getCarsByBodyStyle(bs.body_style).length;
    if (count > 0) xml += url(helpers.bodyStyleUrl(bs.body_style), 'daily', '0.8');
  });

  // Price range pages
  validPrices.forEach(p => {
    xml += url(helpers.priceRangeUrl(p), 'daily', '0.8');
  });

  // Year pages
  years.forEach(y => {
    const count = queries.getCarsByYear(y.year).length;
    if (count > 0) xml += url(helpers.yearUrl(y.year), 'weekly', '0.7');
  });

  // Evergreen: Area pages
  Object.keys(allAreas).forEach(slug => { xml += url(helpers.areaUrl(slug), 'weekly', '0.7'); });

  // Evergreen: Guide pages
  Object.keys(allGuides).forEach(slug => { xml += url(helpers.guideUrl(slug), 'monthly', '0.7'); });

  // Evergreen: Comparison pages
  Object.keys(allComparisons).forEach(slug => { xml += url(helpers.compareUrl(slug), 'monthly', '0.7'); });

  // Evergreen: Service pages
  xml += url('/financing', 'monthly', '0.7');
  Object.keys(allServices).forEach(slug => {
    if (slug !== 'financing') xml += url(`/financing/${slug}`, 'monthly', '0.6');
  });
  xml += url('/trade-in', 'monthly', '0.6');
  xml += url('/why-buy-used', 'monthly', '0.6');

  xml += '</urlset>';
  res.send(xml);
});

// ============ ADMIN (stays client-side) ============

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ============ BROWSE HUB PAGE ============

app.get('/browse', (req, res) => {
  const allMakes = queries.getDistinctMakes().map(m => m.make);
  const predefinedMakeModels = seoContent.getAllPredefinedMakeModels();

  // Merge DB makes with predefined makes (deduplicated, sorted)
  const makeSet = new Set(allMakes);
  predefinedMakeModels.forEach(m => makeSet.add(m.make));
  const makes = [...makeSet].sort();

  // Build model list: merge DB models with predefined models
  const dbModels = queries.getDistinctModels();
  const modelSet = new Set(dbModels.map(m => `${m.make}|${m.model}`));
  predefinedMakeModels.forEach(m => modelSet.add(`${m.make}|${m.model}`));
  const models = [...modelSet].map(key => {
    const [make, model] = key.split('|');
    return { make, model };
  }).sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));

  const dbBodyStyles = queries.getDistinctBodyStyles().map(bs => bs.body_style);
  const allBodyStyles = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Convertible', 'Wagon'];
  const bodyStyles = allBodyStyles.filter(bs => dbBodyStyles.includes(bs) || true);

  const prices = [5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000, 35000, 40000];

  const guides = evergreenContent.getAllGuides();
  const comparisons = evergreenContent.getAllComparisons();
  const areas = evergreenContent.getAllAreas();

  renderPage(res, 'browse', {
    makes, models, bodyStyles, prices, guides, comparisons, areas, helpers,
    pageTitle: 'Browse Used Cars by Make, Model, Price & More | Warehouse Cars Tampa',
    metaDescription: 'Browse our complete selection of used cars in Tampa by make, model, price range, body style, and more. Find buying guides, model comparisons, and nearby locations.',
    canonicalUrl: helpers.absoluteUrl('/browse'),
    schema: helpers.buildSchemaScripts([
      helpers.buildAutoDealerSchema(),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Browse' }])
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Browse All' }]
  });
});

// ============ SEO PAGE ROUTES ============

// --- Year pages: /2021-used-cars-tampa ---
app.get('/:yearSlug-used-cars-tampa', (req, res, next) => {
  const year = parseInt(req.params.yearSlug);
  if (isNaN(year) || year < 2000 || year > new Date().getFullYear() + 1) return next();

  const cars = queries.getCarsByYear(year);
  const stats = queries.getYearStats(year);
  const content = seoContent.getYearContent(year, stats, cars);
  const linkData = getInternalLinkData();

  renderPage(res, 'seo-listing', {
    cars, stats, content, helpers, ...linkData,
    pageTitle: content.title,
    metaDescription: content.metaDescription,
    canonicalUrl: helpers.absoluteUrl(helpers.yearUrl(year)),
    robots: cars.length === 0 ? 'noindex, follow' : 'index, follow',
    schema: helpers.buildSchemaScripts([
      helpers.buildItemListSchema(cars, content.h1, helpers.yearUrl(year)),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: `${year} Used Cars` }]),
      helpers.buildFAQSchema(content.faqs)
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: `${year} Used Cars in Tampa` }]
  });
});

// --- Guide pages: /guides/:slug ---
app.get('/guides/:slug', (req, res, next) => {
  const stats = queries.getInventoryStats();
  const content = evergreenContent.getGuideContent(req.params.slug, stats);
  if (!content) return next();

  // Get matching cars based on guide filters
  let matchingCars = [];
  if (content.bodyStyleFilter) matchingCars = queries.getCarsByBodyStyle(content.bodyStyleFilter);
  else if (content.priceFilter) matchingCars = queries.getCarsByPriceRange(content.priceFilter);
  else if (content.makeFilter) matchingCars = queries.getCarsByMake(content.makeFilter);
  else matchingCars = queries.getAllCars();

  renderPage(res, 'guide', {
    content, helpers, matchingCars,
    pageTitle: content.title,
    metaDescription: content.metaDescription,
    canonicalUrl: helpers.absoluteUrl(helpers.guideUrl(req.params.slug)),
    schema: helpers.buildSchemaScripts([
      helpers.buildArticleSchema(content.title, content.metaDescription, helpers.guideUrl(req.params.slug)),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Guides', url: '/guides/used-car-buying-guide-tampa' }, { name: content.h1 }]),
      helpers.buildFAQSchema(content.faqs)
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Guides' }, { name: content.h1 }]
  });
});

// --- Comparison pages: /compare/:slug ---
app.get('/compare/:slug', (req, res, next) => {
  const content = evergreenContent.getComparisonContent(req.params.slug);
  if (!content) return next();

  // Get matching cars for both models being compared
  let matchingCars = [];
  if (content.car1.make !== 'Category') {
    const cars1 = queries.getCarsByMake(content.car1.make);
    const cars2 = queries.getCarsByMake(content.car2.make);
    matchingCars = [...cars1, ...cars2].reduce((acc, c) => {
      if (!acc.find(x => x.id === c.id)) acc.push(c);
      return acc;
    }, []);
  } else {
    matchingCars = queries.getAllCars();
  }

  renderPage(res, 'comparison', {
    content, helpers, matchingCars,
    pageTitle: content.title,
    metaDescription: content.metaDescription,
    canonicalUrl: helpers.absoluteUrl(helpers.compareUrl(req.params.slug)),
    schema: helpers.buildSchemaScripts([
      helpers.buildArticleSchema(content.title, content.metaDescription, helpers.compareUrl(req.params.slug)),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Compare' }, { name: content.h1 }])
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Compare' }, { name: content.h1 }]
  });
});

// --- Financing pages ---
app.get('/financing', (req, res) => {
  const content = evergreenContent.getServiceContent('financing');
  renderPage(res, 'service', {
    content, helpers,
    pageTitle: content.title,
    metaDescription: content.metaDescription,
    canonicalUrl: helpers.absoluteUrl('/financing'),
    schema: helpers.buildSchemaScripts([
      helpers.buildAutoDealerSchema(),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Financing' }]),
      helpers.buildFAQSchema(content.faqs)
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Financing' }]
  });
});

app.get('/financing/:slug', (req, res, next) => {
  const content = evergreenContent.getServiceContent(req.params.slug);
  if (!content) return next();
  renderPage(res, 'service', {
    content, helpers,
    pageTitle: content.title,
    metaDescription: content.metaDescription,
    canonicalUrl: helpers.absoluteUrl(`/financing/${req.params.slug}`),
    schema: helpers.buildSchemaScripts([
      helpers.buildAutoDealerSchema(),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Financing', url: '/financing' }, { name: content.h1 }]),
      helpers.buildFAQSchema(content.faqs)
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Financing', url: '/financing' }, { name: content.h1 }]
  });
});

// --- Trade-in page ---
app.get('/trade-in', (req, res) => {
  const content = evergreenContent.getTradeInContent();
  renderPage(res, 'service', {
    content, helpers,
    pageTitle: content.title,
    metaDescription: content.metaDescription,
    canonicalUrl: helpers.absoluteUrl('/trade-in'),
    schema: helpers.buildSchemaScripts([
      helpers.buildArticleSchema(content.title, content.metaDescription, '/trade-in'),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Trade-In' }]),
      helpers.buildFAQSchema(content.faqs)
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Trade-In Your Car' }]
  });
});

// --- Why buy used page ---
app.get('/why-buy-used', (req, res) => {
  const content = evergreenContent.getWhyBuyUsedContent();
  renderPage(res, 'service', {
    content, helpers,
    pageTitle: content.title,
    metaDescription: content.metaDescription,
    canonicalUrl: helpers.absoluteUrl('/why-buy-used'),
    schema: helpers.buildSchemaScripts([
      helpers.buildArticleSchema(content.title, content.metaDescription, '/why-buy-used'),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Why Buy Used' }]),
      helpers.buildFAQSchema(content.faqs)
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Why Buy Used' }]
  });
});

// --- Area pages: /used-cars-near-{area}-fl ---
const areaSlugs = Object.keys(evergreenContent.getAllAreas());

app.get('/used-cars-near-:areaSlug-fl', (req, res, next) => {
  const areaSlug = req.params.areaSlug;
  if (!areaSlugs.includes(areaSlug)) return next();

  const stats = queries.getInventoryStats();
  const content = evergreenContent.getAreaContent(areaSlug, stats);
  if (!content) return next();

  const cars = queries.getAllCars();
  const linkData = getInternalLinkData();

  renderPage(res, 'seo-listing', {
    cars, stats, content, helpers, ...linkData,
    pageTitle: content.title,
    metaDescription: content.metaDescription,
    canonicalUrl: helpers.absoluteUrl(helpers.areaUrl(areaSlug)),
    robots: 'index, follow',
    schema: helpers.buildSchemaScripts([
      helpers.buildAutoDealerSchema(),
      helpers.buildItemListSchema(cars, content.h1, helpers.areaUrl(areaSlug)),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: `Used Cars Near ${content.areaName}` }]),
      helpers.buildFAQSchema(content.faqs)
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: `Used Cars Near ${content.areaName}, FL` }]
  });
});

// --- Unified /used-*-tampa handler ---
// Handles: body style pages, price range pages, make pages, make+model pages
const bodyStyleSlugs = { sedans: 'Sedan', suvs: 'SUV', trucks: 'Truck', coupes: 'Coupe', hatchbacks: 'Hatchback', vans: 'Van', convertibles: 'Convertible', wagons: 'Wagon' };

app.get('/used-*-tampa', (req, res, next) => {
  const fullPath = req.path;
  const inner = fullPath.replace('/used-', '').replace('-tampa', '');

  // Body style pages: /used-sedans-tampa -> inner = "sedans"
  if (bodyStyleSlugs[inner]) {
    const bodyStyle = bodyStyleSlugs[inner];
    const cars = queries.getCarsByBodyStyle(bodyStyle);
    const stats = queries.getBodyStyleStats(bodyStyle);
    const content = seoContent.getBodyStyleContent(bodyStyle, stats, cars);
    const linkData = getInternalLinkData();

    return renderPage(res, 'seo-listing', {
      cars, stats, content, helpers, ...linkData,
      pageTitle: content.title,
      metaDescription: content.metaDescription,
      canonicalUrl: helpers.absoluteUrl(helpers.bodyStyleUrl(bodyStyle)),
      robots: cars.length === 0 ? 'noindex, follow' : 'index, follow',
      schema: helpers.buildSchemaScripts([
        helpers.buildItemListSchema(cars, content.h1, helpers.bodyStyleUrl(bodyStyle)),
        helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: `Used ${bodyStyle}s in Tampa` }]),
        helpers.buildFAQSchema(content.faqs)
      ]),
      crumbs: [{ name: 'Home', url: '/' }, { name: `Used ${content.benefits ? content.title.split('|')[0].trim().replace('Used ', '') : bodyStyle + 's'} in Tampa` }]
    });
  }

  // Price range pages: /used-cars-under-20000-tampa -> inner = "cars-under-20000"
  const priceMatch = inner.match(/^cars-under-(\d+)$/);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1]);
    const validPrices = [5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000, 35000, 40000];
    if (!validPrices.includes(maxPrice)) return next();

    const cars = queries.getCarsByPriceRange(maxPrice);
    const stats = queries.getPriceRangeStats(maxPrice);
    const content = seoContent.getPriceRangeContent(maxPrice, stats, cars);
    const linkData = getInternalLinkData();

    return renderPage(res, 'seo-listing', {
      cars, stats, content, helpers, ...linkData,
      pageTitle: content.title,
      metaDescription: content.metaDescription,
      canonicalUrl: helpers.absoluteUrl(helpers.priceRangeUrl(maxPrice)),
      robots: cars.length === 0 ? 'noindex, follow' : 'index, follow',
      schema: helpers.buildSchemaScripts([
        helpers.buildItemListSchema(cars, content.h1, helpers.priceRangeUrl(maxPrice)),
        helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: `Under $${maxPrice.toLocaleString()}` }]),
        helpers.buildFAQSchema(content.faqs)
      ]),
      crumbs: [{ name: 'Home', url: '/' }, { name: `Used Cars Under $${maxPrice.toLocaleString()} in Tampa` }]
    });
  }

  // Make pages and Make+Model pages
  // Build a slug map from DB makes + predefined makes (from seo-content)
  const allMakes = queries.getDistinctMakes();
  const makeSlugMap = {};
  allMakes.forEach(m => { makeSlugMap[helpers.slugify(m.make)] = m.make; });
  // Add predefined makes (from modelData) so pages work even without inventory
  const predefinedModels = seoContent.getAllPredefinedMakeModels();
  predefinedModels.forEach(m => {
    const slug = helpers.slugify(m.make);
    if (!makeSlugMap[slug]) makeSlugMap[slug] = m.make;
  });
  // Also add all makes from makeData keys
  const knownMakes = Object.keys(seoContent.modelData).reduce((acc, key) => {
    const make = key.split(' ')[0];
    if (!acc.includes(make)) acc.push(make);
    return acc;
  }, []);
  knownMakes.forEach(make => {
    const slug = helpers.slugify(make);
    if (!makeSlugMap[slug]) makeSlugMap[slug] = make;
  });

  // Check exact make match first
  if (makeSlugMap[inner]) {
    const make = makeSlugMap[inner];
    const cars = queries.getCarsByMake(make);
    const stats = queries.getMakeStats(make);
    const content = seoContent.getMakeContent(make, stats, cars);
    const linkData = getInternalLinkData();

    return renderPage(res, 'seo-listing', {
      cars, stats, content, helpers, ...linkData,
      pageTitle: content.title,
      metaDescription: content.metaDescription,
      canonicalUrl: helpers.absoluteUrl(helpers.makeUrl(make)),
      robots: cars.length === 0 ? 'noindex, follow' : 'index, follow',
      schema: helpers.buildSchemaScripts([
        helpers.buildAutoDealerSchema(),
        helpers.buildItemListSchema(cars, content.h1, helpers.makeUrl(make)),
        helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: `Used ${make} in Tampa` }]),
        helpers.buildFAQSchema(content.faqs)
      ]),
      crumbs: [{ name: 'Home', url: '/' }, { name: `Used ${make} in Tampa` }]
    });
  }

  // Make+Model: try each known make as prefix
  for (const [makeSlug, makeName] of Object.entries(makeSlugMap)) {
    if (inner.startsWith(makeSlug + '-')) {
      const modelSlug = inner.slice(makeSlug.length + 1);
      // Find matching model from DB first, then check predefined
      const allModels = queries.getDistinctModels();
      let modelMatch = allModels.find(m =>
        helpers.slugify(m.make) === makeSlug && helpers.slugify(m.model) === modelSlug
      );
      // Fallback to predefined models if not in DB
      if (!modelMatch) {
        const predefined = predefinedModels.find(m =>
          helpers.slugify(m.make) === makeSlug && helpers.slugify(m.model) === modelSlug
        );
        if (predefined) modelMatch = predefined;
      }
      if (modelMatch) {
        const cars = queries.getCarsByMakeModel(modelMatch.make, modelMatch.model);
        const stats = queries.getMakeStats(modelMatch.make);
        const content = seoContent.getMakeModelContent(modelMatch.make, modelMatch.model, stats, cars);
        const linkData = getInternalLinkData();

        return renderPage(res, 'seo-listing', {
          cars, stats, content, helpers, ...linkData,
          pageTitle: content.title,
          metaDescription: content.metaDescription,
          canonicalUrl: helpers.absoluteUrl(helpers.makeModelUrl(modelMatch.make, modelMatch.model)),
          robots: cars.length === 0 ? 'noindex, follow' : 'index, follow',
          schema: helpers.buildSchemaScripts([
            helpers.buildItemListSchema(cars, content.h1, helpers.makeModelUrl(modelMatch.make, modelMatch.model)),
            helpers.buildBreadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: `Used ${modelMatch.make}`, url: helpers.makeUrl(modelMatch.make) },
              { name: `${modelMatch.make} ${modelMatch.model}` }
            ]),
            helpers.buildFAQSchema(content.faqs)
          ]),
          crumbs: [
            { name: 'Home', url: '/' },
            { name: `Used ${modelMatch.make}`, url: helpers.makeUrl(modelMatch.make) },
            { name: `${modelMatch.make} ${modelMatch.model} in Tampa` }
          ]
        });
      }
    }
  }

  next();
});

// --- Car detail pages: /car/:slug ---
app.get('/car/:slug', (req, res, next) => {
  const slug = req.params.slug;

  // Legacy numeric URL — 301 redirect to SEO-friendly URL
  if (/^\d+$/.test(slug)) {
    const car = queries.getCarById(parseInt(slug));
    if (!car) return next();
    return res.redirect(301, helpers.carUrl(car));
  }

  // Extract numeric ID from end of slug
  const match = slug.match(/-(\d+)$/);
  if (!match) return next();
  const carId = parseInt(match[1]);

  const car = queries.getCarById(carId);
  if (!car) return next();

  // Canonical slug enforcement
  const correctSlug = helpers.carSlug(car);
  if (slug !== correctSlug) {
    return res.redirect(301, `/car/${correctSlug}`);
  }

  const similarCars = queries.getAllCars().filter(c =>
    c.id !== car.id && (c.make === car.make || c.body_style === car.body_style)
  ).slice(0, 4);

  renderPage(res, 'car-detail', {
    car, similarCars, helpers,
    pageTitle: `${car.year} ${car.make} ${car.model} for Sale | Warehouse Cars Tampa`,
    metaDescription: `${car.year} ${car.make} ${car.model} for sale at Warehouse Cars Tampa in Tampa, FL. ${car.mileage ? car.mileage.toLocaleString() + ' miles.' : ''} $${car.price.toLocaleString()}.`,
    canonicalUrl: helpers.absoluteUrl(helpers.carUrl(car)),
    ogType: 'product',
    ogImage: car.image ? helpers.absoluteUrl(car.image) : undefined,
    schema: helpers.buildSchemaScripts([
      helpers.buildVehicleSchema(car),
      helpers.buildBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: `Used ${car.make}`, url: helpers.makeUrl(car.make) },
        { name: `${car.year} ${car.make} ${car.model}` }
      ])
    ]),
    crumbs: [
      { name: 'Home', url: '/' },
      { name: `Used ${car.make}`, url: helpers.makeUrl(car.make) },
      { name: `${car.year} ${car.make} ${car.model}` }
    ]
  });
});

// --- Contact page ---
app.get('/contact', (req, res) => {
  renderPage(res, 'contact', {
    helpers,
    pageTitle: 'Contact Us | Warehouse Cars Tampa',
    metaDescription: 'Contact Warehouse Cars Tampa about our quality used cars. Schedule a test drive, ask about financing, or request more info.',
    canonicalUrl: helpers.absoluteUrl('/contact'),
    schema: helpers.buildSchemaScripts([
      helpers.buildAutoDealerSchema(),
      helpers.buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact Us' }])
    ]),
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Contact Us' }]
  });
});

// --- Homepage and inventory ---
app.get('/inventory', (req, res) => renderHomepage(res));
app.get('/', (req, res) => renderHomepage(res));

function renderHomepage(res) {
  const cars = queries.getAllCars();
  const makes = queries.getDistinctMakes();
  const bodyStyles = queries.getDistinctBodyStyles();
  const stats = queries.getInventoryStats();

  renderPage(res, 'home', {
    cars, makes, bodyStyles, stats, helpers,
    pageTitle: 'Warehouse Cars Tampa | Quality Used Cars in Tampa, FL',
    metaDescription: `Warehouse Cars Tampa offers ${stats.total_count} quality used Toyotas, Hondas, Nissans, Chevys and more at affordable prices in Tampa, Florida. Browse our inventory today!`,
    canonicalUrl: helpers.absoluteUrl('/'),
    schema: helpers.buildSchemaScripts([
      helpers.buildAutoDealerSchema(),
      helpers.buildItemListSchema(cars.filter(c => c.featured).slice(0, 8), 'Featured Vehicles at Warehouse Cars Tampa', '/')
    ]),
    crumbs: []
  });
}

// ============ 404 HANDLER ============

app.use((req, res) => {
  res.status(404);
  renderPage(res, '404', {
    helpers,
    pageTitle: 'Page Not Found | Warehouse Cars Tampa',
    metaDescription: 'The page you are looking for could not be found. Browse our inventory of quality used cars in Tampa, FL.',
    canonicalUrl: helpers.absoluteUrl('/'),
    robots: 'noindex, follow',
    schema: ''
  });
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`Warehouse Cars Tampa running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
