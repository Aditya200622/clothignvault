import React, { useState } from 'react';
import { Heart, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: (productId: string) => void;
  onProductClick: () => void;
  onQuickAdd: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onWishlistToggle,
  onProductClick,
  onQuickAdd
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    // Use first available color for quick add
    onQuickAdd(product, size, product.colors[0]);
  };

  // Color background tints corresponding to product index or tags
  const getCardBg = () => {
    if (product.id.includes('velvet') || product.id.includes('sequin')) return 'bg-[#FDE2E4]'; // Soft pink
    if (product.id.includes('knit') || product.id.includes('cashmere')) return 'bg-[#FFF5EB]'; // Cream orange
    if (product.id.includes('street') || product.id.includes('cargo')) return 'bg-[#EAFFD0]'; // Pale green
    if (product.id.includes('leather') || product.id.includes('trench')) return 'bg-[#EFEFEF]'; // Gray
    return 'bg-[#FFF0F2]'; // Default warm blush
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -6, 
        scale: 1.02, 
        boxShadow: "0 20px 40px -15px rgba(244, 63, 94, 0.15)",
        borderColor: "rgba(244, 63, 94, 0.3)"
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative flex flex-col w-full rounded-[2rem] overflow-hidden bg-white border border-rose-50 cursor-pointer"
      onClick={onProductClick}
    >
      {/* Product Image Stage with Coral tint background */}
      <div className={`relative aspect-[3/4] w-full overflow-hidden ${getCardBg()}`}>
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full w-full object-cover object-top transition-all duration-500 ease-out ${
            isHovered && product.images[1] ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Alternate Image on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 ease-out ${
              isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Top-Left Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-1.5 pointer-events-none">
          {product.originalPrice && (
            <span className="px-2.5 py-1 rounded-sm text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-wider text-white bg-red-500 shadow-sm">
              Sale
            </span>
          )}
          {product.tag && (
            <span className="px-2.5 py-1 rounded-sm text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-wider text-white bg-gray-900 border border-white/10 shadow-xs">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          className="absolute top-4 right-4 p-2 rounded-full shadow-sm bg-white/80 hover:bg-white text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
          aria-label="Toggle wishlist item"
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 ${
              isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''
            }`}
          />
        </button>

        {/* Sizing drawer overlays on hover */}
        <div
          className={`absolute bottom-4 left-4 right-4 transition-all duration-300 transform ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 flex flex-col space-y-1.5 shadow-md border border-rose-50 text-center">
            <span className="text-[9px] font-black text-rose-500 tracking-wider uppercase flex items-center justify-center space-x-1">
              <ShoppingBag className="h-3 w-3" />
              <span>Quick Add Size</span>
            </span>
            <div className="flex justify-center gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleQuickAddClick(e, size)}
                  className="h-6.5 w-7.5 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white hover:scale-105 border border-rose-100 transition-all duration-150 text-[10px] font-mono font-black flex items-center justify-center cursor-pointer"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Category brand & rating row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-500 font-mono tracking-wider uppercase font-bold">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center space-x-0.5 text-[10px] text-gray-500 font-bold">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              <span className="font-mono">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <p className="mt-1.5 text-xs sm:text-sm font-extrabold tracking-tight text-gray-950 line-clamp-1 group-hover:text-rose-500 transition-colors duration-200">
            {product.name}
          </p>
        </div>

        {/* Price Tag Row with discount support */}
        <div className="mt-3 pt-2.5 border-t border-rose-50 flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xs sm:text-sm font-black text-rose-600 font-mono">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through font-mono font-medium">₹{product.originalPrice}</span>
            )}
          </div>
          
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold group-hover:text-rose-500 transition-colors">
            Look Details
          </span>
        </div>
      </div>
    </motion.div>
  );
}
