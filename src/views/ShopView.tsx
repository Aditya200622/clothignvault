import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, Grid3X3, RefreshCw, X } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../data';
import ProductCard from '../components/ProductCard';

interface ShopViewProps {
  wishlist: Product[];
  onWishlistToggle: (productId: string) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedProductId: (id: string) => void;
  onQuickAdd: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function ShopView({
  wishlist,
  onWishlistToggle,
  setCurrentTab,
  setSelectedProductId,
  onQuickAdd
}: ShopViewProps) {
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(600);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Available Sizes
  const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '24', '26', '28', '30'];

  // Tags Filter list
  const ALL_TAGS = ['New Arrival', 'Trending', 'Oversized'];

  // Handle product detail click
  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentTab('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query matches title or material or details
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Size filter
    if (selectedSize !== 'all') {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }

    // Tag filter
    if (selectedTag !== 'all') {
      result = result.filter(p => p.tag === selectedTag);
    }

    // Price filter
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedSize, selectedTag, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedTag('all');
    setPriceRange(600);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-20 page-enter-fade">
      
      {/* Editorial Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-8 border-b border-rose-100 text-left mb-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-500 font-bold">Atelier Archives</span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-gray-950 mt-1">Couture Catalog</h1>
          <p className="text-xs text-gray-500 font-medium mt-2 max-w-sm">
            Curated western streetwear, gowns, and hand-tailored knits. Filtered to fit your exact silhouette.
          </p>
        </div>
        
        {/* Rapid Search Bar */}
        <div className="mt-6 md:mt-0 max-w-xs w-full relative">
          <input
            type="text"
            placeholder="Search catalog garments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-rose-200 focus:border-rose-400 rounded-xl px-4 py-3 pl-10 text-xs text-gray-850 placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors shadow-xs"
          />
          <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-rose-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 1. DESKTOP SIDEBAR FILTERS (Left Column) */}
        <aside className="hidden lg:col-span-3 lg:flex flex-col space-y-8 bg-white border border-rose-100 p-6 rounded-[2rem] shadow-sm sticky top-28 text-left">
          
          <div className="flex items-center justify-between pb-4 border-b border-rose-50">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-gray-900 flex items-center space-x-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-rose-500" />
              <span>Refine Pieces</span>
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-mono uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Categories select checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</h4>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-xs text-left py-1.5 px-3 rounded-xl cursor-pointer transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-rose-50 text-rose-700 font-bold border-l-2 border-rose-500'
                    : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50/40'
                }`}
              >
                All Apparel
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs text-left py-1.5 px-3 rounded-xl cursor-pointer transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-rose-50 text-rose-700 font-bold border-l-2 border-rose-500'
                      : 'text-gray-600 hover:text-rose-900 hover:bg-rose-50/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selectors matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Vault Silhouette Size</h4>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`col-span-2 py-1.5 rounded-xl border text-xs font-mono font-black transition-all cursor-pointer ${
                  selectedSize === 'all'
                    ? 'bg-rose-550 bg-rose-500 text-white border-rose-500'
                    : 'bg-white border-rose-100 text-gray-600 hover:border-rose-300'
                }`}
              >
                All Sizes
              </button>
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-1.5 rounded-xl border text-xs font-mono font-black transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white border-rose-100/60 text-gray-600 hover:border-rose-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter selection links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Couture Tag</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${
                  selectedTag === 'all'
                    ? 'bg-rose-500 text-white'
                    : 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100/50'
                }`}
              >
                All Tags
              </button>
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Price Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold">
              <h4 className="uppercase tracking-wider text-gray-700">Price Limit</h4>
              <span className="font-mono text-rose-600">${priceRange} Max</span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>₹50</span>
              <span>₹600</span>
            </div>
          </div>

        </aside>

        {/* 2. PRODUCT GRID SECTION (Right Column) */}
        <main className="lg:col-span-9 flex flex-col space-y-6">
          
          {/* Top Sort Status Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-rose-100 text-left mb-2.5 shadow-xs">
            <div className="text-xs text-gray-500 font-medium">
              Revealing <span className="text-rose-600 font-bold font-mono">{filteredProducts.length}</span> luxury pieces of western apparel
            </div>

            {/* Sort Dropdown Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 font-mono flex items-center space-x-1">
                <ArrowUpDown className="h-3 w-3 text-rose-400" />
                <span>Sort by:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-rose-150 rounded-lg py-1 px-2.5 text-xs text-gray-800 focus:outline-none hover:border-rose-400 transition-all cursor-pointer"
              >
                <option value="featured">Featured Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated Vault Pieces</option>
              </select>

              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden p-1.5 border border-rose-100 hover:border-rose-400 bg-white text-rose-600 rounded-lg flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">Filter</span>
              </button>
            </div>
          </div>

          {/* Empty Results state */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl border border-rose-100 bg-white shadow-sm">
              <Grid3X3 className="h-12 w-12 text-rose-300 animate-pulse" />
              <p className="font-serif italic text-lg text-gray-800">No matching luxury pieces found</p>
              <p className="text-xs text-gray-500 max-w-sm font-medium leading-normal">
                Try widening your price range, toggling off sizing filters, or resetting terms. Everything is handcrafted.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs uppercase font-extrabold cursor-pointer transition-all shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.some(p => p.id === product.id)}
                  onWishlistToggle={onWishlistToggle}
                  onProductClick={() => handleProductClick(product.id)}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          )}

        </main>

      </div>

      {/* 3. MOBILE ADAPTIVE FILTERS GLASSDRAWER */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs z-50 flex justify-end">
          {/* backdrop */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsMobileFiltersOpen(false)} />
          
          <div className="relative w-full max-w-xs bg-white border-l border-rose-100 h-full p-6 flex flex-col justify-between overflow-y-auto z-10 text-left">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                <span className="font-display font-bold text-xs uppercase tracking-widest text-gray-950">Refine Pieces</span>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 hover:bg-rose-50 text-gray-500 hover:text-gray-950 rounded-full cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Reset shortcut */}
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFiltersOpen(false);
                }}
                className="w-full text-center py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 uppercase tracking-wider text-[10px] font-black rounded-xl"
              >
                Reset All Refines
              </button>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-gray-700">Category</h4>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`text-xs text-left py-2 px-2.5 rounded-lg ${
                      selectedCategory === 'all' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-gray-600'
                    }`}
                  >
                    All Apparel
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-xs text-left py-2 px-2.5 rounded-lg ${
                        selectedCategory === cat.id ? 'bg-rose-50 text-rose-700 font-bold' : 'text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-gray-700">Silhouette Size</h4>
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`text-xs py-1.5 rounded-lg border font-black ${
                      selectedSize === 'all' ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-100 text-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {ALL_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs py-1.5 rounded-lg border font-black ${
                        selectedSize === size ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-100 text-gray-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-700 uppercase">Price Range</span>
                  <span className="font-mono text-rose-600">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

            </div>

            {/* Bottom complete button */}
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="mt-8 w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-sans text-xs uppercase tracking-widest font-black rounded-full text-center shadow-md"
            >
              Examine Results
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
