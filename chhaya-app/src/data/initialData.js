// Initial Seed Data for Chhaya Mobiles & Repairs Platform (Chitrakoot Dham, Sony Dharmshala)

export const DEFAULT_SETTINGS = {
  store: {
    name: 'Chhaya Mobiles & Repairs',
    tagline: 'Chitrakoot\'s Premier Smartphone Retail & Precision Hardware Repair Lab',
    badge: 'EST. 2023 • SONY DHARMSHALA, CHITRAKOOT',
    address: 'Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, Chitrakoot, Madhya Pradesh 485334',
    landmark: 'Near Kamta Nath Mandir, 5VF8+XPG Chitrakoot',
    phone: '+91 93018 61874',
    whatsapp: '+91 93018 61874',
    email: 'contact@chhayamobiles.com',
    hoursWeek: 'Mon – Sat: 10:00 AM – 9:30 PM',
    hoursSun: 'Sunday: 11:00 AM – 6:00 PM',
    mapEmbed: 'https://maps.google.com/maps?q=25.1749388,80.8668289&t=&z=16&ie=UTF8&iwloc=&output=embed',
    googleReviewUrl: 'https://www.google.com/maps/place/Sony+Dharmshala+Chitarkoot+Dham+M.P./@25.1755836,80.8652137,857m/data=!3m1!1e3!4m8!3m7!1s0x3984a63a69f3c01d:0x66ba352b5bd3deab!8m2!3d25.1749388!4d80.8668289!9m1!1b1!16s%2Fg%2F11h9zslwhs?entry=ttu&g_ep=EgoyMDI2MDkxNC4wIKXMDSoASAFQAw%3D%3D',
    payments: 'In-store Counter: Cash, PhonePe, Google Pay, Paytm UPI, Debit/Credit Cards.'
  },
  announcement: {
    text: '🔥 Festival Special: Free 9D Tempered Glass with any Screen Replacement! Walk-ins welcome.',
    visible: true,
    tone: 'blue', // blue, amber, emerald, red
    blinking: false, // Blinking attention alert
    slider: false    // Scrolling text slider (marquee)
  },
  owner: {
    name: 'Pushpendra Prajapati',
    title: 'Master Technician & Store Proprietor',
    experience: 'Started 2023 Till Now Running • Sony Dharmshala, Chitrakoot',
    estYear: '2023',
    bio: 'Chhaya Mobiles was established in 2023 at Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham M.P. by Pushpendra Prajapati. Started from 2023 and continuously running till now, providing transparent on-the-counter smartphone repairs and certified gadget retail.',
    avatar: ''
  },
  media: {
    video: {
      id: 'vid-1',
      title: 'Chhaya Mobiles Workshop & Store Showcase',
      url: '/final_video.mp4',
      autoplayWithAudio: true
    },
    images: [
      {
        id: 'img-1',
        title: 'Storefront Exterior — Sony Dharmshala, Chitrakoot',
        caption: 'Prime retail location at Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P.',
        url: '/exterior.png'
      },
      {
        id: 'img-2',
        title: 'Precision Micro-soldering Workshop Interior',
        caption: 'State-of-the-art diagnostic benches and certified gadget showcases',
        url: '/interior.png'
      }
    ]
  },
  productCategories: [
    'Pre-Owned Phones',
    'Batteries & Power',
    'Screen Protection',
    'Cases & Covers',
    'Audio & Cables'
  ],
  spinner: {
    enabled: true,
    title: 'Chitrakoot Lucky Spin & Win',
    subtitle: 'Spin the wheel to win instant counter discounts & gifts!',
    expiryMinutes: 120,
    slices: [
      { id: 's1', label: '₹150 OFF Repair', prize: '₹150 Flat Discount on Screen or Motherboard Repair', code: 'CHHAYA-REP150', color: '#2563eb', textColor: '#ffffff' },
      { id: 's2', label: 'Free 9D Glass', prize: 'Free 9D Tempered Glass Installation on Any Phone', code: 'CHHAYA-9DGLASS', color: '#059669', textColor: '#ffffff' },
      { id: 's3', label: '10% Gadget OFF', prize: '10% Instant OFF on Any Audio or Power Gadget', code: 'CHHAYA-GADGET10', color: '#d97706', textColor: '#ffffff' },
      { id: 's4', label: '₹50 OFF Cover', prize: '₹50 Flat OFF on Any Mobile Cover or Case', code: 'CHHAYA-COVER50', color: '#7c3aed', textColor: '#ffffff' },
      { id: 's5', label: 'Free Cable Guard', prize: 'Free Spiral Cable Protector Set (Pack of 4)', code: 'CHHAYA-FREEPROT', color: '#db2777', textColor: '#ffffff' },
      { id: 's6', label: '₹200 OFF Combo', prize: '₹200 Instant OFF on Combo (Screen + Battery)', code: 'CHHAYA-COMBO200', color: '#0891b2', textColor: '#ffffff' }
    ]
  }
};

export const DEFAULT_MEDIA = {
  video: {
    id: 'vid-1',
    title: 'Chhaya Mobiles Workshop & Store Showcase',
    url: '/final_video.mp4',
    autoplayWithAudio: true
  },
  images: [
    {
      id: 'img-1',
      title: 'Storefront Exterior — Sony Dharmshala, Chitrakoot',
      caption: 'Prime retail location at Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P.',
      url: '/exterior.png'
    },
    {
      id: 'img-2',
      title: 'Precision Micro-soldering Workshop Interior',
      caption: 'State-of-the-art diagnostic benches and certified gadget showcases',
      url: '/interior.png'
    }
  ]
};

export const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Apple iPhone 13 128GB Midnight (Certified Pre-Owned)',
    category: 'Pre-Owned Phones',
    sku: 'CH-IP13-MDN',
    price: 34999,
    mrp: 52000,
    location: 'Showcase #1, Shelf A',
    condition: 'Mint 92% Battery • OEM Box',
    units: 4,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    featured: true,
    specs: ['128GB NVMe Storage', 'A15 Bionic Chip', '92% Genuine Battery Health', '6-Month Store Warranty']
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S22 5G 128GB Phantom Black',
    category: 'Pre-Owned Phones',
    sku: 'CH-SS22-BLK',
    price: 28499,
    mrp: 48999,
    location: 'Showcase #1, Shelf B',
    condition: 'Grade A+ • Snapdragon 8 Gen 1',
    units: 3,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    featured: true,
    specs: ['Dynamic AMOLED 2X 120Hz', '50MP Triple Camera', 'Grade A+ Condition', 'Original Bill Included']
  },
  {
    id: 'prod-3',
    name: 'OnePlus 11R 5G 256GB Sonic Black',
    category: 'Pre-Owned Phones',
    sku: 'CH-OP11R-256',
    price: 24999,
    mrp: 39999,
    location: 'Showcase #2, Shelf A',
    condition: 'Like New • 100W SuperVOOC Included',
    units: 2,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    featured: true,
    specs: ['16GB RAM / 256GB Storage', 'Snapdragon 8+ Gen 1', '100W Fast Charger', 'Factory Box Pack']
  },
  {
    id: 'prod-4',
    name: 'Apple 20W USB-C Fast Power Adapter OEM',
    category: 'Batteries & Power',
    sku: 'CH-ACC-20W',
    price: 1450,
    mrp: 1900,
    location: 'Peg Board #3',
    condition: 'Genuine Sealed Pack',
    units: 18,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    featured: true,
    specs: ['20W Power Delivery (PD 3.0)', 'Apple MFi Certified', 'Compact Travel Design', '1-Year Warranty']
  },
  {
    id: 'prod-5',
    name: 'Anker 20,000mAh 22.5W Power Bank Dual Port',
    category: 'Batteries & Power',
    sku: 'CH-ANK-20K',
    price: 2199,
    mrp: 2999,
    location: 'Shelf 4, Unit C',
    condition: 'Brand New In Box',
    units: 7,
    image: 'https://images.unsplash.com/photo-1609592424364-e4c16ca60882?w=600&auto=format&fit=crop&q=80',
    featured: false,
    specs: ['20,000mAh High Density Li-Polymer', '22.5W Super Charge', 'USB-C + Dual USB-A', 'LED Battery Indicator']
  },
  {
    id: 'prod-6',
    name: 'Spigen Ultra Hybrid Armor Case (iPhone 14 / 15)',
    category: 'Cases & Covers',
    sku: 'CH-SPG-HYB',
    price: 999,
    mrp: 1499,
    location: 'Display Unit #2',
    condition: 'Air Cushion Military Drop Tested',
    units: 15,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80',
    featured: false,
    specs: ['Mil-grade drop certified', 'Anti-yellowing crystal TPU', 'Raised camera bevel guard', 'MagSafe Compatible']
  },
  {
    id: 'prod-7',
    name: '9D Edge-to-Edge Curved Ceramic Screen Guard',
    category: 'Screen Protection',
    sku: 'CH-GLS-9D',
    price: 349,
    mrp: 699,
    location: 'Fitting Bench Counter',
    condition: 'Free In-Store Precision Fitting',
    units: 50,
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600&auto=format&fit=crop&q=80',
    featured: true,
    specs: ['9H scratch-resistant tempered glass', 'Oleophobic anti-fingerprint coating', 'Zero bubble laser cutout', 'In-store fitting free']
  },
  {
    id: 'prod-8',
    name: 'Realme Buds Air 5 Pro ANC Bluetooth Earbuds',
    category: 'Audio & Cables',
    sku: 'CH-RME-BUDS5',
    price: 3999,
    mrp: 5499,
    location: 'Audio Showcase #1',
    condition: 'Brand New Sealed • 50dB Hybrid ANC',
    units: 5,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    featured: true,
    specs: ['50dB Active Noise Cancellation', 'Dual Dynamic Coaxial Drivers', 'LDAC Hi-Res Audio codec', '40 Hours Playback']
  }
];

export const DEFAULT_REPAIRS = [
  {
    id: 'srv-1',
    name: 'Original OLED / Super Retina Screen Replacement',
    category: 'Screen & Display',
    price: 1999,
    duration: '30–45 Mins',
    warranty: '90 Days In-Store Warranty',
    description: 'Precision replacement for shattered glass, unresponsive touch digitizers, green lines, and black screens using genuine OEM grade displays with True Tone calibration.',
    includes: ['Original Color & 120Hz Calibration', 'Free 9D Tempered Glass Installation', 'Precision Dust Mesh Cleaning', 'Water-Resistant Frame Seal Reapplied'],
    popular: true,
    status: true
  },
  {
    id: 'srv-2',
    name: 'Certified OEM High-Capacity Battery Replacement',
    category: 'Battery & Charging',
    price: 999,
    duration: '25–40 Mins',
    warranty: '180 Days Full Replacement Warranty',
    description: 'Solve rapid battery draining, random shutdowns, and sluggish performance with fresh cycle-0 high density certified batteries.',
    includes: ['Cycle-0 Fresh Manufacturing Batch', 'Battery Health & Cycle Count Reset', 'Safe Battery Adhesive Tab Pull', 'Old Battery Safe Disposal'],
    popular: true,
    status: true
  },
  {
    id: 'srv-3',
    name: 'Micro-soldering & Motherboard IC Logic Repair',
    category: 'Motherboard & Micro-soldering',
    price: 1499,
    duration: '2–4 Hours',
    warranty: '90 Days Bench Warranty',
    description: 'Level-4 microscopic hardware repair for Dead phones, No Power, Audio IC issues, Baseband / Network search failure, and Short Circuits on PCB lines.',
    includes: ['Trinocular Microscope Inspection', 'Thermal Camera Short Circuit Detection', 'OEM IC Chip Replacement & Reballing', 'Pre & Post Voltage Stability Test'],
    popular: true,
    status: true
  },
  {
    id: 'srv-4',
    name: 'Emergency Liquid & Water Damage Ultrasonic Rescue',
    category: 'Diagnostics & Recovery',
    price: 799,
    duration: '1–2 Hours',
    warranty: 'Tested Under Load',
    description: 'Immediate ultrasonic bath chemical wash to dissolve mineral oxidation, prevent motherboard corrosion, and rescue precious photos and contacts.',
    includes: ['Complete Device Teardown', '99.9% Isopropyl Ultrasonic Bath', 'Deoxidation & Anti-Rust Treatment', 'Data Integrity & Board Recovery'],
    popular: true,
    status: true
  },
  {
    id: 'srv-5',
    name: 'USB-C / Lightning Port & Mic Sub-Board Replacement',
    category: 'Ports & Audio',
    price: 699,
    duration: '20–30 Mins',
    warranty: '90 Days Warranty',
    description: 'Fix loose charging cables, slow charging, distorted microphone in calls, or moisture detected in charging port errors.',
    includes: ['OEM Sub-Board & Mic Flex Strip', 'Fast Charging (PD/SuperVOOC) Verified', 'Loudspeaker & Mic Acoustic Test', 'Port Dust Protection Gasket'],
    popular: false,
    status: true
  },
  {
    id: 'srv-6',
    name: 'Rear Camera Module & Sapphire Lens Glass Replacement',
    category: 'Camera & Optics',
    price: 899,
    duration: '30–45 Mins',
    warranty: '90 Days Warranty',
    description: 'Fix cracked rear camera glass, blurry focus, shaking OIS optical stabilizer, or laser autofocus sensor issues.',
    includes: ['Optical Grade Sapphire Glass Fitting', 'Sensor Clean Room Dust Removal', 'OIS & Autofocus Calibration', 'Macro & Wide-Angle QA Check'],
    popular: false,
    status: true
  }
];

export const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Rahul Sharma',
    rating: 5,
    date: '14 Sep 2026',
    service: 'Screen Replacement',
    device: 'iPhone 13 Pro',
    comment: 'Pushpendra bhai fixed my iPhone 13 Pro shattered display in just 35 minutes right in front of me at Sony Dharmshala store! Colors and 120Hz ProMotion are 100% genuine. Outstanding service!',
    verified: true,
    pinned: true
  },
  {
    id: 'rev-2',
    name: 'Pooja Deshmukh',
    rating: 5,
    date: '12 Sep 2026',
    service: 'Water Damage Rescue',
    device: 'Samsung S22 Ultra',
    comment: 'Phone fell in water during rain and wouldn\'t turn on. Authorized service center quoted 32,000 for board swap. Chhaya Mobiles recovered my phone and all photos for just 1,800! Pure magic.',
    verified: true,
    pinned: true
  },
  {
    id: 'rev-3',
    name: 'Amit Kulkarni',
    rating: 5,
    date: '08 Sep 2026',
    service: 'Pre-Owned Phone Purchase',
    device: 'OnePlus 11R',
    comment: 'Bought a pre-owned OnePlus 11R from Chhaya Mobiles. The condition was literally mint with 100W SuperVOOC charger in the original box. Very transparent testing and fair pricing.',
    verified: true,
    pinned: true
  },
  {
    id: 'rev-4',
    name: 'Sneha Patel',
    rating: 5,
    date: '02 Sep 2026',
    service: 'Battery Replacement',
    device: 'iPhone 11',
    comment: 'Got my battery replaced. Maximum capacity back to 100% and backup lasts all day again. Super polite staff and fast turnaround.',
    verified: true,
    pinned: false
  },
  {
    id: 'rev-5',
    name: 'Vikram Joshi',
    rating: 5,
    date: '28 Aug 2026',
    service: 'Charging Port Repair',
    device: 'Realme GT Neo 3',
    comment: 'Fast charging wasn\'t working. Repaired in 20 minutes with original sub-board. Highly recommended shop in Chitrakoot!',
    verified: true,
    pinned: false
  }
];
