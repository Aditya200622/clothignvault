import React, { useState } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X, Trash2, Plus, Minus, Sparkles } from 'lucide-react';
import { CartItem, Product, UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cart: CartItem[];
  wishlist: Product[];
  currentUser: UserProfile | null;
  onUpdateCartQty: (productId: string, size: string, change: number) => void;
  onRemoveFromCart: (productId: string, size: string) => void;
  setSelectedProductId: (id: string) => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  cart,
  wishlist,
  currentUser,
  onUpdateCartQty,
  onRemoveFromCart,
  setSelectedProductId
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const navLinks = [
    { label: 'Home', tab: 'home' },
    { label: 'Shop', tab: 'shop' },
    { label: 'Categories', tab: 'categories' },
    { label: 'About Us', tab: 'about', isNew: true },
    { label: 'Contact', tab: 'contact' },
    ...(currentUser?.role === 'admin' || currentUser?.email === 'adityaworkspace22@gmail.com'
  ? [{ label: 'Admin', tab: 'admin' }]
  : [])
  ];

  const handleLinkClick = (tab: string) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
    setIsMiniCartOpen(false);
    setIsSearchOpen(false);
  };

  const handleLogoClick = () => {
    setCurrentTab('home');
    setIsMobileMenuOpen(false);
    setIsMiniCartOpen(false);
    setIsSearchOpen(false);
  };

  const isHome = currentTab === 'home';

  return (
    <>
      {/* Sticky Premium Header Container */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isHome 
          ? 'bg-rose-500/10 backdrop-blur-md border-b border-rose-200/20 text-rose-950 shadow-[0_4px_30px_rgba(0,0,0,0.05)]' 
          : 'bg-white/90 backdrop-blur-md border-b border-rose-100 text-gray-800 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={handleLogoClick} 
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
          <div className="h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border border-rose-100 group-hover:scale-105 transition-transform duration-300">
  <img
    src="/logo.png"
    alt="ClothingVault Logo"
    className="w-[100%] h-[1000%] object-contain scale-230"
  />
</div>
            
            <span className={`font-display font-black text-base sm:text-lg tracking-[0.12em] uppercase transition-all duration-300 group-hover:tracking-[0.25em] ${
              isHome 
                ? 'text-rose-950 hover:text-rose-600' 
                : 'text-gray-950 hover:text-rose-500'
            }`}>
              CLOTHING<span className="text-rose-500 font-light">VAULT</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <motion.button
                key={link.tab}
                onClick={() => handleLinkClick(link.tab)}
                whileHover={{ y: -1, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`font-sans text-xs tracking-widest uppercase font-bold transition-all duration-200 relative py-1 cursor-pointer flex items-center gap-1.5 ${
                  currentTab === link.tab
                    ? (isHome ? 'text-rose-900' : 'text-rose-600')
                    : (isHome ? 'text-rose-950/70 hover:text-rose-900' : 'text-gray-500 hover:text-rose-600')
                }`}
              >
                <span>{link.label}</span>
                {link.isNew && (
                  <span className="text-[7.5px] bg-rose-50 text-rose-600 font-extrabold px-1.5 py-0.5 rounded-sm shadow-xs border border-rose-200">
                    NEW
                  </span>
                )}
                {currentTab === link.tab && (
                  <motion.div
                    layoutId="navbar-underline"
                    className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                      isHome ? 'bg-rose-600' : 'bg-rose-500'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Toolbar Utilities */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(prev => !prev)}
              aria-label="Search items"
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isHome ? 'text-rose-950/80 hover:text-rose-950 hover:bg-rose-900/10' : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Search className="h-4.5 w-4" />
            </button>

            {/* Wishlist Indicator */}
            <button
              onClick={() => handleLinkClick('wishlist')}
              aria-label="Wishlist"
              className={`p-2 rounded-full transition-all relative cursor-pointer ${
                isHome ? 'text-rose-950/80 hover:text-rose-950 hover:bg-rose-900/10' : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsMiniCartOpen(true)}
              aria-label="Cart"
              className={`p-2 rounded-full transition-all relative cursor-pointer ${
                isHome ? 'text-rose-950/80 hover:text-rose-950 hover:bg-rose-900/10' : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center shadow-xs animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile State Trigger */}
            <button
              onClick={() => handleLinkClick(currentUser ? 'profile' : 'login')}
              aria-label="Profile"
              className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1 ${
                isHome ? 'text-rose-950/80 hover:text-rose-950 hover:bg-rose-900/10' : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              {currentUser ? (
                <div className="h-6.5 w-6.5 rounded-full ring-2 ring-rose-300 overflow-hidden bg-rose-100 flex items-center justify-center">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <User className="h-4.5 w-4.5" />
              )}
            </button>

            {/* Mobile Hamburger */}
           <button
  onClick={() => setIsMobileMenuOpen(prev => !prev)}
  aria-label="Toggle menu"
  className="p-1 md:hidden text-rose-500 relative z-[9999] flex-shrink-0"
>
  {isMobileMenuOpen ? (
    <X className="h-6 w-6" />
  ) : (
    <Menu className="h-6 w-6" />
  )}
</button>
          </div>
        </div>

        {/* Dynamic Search Box dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white border-b border-rose-100"
            >
              <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-3">
                <Search className="h-5 w-5 text-rose-400" />
                <input
                  type="text"
                  placeholder="Search premium outerwear, party dresses, knits..."
                  className="w-full bg-transparent border-0 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsSearchOpen(false);
                      handleLinkClick('shop');
                    }
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-rose-600 text-xs uppercase tracking-widest cursor-pointer font-bold"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-rose-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Slide-out Cart Drawer (Beautiful Light Pink Styled Glassmorphism / Female Luxury theme) */}
      <AnimatePresence>
        {isMiniCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMiniCartOpen(false)}
              className="fixed inset-0 bg-gray-900/40 z-50 backdrop-blur-xs"
            />

            {/* Sidebar Shell */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 shadow-2xl flex flex-col border-l border-rose-100"
            >
              {/* Header */}
              <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-rose-500" />
                  <span className="font-display font-bold text-sm tracking-wider uppercase text-gray-900">Your Wardrobe Vault</span>
                  <span className="text-xs bg-rose-500 text-white font-bold py-0.5 px-2 rounded-full">
                    {cartCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsMiniCartOpen(false)}
                  className="p-1.5 hover:bg-rose-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
                {cart.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-2">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <p className="font-serif italic text-lg text-gray-800">Your Wardrobe Vault is Empty</p>
                    <p className="font-sans text-xs text-gray-500 max-w-xs leading-relaxed">
                      Discover curated luxury dresses, statement oversized hoodies, and western jackets in our limited drops.
                    </p>
                    <button
                      onClick={() => handleLinkClick('shop')}
                      className="mt-4 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 transform active:scale-95 shadow-md cursor-pointer"
                    >
                      Shop Collection
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                      className="flex space-x-3.5 p-3 rounded-2xl bg-white border border-rose-100/60 shadow-xs hover:shadow-sm transition-all duration-300"
                    >
                      <div className="h-20 w-16 rounded-xl overflow-hidden bg-rose-50 border border-rose-100 relative flex-shrink-0 cursor-pointer"
                        onClick={() => {
                          setSelectedProductId(item.product.id);
                          handleLinkClick('product-details');
                        }}
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p 
                            onClick={() => {
                              setSelectedProductId(item.product.id);
                              handleLinkClick('product-details');
                            }}
                            className="font-display font-bold text-xs sm:text-sm text-gray-900 line-clamp-1 hover:text-rose-600 cursor-pointer transition-colors"
                          >
                            {item.product.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-1 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                            <span>Siz: <b className="text-gray-900">{item.selectedSize}</b></span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <span>Col:</span>
                              <span 
                                className="h-2 w-2 rounded-full border border-black/10" 
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <b className="text-gray-900 ml-0.5">{item.selectedColor.name.split(' ')[0]}</b>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1.5 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  onUpdateCartQty(item.product.id, item.selectedSize, -1);
                                } else {
                                  onRemoveFromCart(item.product.id, item.selectedSize);
                                }
                              }}
                              className="p-1 hover:bg-gray-250 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono text-xs font-semibold px-1 text-gray-950">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateCartQty(item.product.id, item.selectedSize, 1)}
                              className="p-1 hover:bg-gray-250 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs sm:text-sm font-bold text-rose-600">₹{item.product.price * item.quantity}</span>
                            <button
                              onClick={() => onRemoveFromCart(item.product.id, item.selectedSize)}
                              className="p-1 hover:bg-rose-50 rounded text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Checkout Summary */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-rose-100 bg-rose-50/20 space-y-4">
                  <div className="flex justify-between items-center text-xs tracking-wider text-gray-500 uppercase font-bold">
                    <span>Order Subtotal</span>
                    <span className="font-mono text-lg font-bold text-rose-600">₹{cartTotal}</span>
                  </div>
                  <div className="bg-rose-500/5 rounded-xl p-3 border border-rose-100">
                    <p className="text-[10px] text-rose-700 font-sans leading-relaxed">
                      🎁 <b>Congratulations!</b> You qualify for Free shipping and exclusive boutique unboxing drops on this order automatically.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => {
                        setIsMiniCartOpen(false);
                        handleLinkClick('cart');
                      }}
                      className="py-3 px-4 border border-rose-200 hover:bg-rose-50 text-gray-700 rounded-xl text-xs uppercase font-extrabold tracking-wider text-center cursor-pointer transition-all"
                    >
                      View Cart
                    </button>
                    <button
                      onClick={() => {
                        setIsMiniCartOpen(false);
                        handleLinkClick('checkout');
                      }}
                      className="py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs uppercase font-extrabold tracking-wider text-center cursor-pointer transition-all shadow-md active:translate-y-px"
                    >
                      Checkout Now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Glass Drawer Component */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 bg-white z-40 md:hidden flex flex-col p-6 pt-24 space-y-8"
          >
            {/* Header close trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-50 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Links */}
            <div className="flex flex-col space-y-5 text-center">
              {navLinks.map((link) => (
                <button
                  key={link.tab}
                  onClick={() => handleLinkClick(link.tab)}
                  className={`font-display text-lg tracking-wider uppercase font-extrabold transition-all py-2 cursor-pointer ${
                    currentTab === link.tab ? 'text-rose-600 scale-102' : 'text-gray-500 hover:text-rose-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Custom Premium Card */}
            <div className="flex-1 flex items-end">
              <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 to-pink-100 p-5 border border-rose-200 text-center space-y-3.5 shadow-xs">
                <Sparkles className="h-6 w-6 text-rose-500 mx-auto animate-bounce" />
                <p className="font-serif italic text-base text-rose-800 font-semibold">Join ClothingVault Club</p>
                <p className="font-sans text-[10.5px] text-rose-900/80 leading-normal">
                  Unlock 20% off your first luxury drops purchase and receive priority alerts about our newest arrivals automatically.
                </p>
                <button
                  onClick={() => handleLinkClick(currentUser ? 'profile' : 'login')}
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 rounded-full text-white font-sans text-xs tracking-wider uppercase font-extrabold cursor-pointer transition-all shadow-xs"
                >
                  {currentUser ? 'My Account' : 'Sign Up Now'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
