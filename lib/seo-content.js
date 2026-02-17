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
  },
  Volkswagen: {
    tagline: 'German engineering meets everyday practicality in Tampa',
    reliability: 'refined European driving dynamics, solid build quality, and upscale interiors',
    highlights: ['Turbocharged engines standard across the lineup', 'Premium interior materials and build quality', 'German-engineered handling and ride comfort'],
    buyingTip: 'Volkswagen offers a European driving experience at mainstream prices. The Jetta and Tiguan are standout values in the used market, delivering a refined feel that rivals luxury brands. Look for models with the 1.4T or 2.0T engines — they offer a great balance of power and fuel economy. Stick to models from 2018 and newer for the best reliability track record.'
  },
  Subaru: {
    tagline: 'adventure-ready with standard all-wheel drive',
    reliability: 'standard AWD capability, rugged dependability, and loyal owner satisfaction',
    highlights: ['Standard all-wheel drive on every model', 'EyeSight driver assist technology', 'Exceptional safety ratings across the lineup'],
    buyingTip: 'Subaru is the only mainstream brand with standard all-wheel drive on virtually every model. While Tampa may not get snow, AWD provides confident handling in Florida downpours and storms. The Outback and Forester hold their value incredibly well, so a well-priced used one is a smart find. Check for head gasket service history on older models.'
  },
  Mazda: {
    tagline: 'premium driving dynamics without the premium price tag',
    reliability: 'engaging driving experience, upscale interiors, and strong reliability ratings',
    highlights: ['Best-in-class driving dynamics', 'Upscale interior quality that rivals luxury brands', 'Consistently strong reliability and safety ratings'],
    buyingTip: 'Mazda punches well above its weight class. The CX-5 and Mazda3 offer interiors and driving experiences that compete with luxury brands at a fraction of the price. Mazda has quietly become one of the most reliable brands on the market — Consumer Reports consistently ranks them near the top. Used Mazdas are one of the best-kept secrets in the market.'
  },
  Jeep: {
    tagline: 'legendary off-road capability and open-air freedom',
    reliability: 'iconic ruggedness, unmatched off-road capability, and adventurous spirit',
    highlights: ['Trail Rated 4x4 capability on select models', 'Iconic styling recognized worldwide', 'Open-air driving options perfect for Tampa sunshine'],
    buyingTip: 'Jeep has an incredibly loyal following, and models like the Wrangler hold their value better than almost any other vehicle. In Tampa, a Jeep is perfect for beach trips and enjoying the Florida sunshine with the top down. The Grand Cherokee offers a more refined ride for daily driving. When buying used, check the 4WD system and look for well-maintained examples.'
  },
  Dodge: {
    tagline: 'bold American muscle and family-friendly performance',
    reliability: 'powerful engine options, bold styling, and strong performance heritage',
    highlights: ['Legendary HEMI V8 engine options', 'Bold, head-turning design language', 'Performance-oriented at every price point'],
    buyingTip: 'Dodge is the brand for drivers who want excitement. The Charger and Challenger offer genuine muscle car thrills, while the Durango provides family SUV space with available V8 power. Used Dodge vehicles are often priced aggressively, making them a great performance-per-dollar value. Look for models with the 5.7L HEMI for the best balance of power and reliability.'
  },
  Ram: {
    tagline: 'the truck that works as hard as you do',
    reliability: 'class-leading interior comfort, smooth ride quality, and serious capability',
    highlights: ['Best-in-class interior for a full-size truck', 'Available coil-spring rear suspension for a smooth ride', 'Strong towing and payload ratings'],
    buyingTip: 'Ram trucks have surged in popularity thanks to their car-like ride quality and upscale interiors. The Ram 1500 with the coil-spring rear suspension rides smoother than any other full-size truck. In Tampa, a Ram is perfect for towing your boat or hauling gear. Used Rams offer tremendous value compared to new truck prices, which have skyrocketed in recent years.'
  },
  GMC: {
    tagline: 'professional-grade trucks and SUVs built for Tampa living',
    reliability: 'premium build quality, powerful drivetrains, and professional-grade refinement',
    highlights: ['Professional Grade engineering and materials', 'Denali trim offers near-luxury experience', 'Strong towing and hauling capability'],
    buyingTip: 'GMC is the premium counterpart to Chevrolet, offering upgraded materials and a more refined experience. The Sierra is a top pick for truck buyers who want something a step above, and the Terrain is an excellent compact SUV. Look for Denali trims on the used market — you get luxury-level features at a fraction of the original price.'
  },
  BMW: {
    tagline: 'the ultimate driving experience, now within reach',
    reliability: 'exhilarating driving dynamics, prestigious engineering, and luxury appointments',
    highlights: ['Legendary rear-wheel-drive handling dynamics', 'Turbocharged power across the lineup', 'Premium interior technology and materials'],
    buyingTip: 'A used BMW is one of the best ways to get into a luxury vehicle at an affordable price. BMWs depreciate significantly in the first few years, making 3-5 year old models incredible values. The 3 Series and X3 are the sweet spots — they offer the core BMW driving experience without the maintenance costs of larger models. Always check service history and look for CPO or well-maintained examples.'
  },
  Lexus: {
    tagline: 'Toyota reliability wrapped in luxury refinement',
    reliability: 'bulletproof Toyota-based reliability with luxury comfort, fit, and finish',
    highlights: ['Toyota-based powertrain reliability', 'Whisper-quiet cabin refinement', 'Exceptional long-term dependability and resale value'],
    buyingTip: 'Lexus is consistently rated the most reliable luxury brand, built on Toyota\'s legendary engineering. A used Lexus gives you genuine luxury — premium materials, a whisper-quiet cabin, and cutting-edge safety features — backed by dependability that puts other luxury brands to shame. The ES and RX are the most popular choices and are known to run for 200,000+ miles with proper care.'
  },
  Acura: {
    tagline: 'Honda engineering with a premium upgrade',
    reliability: 'Honda-based reliability with sportier performance and upscale refinement',
    highlights: ['Honda-derived powertrain dependability', 'Super Handling All-Wheel Drive available', 'Strong safety ratings and AcuraWatch technology'],
    buyingTip: 'Acura delivers a luxury experience built on Honda\'s rock-solid engineering. The TLX offers engaging driving dynamics, the RDX is one of the best compact luxury SUVs, and the MDX provides three-row luxury. Used Acuras are significantly less expensive than German luxury competitors while being far more reliable. They are one of the smartest buys in the used luxury market.'
  },
  Infiniti: {
    tagline: 'bold Japanese luxury with powerful performance',
    reliability: 'Nissan-based engineering with premium luxury features and strong V6 power',
    highlights: ['Powerful VQ-series V6 engines', 'Bold, distinctive styling', 'Feature-rich interiors at competitive prices'],
    buyingTip: 'Infiniti offers striking design and strong V6 performance at prices well below European luxury competitors. The Q50 is a sporty sedan with one of the best V6 engines in the business, while the QX60 provides family-friendly three-row luxury. Used Infiniti vehicles depreciate more than Lexus, which means buyers get an outstanding luxury experience for the money.'
  },
  Buick: {
    tagline: 'quiet luxury and comfort at a surprisingly accessible price',
    reliability: 'refined ride quality, whisper-quiet cabins, and premium comfort features',
    highlights: ['QuietTuning technology for a serene cabin', 'Premium features at mainstream prices', 'Strong safety ratings and driver assistance technology'],
    buyingTip: 'Buick has reinvented itself as an accessible luxury brand with vehicles that rival more expensive competitors in comfort and quietness. The Encore is a stylish compact SUV, and the Enclave offers three-row luxury. Used Buicks are one of the best-kept value secrets — you get near-luxury refinement at mainstream prices because many buyers overlook the brand.'
  }
};

const defaultMake = {
  tagline: 'quality and value you can count on',
  reliability: 'solid build quality and dependable performance',
  highlights: ['Inspected and road-ready', 'Competitive pricing', 'Quality you can trust'],
  buyingTip: 'When shopping for a quality used vehicle, always check the service history, take a thorough test drive, and have the vehicle inspected by a trusted mechanic. At Warehouse Cars Tampa, every vehicle on our lot has been inspected to meet our quality standards.'
};

const modelData = {
  // --- Toyota ---
  'Toyota Camry': { class: 'Midsize Sedan', strengths: 'legendary reliability, smooth ride, excellent resale value', mpg: '28-39 MPG', bestFor: 'families and commuters who want a comfortable, dependable daily driver' },
  'Toyota Corolla': { class: 'Compact Sedan', strengths: 'bulletproof reliability, outstanding fuel economy, lowest maintenance costs', mpg: '31-40 MPG', bestFor: 'first-time buyers and commuters who want maximum reliability at a great price' },
  'Toyota RAV4': { class: 'Compact SUV', strengths: 'versatile cargo space, available AWD, strong resale value, modern safety features', mpg: '27-35 MPG', bestFor: 'families and active lifestyles who need SUV practicality with car-like fuel economy' },
  'Toyota Highlander': { class: 'Midsize Three-Row SUV', strengths: 'spacious three-row seating, refined ride, Toyota reliability, strong towing capability', mpg: '21-29 MPG', bestFor: 'larger families who need three-row seating with bulletproof reliability' },
  'Toyota Tacoma': { class: 'Midsize Truck', strengths: 'legendary off-road capability, incredible resale value, proven durability', mpg: '19-24 MPG', bestFor: 'outdoor enthusiasts and those who need truck capability without a full-size footprint' },
  'Toyota 4Runner': { class: 'Midsize Off-Road SUV', strengths: 'body-on-frame durability, serious off-road capability, excellent resale value', mpg: '16-19 MPG', bestFor: 'adventure seekers who need a rugged, trail-ready SUV that will last for decades' },
  'Toyota Prius': { class: 'Compact Hybrid', strengths: 'best-in-class fuel economy, ultra-low running costs, proven hybrid reliability', mpg: '50-58 MPG', bestFor: 'eco-conscious drivers and commuters who want to spend the least possible on fuel' },
  'Toyota Avalon': { class: 'Full-Size Sedan', strengths: 'spacious luxury-level comfort, smooth V6 power, quiet cabin, Toyota dependability', mpg: '22-34 MPG', bestFor: 'drivers who want near-luxury comfort and space with Toyota reliability at a fraction of Lexus prices' },
  'Toyota C-HR': { class: 'Subcompact Crossover', strengths: 'distinctive styling, nimble handling, standard safety features, compact footprint', mpg: '27-31 MPG', bestFor: 'urban drivers who want crossover styling and versatility in a small, easy-to-park package' },
  'Toyota Tundra': { class: 'Full-Size Truck', strengths: 'proven V8 reliability, strong towing capacity, legendary durability, excellent resale value', mpg: '13-18 MPG', bestFor: 'truck buyers who prioritize long-term reliability and strong towing for boats and trailers' },

  // --- Honda ---
  'Honda Civic': { class: 'Compact Sedan', strengths: 'exceptional reliability, engaging driving dynamics, outstanding fuel economy, high resale value', mpg: '30-42 MPG', bestFor: 'drivers of all ages who want a fun, efficient, and ultra-reliable compact car' },
  'Honda Accord': { class: 'Midsize Sedan', strengths: 'refined ride quality, spacious interior, powerful yet efficient engines, top safety ratings', mpg: '26-38 MPG', bestFor: 'commuters and families who want a roomy, refined sedan that excels in every category' },
  'Honda CR-V': { class: 'Compact SUV', strengths: 'class-leading cargo space, smooth ride, excellent fuel economy, Honda reliability', mpg: '27-34 MPG', bestFor: 'families and active drivers who need a practical, fuel-efficient SUV they can depend on' },
  'Honda HR-V': { class: 'Subcompact SUV', strengths: 'versatile Magic Seat system, surprisingly spacious interior, nimble handling', mpg: '28-34 MPG', bestFor: 'urban drivers and first-time SUV buyers who want versatility in a compact, affordable package' },
  'Honda Pilot': { class: 'Midsize Three-Row SUV', strengths: 'spacious three-row interior, refined V6 power, family-friendly features, strong safety ratings', mpg: '20-27 MPG', bestFor: 'larger families who need a reliable three-row SUV with a polished, comfortable ride' },
  'Honda Fit': { class: 'Subcompact Hatchback', strengths: 'incredible interior versatility, outstanding fuel economy, fun to drive, low ownership costs', mpg: '33-40 MPG', bestFor: 'city drivers and budget-minded buyers who want maximum interior flexibility in a tiny footprint' },
  'Honda Odyssey': { class: 'Minivan', strengths: 'class-leading family features, powerful V6, Magic Slide seats, Honda reliability', mpg: '19-28 MPG', bestFor: 'families who want the most practical, well-engineered minivan with legendary Honda dependability' },

  // --- Nissan ---
  'Nissan Altima': { class: 'Midsize Sedan', strengths: 'comfortable ride, available AWD, ProPILOT Assist technology, competitive pricing', mpg: '26-39 MPG', bestFor: 'commuters and value-focused buyers who want a well-equipped midsize sedan at a great price' },
  'Nissan Sentra': { class: 'Compact Sedan', strengths: 'affordable pricing, fuel efficiency, modern safety features, comfortable interior', mpg: '29-39 MPG', bestFor: 'budget-minded buyers and commuters who want a feature-rich compact at an affordable price' },
  'Nissan Rogue': { class: 'Compact SUV', strengths: 'spacious cargo area, comfortable ride, advanced safety features, fuel-efficient', mpg: '26-35 MPG', bestFor: 'families and commuters who want a practical, comfortable SUV with plenty of cargo room' },
  'Nissan Maxima': { class: 'Full-Size Sport Sedan', strengths: 'powerful 300-hp V6, sporty handling, premium interior, athletic styling', mpg: '20-30 MPG', bestFor: 'drivers who want a powerful, stylish full-size sedan with a premium feel at a mainstream price' },
  'Nissan Pathfinder': { class: 'Midsize Three-Row SUV', strengths: 'spacious three-row seating, strong V6 power, available 4WD, family-oriented features', mpg: '20-27 MPG', bestFor: 'families who need a capable three-row SUV with strong towing and plenty of space' },
  'Nissan Versa': { class: 'Subcompact Sedan', strengths: 'lowest price in its class, surprising interior room, modern safety tech, excellent fuel economy', mpg: '32-40 MPG', bestFor: 'budget-minded buyers and first-time car owners who want an affordable, fuel-efficient daily driver' },
  'Nissan Kicks': { class: 'Subcompact Crossover', strengths: 'affordable pricing, excellent fuel economy, surprisingly spacious cabin, modern tech features', mpg: '31-36 MPG', bestFor: 'city drivers and first-time crossover buyers who want an affordable, efficient, and stylish small SUV' },
  'Nissan Frontier': { class: 'Midsize Truck', strengths: 'proven powertrain durability, affordable truck pricing, capable towing, rugged construction', mpg: '18-24 MPG', bestFor: 'truck buyers who want a reliable, no-nonsense midsize pickup at a value price' },
  'Nissan Murano': { class: 'Midsize SUV', strengths: 'premium interior comfort, smooth V6 power, distinctive styling, quiet cabin', mpg: '20-28 MPG', bestFor: 'couples and small families who want a comfortable, upscale midsize SUV with a luxurious feel' },

  // --- Chevrolet ---
  'Chevrolet Malibu': { class: 'Midsize Sedan', strengths: 'spacious interior, smooth ride, strong safety ratings, user-friendly infotainment', mpg: '29-36 MPG', bestFor: 'commuters and families who want a comfortable, well-equipped midsize sedan at a value price' },
  'Chevrolet Equinox': { class: 'Compact SUV', strengths: 'versatile cargo space, smooth ride, strong safety ratings, affordable pricing', mpg: '26-32 MPG', bestFor: 'families and commuters who want a practical, comfortable compact SUV without breaking the bank' },
  'Chevrolet Cruze': { class: 'Compact Sedan', strengths: 'fuel-efficient turbocharged engine, modern tech features, refined ride, competitive pricing', mpg: '30-40 MPG', bestFor: 'commuters and young professionals who want a fuel-efficient compact with a grown-up ride quality' },
  'Chevrolet Silverado': { class: 'Full-Size Truck', strengths: 'powerful engine options, strong towing capacity, durable construction, wide model range', mpg: '16-23 MPG', bestFor: 'truck buyers who need serious capability for work, towing, and hauling in the Tampa Bay area' },
  'Chevrolet Traverse': { class: 'Full-Size Three-Row SUV', strengths: 'class-leading cargo space, spacious three-row seating, smooth ride, strong safety features', mpg: '18-27 MPG', bestFor: 'large families who need maximum passenger and cargo space with a comfortable ride' },
  'Chevrolet Trax': { class: 'Subcompact SUV', strengths: 'affordable pricing, compact footprint, easy to maneuver, modern connectivity features', mpg: '26-31 MPG', bestFor: 'urban drivers and first-time buyers who want an affordable, easy-to-park small SUV' },
  'Chevrolet Impala': { class: 'Full-Size Sedan', strengths: 'spacious interior, smooth V6 power, comfortable highway cruiser, strong value', mpg: '22-29 MPG', bestFor: 'drivers who want a roomy, comfortable full-size sedan with strong V6 performance at an excellent price' },
  'Chevrolet Colorado': { class: 'Midsize Truck', strengths: 'capable towing and hauling, available diesel engine, manageable size, off-road capability', mpg: '19-30 MPG', bestFor: 'truck buyers who want midsize capability without the bulk of a full-size pickup' },
  'Chevrolet Blazer': { class: 'Midsize SUV', strengths: 'sporty styling, powerful engine options, spacious interior, modern tech features', mpg: '22-29 MPG', bestFor: 'style-conscious buyers who want a head-turning midsize SUV with strong performance' },
  'Chevrolet Camaro': { class: 'Sports Car', strengths: 'exhilarating performance, sharp handling, iconic muscle car heritage, multiple engine options', mpg: '19-29 MPG', bestFor: 'driving enthusiasts who want American muscle car thrills with modern technology and handling' },

  // --- Hyundai ---
  'Hyundai Elantra': { class: 'Compact Sedan', strengths: 'outstanding warranty coverage, feature-rich at every trim, modern styling, excellent fuel economy', mpg: '31-41 MPG', bestFor: 'value-minded buyers who want a well-equipped compact sedan backed by an industry-leading warranty' },
  'Hyundai Sonata': { class: 'Midsize Sedan', strengths: 'striking design, generous standard features, smooth ride, excellent warranty', mpg: '28-36 MPG', bestFor: 'families and commuters who want a stylish, feature-loaded midsize sedan at a great value' },
  'Hyundai Tucson': { class: 'Compact SUV', strengths: 'bold styling, generous warranty, packed with features, comfortable ride quality', mpg: '26-33 MPG', bestFor: 'families and active buyers who want a well-equipped compact SUV with strong warranty protection' },
  'Hyundai Santa Fe': { class: 'Midsize SUV', strengths: 'spacious interior, premium features, strong safety ratings, excellent warranty coverage', mpg: '25-29 MPG', bestFor: 'families who need a spacious, comfortable midsize SUV with top-tier warranty protection' },
  'Hyundai Kona': { class: 'Subcompact SUV', strengths: 'fun driving dynamics, bold styling, available turbocharged engine, great fuel economy', mpg: '27-35 MPG', bestFor: 'urban drivers who want a stylish, fun-to-drive small SUV with surprising performance' },
  'Hyundai Accent': { class: 'Subcompact Sedan', strengths: 'lowest cost of ownership in its class, excellent fuel economy, outstanding warranty, simple reliability', mpg: '33-41 MPG', bestFor: 'budget-conscious buyers and first-time car owners who want maximum value and warranty protection' },

  // --- Kia ---
  'Kia Forte': { class: 'Compact Sedan', strengths: 'excellent value, generous standard features, strong warranty, refined interior', mpg: '31-41 MPG', bestFor: 'budget-minded buyers who want more features per dollar than any other compact sedan' },
  'Kia Optima': { class: 'Midsize Sedan', strengths: 'stylish design, turbocharged engine options, feature-rich interior, strong warranty', mpg: '25-36 MPG', bestFor: 'drivers who want a stylish, well-equipped midsize sedan that stands out from the crowd' },
  'Kia Soul': { class: 'Subcompact Crossover', strengths: 'uniquely boxy design, surprisingly spacious cabin, fun personality, excellent cargo room', mpg: '28-35 MPG', bestFor: 'buyers who want a fun, distinctive vehicle with great interior space and a personality all its own' },
  'Kia Sportage': { class: 'Compact SUV', strengths: 'bold styling, well-equipped at every trim, strong warranty, comfortable ride', mpg: '25-32 MPG', bestFor: 'families and commuters who want a stylish compact SUV packed with features at a competitive price' },
  'Kia Sorento': { class: 'Midsize SUV', strengths: 'available third-row seating, strong V6 option, premium interior quality, excellent warranty', mpg: '22-29 MPG', bestFor: 'families who need a versatile midsize SUV with available three-row seating and strong value' },
  'Kia Seltos': { class: 'Subcompact SUV', strengths: 'right-sized for city driving, generous features for the price, modern design, good fuel economy', mpg: '27-33 MPG', bestFor: 'urban drivers and young buyers who want a well-equipped, modern small SUV at an accessible price' },
  'Kia Telluride': { class: 'Midsize Three-Row SUV', strengths: 'stunning design, premium interior quality, spacious three-row seating, exceptional value', mpg: '20-26 MPG', bestFor: 'families who want a premium three-row SUV experience without the luxury-brand price tag' },

  // --- Ford ---
  'Ford Escape': { class: 'Compact SUV', strengths: 'nimble handling, available hybrid powertrain, spacious cargo area, strong safety features', mpg: '26-41 MPG', bestFor: 'families and commuters who want a versatile, fuel-efficient compact SUV for daily driving' },
  'Ford Fusion': { class: 'Midsize Sedan', strengths: 'refined ride quality, available hybrid and AWD, attractive styling, strong safety ratings', mpg: '23-43 MPG', bestFor: 'commuters who want a comfortable, stylish midsize sedan with available hybrid efficiency' },
  'Ford Explorer': { class: 'Midsize Three-Row SUV', strengths: 'powerful engine options, spacious three-row interior, strong towing capability, iconic nameplate', mpg: '20-27 MPG', bestFor: 'families who need a capable three-row SUV with strong towing and a commanding road presence' },
  'Ford F-150': { class: 'Full-Size Truck', strengths: 'best-selling truck in America, aluminum body durability, powerful EcoBoost engines, outstanding towing', mpg: '18-25 MPG', bestFor: 'truck buyers who want the most popular, most capable, and most versatile full-size pickup available' },
  'Ford Edge': { class: 'Midsize SUV', strengths: 'spacious two-row interior, smooth ride, strong V6 option, generous cargo space', mpg: '21-29 MPG', bestFor: 'couples and small families who want a roomy midsize SUV focused on comfort and space' },
  'Ford Ranger': { class: 'Midsize Truck', strengths: 'turbocharged EcoBoost power, manageable size, solid towing capability, off-road options', mpg: '21-26 MPG', bestFor: 'truck buyers who want midsize versatility with EcoBoost turbocharged efficiency and capability' },
  'Ford EcoSport': { class: 'Subcompact SUV', strengths: 'affordable pricing, compact footprint, standard 4WD available, easy to maneuver', mpg: '26-29 MPG', bestFor: 'city drivers who want an affordable, compact SUV that is easy to park and navigate in Tampa traffic' },
  'Ford Mustang': { class: 'Sports Car', strengths: 'iconic American muscle, thrilling V8 and EcoBoost options, sharp handling, head-turning styling', mpg: '18-32 MPG', bestFor: 'driving enthusiasts who want an iconic American sports car with thrilling performance and timeless styling' },
  'Ford Bronco Sport': { class: 'Compact SUV', strengths: 'rugged off-road capability, retro-inspired styling, standard 4WD, adventure-ready features', mpg: '25-29 MPG', bestFor: 'adventure-minded buyers who want a stylish, trail-capable compact SUV for Florida weekend getaways' },

  // --- Volkswagen ---
  'Volkswagen Jetta': { class: 'Compact Sedan', strengths: 'refined European ride quality, spacious trunk, turbocharged efficiency, premium feel', mpg: '30-40 MPG', bestFor: 'commuters who want a European driving experience with upscale cabin quality at a mainstream price' },
  'Volkswagen Passat': { class: 'Midsize Sedan', strengths: 'generous rear-seat space, smooth turbocharged engine, composed highway ride, upscale interior', mpg: '25-36 MPG', bestFor: 'families and road-trippers who want a spacious, refined midsize sedan with a premium European feel' },
  'Volkswagen Tiguan': { class: 'Compact SUV', strengths: 'available third-row seating, refined ride quality, European styling, spacious interior', mpg: '22-29 MPG', bestFor: 'families who want a well-rounded compact SUV with European refinement and available three-row seating' },
  'Volkswagen Atlas': { class: 'Midsize Three-Row SUV', strengths: 'massive interior space, family-friendly features, smooth ride, straightforward controls', mpg: '20-24 MPG', bestFor: 'larger families who need maximum passenger and cargo space with a no-fuss, user-friendly layout' },

  // --- Subaru ---
  'Subaru Outback': { class: 'Midsize Wagon/Crossover', strengths: 'standard AWD, rugged capability, generous cargo space, excellent safety ratings', mpg: '26-32 MPG', bestFor: 'outdoor enthusiasts and families who want a capable, safe, all-weather vehicle for every adventure' },
  'Subaru Forester': { class: 'Compact SUV', strengths: 'standard AWD, excellent visibility, spacious cargo area, top safety ratings', mpg: '26-33 MPG', bestFor: 'safety-conscious families who want a practical, reliable compact SUV with standard all-wheel drive' },
  'Subaru Crosstrek': { class: 'Subcompact Crossover', strengths: 'standard AWD, excellent ground clearance, rugged capability, outstanding fuel economy', mpg: '27-34 MPG', bestFor: 'active lifestyles and commuters who want a compact crossover that can handle any road or weather condition' },
  'Subaru Impreza': { class: 'Compact Sedan/Hatchback', strengths: 'standard AWD, excellent fuel economy, strong safety ratings, affordable pricing', mpg: '28-36 MPG', bestFor: 'budget-minded buyers who want standard all-wheel drive and excellent safety in an affordable compact' },

  // --- Mazda ---
  'Mazda Mazda3': { class: 'Compact Sedan/Hatchback', strengths: 'best-in-class driving dynamics, premium interior quality, strong reliability, sharp styling', mpg: '28-36 MPG', bestFor: 'driving enthusiasts who want a compact car that feels premium and is genuinely fun to drive' },
  'Mazda CX-5': { class: 'Compact SUV', strengths: 'upscale interior, engaging handling, strong reliability ratings, refined ride quality', mpg: '25-31 MPG', bestFor: 'buyers who want a compact SUV with luxury-level quality and driving dynamics at a mainstream price' },
  'Mazda CX-30': { class: 'Subcompact SUV', strengths: 'stunning design, premium interior, nimble handling, excellent build quality', mpg: '26-33 MPG', bestFor: 'style-conscious drivers who want a small SUV with upscale refinement and engaging driving character' },
  'Mazda Mazda6': { class: 'Midsize Sedan', strengths: 'elegant styling, premium interior materials, engaging driving dynamics, excellent reliability', mpg: '26-35 MPG', bestFor: 'drivers who want a midsize sedan with near-luxury refinement and a rewarding driving experience' },

  // --- BMW ---
  'BMW 3 Series': { class: 'Compact Luxury Sedan', strengths: 'benchmark driving dynamics, turbocharged performance, premium technology, prestigious heritage', mpg: '26-36 MPG', bestFor: 'driving enthusiasts who want the quintessential luxury sport sedan experience with cutting-edge technology' },
  'BMW X3': { class: 'Compact Luxury SUV', strengths: 'athletic handling, powerful turbocharged engines, premium interior, versatile cargo space', mpg: '25-29 MPG', bestFor: 'buyers who want a compact luxury SUV that delivers genuine driving excitement with everyday practicality' },
  'BMW X5': { class: 'Midsize Luxury SUV', strengths: 'powerful engine options, spacious luxury interior, advanced technology, commanding road presence', mpg: '21-27 MPG', bestFor: 'families who want a spacious, powerful luxury SUV with BMW performance and premium appointments' },

  // --- Jeep ---
  'Jeep Wrangler': { class: 'Off-Road SUV', strengths: 'unmatched off-road capability, removable top and doors, iconic design, incredible resale value', mpg: '17-25 MPG', bestFor: 'adventure lovers who want the ultimate open-air driving experience and legendary off-road capability' },
  'Jeep Cherokee': { class: 'Compact SUV', strengths: 'Trail Rated off-road capability, comfortable on-road ride, available V6, versatile cargo space', mpg: '22-31 MPG', bestFor: 'buyers who want a compact SUV that handles daily commuting and weekend trail adventures equally well' },
  'Jeep Grand Cherokee': { class: 'Midsize SUV', strengths: 'refined luxury interior, powerful engine options, serious off-road capability, premium ride quality', mpg: '19-26 MPG', bestFor: 'drivers who want a premium midsize SUV that seamlessly combines luxury comfort with rugged capability' },
  'Jeep Compass': { class: 'Compact SUV', strengths: 'affordable Jeep entry point, modern interior design, available 4x4, fuel-efficient', mpg: '26-32 MPG', bestFor: 'first-time Jeep buyers who want the brand\'s rugged styling and capability at an accessible price point' },
  'Jeep Renegade': { class: 'Subcompact SUV', strengths: 'playful design, Trail Rated capability, compact and city-friendly, distinctive personality', mpg: '24-32 MPG', bestFor: 'urban adventurers who want Jeep styling and off-road credibility in a fun, compact package' },

  // --- Dodge ---
  'Dodge Charger': { class: 'Full-Size Sedan', strengths: 'iconic muscle car presence, powerful HEMI V8 options, spacious four-door practicality, thrilling performance', mpg: '19-30 MPG', bestFor: 'drivers who want genuine muscle car excitement in a practical four-door sedan with room for the family' },
  'Dodge Challenger': { class: 'Muscle Car', strengths: 'classic American muscle styling, thundering HEMI V8 power, retro design, wide body presence', mpg: '18-27 MPG', bestFor: 'performance enthusiasts who want a classic American muscle car with modern power and technology' },
  'Dodge Durango': { class: 'Full-Size SUV', strengths: 'available HEMI V8 power, three-row seating, strong towing capability, muscle car DNA', mpg: '19-26 MPG', bestFor: 'families who want a three-row SUV with serious power, strong towing, and bold styling' },

  // --- Ram ---
  'Ram 1500': { class: 'Full-Size Truck', strengths: 'class-leading ride quality, luxurious interior, powerful engine options, impressive towing capacity', mpg: '17-25 MPG', bestFor: 'truck buyers who want the smoothest ride, most refined interior, and serious capability in a full-size pickup' },

  // --- GMC ---
  'GMC Sierra': { class: 'Full-Size Truck', strengths: 'professional-grade build quality, premium Denali trims, strong towing, innovative features', mpg: '16-23 MPG', bestFor: 'truck buyers who want professional-grade capability with premium materials and a refined experience' },
  'GMC Terrain': { class: 'Compact SUV', strengths: 'distinctive styling, premium interior for its class, compact maneuverability, strong safety features', mpg: '26-30 MPG', bestFor: 'buyers who want a well-appointed compact SUV with upscale touches at an accessible price point' },
  'GMC Acadia': { class: 'Midsize Three-Row SUV', strengths: 'available three-row seating, premium interior, refined ride, manageable size for a three-row', mpg: '22-28 MPG', bestFor: 'families who want a premium-feeling three-row SUV that is easier to maneuver than full-size alternatives' },

  // --- Lexus ---
  'Lexus IS': { class: 'Compact Luxury Sedan', strengths: 'sharp styling, engaging rear-wheel-drive dynamics, bulletproof Lexus reliability, premium cabin', mpg: '21-31 MPG', bestFor: 'driving enthusiasts who want a sporty luxury sedan with the reliability advantage of Lexus ownership' },
  'Lexus ES': { class: 'Midsize Luxury Sedan', strengths: 'whisper-quiet cabin, ultra-smooth ride, Toyota-based reliability, premium comfort', mpg: '26-44 MPG', bestFor: 'luxury buyers who prioritize supreme comfort, quietness, and long-term dependability above all else' },
  'Lexus RX': { class: 'Midsize Luxury SUV', strengths: 'benchmark luxury comfort, excellent reliability, smooth ride, strong resale value', mpg: '20-31 MPG', bestFor: 'luxury SUV buyers who want the most reliable, comfortable, and refined midsize luxury crossover available' },
  'Lexus NX': { class: 'Compact Luxury SUV', strengths: 'bold styling, Lexus reliability, premium technology, available hybrid powertrain', mpg: '25-35 MPG', bestFor: 'luxury buyers who want a stylish, reliable compact SUV with premium features and available hybrid efficiency' },

  // --- Acura ---
  'Acura TLX': { class: 'Midsize Luxury Sedan', strengths: 'sporty driving dynamics, Honda-based reliability, premium interior, Super Handling AWD available', mpg: '23-33 MPG', bestFor: 'drivers who want a sporty luxury sedan with Honda engineering dependability and engaging performance' },
  'Acura RDX': { class: 'Compact Luxury SUV', strengths: 'turbocharged power, premium cabin, Honda reliability, available Super Handling AWD', mpg: '24-28 MPG', bestFor: 'luxury buyers who want a sporty, well-equipped compact SUV with Honda engineering and long-term reliability' },
  'Acura MDX': { class: 'Midsize Luxury Three-Row SUV', strengths: 'spacious three-row luxury, Honda reliability, refined V6 power, advanced safety features', mpg: '20-27 MPG', bestFor: 'families who want three-row luxury with the peace of mind that comes from Honda-based reliability' },

  // --- Buick ---
  'Buick Encore': { class: 'Subcompact Luxury SUV', strengths: 'quiet cabin, smooth ride, accessible luxury pricing, compact maneuverability', mpg: '25-30 MPG', bestFor: 'buyers who want a quiet, comfortable small SUV with premium touches at a surprisingly affordable price' },
  'Buick Enclave': { class: 'Full-Size Luxury Three-Row SUV', strengths: 'spacious luxury interior, whisper-quiet cabin, smooth ride, premium features at an accessible price', mpg: '18-26 MPG', bestFor: 'families who want spacious three-row luxury without paying Cadillac or German luxury prices' },

  // --- Infiniti ---
  'Infiniti Q50': { class: 'Midsize Luxury Sedan', strengths: 'powerful twin-turbo V6, bold styling, advanced technology, competitive luxury pricing', mpg: '20-29 MPG', bestFor: 'performance-minded luxury buyers who want a powerful, distinctive sedan at an outstanding used value' },
  'Infiniti QX60': { class: 'Midsize Luxury Three-Row SUV', strengths: 'spacious three-row luxury, smooth ride, family-friendly features, competitive pricing', mpg: '20-27 MPG', bestFor: 'families who want a three-row luxury SUV with a comfortable ride and excellent used-market value' }
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

  const mKey = make + ' ' + model;
  const mData = modelData[mKey];

  let introText;
  if (mData) {
    introText = `<p>Find the perfect used ${make} ${model} right here at Warehouse Cars Tampa in Tampa, FL. ${count > 0 ? `We currently have <strong>${count} ${make} ${model}${count !== 1 ? 's' : ''}</strong> in stock${count > 0 ? `, priced from <strong>$${fmtPrice(priceMin)}</strong>${priceMax !== priceMin ? ` to <strong>$${fmtPrice(priceMax)}</strong>` : ''}` : ''}.` : `While we don't currently have a ${make} ${model} in stock, our inventory changes frequently.`}</p>
<p>The ${make} ${model} is a popular <strong>${mData.class}</strong> known for ${mData.strengths}. With an estimated <strong>${mData.mpg}</strong>, the ${model} is an excellent choice for ${mData.bestFor}. Whether you're commuting across the Howard Frankland Bridge or running errands around South Tampa, the ${model} delivers everything you need for daily driving in the Tampa Bay area.</p>
<p>${data.buyingTip}</p>
<p>Every vehicle at Warehouse Cars Tampa goes through our quality inspection process before it reaches our lot. We stand behind what we sell and offer transparent, no-haggle pricing. Stop by our Tampa location or contact us to schedule a test drive today.</p>`;
  } else {
    introText = `<p>Find the perfect used ${make} ${model} right here at Warehouse Cars Tampa in Tampa, FL. ${count > 0 ? `We currently have <strong>${count} ${make} ${model}${count !== 1 ? 's' : ''}</strong> in stock${count > 0 ? `, priced from <strong>$${fmtPrice(priceMin)}</strong>${priceMax !== priceMin ? ` to <strong>$${fmtPrice(priceMax)}</strong>` : ''}` : ''}.` : `While we don't currently have a ${make} ${model} in stock, our inventory changes frequently.`}</p>
<p>The ${make} ${model} is a popular choice among Tampa drivers for its combination of ${data.reliability}. Whether you're commuting across the Howard Frankland Bridge or running errands around South Tampa, the ${model} delivers the comfort and efficiency you need for daily driving in the Tampa Bay area.</p>
<p>${data.buyingTip}</p>
<p>Every vehicle at Warehouse Cars Tampa goes through our quality inspection process before it reaches our lot. We stand behind what we sell and offer transparent, no-haggle pricing. Stop by our Tampa location or contact us to schedule a test drive today.</p>`;
  }

  let faqs;
  if (mData) {
    faqs = [
      { q: `How much is a used ${make} ${model} in Tampa?`, a: count > 0 ? `At Warehouse Cars Tampa, our used ${make} ${model} inventory is priced from $${fmtPrice(priceMin)} to $${fmtPrice(priceMax)}. Pricing depends on year, mileage, and condition.` : `Pricing varies by year, mileage, and condition. Contact us for current availability and pricing on the ${make} ${model}.` },
      { q: `Is the ${make} ${model} a reliable car?`, a: `Yes — ${make} is known for ${data.reliability}. The ${model} is a ${mData.class} recognized for ${mData.strengths}, making it an excellent choice for used car buyers looking for a vehicle they can count on for years to come.` },
      { q: `What is the ${make} ${model} best for?`, a: `The ${make} ${model} is best for ${mData.bestFor}. It achieves an estimated ${mData.mpg}, making it efficient for Tampa commutes and everyday driving.` },
      { q: `Can I test drive a ${make} ${model} at Warehouse Cars Tampa?`, a: `Of course! Just give us a call or use our contact form to schedule a test drive. Walk-ins are also welcome during business hours, Monday through Saturday.` }
    ];
  } else {
    faqs = [
      { q: `How much is a used ${make} ${model} in Tampa?`, a: count > 0 ? `At Warehouse Cars Tampa, our used ${make} ${model} inventory is priced from $${fmtPrice(priceMin)} to $${fmtPrice(priceMax)}. Pricing depends on year, mileage, and condition.` : `Pricing varies by year, mileage, and condition. Contact us for current availability and pricing on the ${make} ${model}.` },
      { q: `Is the ${make} ${model} a reliable car?`, a: `Yes — ${make} is known for ${data.reliability}. The ${model} in particular has a strong track record for dependability, making it an excellent choice for used car buyers looking for a vehicle they can count on for years to come.` },
      { q: `Can I test drive a ${make} ${model} at Warehouse Cars Tampa?`, a: `Of course! Just give us a call or use our contact form to schedule a test drive. Walk-ins are also welcome during business hours, Monday through Saturday.` }
    ];
  }

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
  },
  Coupe: {
    plural: 'Coupes',
    description: 'sporty styling, thrilling performance, and head-turning looks',
    benefits: ['Sporty design and driving dynamics', 'Lower insurance costs than dedicated sports cars', 'Fun and engaging driving experience', 'Eye-catching style that stands out on Tampa roads'],
    audience: 'singles, couples, and driving enthusiasts who prioritize style and performance',
    tip: 'Coupes offer the best of both worlds — sporty looks and driving fun without the extreme insurance costs of dedicated sports cars. In Tampa, a coupe is a great way to enjoy the sunshine and the open road. Used coupes are often priced lower than their sedan counterparts, making them a smart pick for buyers who want something with personality.'
  },
  Hatchback: {
    plural: 'Hatchbacks',
    description: 'practical versatility with a fun, sporty character',
    benefits: ['More cargo space than a sedan with a compact footprint', 'Fun-to-drive handling and nimble feel', 'Fold-flat rear seats for maximum versatility', 'Great fuel economy for daily Tampa commutes'],
    audience: 'active lifestyles, young professionals, and anyone who wants practicality with personality',
    tip: 'Hatchbacks are the unsung heroes of the used car market. They offer significantly more cargo space than a sedan while maintaining the same compact footprint and fuel economy. Whether you are loading up gear for a Clearwater beach day or hauling supplies from a Tampa home improvement store, a hatchback has you covered.'
  },
  Convertible: {
    plural: 'Convertibles',
    description: 'open-air freedom built for the Florida sunshine lifestyle',
    benefits: ['Top-down driving perfect for Tampa\'s year-round sunshine', 'Unique driving experience you can enjoy almost every day in Florida', 'Head-turning style on Bayshore Boulevard', 'Fun weekend and leisure driving'],
    audience: 'fun-seekers, Florida lifestyle enthusiasts, and anyone who wants to enjoy Tampa\'s beautiful weather from behind the wheel',
    tip: 'Living in Tampa means you can enjoy a convertible nearly year-round — and that is something drivers up north can only dream about. A used convertible is a fantastic way to embrace the Florida lifestyle without paying new-car prices. Look for models with well-maintained soft tops or retractable hardtops for the best long-term experience.'
  },
  Wagon: {
    plural: 'Wagons',
    description: 'sedan comfort with SUV-level cargo space and practicality',
    benefits: ['More cargo space than a sedan without the bulk of an SUV', 'Lower ride height for easy entry and exit', 'Better fuel economy than most SUVs', 'Family-friendly with a car-like driving experience'],
    audience: 'families, road-trippers, and practical buyers who want maximum cargo space without switching to an SUV',
    tip: 'Wagons are the ultimate underrated value in the used car market. They offer nearly as much cargo space as many SUVs but with better fuel economy and a lower, easier-to-load cargo floor. In a market where everyone buys SUVs, wagons fly under the radar — which means you can find terrific deals on practical, family-friendly vehicles.'
  },
  Minivan: {
    plural: 'Minivans',
    description: 'the ultimate family vehicle with unmatched interior space and convenience',
    benefits: ['Most interior passenger and cargo space of any vehicle type', 'Sliding doors make loading kids and car seats easy', 'Family-friendly features like entertainment systems and multiple USB ports', 'Comfortable ride for long Tampa Bay area family outings'],
    audience: 'families with children who need maximum interior space, easy access, and family-oriented features',
    tip: 'Minivans may not be glamorous, but they are the most practical vehicle you can buy for a family. Nothing else offers the combination of interior space, sliding-door convenience, and passenger comfort. Used minivans are one of the best values in the market — they depreciate faster than SUVs, which means buyers get a lot of vehicle for their money. For Tampa families, a minivan makes beach trips, school runs, and road trips a breeze.'
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
    5000: 'Under $5,000, focus on older reliable Japanese cars that have stood the test of time. Toyota Corollas and Honda Civics from 2010-2015 are your best bets in this range — they may have higher mileage, but these models are built to go well beyond 200,000 miles. A pre-purchase inspection is essential at this price point, but a good find here can deliver years of reliable transportation.',
    8000: 'With an $8,000 budget, you gain access to reliable 2015-2018 compact cars with modern safety features and connectivity. This is a great price point for Hyundai Elantras and Kia Fortes, which offer outstanding warranty coverage and generous features. You can also find well-maintained Honda Civics and Toyota Corollas with lower mileage than the under-$5K range.',
    10000: 'In the under-$10,000 range, focus on reliability over flash. Japanese brands like Toyota and Honda are excellent picks at this price point. Always get a pre-purchase inspection, and look for vehicles with lower mileage relative to their age.',
    12000: 'The under-$12,000 range is the sweet spot for 2017-2019 sedans with modern safety features like automatic emergency braking and blind-spot monitoring. You will find well-equipped Hyundai Sonatas, Kia Optimas, and Nissan Altimas, plus compact SUVs like the Chevrolet Trax and Nissan Kicks. This is where you start getting genuinely modern vehicles at used-car prices.',
    15000: 'The under-$15,000 sweet spot gives you access to newer models with modern safety features. At this price, you can find well-maintained vehicles from 2017-2020 with reasonable mileage. This is where the best value in the used car market lives.',
    18000: 'An $18,000 budget opens up newer model year sedans, compact SUVs, and well-equipped trim levels. Expect to find 2019-2021 models with low mileage, including popular choices like the Toyota RAV4, Honda CR-V, and Hyundai Tucson. You can also find loaded sedans like the Honda Accord and Toyota Camry with premium features like leather seats and sunroofs.',
    20000: 'With a $20,000 budget, you have access to a wide range of quality vehicles including newer models, loaded trim levels, and even some compact SUVs. Look for vehicles with remaining manufacturer warranty for extra peace of mind.',
    25000: 'Under $25,000 opens up nearly-new vehicles, higher trim levels, and popular SUVs. At this price point, you can find vehicles that are only 2-3 years old with low mileage and full warranty coverage remaining.',
    30000: 'A $30,000 budget gives you access to premium vehicles, loaded SUVs, and trucks. Many of these vehicles are barely broken in and come with remaining warranty. You can find vehicles that would cost $40,000+ new.',
    35000: 'With $35,000, you can find nearly-new loaded SUVs, well-equipped trucks, and premium brand vehicles. This opens the door to lightly used Lexus, Acura, and BMW models, as well as higher-trim domestic trucks and three-row SUVs. Many of these vehicles are just 1-2 years old with very low mileage and full factory warranty remaining.',
    40000: 'A $40,000 budget puts you in the territory of low-mileage premium vehicles, fully loaded trucks, and luxury brand options. You can find nearly-new BMW X3s, Lexus RX models, loaded Ford F-150s, and high-trim three-row luxury SUVs. At this price point, you are getting vehicles that cost $50,000-$60,000 new with minimal depreciation left to absorb.'
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

function getAllPredefinedMakeModels() {
  return Object.keys(modelData).map(key => {
    const spaceIndex = key.indexOf(' ');
    return {
      make: key.substring(0, spaceIndex),
      model: key.substring(spaceIndex + 1)
    };
  });
}

module.exports = { getMakeContent, getMakeModelContent, getBodyStyleContent, getPriceRangeContent, getYearContent, getAllPredefinedMakeModels, modelData };
