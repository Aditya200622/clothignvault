import React, { useState } from 'react';
import { Sparkles, ArrowRight, Star, Heart, Instagram, ChevronDown, Check, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, TESTIMONIALS, INSTAGRAM_POSTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import FashionShowcase from '../components/FashionShowcase';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedProductId: (id: string) => void;
  wishlist: Product[];
  onWishlistToggle: (productId: string) => void;
  onQuickAdd: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function HomeView({
  setCurrentTab,
  setSelectedProductId,
  wishlist,
  onWishlistToggle,
  onQuickAdd
}: HomeViewProps) {
  // Category state selector
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Available interactive categories
  const categoriesList = [
    { id: 'All', label: 'All', icon: '🎨' },
    { id: 'atelier-dresses', label: 'Dresses', icon: '👗' },
    { id: 'luxury-streetwear', label: 'T-shirts', icon: '👕' },
    { id: 'denim', label: 'Denim', icon: '👖' },
    { id: 'tailored-outerwear', label: 'Jackets', icon: '🧥' },
    { id: 'coats', label: 'Coats', icon: '🧥' },
    { id: 'shoes', label: 'Shoes', icon: '👟' }
  ];

  // Map category tab selection to product types or mocked catalogs for a lively display
  const getFilteredProducts = () => {
    if (selectedCategory === 'All') return PRODUCTS;
    // Map internal categories
    if (selectedCategory === 'atelier-dresses') {
      return PRODUCTS.filter(p => p.category === 'atelier-dresses' || p.name.includes('Dress') || p.name.includes('Gown'));
    }
    if (selectedCategory === 'luxury-streetwear') {
      return PRODUCTS.filter(p => p.category === 'luxury-streetwear' || p.name.includes('Hoodie') || p.name.includes('T-shirt') || p.name.includes('Knit'));
    }
    if (selectedCategory === 'denim') {
      return PRODUCTS.filter(p => p.category === 'luxury-streetwear' && (p.name.includes('Denim') || p.name.includes('Cargo') || p.name.includes('Pants')));
    }
    if (selectedCategory === 'tailored-outerwear') {
      return PRODUCTS.filter(p => p.category === 'tailored-outerwear' || p.name.includes('Blazer'));
    }
    if (selectedCategory === 'coats') {
      return PRODUCTS.filter(p => p.name.includes('Trench') || p.name.includes('Coat') || p.category === 'tailored-outerwear');
    }
    if (selectedCategory === 'shoes') {
      // Just supply a few products to present interactive responsiveness
      return PRODUCTS.slice(2, 6);
    }
    return PRODUCTS;
  };

  const filteredProducts = getFilteredProducts().slice(0, 8); // Showing top 8 cards corresponding to reference layout structure

  const handleProductCardClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentTab('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // List of stylish categories row ("Premium Shades") above the product grid
  const premiumShades = [
    {
      title: 'Women Gallery',
      bgColor: 'bg-rose-150',
      textColor: 'text-rose-900',
      btnText: 'Click Now',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop',
      action: 'shop'
    },
    {
      title: 'Children Fashion',
      bgColor: 'bg-[#FEF08A]', // Amber-100 tint
      textColor: 'text-amber-900',
      btnText: 'Explore',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=400&auto=format&fit=crop',
      action: 'shop'
    },
    {
      title: "Men's Fashion",
      bgColor: 'bg-[#F2E8E5]', // Grayish rose
      textColor: 'text-neutral-800',
      btnText: 'View Series',
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=400&auto=format&fit=crop',
      action: 'shop'
    },
    {
      title: "Women's Fashion",
      bgColor: 'bg-[#E5D5C5]', // Brownish cream
      textColor: 'text-[#5C4033]',
      btnText: 'Curated Look',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop',
      action: 'shop'
    }
  ];

  return (
    <div className="w-full page-enter-fade">
      
      {/* 1. HERO ENVELOPE: LARGE ROUNDED RED/CORAL CONTAINER EXACTLY AS THE REFERENCE IMAGE */}
      <div className="mx-4 sm:mx-6 lg:mx-8 mt-2 mb-16 rounded-[2.5rem] bg-gradient-to-br from-[#F23847] via-[#FF5462] to-[#EE3544] text-white p-6 sm:p-12 relative overflow-hidden shadow-xl">
        
        {/* Soft moving background custom blobs for soft shifting gradient feel */}
        <motion.div
          animate={{
            x: [-40, 40, -40],
            y: [-30, 30, -30],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: [30, -30, 30],
            y: [40, -40, 40],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-16 right-8 w-96 h-96 rounded-full bg-rose-400/25 blur-3xl pointer-events-none"
        />

        {/* Ambient floating sparkles/light particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            initial={{ 
              x: Math.random() * 800, 
              y: Math.random() * 400, 
              opacity: 0.1, 
              scale: Math.random() * 0.6 + 0.4 
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.15, 0.75, 0.15],
            }}
            transition={{
              duration: 6 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute h-1.5 w-1.5 bg-white rounded-full pointer-events-none"
            style={{
              left: `${8 + i * 11}%`,
              top: `${15 + i * 10}%`,
              boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8)",
            }}
          />
        ))}

        {/* Background circular decoration elements as visible in reference style */}
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[42vw] h-[42vw] max-w-[500px] max-h-[500px] rounded-full bg-[#E11D48]/30 blur-xs border border-white/5 pointer-events-none hidden md:block" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="md:col-span-7 space-y-6 sm:space-y-8 text-left py-4 sm:py-8">
            
            {/* Promo subtext line with scale-up reveal */}
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.95, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="font-sans font-bold text-[10.5px] sm:text-xs uppercase tracking-[0.2em] text-[#FFF] opacity-90 bg-white/10 px-4 py-1.5 rounded-full inline-block border border-white/10"
            >
              Exclusive Offer 20% off This Week
            </motion.span>
 
            {/* Absolute EXACT Title layout - Highly cinematic & luxurystyled Vogue mix */}
            <h1 className="select-none tracking-tight text-white leading-[0.9] text-left">
              <span className="overflow-hidden block py-1">
                <motion.span 
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-sans font-light tracking-[0.16em] uppercase text-rose-100 text-3xl sm:text-5xl lg:text-[4rem] mb-1 sm:mb-2"
                >
                  Stylish
                </motion.span>
              </span>
              <span className="overflow-hidden block py-1">
                <motion.span 
                  initial={{ opacity: 0, y: 45 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-serif italic font-extrabold text-[2.75rem] sm:text-[4.5rem] lg:text-[5.5rem] tracking-tight text-white"
                >
                  Female Clothes
                </motion.span>
              </span>
            </h1>
 
            {/* Description matching verbatim */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.95, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="font-sans text-sm sm:text-base text-rose-50 max-w-md font-medium leading-relaxed"
            >
              Made from Soft, Durable, US-grown Supima Cotton.
            </motion.p>
 
            {/* Action controls from the image: Select category + Shop now Pill */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 max-w-md">
              
              {/* Category selector Pill */}
              <div className="relative flex-1">
                <motion.button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-white/20 border border-white/30 rounded-full px-5 py-3.5 text-[10.5px] font-bold uppercase tracking-widest flex items-center justify-between transition-colors duration-250 cursor-pointer text-left"
                >
                  <span>{selectedCategory === 'All' ? 'Select Category' : selectedCategory.replace('-', ' ')}</span>
                  <ChevronDown className="h-4 w-4 text-white opacity-80" />
                </motion.button>
 
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden z-20 text-gray-800"
                    >
                      {categoriesList.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold border-b border-rose-50/50 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                          {selectedCategory === cat.id && <Check className="h-3.5 w-3.5 text-rose-500" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
 
              {/* Shop now button Pill with stunning hover glow */}
              <motion.button
                onClick={() => {
                  setCurrentTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 0 25px 8px rgba(255, 255, 255, 0.75)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-rose-600 font-extrabold text-[11px] uppercase tracking-[0.25em] px-8 py-4 rounded-full shadow-lg text-center cursor-pointer flex-shrink-0 transition-transform duration-350"
              >
                Shop Now
              </motion.button>
            </div>
 
            {/* Overlapping customer micro feedback widget - from image with reveal */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-flex items-center gap-4 bg-white/10 hover:bg-white/15 border border-white/10 p-3.5 rounded-[1.5rem] select-none text-left shadow-sm"
            >
              <div className="flex -space-x-3">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-rose-500 object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
                  alt="Customer Review Portrait 1"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-rose-500 object-cover"
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=150&auto=format&fit=crop"
                  alt="Customer Review Portrait 2"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-rose-500 object-cover"
                  src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=150&auto=format&fit=crop"
                  alt="Customer Review Portrait 3"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-extrabold text-white">Our Happy Customer</p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="flex text-amber-300 text-xs text-luxury">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <span className="text-[10px] text-rose-100 font-mono font-bold">4.8 (453k Reviews)</span>
                </div>
              </div>
            </motion.div>
 
            {/* Bottom Info line from reference */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="text-xs pt-4 border-t border-white/15 text-rose-50 flex items-center gap-2"
            >
              <span>Not Yet Member?</span>
              <button 
                onClick={() => {
                  setCurrentTab('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="bg-white/15 hover:bg-white/20 border border-white/20 font-bold px-4 py-1.5 rounded-full uppercase tracking-wider text-[10px] text-white cursor-pointer transition-colors"
              >
                Sign Up Now
              </button>
            </motion.div>
 
          </div>
 
          {/* Right Image Circle with interactive floating oscillations & zoom transitions */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -12, 0]
            }}
            transition={{
              opacity: { duration: 0.95 },
              scale: { duration: 0.95 },
              y: { 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }
            }}
            className="md:col-span-5 relative flex justify-center items-center py-6"
          >
            <div className="relative w-72 sm:w-85 lg:w-96 aspect-square rounded-full bg-[#E11D48]/35 border border-white/10 shadow-2xl flex items-center justify-center">
              {/* model image on a coral circle backdrop with mount zoom */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 overflow-hidden shadow-inner">
                <motion.img
                  initial={{ scale: 1.25 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                  alt="Main smiling model"
                  className="h-full w-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Decorative circular accessories */}
              <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white text-rose-600 font-bold flex items-center justify-center shadow-lg text-sm rotate-12">
                ✨
              </div>
              <div className="absolute -bottom-2 -left-2 h-14 w-14 rounded-full bg-rose-500/80 backdrop-blur-md text-white font-mono flex flex-col items-center justify-center shadow-md border border-white/10 text-[9px] uppercase tracking-wider">
                <span className="font-bold">20%</span>
                <span>OFF</span>
              </div>
            </div>
          </motion.div>
 
        </div>
      </div>
 
      {/* 2. PREMIUM SHADES BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="flex flex-col items-center justify-center mb-10">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-rose-500 tracking-tight uppercase">
            Premium Shades
          </h2>
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="h-[1px] w-8 bg-rose-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <div className="h-[1px] w-8 bg-rose-200" />
          </div>
        </div>
 
        {/* Carousel / horizontal pill gallery row matching reference exactly */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {premiumShades.map((shade, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ 
                y: -6, 
                scale: 1.03, 
                boxShadow: "0 15px 30px -10px rgba(244, 63, 94, 0.12)",
                borderColor: "rgba(244, 63, 94, 0.25)"
              }}
              onClick={() => {
                setCurrentTab(shade.action);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group overflow-hidden rounded-[2rem] p-4 flex flex-col sm:flex-row items-center justify-between cursor-pointer border border-rose-100 transition-all duration-300 ${shade.bgColor}`}
            >
              <div className="text-left py-2 sm:pl-2">
                <h3 className={`font-display font-extrabold text-xs sm:text-sm uppercase tracking-wide ${shade.textColor}`}>
                  {shade.title}
                </h3>
                <button className="mt-2 text-[9px] bg-white text-rose-600 font-black px-3.5 py-1.5 rounded-full shadow-xs uppercase tracking-wider hover:bg-rose-50 transition-colors">
                  {shade.btnText}
                </button>
              </div>
              
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/60 shadow-sm mt-3 sm:mt-0 flex-shrink-0">
                <img
                  src={shade.image}
                  alt={shade.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
 
      {/* Premium Horizontal Scroll GSAP Fashion Showcase Section */}
      <FashionShowcase setCurrentTab={setCurrentTab} />
 
      {/* 3. INTERACTIVE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-rose-500 tracking-tight uppercase">
            Category
          </h2>
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="h-[1px] w-8 bg-rose-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <div className="h-[1px] w-8 bg-rose-200" />
          </div>
        </div>
 
        {/* Category Icons Row - beautiful circular buttons matching exactly */}
        <div className="flex items-center justify-start md:justify-center space-x-4 sm:space-x-8 overflow-x-auto pb-4 scrollbar-none select-none">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center space-y-2.5 outline-none focus:outline-none focus:ring-0 group cursor-pointer flex-shrink-0"
              >
                <div className={`h-14 w-14 rounded-full flex items-center justify-center text-xl transition-all ${
                  isSelected 
                    ? 'bg-rose-500 text-white shadow-md ring-2 ring-offset-2 ring-rose-300 scale-105' 
                    : 'bg-white border border-rose-100 hover:border-rose-400 text-rose-500 hover:scale-102'
                }`}>
                  <span>{cat.icon}</span>
                </div>
                <span className={`text-[11px] uppercase tracking-wider font-extrabold transition-all ${
                  isSelected ? 'text-gray-950 font-black border-b-2 border-rose-500 pb-0.5' : 'text-gray-500 group-hover:text-rose-500'
                }`}>
                  {cat.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>
 
      {/* 4. PRODUCT GRID AND CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        
        {/* Responsive grid mapping filtered lists */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {filteredProducts.map((product, idx) => {
            const isWish = wishlist.some(p => p.id === product.id);
            // Color theme presets inside card backdrops matching image aesthetic
            const backdrops = [
              'bg-[#FDE2E4]', // Soft pink-tint
              'bg-[#FFCAD4]', // Pale pink
              'bg-[#F2D5CE]', // Blush beige
              'bg-[#FFCAD4]', // Pale pink
              'bg-[#EAFFD0]', // Soft lime-yellow
              'bg-[#FFF5EB]', // Warm pale amber
              'bg-[#EFEFEF]', // Soft grey
              'bg-[#FAEEED]'  // Snow rose
            ];
            const bgClass = backdrops[idx % backdrops.length];
 
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (idx % 4) * 0.1 }}
                whileHover={{ 
                  y: -6, 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px -15px rgba(244, 63, 94, 0.15)",
                  borderColor: "rgba(244, 63, 94, 0.3)"
                }}
                className="group relative rounded-[2rem] bg-white p-2 border border-rose-50/50 flex flex-col justify-between cursor-pointer"
              >
                {/* 1. Styled Background Circle Image Stage */}
                <div className={`relative aspect-[3/4] rounded-[1.75rem] overflow-hidden ${bgClass}`}
                  onClick={() => handleProductCardClick(product.id)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                    {product.originalPrice && (
                      <span className="text-[9px] font-black uppercase bg-red-500 text-white px-2 py-1 rounded-sm shadow-sm font-mono tracking-wider">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    )}
                    {product.tag && (
                      <span className="text-[8px] font-black uppercase bg-neutral-900 border border-white/20 text-white px-2.5 py-1 rounded-sm shadow-xs font-mono tracking-wider">
                        {product.tag}
                      </span>
                    )}
                  </div>
 
                  {/* Top-Right Heart Wishlist Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWishlistToggle(product.id);
                    }}
                    className={`absolute top-3.5 right-3.5 p-2 rounded-full shadow-sm backdrop-blur-md cursor-pointer transition-colors ${
                      isWish ? 'bg-rose-500 text-white' : 'bg-white/80 hover:bg-white text-gray-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" />
                  </button>
 
                  {/* EXACT Overlay details in Image 3 for all cards or selected triggers */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xs p-3 text-left transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-rose-50">
                    <span className="text-[8.5px] font-mono text-rose-500 tracking-wider uppercase font-bold">Hot Choice 🔥</span>
                    <h4 className="font-display font-extrabold text-xs text-gray-900 mt-0.5 tracking-tight line-clamp-1">{product.name}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-1 font-sans">{product.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-rose-50/50">
                      <span className="font-mono text-xs font-black text-rose-600">${product.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAdd(product, product.sizes[0] || 'S', product.colors[0] || { name: 'Rose', hex: '#FDA4AF' });
                        }}
                        className="bg-rose-500 hover:bg-rose-600 text-white text-[9px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
 
                {/* 2. Static bottom info layout matching reference images */}
                <div className="p-3 text-left">
                  <h3 
                    onClick={() => handleProductCardClick(product.id)}
                    className="font-display font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-1 hover:text-rose-500 cursor-pointer transition-colors animate-all"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 tracking-wide font-sans line-clamp-1 mt-0.5">
                    {product.material.split(',')[0]}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline space-x-1 sm:space-x-1.5">
                      <span className="font-mono text-xs sm:text-sm font-black text-rose-600">₹{product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="font-mono text-[10px] text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product, product.sizes[0] || 'S', product.colors[0] || { name: 'Rose', hex: '#FDA4AF' });
                      }}
                      className="h-7 w-7 rounded-full bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-rose-100"
                      title="Quick Add"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
 
        {/* View All Collection trigger button */}
        <div className="mt-12">
          <motion.button
            onClick={() => {
              setCurrentTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            whileHover={{ y: -3, scale: 1.05, boxShadow: "0 10px 25px rgba(244, 63, 94, 0.12)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white border border-rose-200 text-rose-600 font-extrabold text-xs uppercase tracking-[0.2em] rounded-full cursor-pointer transition-colors duration-250"
          >
            Examine Entire Collection
          </motion.button>
        </div>
 
      </section>

      {/* 5. SEASONS SALE HERO BANNER CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-left">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-rose-500/5 to-pink-500/10 border border-rose-200 p-8 sm:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* background rose petal circle */}
          <div className="absolute top-[-10%] right-[-10%] h-64 w-64 rounded-full bg-rose-300/10 blur-[50px] pointer-events-none" />

          <div className="space-y-4 max-w-lg">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-600 font-black block">Atelier Craftsmanship</span>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-gray-900 leading-tight">
              Curated premium cotton & bias-cut silk silhouettes
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              We compile heavy premium knits and bias-cut elements for modern luxury. Experience unboxing priority with custom clothing vaults and custom unboxing cards tailored exactly for your wardrobe.
            </p>
            
            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <span>View Private Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="w-full max-w-xs aspect-square rounded-3xl overflow-hidden shadow-lg border border-rose-100 flex-shrink-0 bg-rose-50">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400&auto=format&fit=crop"
              alt="Luxury aesthetic model outfit details"
              className="h-full w-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* 6. INSTAGRAM VAULT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <div className="mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-rose-500 font-black">On Instagram</span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mt-1 uppercase">#ClothingVaultGirl</h2>
          <p className="text-xs text-gray-500 mt-2">Tag your styled snapshots for exclusive weekly drop codes and mentions.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 shadow-xs cursor-pointer"
            >
              <img
                src={post.url}
                alt="Styled customer display"
                className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-rose-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-1">
                <Instagram className="h-5 w-5 text-white" />
                <span className="text-xs font-mono font-bold text-white">{post.likes} Likes</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. REVIEWS & TESTIMONIAL AUDITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-left">
        <div className="bg-rose-50/70 border border-rose-100 rounded-[2rem] p-6 sm:p-12 relative overflow-hidden">
          <Sparkles className="absolute top-5 right-5 h-24 w-24 text-rose-200/40 rotate-12 pointer-events-none" />
          
          <div className="max-w-4xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-600 font-bold block mb-4">Customer Ledger</span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-950 mb-8 uppercase">Aesthetics Approved</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {TESTIMONIALS.map((test) => (
                <div key={test.id} className="bg-white rounded-2xl p-5 border border-rose-100/40 shadow-xs space-y-3.5">
                  <div className="flex text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 italic font-mono leading-relaxed">
                    "{test.quote}"
                  </p>
                  <div className="flex items-center space-x-3 pt-3 border-t border-rose-50">
                    <img
                      src={test.avatar}
                      alt={test.user}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-rose-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-display font-bold text-xs text-gray-900">{test.user}</h4>
                      <p className="text-[10px] text-rose-600 font-mono font-semibold">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLUB VIP SIGNUP */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#E11D48] to-[#EE3544] text-white p-8 sm:p-12 space-y-5 shadow-lg relative overflow-hidden">
          <Sparkles className="h-6 w-6 text-white/80 mx-auto animate-pulse" />
          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wider">Join ClothingVault Confidential</h3>
          <p className="text-xs text-rose-50 max-w-sm mx-auto leading-relaxed">
            Register your profile to access premium 1-click unboxing drops, track custom shipment intervals, and save beloved fits in your list securely.
          </p>
          <button
            onClick={() => {
              setCurrentTab('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-white hover:bg-rose-50 text-rose-600 font-extrabold rounded-full text-xs uppercase tracking-widest transition-transform duration-200 transform hover:scale-102 shadow-md cursor-pointer"
          >
            Create Vault Account
          </button>
        </div>
      </section>

    </div>
  );
}
