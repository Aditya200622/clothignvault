import { Product } from './types';

export const CATEGORIES = [
  {
    id: 'atelier-dresses',
    name: 'Atelier Dresses',
    description: 'Sculptical silhouettes, premium silk, and statement night-out gowns.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    count: 14
  },
  {
    id: 'luxury-streetwear',
    name: 'Luxury Streetwear',
    description: 'Oversized luxury hoodies, distress heavy cargo, and utility jackets.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    count: 18
  },
  {
    id: 'minimal-knits',
    name: 'Minimal Knits & Loungewear',
    description: 'Cozy brushed cashmere, slouchy aesthetic cardigans, and premium lounge sets.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
    count: 12
  },
  {
    id: 'tailored-outerwear',
    name: 'Tailored Outerwear',
    description: 'Heavy blazers, sharp shoulders, and double-breasted leather trench coats.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    count: 9
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'v1-atelier-velvet',
    name: 'Atelier Off-Shoulder Velvet Gown',
    price: 380,
    originalPrice: 450,
    rating: 4.9,
    reviewsCount: 34,
    category: 'atelier-dresses',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A masterpiece of structural tailoring. Features a sculpted sweetheart neck, heavy-bushed Italian silk velvet, and side ruched drapery that accents the hourglass silhouette. Meshki and House of CB inspired elegance.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Onyx Black', hex: '#0B0B0C' },
      { name: 'Royal Plum', hex: '#2E1A47' }
    ],
    material: '80% heavy Italian velvet, 20% premium Mulberry silk lining.',
    care: 'Dry clean only by luxury apparel specialist. Store on padded garment hangers.',
    details: [
      'Sculpted off-shoulder neckline with internal non-slip grip band',
      'Fully lined with buttery soft stretch satin',
      'Concealed ultra-glide back zipper closure',
      'High-thigh elegant side split with hand-finished stitch lines'
    ],
    reviews: [
      {
        id: 'r1',
        user: 'Elena Rostova',
        rating: 5,
        comment: 'Absolutely breathtaking! The structured corsetry inside holds everything beautifully. It literally screams luxury. Got endless compliments at the gala.',
        date: '2026-05-12'
      },
      {
        id: 'r2',
        user: 'Mia Thorne',
        rating: 4.8,
        comment: 'Beautiful silk lining. I ordered size S and fits like a glove. Note: has almost no stretch, so measure yourself accurately.',
        date: '2026-05-18'
      }
    ]
  },
  {
    id: 'v2-cyber-street-hoodie',
    name: 'Cybernetic Oversized Loop Hoodie',
    price: 165,
    rating: 4.8,
    reviewsCount: 52,
    category: 'luxury-streetwear',
    tag: 'Oversized',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549064482-6779ba3292fe?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Engineered lounge street luxury. This hyper-heavyweight 520GSM French Terry hoodie features a modern crop-oversized boxy cut, seamless dropped shoulders, and subtle distressed metallic custom Vault rivets on the back collar.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cyber Charcoal', hex: '#1C1B1F' },
      { name: 'Neon Lavender', hex: '#63447F' },
      { name: 'Chalk White', hex: '#F3F4F6' }
    ],
    material: '100% Organic Cotton French Terry, heavy fabric weight.',
    care: 'Cold wash inside out. Air dry flat to maximize logo texture preservation.',
    details: [
      'Pre-shrunk and double garment-dyed for vintage look',
      'Hidden seamless kangaroo pocket on waist side-seams',
      'Double-ply hood without drawstring for minimal cyber presentation',
      'Embossed signature tonal Vault monogram'
    ],
    reviews: [
      {
        id: 'r3',
        user: 'Zara Kapoor',
        rating: 5,
        comment: 'So heavy! It is genuinely a premium streetwear weight. The lavender hue is subtle and extremely beautiful in natural lighting.',
        date: '2026-04-20'
      }
    ]
  },
  {
    id: 'v3-lavender-slip',
    name: 'Aura Silk Slip Dress in Lavender Glow',
    price: 240,
    originalPrice: 290,
    rating: 5.0,
    reviewsCount: 41,
    category: 'atelier-dresses',
    tag: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'An elegant bias-cut silk slip dress glowing with light lavender undertones. Radiating luxury, it flows effortlessly down the figure, providing a celestial glow under ambient evening lounge lighting.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Lavender Mist', hex: '#CBD5E1' },
      { name: 'Champagne Satin', hex: '#E2E8F0' }
    ],
    material: '92% heavy silk satin, 8% Lycra for comfort-yielding stretch.',
    care: 'Delicate hand wash in cold water or dry clean. Low-steam only.',
    details: [
      'Premium weight real silk bias-cut drape',
      'Adjustable gold hardware strap slides',
      'Double lined cowl bust line for absolute non-sheer security',
      'Mid-calf luxury midi length'
    ],
    reviews: [
      {
        id: 'r4',
        user: 'Sophie Mercer',
        rating: 5,
        comment: 'The quality of the silk is amazing. Not thin or see through like cheap dresses. Hugs the curves flawlessly.',
        date: '2026-05-01'
      }
    ]
  },
  {
    id: 'v4-leather-trench',
    name: 'Obsidian Hourglass Leather Trench Coat',
    price: 520,
    rating: 4.7,
    reviewsCount: 19,
    category: 'tailored-outerwear',
    tag: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Inspired by metropolitan streetwear runways. Tailored with buttery-soft vegan PU leather, a wide lapel collar, and a signature chunky double belt that pinches the waist into a striking dramatic structural hourglass outline.',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Bespoke Onyx', hex: '#0B0B0C' },
      { name: 'Espresso Glaze', hex: '#3E2723' }
    ],
    material: 'Exclusive ultra-soft polyurethane leather coat with full cupro lining.',
    care: 'Wipe clean with a damp luxury microfiber cloth. Do not apply dry heat.',
    details: [
      'Deep functional button-flap side pockets',
      'Padded sharp shoulders for strong structural presence',
      'Satin-touch inner lining with signature Vault pattern',
      'Removable extra-wide utility harness waist belt'
    ],
    reviews: [
      {
        id: 'r5',
        user: 'Karolina W.',
        rating: 4.9,
        comment: 'This trench makes me feel like a literal matrix heroine. Stitches are perfect, and the PU synthetic leather is soft, not stiff.',
        date: '2026-05-14'
      }
    ]
  },
  {
    id: 'v5-cashmere-knit',
    name: 'Clara Slouchy Cashmere Knit Cardigan Suite',
    price: 295,
    originalPrice: 350,
    rating: 4.9,
    reviewsCount: 28,
    category: 'minimal-knits',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Unrivaled comfort meets high-end minimalism. Handknitted from Grade-A Mongolian cashmere with a high ribbed waistband and balloon-draped puff sleeves for cozy, yet curated style.',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Cozy Oatmeal', hex: '#D1CAAA' },
      { name: 'Shadow Charcoal', hex: '#2D3748' }
    ],
    material: '100% Pure Mongolian Cashmere, handspun yarn.',
    care: 'Dry clean only or cold wash with specialty wool detergent. Lay flat on dry towel.',
    details: [
      'Thick chunky ribs with modern double knitted cuffs',
      'Custom real horn logo buttons dyed to match fabric tone',
      'Balloon drop silhouette for relaxed slouch look',
      'Ultra breathable, thermally-insulating'
    ],
    reviews: [
      {
        id: 'r6',
        user: 'Aria Sinclair',
        rating: 5,
        comment: 'The softest thing in my wardrobe. Literally feels like wearing a cloud. Handwash took a while but worth keeping this cashmere perfect!',
        date: '2026-05-11'
      }
    ]
  },
  {
    id: 'v6-broad-blazer',
    name: 'Bespoke Atelier Hourglass Blazer',
    price: 310,
    rating: 4.8,
    reviewsCount: 31,
    category: 'tailored-outerwear',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A sharp statement blazer designed for power dressing. Dramatic padded pagoda shoulders, custom gold hardware locks, and extreme tailored darts create an elegant and high-prestige hourglass look.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Onyx Midnight', hex: '#111827' },
      { name: 'Monaco Cream', hex: '#F9FAFB' }
    ],
    material: '62% luxury worsted wool, 35% polyester, 3% elastane lining.',
    care: 'Professional dry clean only.',
    details: [
      'Structured padded pagoda shoulders with internal canvas backing',
      'Satin shawl collar lapel with deep plunge chest angle',
      'Flapless pocket slits for clean structural modern look',
      'Sleeve cuff premium slits with working functional vents'
    ],
    reviews: [
      {
        id: 'r7',
        user: 'Valerie Pierce',
        rating: 4.8,
        comment: 'Unbelievable shoulder structure! It gives you immediate posture and status. The linen-wool blend has zero wrinkles.',
        date: '2026-05-02'
      }
    ]
  },
  {
    id: 'v7-cargo-denim',
    name: 'Distressed Heavy Utility Cargo Denim',
    price: 185,
    rating: 4.6,
    reviewsCount: 22,
    category: 'luxury-streetwear',
    tag: 'Oversized',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549064482-6779ba3292fe?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Urban luxury utility. Built with 14oz non-stretch Japanese selvedge denim, featuring extreme enzyme wash weathering, multi-pocket tactical utility cargo flaps, and dynamic adjust waist metal straps.',
    sizes: ['24', '26', '28', '30'],
    colors: [
      { name: 'Enzyme Mineral Wash', hex: '#6B7280' },
      { name: 'Dust-Stained Violet', hex: '#4C1D95' }
    ],
    material: '100% Selvedge Japanese Denim Cotton, heavy wash.',
    care: 'Wash cold inside out. To maintain aesthetic distressing, avoid fabric softeners.',
    details: [
      'Heavy-duty ykk zipper with custom denim fly wrap button fastening',
      'Utility tactical layout with 6 deep pocket systems',
      'Dynamic velcro tab bottom cuffs for variable straight/taper fitting',
      'Hand-distressed distress lines throughout thighs'
    ],
    reviews: [
      {
        id: 'r8',
        user: 'Natasha D.',
        rating: 4.7,
        comment: 'Perfect oversized streetwear fit. Heavy weight denim draping on sneakers is ideal. Highly recommend adjusting the bottom tab!',
        date: '2026-05-04'
      }
    ]
  },
  {
    id: 'v8-sequin-mini',
    name: 'Midnight Sparkle Sequin Silhouette Gown',
    price: 340,
    originalPrice: 395,
    rating: 4.9,
    reviewsCount: 45,
    category: 'atelier-dresses',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1549064482-6779ba3292fe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A stellar dress for VIP girls. Adorned with hand-stitched premium micro-sequins engineered to catch and refract light across purple, lavender and deep black spectra. Slip inside and glow on the VIP list.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Midnight Purple Sequin', hex: '#4A148C' },
      { name: 'Prism Black Sequin', hex: '#212121' }
    ],
    material: 'Breathable micro-net base fabric with 1000s of stitched glass sequins.',
    care: 'Delicate hand soak only. Do not machine wash or squeeze.',
    details: [
      'Inner double-stretch cooling mesh jersey lining',
      'Low plunging open backline with dainty thin supporting cords',
      'Seamless flat heat-pressed hemlines',
      'Luxurious glitter response in dynamic night-club ambient states'
    ],
    reviews: [
      {
        id: 'r9',
        user: 'Jade Miller',
        rating: 5,
        comment: 'This dress is literally insane. The way it reflects purple and gold glint in the club is just... expensive. True showstopper!',
        date: '2026-05-19'
      }
    ]
  }
];

export const TESTIMONIALS = [
  {
    id: 't1',
    user: 'Cassandra Sterling',
    role: 'Fashion Stylist & Model',
    quote: "ClothingVault has revolutionized my luxury streetwear wardrobe. The heavy 520GSM hoodies and tailoring rival high-tier Milan fashion houses, but with an edgy western aesthetic that speaks to this generation.",
    avatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=300&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't2',
    user: 'Victoria Chen',
    role: 'Creative Director',
    quote: "The styling, fast checkout, and absolute weight of the materials from ClothingVault are masterclass levels. The dark purple and deep black styling details in the Atelier dresses make every unboxing feel like a boutique opening.",
    avatar: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=300&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't3',
    user: 'Giselle Laurent',
    role: 'VIP Digital Influencer',
    quote: "They really nailed modern luxury fits. Streetwear pants that don't bunch, slips that drape like liquid wine, and customer service that answers under an hour. Outstanding luxury shopping experience.",
    avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=300&auto=format&fit=crop',
    rating: 5
  }
];

export const INSTAGRAM_POSTS = [
  { id: 'i1', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop', likes: '1.4k' },
  { id: 'i2', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop', likes: '2.5k' },
  { id: 'i3', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop', likes: '891' },
  { id: 'i4', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop', likes: '3.1k' },
  { id: 'i5', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop', likes: '4.2k' },
  { id: 'i6', url: 'https://images.unsplash.com/photo-1549064482-6779ba3292fe?q=80&w=400&auto=format&fit=crop', likes: '1.8k' }
];
