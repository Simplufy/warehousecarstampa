const BASE_URL = 'https://floridaautohaus.com';

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function carSlug(car) {
  return `${car.year}-${slugify(car.make)}-${slugify(car.model)}-${car.id}`;
}

function carUrl(car) {
  return `/car/${carSlug(car)}`;
}

function makeUrl(make) {
  return `/used-${slugify(make)}-tampa`;
}

function makeModelUrl(make, model) {
  return `/used-${slugify(make)}-${slugify(model)}-tampa`;
}

function bodyStyleUrl(bodyStyle) {
  const plurals = {
    sedan: 'sedans', suv: 'suvs', truck: 'trucks', coupe: 'coupes',
    hatchback: 'hatchbacks', van: 'vans', convertible: 'convertibles', wagon: 'wagons'
  };
  const slug = slugify(bodyStyle);
  return `/used-${plurals[slug] || slug}-tampa`;
}

function priceRangeUrl(maxPrice) {
  return `/used-cars-under-${maxPrice}-tampa`;
}

function yearUrl(year) {
  return `/${year}-used-cars-tampa`;
}

function areaUrl(areaSlug) {
  return `/used-cars-near-${areaSlug}-fl`;
}

function guideUrl(slug) {
  return `/guides/${slug}`;
}

function compareUrl(slug) {
  return `/compare/${slug}`;
}

function absoluteUrl(path) {
  return `${BASE_URL}${path}`;
}

// Schema builders
function buildAutoDealerSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Florida Autohaus',
    description: 'Quality used cars at affordable prices in Tampa, FL',
    url: BASE_URL,
    telephone: '',
    email: 'info@floridaautohaus.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tampa',
      addressRegion: 'FL',
      addressCountry: 'US'
    },
    priceRange: '$$',
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '17:00' }
    ],
    areaServed: { '@type': 'City', name: 'Tampa' }
  };
}

function buildVehicleSchema(car) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.year} ${car.make} ${car.model}`,
    brand: { '@type': 'Brand', name: car.make },
    model: car.model,
    vehicleModelDate: String(car.year),
    color: car.color || undefined,
    vehicleTransmission: car.transmission || undefined,
    fuelType: car.fuel_type || undefined,
    driveWheelConfiguration: car.drivetrain || undefined,
    bodyType: car.body_style || undefined,
    url: absoluteUrl(carUrl(car)),
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: 'Florida Autohaus'
      }
    }
  };
  if (car.mileage) {
    schema.mileageFromOdometer = {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'SMI'
    };
  }
  if (car.engine) {
    schema.vehicleEngine = { '@type': 'EngineSpecification', name: car.engine };
  }
  if (car.vin) {
    schema.vehicleIdentificationNumber = car.vin;
  }
  if (car.image) {
    schema.image = absoluteUrl(car.image);
  }
  if (car.description) {
    schema.description = car.description;
  }
  return schema;
}

function buildItemListSchema(cars, listName, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: absoluteUrl(url),
    numberOfItems: cars.length,
    itemListElement: cars.map((car, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(carUrl(car))
    }))
  };
}

function buildBreadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url ? absoluteUrl(crumb.url) : undefined
    }))
  };
}

function buildFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };
}

function buildArticleSchema(title, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: absoluteUrl(url),
    publisher: {
      '@type': 'AutoDealer',
      name: 'Florida Autohaus'
    }
  };
}

function buildSchemaScripts(schemas) {
  return schemas
    .filter(Boolean)
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n  ');
}

function fmtPrice(price) {
  return Number(price).toLocaleString('en-US');
}

module.exports = {
  slugify, carSlug, carUrl, makeUrl, makeModelUrl, bodyStyleUrl,
  priceRangeUrl, yearUrl, areaUrl, guideUrl, compareUrl,
  absoluteUrl, BASE_URL, fmtPrice,
  buildAutoDealerSchema, buildVehicleSchema, buildItemListSchema,
  buildBreadcrumbSchema, buildFAQSchema, buildArticleSchema, buildSchemaScripts
};
