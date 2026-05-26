import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Lock, Ticket, HelpCircle, CheckCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateCartQty: (productId: string, size: string, change: number) => void;
  onRemoveFromCart: (productId: string, size: string) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedProductId: (id: string) => void;
  // Coupon state handlers inside parent or we can handle locally and export discount to parent checkout
  couponDiscountPct: number;
  setCouponDiscountPct: (pct: number) => void;
}

export default function CartView({
  cart,
  onUpdateCartQty,
  onRemoveFromCart,
  setCurrentTab,
  setSelectedProductId,
  couponDiscountPct,
  setCouponDiscountPct
}: CartViewProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  // Calculate discount
  const discountAmount = Math.round(subtotal * (couponDiscountPct / 100));
  const postDiscountSubtotal = subtotal - discountAmount;
  
  // Shipping thresholds: Free shipping above $150
  const shippingCost = subtotal >= 150 || subtotal === 0 ? 0 : 25;
  const taxCost = Math.round(postDiscountSubtotal * 0.08); // 8% sales tax
  const grandTotal = postDiscountSubtotal + shippingCost + taxCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = couponCode.trim().toUpperCase();
    if (code === 'VAULTVIP' || code === 'YOUTH15') {
      setCouponDiscountPct(15);
      setCouponSuccess('Couture Voucher Authorized: -15% deducted from Vault cart!');
      setCouponCode('');
    } else {
      setCouponError('Invalid voucher index. Try VAULTVIP or YOUTH15.');
    }
  };

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentTab('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutClick = () => {
    setCurrentTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 text-left page-enter-fade">
      
      {/* Header section */}
      <div className="pb-8 border-b border-rose-100 mb-10">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-500 font-bold">Shopping Ledger</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-gray-950 mt-1 uppercase">My Cart</h1>
        <p className="text-xs text-gray-500 font-medium mt-2 max-w-sm">
          Examine materials and verify silhouette sizing before sealing your personal drop.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 rounded-[2rem] border border-rose-100 bg-white shadow-sm">
          <div className="h-16 w-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-2">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <p className="font-serif italic text-lg text-gray-800">Your shopping cart is bare</p>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-semibold">
            Each pattern drop is strictly capped at 150 pieces worldwide. Return to catalog to secure your favorite luxury seams.
          </p>
          <button
            onClick={() => setCurrentTab('shop')}
            className="mt-4 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-extrabold tracking-widest uppercase transition-all cursor-pointer shadow-sm"
          >
            Shop Curated Drops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Interactive Items checklist (8 columns) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-[2rem] bg-white border border-rose-50 hover:border-rose-100 hover:shadow-xs transition-all duration-300 gap-4"
              >
                {/* Visual Thumbnail & Detail text column */}
                <div className="flex items-center space-x-4">
                  <div
                    onClick={() => handleProductClick(item.product.id)}
                    className="h-24 w-18 rounded-2xl overflow-hidden bg-rose-550 bg-rose-50/50 border border-rose-100 cursor-pointer flex-shrink-0 relative"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-rose-500 uppercase tracking-wider font-bold">
                      {item.product.category.replace('-', ' ')}
                    </span>
                    <h3
                      onClick={() => handleProductClick(item.product.id)}
                      className="font-display font-extrabold text-xs sm:text-sm text-gray-950 hover:text-rose-500 cursor-pointer transition-colors mt-0.5 line-clamp-1"
                    >
                      {item.product.name}
                    </h3>
                    
                    {/* Size / Color badges */}
                    <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">
                      <span>Size: <strong className="text-gray-950 font-black">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <span>Color:</span>
                        <span 
                          className="h-2.5 w-2.5 rounded-full border border-gray-150" 
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <strong className="text-gray-950 font-black ml-0.5">{item.selectedColor.name.split(' ')[0]}</strong>
                      </span>
                    </div>

                    {/* Price and total */}
                    <p className="mt-2 text-xs sm:text-sm text-gray-900 font-mono font-black">
                      ${item.product.price} <span className="text-[10px] text-gray-400 font-normal">/ unit</span>
                    </p>
                  </div>
                </div>

                {/* Right columns: Stepper and Action Row */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 sm:space-x-8 border-t sm:border-t-0 border-rose-50 pt-3 sm:pt-0">
                  {/* Quantity adjustment */}
                  <div className="flex items-center space-x-2.5 bg-rose-50/40 p-1.5 rounded-xl border border-rose-100">
                    <button
                      onClick={() => onUpdateCartQty(item.product.id, item.selectedSize, -1)}
                      className="p-1 hover:bg-rose-100 rounded font-bold text-gray-500 hover:text-rose-600 cursor-pointer"
                      aria-label="Reduce quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-mono text-xs font-black px-1 text-gray-950">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateCartQty(item.product.id, item.selectedSize, 1)}
                      className="p-1 hover:bg-rose-100 rounded font-bold text-gray-500 hover:text-rose-600 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Pricing status */}
                  <div className="text-right">
                    <p className="font-mono text-sm sm:text-base font-black text-rose-600">${item.product.price * item.quantity}</p>
                    <button
                      onClick={() => onRemoveFromCart(item.product.id, item.selectedSize)}
                      className="inline-flex items-center space-x-1 text-[10px] text-rose-500 hover:text-rose-700 uppercase tracking-wider font-mono font-black mt-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right: Premium Receipt Totals (4 columns) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Promo code field */}
            <div className="p-5 rounded-[2rem] bg-white border border-rose-100 shadow-xs text-left">
              <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest font-black block mb-2">Voucher Registry</span>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. VAULTVIP"
                  className="bg-rose-50 border border-rose-100 focus:border-rose-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none w-full uppercase font-bold tracking-wider"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-sans font-extrabold uppercase cursor-pointer transition-colors shrink-0"
                >
                  Verify
                </button>
              </form>
              
              {couponError && <p className="text-[10px] text-red-500 mt-2 font-mono font-bold">{couponError}</p>}
              {couponSuccess && (
                <div className="flex items-center space-x-1 text-[10px] text-emerald-600 mt-2 font-mono font-bold">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{couponSuccess}</span>
                </div>
              )}
            </div>

            {/* Calculations block */}
            <div className="p-6 rounded-[2rem] bg-white border border-rose-100 space-y-4 shadow-sm text-left">
              <span className="font-display font-black text-xs uppercase tracking-[0.25em] text-gray-950 block pb-2 border-b border-rose-100 text-center">Order Summary</span>
              
              <div className="space-y-2.5 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal ({cartCount} styles)</span>
                  <span className="font-mono text-gray-950">${subtotal}</span>
                </div>

                {couponDiscountPct > 0 && (
                  <div className="flex justify-between text-emerald-600 font-mono font-bold">
                    <span>Voucher Saved ({couponDiscountPct}%)</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center space-x-1">
                    <span>Air Shipping Logistics</span>
                    <HelpCircle className="h-3 w-3 text-gray-400" title="Free worldwide air express on catalog items above $150." />
                  </span>
                  <span className="font-mono text-gray-950">
                    {shippingCost === 0 ? <b className="text-emerald-600 font-black">FREE OVER $150</b> : `$${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>PCI Encrypted Duties / Tax</span>
                  <span className="font-mono text-gray-950">${taxCost}</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-rose-100 flex justify-between items-baseline font-bold">
                <span className="font-display text-xs uppercase tracking-widest text-gray-950">Grand total</span>
                <span className="font-mono text-lg sm:text-xl font-black text-rose-600">${grandTotal}</span>
              </div>

              {/* Secure Checkout trigger */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md mt-4"
              >
                <Lock className="h-4 w-4" />
                <span>Encrypted checkout</span>
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400 font-mono font-bold mt-3">
                <Lock className="h-3.5 w-3.5 text-rose-500" />
                <span>PCI-DSS DOUBLE ENCRYPTION APPLIED</span>
              </div>

            </div>

          </aside>

        </div>
      )}

    </div>
  );
}
