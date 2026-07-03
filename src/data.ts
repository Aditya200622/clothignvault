import { Product } from './types';

// ─── Indian Women's Western Fashion Categories ───────────────────────────────
export const CATEGORIES = [
  {
    id: 'dresses',
    name: 'Dresses',
    description: 'Elegant dresses for every occasion — from casual day-out to grand celebration.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    count: 14
  },
  {
    id: 'co-ord-sets',
    name: 'Co-ord Sets',
    description: 'Perfectly matched co-ordinated sets that keep you effortlessly stylish.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
    count: 10
  },
  {
    id: 'tops',
    name: 'Tops & Shirts',
    description: 'Trendy tops and shirts crafted for the modern Indian woman.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
    count: 18
  },
  {
    id: 'blazers',
    name: 'Blazers & Jackets',
    description: 'Power dressing redefined — structured blazers for office and events.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    count: 8
  }
];

// ─── Products ─────────────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id: 'v1-velvet-gown',
    sku: 'CV-001',
    stock: 25,
    name: 'Atelier Off-Shoulder Velvet Gown',
    price: 3799,
    originalPrice: 4499,
    rating: 4.9,
    reviewsCount: 34,
    category: 'dresses',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A masterpiece of structural tailoring. Features a sculpted sweetheart neck, heavy-brushed velvet, and side ruched drapery that accentuates the hourglass silhouette. Perfect for weddings, receptions, and premium soirées.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Onyx Black', hex: '#0B0B0C' },
      { name: 'Royal Plum', hex: '#2E1A47' }
    ],
    material: '80% heavy velvet, 20% premium satin lining.',
    care: 'Dry clean only. Store on padded garment hangers.',
    details: [
      'Sculpted off-shoulder neckline with internal non-slip grip band',
      'Fully lined with buttery soft stretch satin',
      'Concealed ultra-glide back zipper closure',
      'Elegant side split with hand-finished stitch lines'
    ],
    reviews: [
      {
        id: 'r1',
        user: 'Priya Sharma',
        rating: 5,
        comment: 'Wore this to my cousin\'s wedding reception. Got endless compliments! The velvet quality is absolutely top-notch.',
        date: '2026-05-12'
      },
      {
        id: 'r2',
        user: 'Nandini Menon',
        rating: 4.8,
        comment: 'Beautiful lining. Ordered size S and fits like a glove. Size runs true — measure yourself accurately.',
        date: '2026-05-18'
      }
    ]
  },
  {
    id: 'v3-lavender-slip',
    sku: 'CV-002',
    stock: 18,
    name: 'Aura Satin Slip Midi Dress — Lavender',
    price: 2399,
    originalPrice: 2899,
    rating: 5.0,
    reviewsCount: 41,
    category: 'dresses',
    tag: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'An elegant bias-cut satin slip dress glowing with light lavender undertones. It flows effortlessly down the figure, ideal for cocktail parties, engagement functions, and date nights.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Lavender Mist', hex: '#CBD5E1' },
      { name: 'Champagne Satin', hex: '#E2E8F0' }
    ],
    material: '92% heavy satin, 8% Lycra for comfort stretch.',
    care: 'Delicate hand wash in cold water or dry clean. Low-steam only.',
    details: [
      'Premium weight satin bias-cut drape',
      'Adjustable gold hardware strap slides',
      'Double lined cowl bust line for non-sheer security',
      'Mid-calf luxury midi length'
    ],
    reviews: [
      {
        id: 'r4',
        user: 'Kavya Iyer',
        rating: 5,
        comment: 'The quality of the satin is amazing. Not thin or see-through. Hugs the curves flawlessly. Will order again!',
        date: '2026-05-01'
      }
    ]
  },
  {
    id: 'v8-sequin-party',
    sku: 'CV-003',
    stock: 25,
    name: 'Midnight Sparkle Sequin Party Gown',
    price: 3399,
    originalPrice: 3950,
    rating: 4.9,
    reviewsCount: 45,
    category: 'dresses',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1549064482-6779ba3292fe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A stellar dress for the modern Indian woman. Adorned with hand-stitched premium micro-sequins that catch and refract light beautifully. Perfect for sangeet, cocktail parties, and new year celebrations.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Midnight Purple Sequin', hex: '#4A148C' },
      { name: 'Prism Black Sequin', hex: '#212121' }
    ],
    material: 'Breathable micro-net base fabric with stitched glass sequins.',
    care: 'Delicate hand soak only. Do not machine wash or wring.',
    details: [
      'Inner double-stretch cooling mesh jersey lining',
      'Low plunging open backline with dainty thin supporting cords',
      'Seamless flat heat-pressed hemlines',
      'Stunning glitter response under party lights'
    ],
    reviews: [
      {
        id: 'r9',
        user: 'Simran Kaur',
        rating: 5,
        comment: 'Wore this at a sangeet function — looked absolutely stunning! The way it reflects light is just magical. True showstopper!',
        date: '2026-05-19'
      }
    ]
  },
  {
    id: 'v6-power-blazer',
    sku: 'CV-004',
    stock: 16,
    name: 'Power Dressing Hourglass Blazer',
    price: 3099,
    originalPrice: 3699,
    rating: 4.8,
    reviewsCount: 31,
    category: 'blazers',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A sharp statement blazer designed for power dressing. Dramatic padded shoulders, custom gold hardware, and extreme tailored darts create an elegant hourglass look — perfect for corporate boardrooms and premium events.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Onyx Midnight', hex: '#111827' },
      { name: 'Monaco Cream', hex: '#F9FAFB' }
    ],
    material: '62% worsted wool, 35% polyester, 3% elastane lining.',
    care: 'Professional dry clean only.',
    details: [
      'Structured padded shoulders with internal canvas backing',
      'Satin shawl collar lapel with deep plunge chest angle',
      'Flapless pocket slits for clean structural modern look',
      'Sleeve cuff premium slits with working functional vents'
    ],
    reviews: [
      {
        id: 'r7',
        user: 'Ananya Verma',
        rating: 4.8,
        comment: 'Unbelievable shoulder structure! It gives you immediate confidence and presence. The wool blend has zero wrinkles.',
        date: '2026-05-02'
      }
    ]
  },
  {
    id: 'v4-leather-trench',
    sku: 'CV-005',
    stock: 12,
    name: 'Obsidian Hourglass Vegan Leather Jacket',
    price: 5199,
    originalPrice: 5999,
    rating: 4.7,
    reviewsCount: 19,
    category: 'blazers',
    tag: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Crafted with buttery-soft vegan PU leather, a wide lapel collar, and a signature chunky double belt that pinches the waist into a striking hourglass outline. A statement piece for every fashion-forward woman.',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Bespoke Onyx', hex: '#0B0B0C' },
      { name: 'Espresso Brown', hex: '#3E2723' }
    ],
    material: 'Ultra-soft polyurethane vegan leather with full cupro lining.',
    care: 'Wipe clean with a damp microfiber cloth. Do not apply dry heat.',
    details: [
      'Deep functional button-flap side pockets',
      'Padded sharp shoulders for strong structural presence',
      'Satin-touch inner lining with signature pattern',
      'Removable wide utility waist belt'
    ],
    reviews: [
      {
        id: 'r5',
        user: 'Meghna Joshi',
        rating: 4.9,
        comment: 'This jacket is a showstopper! The stitching is perfect, and the PU leather is soft, not stiff at all. Love it!',
        date: '2026-05-14'
      }
    ]
  },
  {
    id: 'v9-floraltop',
    sku: 'CV-006',
    stock: 30,
    name: 'Bloom Floral Print Wrap Top',
    price: 1299,
    originalPrice: 1599,
    rating: 4.6,
    reviewsCount: 28,
    category: 'tops',
    tag: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A beautiful floral print wrap top that ties at the waist for a flattering fit. Ideal for brunch outings, office casual Fridays, and weekend getaways. Pairs beautifully with wide-leg trousers or jeans.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pastel Pink Floral', hex: '#FBCFE8' },
      { name: 'Ivory White', hex: '#FAFAF9' }
    ],
    material: '100% breathable rayon crepe.',
    care: 'Gentle machine wash cold or hand wash. Hang to dry.',
    details: [
      'Adjustable self-tie waist wrap for custom fit',
      'V-neckline with subtle ruffle trim',
      'Side seam pockets',
      'Lightweight, perfect for Indian summers'
    ],
    reviews: [
      {
        id: 'r10',
        user: 'Riya Bhatia',
        rating: 4.7,
        comment: 'So pretty! The fabric is super soft and the fit is very flattering. I wore this for a brunch and got many compliments.',
        date: '2026-06-01'
      }
    ]
  },
  {
    id: 'v10-coordset',
    sku: 'CV-007',
    stock: 20,
    name: 'Sage Linen Co-ord Set — Crop Top & Trousers',
    price: 2799,
    originalPrice: 3299,
    rating: 4.8,
    reviewsCount: 36,
    category: 'co-ord-sets',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A stunning sage linen co-ord set featuring a cropped buttoned top and wide-leg trousers with an elasticated waist. The ultimate effortless outfit for brunches, casual outings, and travel. Breathable linen keeps you cool all day.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sage Green', hex: '#84A98C' },
      { name: 'Dusty Rose', hex: '#D4A5A5' }
    ],
    material: '100% premium washed linen.',
    care: 'Machine wash cold, gentle cycle. Iron on medium heat while slightly damp.',
    details: [
      'Cropped top with mother-of-pearl buttons',
      'Wide-leg trousers with elasticated waistband',
      'Sold as a set — mix and match separately',
      'Pre-washed for softness, minimal shrinkage'
    ],
    reviews: [
      {
        id: 'r11',
        user: 'Shruti Patel',
        rating: 5,
        comment: 'Best purchase! The sage colour is so beautiful and the linen quality is premium. Wore it for a family gathering and felt amazing!',
        date: '2026-06-05'
      }
    ]
  },
  {
    id: 'v11-shirttop',
    sku: 'CV-008',
    stock: 22,
    name: 'Classy Striped Oversized Shirt',
    price: 1599,
    originalPrice: 1999,
    rating: 4.5,
    reviewsCount: 24,
    category: 'tops',
    tag: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A classic oversized striped shirt that can be worn as a top, thrown over a dress, or knotted at the waist. Versatile, breezy, and incredibly chic — your new wardrobe staple.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Classic Navy Stripe', hex: '#1E3A5F' },
      { name: 'Soft Blush Stripe', hex: '#F4A7B9' }
    ],
    material: '100% cotton poplin.',
    care: 'Machine wash warm. Tumble dry low. Iron if needed.',
    details: [
      'Relaxed oversized fit with dropped shoulders',
      'Long sleeves with button cuffs — can roll up',
      'Full button placket front',
      'Split hem for style versatility'
    ],
    reviews: [
      {
        id: 'r12',
        user: 'Tanya Malhotra',
        rating: 4.5,
        comment: 'Such a versatile piece! I wear it as a beach cover-up, then knot it as a top. Great quality cotton.',
        date: '2026-06-10'
      }
    ]
  }
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: 't1',
    user: 'Diya Kapoor',
    role: 'Fashion Stylist, Mumbai',
    quote: "ClothingVault has completely transformed my wardrobe. The quality of the dresses and co-ord sets rivals premium boutiques in Bandra, but at a fraction of the price. Every piece I\'ve ordered has been absolutely stunning!",
    avatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=300&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't2',
    user: 'Ritika Singhania',
    role: 'Entrepreneur & Influencer, Delhi',
    quote: "The packaging, the fabric quality, and the overall experience is world-class. I ordered the velvet gown for my best friend\'s wedding and it was a showstopper! Delivery was also super fast — 2 days!",
    avatar: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=300&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't3',
    user: 'Pooja Nair',
    role: 'Content Creator, Bengaluru',
    quote: "Finally a brand that understands the modern Indian woman\'s sense of style. The linen co-ord set I ordered fits like a dream and the customer service responded under an hour. Outstanding experience!",
    avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=300&auto=format&fit=crop',
    rating: 5
  }
];

// ─── Instagram Posts ──────────────────────────────────────────────────────────
export const INSTAGRAM_POSTS = [
  { id: 'i1', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop', likes: '1.4k' },
  { id: 'i2', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop', likes: '2.5k' },
  { id: 'i3', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop', likes: '891' },
  { id: 'i4', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop', likes: '3.1k' },
  { id: 'i5', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop', likes: '4.2k' },
  { id: 'i6', url: 'https://images.unsplash.com/photo-1549064482-6779ba3292fe?q=80&w=400&auto=format&fit=crop', likes: '1.8k' }
];
