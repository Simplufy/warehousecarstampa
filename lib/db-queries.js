module.exports = function (db) {
  function attachImages(car) {
    if (!car) return car;
    const images = db.prepare('SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order').all(car.id);
    car.images = images.map(i => i.image_path);
    return car;
  }

  function getAllCars() {
    const cars = db.prepare('SELECT * FROM cars ORDER BY featured DESC, created_at DESC').all();
    cars.forEach(attachImages);
    return cars;
  }

  function getCarById(id) {
    const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(id);
    if (car) attachImages(car);
    return car;
  }

  function getDistinctMakes() {
    return db.prepare('SELECT DISTINCT make FROM cars ORDER BY make').all();
  }

  function getDistinctModels() {
    return db.prepare('SELECT DISTINCT make, model FROM cars ORDER BY make, model').all();
  }

  function getDistinctBodyStyles() {
    return db.prepare("SELECT DISTINCT body_style FROM cars WHERE body_style IS NOT NULL AND body_style != '' ORDER BY body_style").all();
  }

  function getDistinctYears() {
    return db.prepare('SELECT DISTINCT year FROM cars ORDER BY year DESC').all();
  }

  function getCarsByMake(make) {
    const cars = db.prepare('SELECT * FROM cars WHERE LOWER(make) = LOWER(?) ORDER BY featured DESC, created_at DESC').all(make);
    cars.forEach(attachImages);
    return cars;
  }

  function getCarsByMakeModel(make, model) {
    const cars = db.prepare('SELECT * FROM cars WHERE LOWER(make) = LOWER(?) AND LOWER(model) = LOWER(?) ORDER BY featured DESC, created_at DESC').all(make, model);
    cars.forEach(attachImages);
    return cars;
  }

  function getCarsByBodyStyle(bodyStyle) {
    const cars = db.prepare('SELECT * FROM cars WHERE LOWER(body_style) = LOWER(?) ORDER BY featured DESC, created_at DESC').all(bodyStyle);
    cars.forEach(attachImages);
    return cars;
  }

  function getCarsByPriceRange(maxPrice) {
    const cars = db.prepare('SELECT * FROM cars WHERE price <= ? ORDER BY price ASC').all(maxPrice);
    cars.forEach(attachImages);
    return cars;
  }

  function getCarsByYear(year) {
    const cars = db.prepare('SELECT * FROM cars WHERE year = ? ORDER BY featured DESC, created_at DESC').all(year);
    cars.forEach(attachImages);
    return cars;
  }

  function getInventoryStats() {
    return db.prepare(`
      SELECT
        COUNT(*) as total_count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        CAST(AVG(price) AS INTEGER) as avg_price,
        MIN(year) as min_year,
        MAX(year) as max_year,
        MIN(mileage) as min_mileage,
        MAX(mileage) as max_mileage
      FROM cars
    `).get();
  }

  function getMakeStats(make) {
    return db.prepare(`
      SELECT
        COUNT(*) as count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        CAST(AVG(price) AS INTEGER) as avg_price,
        GROUP_CONCAT(DISTINCT body_style) as body_styles,
        GROUP_CONCAT(DISTINCT year) as years
      FROM cars WHERE LOWER(make) = LOWER(?)
    `).get(make);
  }

  function getBodyStyleStats(bodyStyle) {
    return db.prepare(`
      SELECT
        COUNT(*) as count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        CAST(AVG(price) AS INTEGER) as avg_price,
        GROUP_CONCAT(DISTINCT make) as makes,
        GROUP_CONCAT(DISTINCT year) as years
      FROM cars WHERE LOWER(body_style) = LOWER(?)
    `).get(bodyStyle);
  }

  function getPriceRangeStats(maxPrice) {
    return db.prepare(`
      SELECT
        COUNT(*) as count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        GROUP_CONCAT(DISTINCT make) as makes,
        GROUP_CONCAT(DISTINCT body_style) as body_styles
      FROM cars WHERE price <= ?
    `).get(maxPrice);
  }

  function getYearStats(year) {
    return db.prepare(`
      SELECT
        COUNT(*) as count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        GROUP_CONCAT(DISTINCT make) as makes,
        GROUP_CONCAT(DISTINCT body_style) as body_styles
      FROM cars WHERE year = ?
    `).get(year);
  }

  return {
    attachImages, getAllCars, getCarById,
    getDistinctMakes, getDistinctModels, getDistinctBodyStyles, getDistinctYears,
    getCarsByMake, getCarsByMakeModel, getCarsByBodyStyle, getCarsByPriceRange, getCarsByYear,
    getInventoryStats, getMakeStats, getBodyStyleStats, getPriceRangeStats, getYearStats
  };
};
