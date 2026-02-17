const { fmtPrice } = require('./seo-helpers');

const makeData = {
  Toyota: {
    tagline: 'the most reliable brand on the road',
    reliability: 'legendary reliability and industry-leading resale value',
    highlights: ['Highest resale value in the industry', 'Toyota Safety Sense standard on most models', 'Engines known to exceed 200,000+ miles'],
    buyingTip: 'Toyota vehicles are famous for going the distance. Many owners report driving well past 200,000 miles with just routine oil changes and basic maintenance. When buying used, look for complete service records — a well-maintained Toyota can easily last another 100,000 miles.'
  },
  Honda: {
    tagline: 'precision-engineered and built to last',
    reliability: 'outstanding engineering, fuel efficiency, and long-term dependability',
    highlights: ['Honda Sensing safety suite across the lineup', 'Excellent fuel economy on every model', 'Low cost of ownership year after year'],
    buyingTip: 'Honda engines are some of the most efficient and durable on the market. The Civic and Accord consistently rank as top picks for used car buyers. Check that the timing belt (on older models) has been serviced — Hondas with regular maintenance are virtually bulletproof.'
  },
  Nissan: {
    tagline: 'innovative technology at an affordable price',
    reliability: 'strong value, modern features, and competitive pricing',
    highlights: ['Nissan Safety Shield 360 technology', 'Comfortable ride quality', 'Affordable pricing across the lineup'],
    buyingTip: 'Nissan offers some of the best value in the used car market. Models like the Altima and Rogue deliver modern features at prices below comparable Toyota or Honda models. When shopping used Nissan, check the CVT transmission service history for peace of mind.'
  },
  Chevrolet: {
    tagline: 'American-built versatility for every lifestyle',
    reliability: 'wide model range from efficient sedans to powerful trucks and SUVs',
    highlights: ['Chevy Safety Assist on newer models', 'Strong V6 and V8 engine options', 'Spacious interiors across the lineup'],
    buyingTip: 'Chevrolet offers incredible variety — from the fuel-efficient Malibu to the rugged Equinox. Used Chevys are often priced lower than Japanese competitors with similar features, making them a smart value pick. Look for models with the updated infotainment system for the best tech experience.'
  },
  Hyundai: {
    tagline: 'award-winning quality with the best warranty in the business',
    reliability: 'rapid quality improvements, modern design, and outstanding warranty coverage',
    highlights: ['Industry-leading 10-year/100,000-mile powertrain warranty', 'Modern design inside and out', 'Feature-packed at every trim level'],
    buyingTip: 'Hyundai has transformed from a budget brand into a quality leader. Their 10-year powertrain warranty often transfers to second owners, giving you extra peace of mind. Models from 2018 and newer represent a significant quality leap.'
  },
  Kia: {
    tagline: 'stylish, feature-rich, and surprisingly affordable',
    reliability: 'exceptional value with premium features at non-premium prices',
    highlights: ['10-year/100,000-mile powertrain warranty', 'Award-winning interior design', 'Strong safety ratings across the lineup'],
    buyingTip: 'Kia has earned numerous quality awards in recent years and offers some of the most feature-rich vehicles at their price points. Like Hyundai, the 10-year powertrain warranty is a major plus for used buyers. The Forte is one of the best compact car values on the market.'
  },
  Ford: {
    tagline: 'iconic American performance and capability',
    reliability: 'proven durability, especially in trucks and SUVs',
    highlights: ['Ford Co-Pilot360 safety technology', 'EcoBoost engines deliver power with efficiency', 'Strong towing and hauling capability'],
    buyingTip: 'Ford is a powerhouse in the SUV and truck segments. The Escape is a perennial bestseller for good reason — it offers a great balance of space, efficiency, and capability. Ford EcoBoost engines provide surprisingly good fuel economy without sacrificing power.'
  }
};

const defaultMake = {
  tagline: 'quality and value you can count on',
  reliability: 'solid build quality and dependable performance',
  highlights: ['Inspected and road-ready', 'Competitive pricing', 'Quality you can trust'],
  buyingTip: 'When shopping for a quality used vehicle, always check the service history, take a thorough test drive, and have the vehicle inspected by a trusted mechanic. At Warehouse Cars Tampa, every vehicle on our lot has been inspected to meet our quality standards.'
};

function getMakeContent(make, stats, cars) {
  const data = makeData[make] || defaultMake;
  const count = stats.count || 0;
  const bodyStyles = stats.body_styles ? stats.body_styles.split(',').filter(Boolean) : [];
  const years = stats.years ? stats.years.split(',').sort().filter(Boolean) : [];

  const introText = `<p>Looking for a used ${make} in Tampa, FL? Warehouse Cars Tampa currently has <strong>${count} pre-owned ${make} vehicle${count !== 1 ? 's' : ''}</strong>${count > 0 ? ` starting at just <strong>$${fmtPrice(stats.min_price)}</strong>` : ''}. ${make} is known for ${data.reliability}, making it one of the smartest choices in the used car market.</p>
<p>At Warehouse Cars Tampa, every ${make} on our lot has been thoroughly inspected for quality and reliability. We believe in transparent pricing with no hidden fees — the price you see is the price you pay. Whether you're a first-time buyer or upgrading your current ride, our team is here to help you find the perfect ${make} without the pressure.</p>
<p>${data.buyingTip}</p>
${count > 0 && bodyStyles.length > 0 ? `<p>Our current ${make} inventory includes ${bodyStyles.join(', ').toLowerCase()} body styles${years.length > 1 ? ` from model years ${years[0]} through ${years[years.length - 1]}` : ''}. Browse below and contact us to schedule a test drive — we're conveniently located in Tampa, FL and serve drivers from Brandon, St. Petersburg, Wesley Chapel, Clearwater, and across the Tampa Bay area.</p>` : `<p>While our inventory changes frequently, we regularly stock ${make} vehicles. Contact us today and we'll help you find exactly what you're looking for — or notify you as soon as one arrives on our lot.</p>`}`;

  const faqs = [
    { q: `Why buy a used ${make} in Tampa?`, a: `${make} vehicles offer ${data.reliability}. Buying used saves you thousands compared to new, and Tampa's large used car market means great selection. At Warehouse Cars Tampa, we hand-pick quality ${make} vehicles so you can buy with confidence.` },
    { q: `How much does a used ${make} cost at Warehouse Cars Tampa?`, a: count > 0 ? `Our used ${make} inventory currently ranges from $${fmtPrice(stats.min_price)} to $${fmtPrice(stats.max_price)}, with an average price of $${fmtPrice(stats.avg_price)}. We offer competitive pricing and financing options to fit your budget.` : `Pricing varies by model, year, and condition. Contact us for current ${make} availability and pricing. We offer competitive prices and flexible financing options.` },
    { q: `Do you offer financing on used ${make} vehicles?`, a: `Yes! We work with multiple lenders to find financing options that work for your budget, including options for first-time buyers and those rebuilding credit. Visit our financing page or contact us to get pre-approved.` },
    { q: `Can I schedule a test drive for a ${make}?`, a: `Absolutely! You can schedule a test drive by calling us, sending us a message through our contact page, or simply stopping by our Tampa lot during business hours. We're open Monday through Saturday.` }
  ];

  return {
    title: `Used ${make} for Sale in Tampa FL | Warehouse Cars Tampa`,
    metaDescription: count > 0 ? `Browse ${count} used ${make} vehicle${count !== 1 ? 's' : ''} for sale at Warehouse Cars Tampa. Starting at $${fmtPrice(stats.min_price)}. ${data.tagline.charAt(0).toUpperCase() + data.tagline.slice(1)}.` : `Shop used ${make} vehicles at Warehouse Cars Tampa in Tampa, FL. ${data.tagline.charAt(0).toUpperCase() + data.tagline.slice(1)}. Quality pre-owned cars at fair prices.`,
    h1: `Used ${make} Vehicles for Sale in Tampa, FL`,
    introText,
    highlights: data.highlights,
    faqs
  };
}

function getMakeModelContent(make, model, stats, cars) {
  const data = makeData[make] || defaultMake;
  const count = cars.length;
  const priceMin = count > 0 ? Math.min(...cars.map(c => c.price)) : 0;
  const priceMax = count > 0 ? Math.max(...cars.map(c => c.price)) : 0;

  const introText = `<p>Find the perfect used ${make} ${model} right here at Warehouse Cars Tampa in Tampa, FL. ${count > 0 ? `We currently have <strong>${count} ${make} ${model}${count !== 1 ? 's' : ''}</strong> in stock${count > 0 ? `, priced from <strong>$${fmtPrice(priceMin)}</strong>${priceMax !== priceMin ? ` to <strong>$${fmtPrice(priceMax)}</strong>` : ''}` : ''}.` : `While we don't currently have a ${make} ${model} in stock, our inventory changes frequently.`}</p>
<p>The ${make} ${model} is a popular choice among Tampa drivers for its combination of ${data.reliability}. Whether you're commuting across the Howard Frankland Bridge or running errands around South Tampa, the ${model} delivers the comfort and efficiency you need for daily driving in the Tampa Bay area.</p>
<p>${data.buyingTip}</p>
<p>Every vehicle at Warehouse Cars Tampa goes through our quality inspection process before it reaches our lot. We stand behind what we sell and offer transparent, no-haggle pricing. Stop by our Tampa location or contact us to schedule a test drive today.</p>`;

  const faqs = [
    { q: `How much is a used ${make} ${model} in Tampa?`, a: count > 0 ? `At Warehouse Cars Tampa, our used ${make} ${model} inventory is priced from $${fmtPrice(priceMin)} to $${fmtPrice(priceMax)}. Pricing depends on year, mileage, and condition.` : `Pricing varies by year, mileage, and condition. Contact us for current availability and pricing on the ${make} ${model}.` },
    { q: `Is the ${make} ${model} a reliable car?`, a: `Yes — ${make} is known for ${data.reliability}. The ${model} in particular has a strong track record for dependability, making it an excellent choice for used car buyers looking for a vehicle they can count on for years to come.` },
    { q: `Can I test drive a ${make} ${model} at Warehouse Cars Tampa?`, a: `Of course! Just give us a call or use our contact form to schedule a test drive. Walk-ins are also welcome during business hours, Monday through Saturday.` }
  ];

  return {
    title: `Used ${make} ${model} for Sale in Tampa FL | Warehouse Cars Tampa`,
    metaDescription: count > 0 ? `${count} used ${make} ${model}${count !== 1 ? 's' : ''} for sale at Warehouse Cars Tampa starting at $${fmtPrice(priceMin)}. Quality pre-owned vehicles in Tampa, FL.` : `Shop used ${make} ${model} vehicles at Warehouse Cars Tampa in Tampa, FL. Quality inspected, fair pricing, financing available.`,
    h1: `Used ${make} ${model} for Sale in Tampa, FL`,
    introText,
    faqs
  };
}

const bodyStyleData = {
  Sedan: {
    plural: 'Sedans',
    description: 'the perfect blend of comfort, fuel efficiency, and everyday practicality',
    benefits: ['Better fuel economy than SUVs and trucks', 'Lower insurance rates on average', 'Easy to park and maneuver in city traffic', 'Comfortable ride for daily Tampa commutes'],
    audience: 'commuters, small families, and anyone looking for an efficient, comfortable daily driver',
    tip: 'Sedans are the sweet spot of the used car market — you get modern safety features, great gas mileage, and a comfortable ride at a lower price point than SUVs. In Tampa, where you might spend time on I-275 or the Selmon Expressway, a fuel-efficient sedan can save you hundreds per year at the pump.'
  },
  SUV: {
    plural: 'SUVs',
    description: 'versatile, spacious, and ready for anything Tampa throws your way',
    benefits: ['Spacious cargo area for family trips and beach days', 'Higher driving position for better road visibility', 'Available AWD for Florida storm season', 'Room for the whole family plus gear'],
    audience: 'families, outdoor enthusiasts, and anyone who needs space and versatility',
    tip: 'SUVs are the most popular vehicle type in Florida, and for good reason. The extra cargo space is perfect for beach trips, the higher ride height helps with visibility in Tampa traffic, and many models offer impressive fuel economy despite their size.'
  },
  Truck: {
    plural: 'Trucks',
    description: 'built for work, adventure, and everything in between',
    benefits: ['Powerful towing and hauling capability', 'Rugged durability for work and play', 'Open bed for hauling gear, furniture, and more', 'Strong resale value'],
    audience: 'contractors, outdoor enthusiasts, and anyone who needs serious capability',
    tip: 'Used trucks hold their value incredibly well, which means a quality used truck is a smart investment. Look for models with the towing package if you plan to pull a boat — Tampa Bay living practically demands it.'
  }
};

const defaultBodyStyle = {
  plural: 'Vehicles',
  description: 'quality and versatility for Tampa drivers',
  benefits: ['Inspected for quality', 'Competitively priced', 'Financing available'],
  audience: 'drivers looking for a quality used vehicle',
  tip: 'No matter what body style you prefer, Warehouse Cars Tampa has options to fit your lifestyle and budget.'
};

function getBodyStyleContent(bodyStyle, stats, cars) {
  const data = bodyStyleData[bodyStyle] || defaultBodyStyle;
  const count = stats.count || 0;
  const makes = stats.makes ? stats.makes.split(',').filter(Boolean) : [];

  const introText = `<p>Shopping for a used ${bodyStyle.toLowerCase()} in Tampa, FL? You're in the right place. Warehouse Cars Tampa has <strong>${count} pre-owned ${data.plural.toLowerCase()}</strong>${count > 0 ? ` starting at just <strong>$${fmtPrice(stats.min_price)}</strong>` : ''}, offering ${data.description}.</p>
<p>Used ${data.plural.toLowerCase()} are ideal for ${data.audience}. ${data.tip}</p>
${makes.length > 0 ? `<p>Our current ${bodyStyle.toLowerCase()} selection includes popular makes like <strong>${makes.join(', ')}</strong>. Each vehicle has been inspected for quality and is priced competitively with no hidden fees. Browse our inventory below, and contact us to schedule a test drive at our Tampa location.</p>` : `<p>Our inventory changes regularly — contact us today to find out what ${data.plural.toLowerCase()} we have available or to be notified when new ones arrive.</p>`}`;

  const faqs = [
    { q: `What are the best used ${data.plural.toLowerCase()} to buy in Tampa?`, a: `It depends on your needs and budget. ${makes.length > 0 ? `Popular choices in our inventory include ${makes.join(', ')} ${data.plural.toLowerCase()}.` : ''} At Warehouse Cars Tampa, we can help you find the perfect ${bodyStyle.toLowerCase()} for your lifestyle and budget.` },
    { q: `How much do used ${data.plural.toLowerCase()} cost at Warehouse Cars Tampa?`, a: count > 0 ? `Our used ${data.plural.toLowerCase()} range from $${fmtPrice(stats.min_price)} to $${fmtPrice(stats.max_price)}. We offer transparent pricing and financing options.` : `Pricing varies by make, model, year, and condition. Contact us for current availability.` },
    { q: `Do you offer financing on used ${data.plural.toLowerCase()}?`, a: `Yes! We work with multiple lenders to offer competitive financing on all our vehicles, including options for buyers with all credit types.` }
  ];

  return {
    title: `Used ${data.plural} for Sale in Tampa FL | Warehouse Cars Tampa`,
    metaDescription: count > 0 ? `Browse ${count} used ${data.plural.toLowerCase()} for sale at Warehouse Cars Tampa starting at $${fmtPrice(stats.min_price)}. ${data.description.charAt(0).toUpperCase() + data.description.slice(1)}.` : `Shop used ${data.plural.toLowerCase()} at Warehouse Cars Tampa. ${data.description.charAt(0).toUpperCase() + data.description.slice(1)}.`,
    h1: `Used ${data.plural} for Sale in Tampa, FL`,
    introText,
    benefits: data.benefits,
    faqs
  };
}

function getPriceRangeContent(maxPrice, stats, cars) {
  const count = stats.count || 0;
  const fmtMax = fmtPrice(maxPrice);
  const makes = stats.makes ? stats.makes.split(',').filter(Boolean) : [];
  const bodyStyles = stats.body_styles ? stats.body_styles.split(',').filter(Boolean) : [];

  const tips = {
    10000: 'In the under-$10,000 range, focus on reliability over flash. Japanese brands like Toyota and Honda are excellent picks at this price point. Always get a pre-purchase inspection, and look for vehicles with lower mileage relative to their age.',
    15000: 'The under-$15,000 sweet spot gives you access to newer models with modern safety features. At this price, you can find well-maintained vehicles from 2017-2020 with reasonable mileage. This is where the best value in the used car market lives.',
    20000: 'With a $20,000 budget, you have access to a wide range of quality vehicles including newer models, loaded trim levels, and even some compact SUVs. Look for vehicles with remaining manufacturer warranty for extra peace of mind.',
    25000: 'Under $25,000 opens up nearly-new vehicles, higher trim levels, and popular SUVs. At this price point, you can find vehicles that are only 2-3 years old with low mileage and full warranty coverage remaining.',
    30000: 'A $30,000 budget gives you access to premium vehicles, loaded SUVs, and trucks. Many of these vehicles are barely broken in and come with remaining warranty. You can find vehicles that would cost $40,000+ new.'
  };

  const introText = `<p>Looking for quality used cars under $${fmtMax} in Tampa? Warehouse Cars Tampa has <strong>${count} affordable vehicle${count !== 1 ? 's' : ''}</strong> priced under $${fmtMax}${count > 0 ? `, starting at just <strong>$${fmtPrice(stats.min_price)}</strong>` : ''}.</p>
<p>${tips[maxPrice] || `At this price point, you'll find a great selection of quality used vehicles. Every car on our lot has been inspected and priced fairly.`}</p>
${makes.length > 0 ? `<p>In this price range, we currently have vehicles from <strong>${makes.join(', ')}</strong>${bodyStyles.length > 0 ? ` including ${bodyStyles.join(', ').toLowerCase()} body styles` : ''}. Every vehicle has been inspected and comes with transparent, no-haggle pricing.</p>` : ''}
<p>At Warehouse Cars Tampa, we specialize in helping Tampa drivers find reliable transportation that fits their budget. We offer financing options including programs for first-time buyers and those rebuilding credit. Browse our selection below or contact us to find the perfect vehicle under $${fmtMax}.</p>`;

  const faqs = [
    { q: `What are the best used cars under $${fmtMax} in Tampa?`, a: `The best used car under $${fmtMax} depends on your needs. ${makes.length > 0 ? `We currently have ${makes.join(', ')} vehicles in this range.` : ''} Our team can help you find the most reliable option that fits your lifestyle and budget.` },
    { q: `Can I get financing on a car under $${fmtMax}?`, a: `Yes! We offer financing on all our vehicles regardless of price. We work with multiple lenders and have options for all credit situations, including first-time buyers.` },
    { q: `Are cheap used cars reliable?`, a: `Absolutely — price doesn't always equal quality. Many used cars under $${fmtMax} have years of reliable service left in them, especially well-maintained Toyota, Honda, and Hyundai models. At Warehouse Cars Tampa, every vehicle passes our inspection before it hits the lot.` }
  ];

  return {
    title: `Used Cars Under $${fmtMax} in Tampa FL | Warehouse Cars Tampa`,
    metaDescription: count > 0 ? `${count} quality used cars under $${fmtMax} in Tampa, FL. Starting at $${fmtPrice(stats.min_price)}. Financing available at Warehouse Cars Tampa.` : `Shop affordable used cars under $${fmtMax} at Warehouse Cars Tampa in Tampa, FL. Quality vehicles, transparent pricing, financing available.`,
    h1: `Used Cars Under $${fmtMax} in Tampa, FL`,
    introText,
    faqs
  };
}

function getYearContent(year, stats, cars) {
  const count = stats.count || 0;
  const makes = stats.makes ? stats.makes.split(',').filter(Boolean) : [];

  const introText = `<p>Browse <strong>${count} used ${year} vehicle${count !== 1 ? 's' : ''}</strong> for sale at Warehouse Cars Tampa in Tampa, FL${count > 0 ? `. Prices start at <strong>$${fmtPrice(stats.min_price)}</strong>` : ''}.</p>
<p>${year} model year vehicles offer a strong balance of modern features, safety technology, and value. Compared to buying new, a ${year} model saves you from the steepest years of depreciation while still getting recent technology, safety features, and a vehicle with plenty of life ahead.</p>
${makes.length > 0 ? `<p>Our ${year} inventory includes models from <strong>${makes.join(', ')}</strong>. Each vehicle has been inspected for quality and is priced to offer outstanding value.</p>` : `<p>Our inventory changes regularly. Contact us to find out what ${year} models we currently have available.</p>`}
<p>Whether you're looking for a fuel-efficient sedan for your Tampa commute or a spacious SUV for family adventures, Warehouse Cars Tampa has ${year} options to fit your needs. Contact us to schedule a test drive today.</p>`;

  const faqs = [
    { q: `Are ${year} model year cars a good buy?`, a: `${year} vehicles are an excellent value. They offer modern safety features and technology while being past the steepest depreciation curve. You get a lot of car for your money with a ${year} model.` },
    { q: `How much do ${year} used cars cost at Warehouse Cars Tampa?`, a: count > 0 ? `Our ${year} models range from $${fmtPrice(stats.min_price)} to $${fmtPrice(stats.max_price)}. Final pricing depends on make, model, mileage, and condition.` : `Pricing varies by make, model, and condition. Contact us for current ${year} model availability and pricing.` },
    { q: `Do you offer warranties on ${year} vehicles?`, a: `Many ${year} vehicles may still have remaining manufacturer warranty coverage. Additionally, we can discuss extended warranty options at the time of purchase. Every vehicle we sell passes our quality inspection.` }
  ];

  return {
    title: `${year} Used Cars for Sale in Tampa FL | Warehouse Cars Tampa`,
    metaDescription: count > 0 ? `${count} used ${year} vehicles for sale in Tampa, FL starting at $${fmtPrice(stats.min_price)}. Quality inspected cars at Warehouse Cars Tampa.` : `Shop ${year} used cars at Warehouse Cars Tampa in Tampa, FL. Quality inspected vehicles with transparent pricing.`,
    h1: `${year} Used Cars for Sale in Tampa, FL`,
    introText,
    faqs
  };
}

module.exports = { getMakeContent, getMakeModelContent, getBodyStyleContent, getPriceRangeContent, getYearContent };
