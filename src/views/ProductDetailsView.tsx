import React, { useState, useMemo } from 'react';
import { Star, Heart, ShoppingBag, Plus, Minus, ShieldCheck, Truck, RotateCcw, PenTool, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import ProductCard from '../components/ProductCard';
import ReviewModal from '../components/ReviewModal';
import SizeGuideModal from '../components/SizeGuideModal';

interface ProductDetailsViewProps {
  key?: React.Key;
  productId: string;
  wishlist: Product[];
  onWishlistToggle: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, size: string, color: { name: string; hex: string }) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedProductId: (id: string) => void;
  onQuickAdd: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onAddReview: (productId: string, name: string, rating: number, comment: string) => void;
}

export default function ProductDetailsView({
  productId,
  wishlist,
  onWishlistToggle,
  onAddToCart,
  setCurrentTab,
  setSelectedProductId,
  onQuickAdd,
  onAddReview
}: ProductDetailsViewProps) {
  // Find current product in state/data
  const product = useMemo(() => {
    return PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  }, [productId]);

  // Gallery Index state
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Selector states
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'S');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.colors[0] || { name: 'Default', hex: '#ffffff' }
  );
  const [quantity, setQuantity] = useState(1);

  // Accordion tabs state
  const [activeTab, setActiveTab] = useState<'fit' | 'shipping' | 'guarantee'>('fit');

  // Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const isWishlisted = wishlist.some(p => p.id === product.id);

  // Related products (from same category, excluding active product)
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  }, [product]);

  const handleQtyChange = (change: number) => {
    const nextQty = quantity + change;
    if (nextQty >= 1 && nextQty <= 10) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleRelatedProductClick = (id: string) => {
    setSelectedProductId(id);
    setActiveImgIdx(0);
    setQuantity(1);
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = (reviewerName: string, rating: number, comment: string) => {
    onAddReview(product.id, reviewerName, rating, comment);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-25 text-left page-enter-fade">
      
      {/* 1. BACK TO CATALOG LINK */}
      <button
        onClick={() => setCurrentTab('shop')}
        className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-rose-500 cursor-pointer mb-8 transition-colors border border-rose-100 bg-white px-4 py-2 rounded-full shadow-xs"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-bold">Return to Catalog</span>
      </button>

      {/* 2. CORE DETAILS DOUBLE COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Gallery portfolio */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden bg-rose-50 border border-rose-100 shadow-sm">
            <img
              src={product.images[activeImgIdx]}
              alt={`${product.name} detailed cover`}
              className="h-full w-full object-cover object-top hover:scale-[1.02] transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-white border transition-all duration-300 cursor-pointer ${
                  activeImgIdx === idx
                    ? 'border-rose-500 ring-2 ring-rose-200 scale-95 shadow-sm'
                    : 'border-rose-100/60 opacity-60 hover:opacity-100 hover:border-rose-300'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Style Specifications controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            {/* Category and active status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-500 font-mono tracking-widest uppercase font-bold">
                {product.category.replace('-', ' ')}
              </span>
              <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-widest px-3 py-1 bg-rose-100/60 border border-rose-200 rounded-full">
                👑 VIP Selection (In Stock)
              </span>
            </div>

            {/* Title / Header */}
            <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-950 tracking-tight leading-tight uppercase">
              {product.name}
            </h1>

            {/* Price section with sale awareness */}
            <div className="flex items-baseline space-x-3.5 mt-2">
              <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through font-mono">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="text-[10px] uppercase font-black text-rose-500 font-mono bg-rose-50 px-2.5 py-1 rounded-sm border border-rose-100">
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Star Rating summary score */}
            <div className="flex items-center space-x-2 pt-1 border-b border-rose-100 pb-4">
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-gray-700 font-bold">{product.rating}</span>
              <span className="text-gray-300">•</span>
              <a href="#reviews-anchor" className="text-xs text-rose-500 underline hover:text-rose-600 font-bold">
                {product.reviews.length} Style Reviews
              </a>
            </div>
          </div>

          {/* Core brief description */}
          <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed font-semibold">
            {product.description}
          </p>

          {/* INTERACTIVE COLOR SELECTOR */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 uppercase tracking-wide">Palette Spectrum</span>
              <span className="text-rose-600 font-mono">{selectedColor.name}</span>
            </div>
            <div className="flex space-x-3">
              {product.colors.map((color) => {
                const isActive = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer relative ${
                      isActive
                        ? 'border-rose-500 scale-110 ring-2 ring-rose-200 shadow-sm'
                        : 'border-rose-100 hover:border-rose-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-white block mix-blend-difference" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* INTERACTIVE SILHOUETTE SIZING */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 uppercase tracking-wide">Couture Silhouette Size</span>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-rose-500 hover:text-rose-700 text-[10px] font-mono tracking-wider uppercase cursor-pointer"
              >
                Size Covenant Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 w-11 rounded-xl border text-xs font-mono font-black transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                        : 'bg-white border-rose-100 text-gray-600 hover:border-rose-300'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUANTITY AND WISHLIST/BAG ROW */}
          <div className="flex items-center space-x-4 pt-4 border-t border-rose-100">
            {/* Stepper Quantity Container */}
            <div className="flex items-center space-x-4 bg-white p-2 rounded-xl border border-rose-150 shadow-xs">
              <button
                onClick={() => handleQtyChange(-1)}
                className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-500 hover:text-rose-600 cursor-pointer transition-colors"
                aria-label="Reduce quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-sm font-black text-gray-900">{quantity}</span>
              <button
                onClick={() => handleQtyChange(1)}
                className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-500 hover:text-rose-600 cursor-pointer transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Glowing Add to Cart */}
            <button
              onClick={handleAddToCartClick}
              className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs uppercase font-extrabold tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>

            {/* Heart Wishlist Toggler */}
            <button
              onClick={() => onWishlistToggle(product.id)}
              className="p-3.5 rounded-full border border-rose-100 hover:border-rose-300 bg-white text-gray-500 hover:text-rose-600 transition-all cursor-pointer shadow-xs"
              aria-label="Save to Vault wishlist"
            >
              <Heart
                className={`h-4.5 w-4.5 transition-colors ${
                  isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>

          {/* 3. COUTURE PREMIUM SPECS LIST */}
          <div className="pt-4 space-y-2.5 border-t border-rose-100 text-xs text-gray-600">
            <div className="flex justify-between py-1 border-b border-rose-50 font-medium">
              <span className="font-mono text-gray-400">Fabric Composition:</span>
              <span className="text-gray-800 text-right">{product.material}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rose-50 font-medium">
              <span className="font-mono text-gray-400">Care Instructions:</span>
              <span className="text-gray-800 text-right">{product.care}</span>
            </div>
          </div>

          {/* 4. DETAILS ACCORDION CONTROLS */}
          <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
            <div className="grid grid-cols-3 border-b border-rose-100 text-[10px] font-mono font-black uppercase tracking-widest text-center">
              <button
                onClick={() => setActiveTab('fit')}
                className={`py-3.5 transition-colors cursor-pointer ${
                  activeTab === 'fit' ? 'bg-rose-50/70 text-rose-600' : 'text-gray-500 hover:text-rose-600'
                }`}
              >
                Fit & Design
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-3.5 border-x border-rose-100 transition-colors cursor-pointer ${
                  activeTab === 'shipping' ? 'bg-rose-50/70 text-rose-600' : 'text-gray-500 hover:text-rose-600'
                }`}
              >
                Shipping Drops
              </button>
              <button
                onClick={() => setActiveTab('guarantee')}
                className={`py-3.5 transition-colors cursor-pointer ${
                  activeTab === 'guarantee' ? 'bg-rose-50/70 text-rose-600' : 'text-gray-500 hover:text-rose-600'
                }`}
              >
                Vault Covenant
              </button>
            </div>

            <div className="p-5 text-xs text-gray-600 leading-relaxed font-semibold">
              {activeTab === 'fit' && (
                <ul className="space-y-1.5 list-disc pl-4 text-left">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                  <li>Model is 5'9" wearing Size S for classic slender curves.</li>
                </ul>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-rose-600 font-bold">
                    <Truck className="h-4 w-4" />
                    <span>Complimentary Priority Air Logistics</span>
                  </div>
                  <p>
                    Orders are processed inside a sleek matte-pink presentation envelope. Standard complimentary transport takes 2-4 days worldwide. Fully insured with real-time biometric tracking details.
                  </p>
                </div>
              )}

              {activeTab === 'guarantee' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-rose-600 font-bold">
                    <RotateCcw className="h-4 w-4" />
                    <span>Complimentary Concierge Pickup Shifts</span>
                  </div>
                  <p>
                    We offer complimentary return shipping pickup schedules from your residential door or workspace. Unworn items must still hold the original Vault metal security ring tag. 14-day absolute covenant.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 5. DYNAMIC CUSTOMER STYLE REVIEWS LIST */}
      <section id="reviews-anchor" className="mt-20 pt-12 border-t border-rose-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 text-left">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-500 font-bold">Vault Audits</span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-gray-950 mt-1 uppercase">Curated Style Reviews</h3>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs uppercase font-extrabold tracking-widest transition-all cursor-pointer shadow-sm"
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Write Style Audit</span>
          </button>
        </div>

        {product.reviews.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-rose-100 text-center text-gray-500 text-xs font-semibold">
            No audits recorded yet. Be the first to catalog your feedback for this limited drop.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-[2rem] bg-white border border-rose-100 space-y-3 text-left relative overflow-hidden shadow-xs"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h5 className="font-display font-black text-gray-950 text-xs">{review.user}</h5>
                    <p className="text-[10px] text-gray-400 font-mono font-bold">{review.date}</p>
                  </div>
                  <div className="flex space-x-1 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-mono text-[10px] font-black text-rose-600">{review.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-gray-650 leading-relaxed font-semibold italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-rose-100">
          <div className="text-center md:text-left mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-rose-500 font-bold">Complete the Look</span>
            <h4 className="font-display font-black text-lg sm:text-xl text-gray-950 mt-1 uppercase">Concentric Wardrobe Pieces</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProd) => (
              <ProductCard
                key={relatedProd.id}
                product={relatedProd}
                isWishlisted={wishlist.some(p => p.id === relatedProd.id)}
                onWishlistToggle={onWishlistToggle}
                onProductClick={() => handleRelatedProductClick(relatedProd.id)}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </section>
      )}

      {/* DYNAMIC REVIEW MODAL SHEET */}
      {isReviewModalOpen && (
        <ReviewModal
          product={product}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* DYNAMIC SIZE GUIDE MODAL SHEET */}
      {isSizeGuideOpen && (
        <SizeGuideModal
          onClose={() => setIsSizeGuideOpen(false)}
          productCategory={product.category}
          productName={product.name}
        />
      )}

    </div>
  );
}
