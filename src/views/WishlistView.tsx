import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistViewProps {
  wishlist: Product[];
  onWishlistToggle: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, size: string, color: { name: string; hex: string }) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedProductId: (id: string) => void;
}

export default function WishlistView({
  wishlist,
  onWishlistToggle,
  onAddToCart,
  setCurrentTab,
  setSelectedProductId
}: WishlistViewProps) {
  const handleMoveToCart = (product: Product) => {
    // move to cart using first size and first color available
    const defaultSize = product.sizes[0] || 'S';
    const defaultColor = product.colors[0] || { name: 'Default', hex: '#ffffff' };
    
    // add to cart
    onAddToCart(product, 1, defaultSize, defaultColor);
    
    // remove from wishlist
    onWishlistToggle(product.id);
  };

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentTab('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 text-left page-enter-fade">
      
      {/* Page Header */}
      <div className="pb-8 border-b border-rose-100 mb-10">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-500 font-bold">Personal Boutique Cache</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-gray-950 mt-1 uppercase">My Wishlist</h1>
        <p className="text-xs text-gray-500 font-medium mt-2 max-w-sm">
          A personal vault containing garments awaiting selection. Once bought, they leave the ledger.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 rounded-[2rem] border border-rose-100 bg-white shadow-sm">
          <div className="h-16 w-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-2">
            <Heart className="h-7 w-7 fill-current" />
          </div>
          <p className="font-serif italic text-lg text-gray-800">Your wish vault is vacant</p>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-semibold">
            As you browse, tap the heart rings on luxury coats and evening slips to save them here for easy acquisition.
          </p>
          <button
            onClick={() => setCurrentTab('shop')}
            className="mt-4 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-extrabold tracking-widest uppercase transition-all cursor-pointer shadow-sm"
          >
            Explore Couture Drops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col w-full rounded-[2rem] overflow-hidden bg-white border border-rose-50 hover:shadow-md transition-all duration-300"
            >
              {/* Product Thumbnail image */}
              <div 
                onClick={() => handleProductClick(product.id)}
                className="relative aspect-[3/4] w-full overflow-hidden bg-rose-50 cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover object-top hover:scale-[1.01] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Remove heart toggle absolute */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onWishlistToggle(product.id);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-500 shadow-xs pointers-events-auto cursor-pointer transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Product content details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-rose-500 font-mono tracking-wider uppercase font-bold">
                    {product.category.replace('-', ' ')}
                  </span>
                  <p 
                    onClick={() => handleProductClick(product.id)}
                    className="mt-1 text-xs sm:text-sm font-extrabold tracking-tight text-gray-950 line-clamp-1 hover:text-rose-500 cursor-pointer transition-colors"
                  >
                    {product.name}
                  </p>
                  
                  <div className="mt-2 flex items-baseline space-x-1.5 font-mono">
                    <span className="text-xs sm:text-sm font-black text-rose-600">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Direct quick move to cart action */}
                <div className="mt-4 pt-3.5 border-t border-rose-50">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-500 rounded-full text-[10px] uppercase font-black tracking-widest flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
