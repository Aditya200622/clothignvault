import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ShieldCheck, Lock, CreditCard, Gift, ArrowLeft, RefreshCw, CheckCircle, Truck } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  couponDiscountPct: number;
  onPlaceOrder: (order: Order) => void;
  setCurrentTab: (tab: string) => void;
}

export default function CheckoutView({
  cart,
  couponDiscountPct,
  onPlaceOrder,
  setCurrentTab
}: CheckoutViewProps) {
  // Form fields state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    cardName: '',
    cardNumber: '4111 •••• •••• ••••',
    cardExpiry: '12/29',
    cardCvv: '•••'
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStateMsg, setProcessingStateMsg] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Calculations
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (couponDiscountPct / 100));
  const postDiscountSubtotal = subtotal - discountAmount;
  const shippingCost = subtotal >= 150 || subtotal === 0 ? 0 : 25;
  const taxCost = Math.round(postDiscountSubtotal * 0.08);
  const grandTotal = postDiscountSubtotal + shippingCost + taxCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, name: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Trigger stateful animation sequence
    setIsProcessing(true);
    
    const steps = [
      { text: 'Opening biometric transit gates...', delay: 0 },
      { text: 'PCI secure card validation...', delay: 800 },
      { text: 'Deducting inventory allowance inside Vault ledger...', delay: 1500 },
      { text: 'Sealing matte-black couture presentation box...', delay: 2200 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setProcessingStateMsg(step.text);
      }, step.delay);
    });

    // Complete order placement
    setTimeout(async () => {
      const generatedId = `CV-${Math.floor(Math.random() * 90000) + 10000}`;
      setCreatedOrderId(generatedId);
      
     const newOrder: Order = {
  id: generatedId,
  date: new Date().toISOString().split('T')[0],
  items: [...cart],
  subtotal,
  shipping: shippingCost,
  tax: taxCost,
  total: grandTotal,
  status: 'Processing',
  shippingAddress: {
    fullName: formData.fullName,
    email: formData.email,
    address: formData.address,
    city: formData.city,
    postalCode: formData.postalCode,
    phone: formData.phone
  },
  paymentMethod: paymentMethod
};

await addDoc(collection(db, "orders"), {
  ...newOrder,
  createdAt: new Date(),
});

onPlaceOrder(newOrder);
      setIsProcessing(false);
      setIsDone(true);
    }, 3000);
  };

  const handleReturnToProfile = () => {
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isDone) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 relative z-20 text-center space-y-6 page-enter-fade">
        <div className="h-20 w-20 rounded-full bg-purple-950/20 border border-purple-500/25 flex items-center justify-center text-purple-400 mx-auto animate-bounce shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <CheckCircle className="h-10 w-10 text-purple-400" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-semibold">Ledger Registration Confirmed</span>
          <h1 className="font-display font-bold text-2xl text-white">Order Sealing Completed</h1>
          <p className="font-mono text-xs text-purple-300 font-bold">Transaction index: {createdOrderId}</p>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed font-light max-w-sm mx-auto">
          We have wrapped your custom pieces in our signature matte-black tissue inside the scent-infused Vault casket. An express transport rider has been assigned.
        </p>

        <div className="p-4 rounded-xl bg-neutral-950 border border-white/5 space-y-2 max-w-sm mx-auto text-left text-xs text-gray-400 font-sans">
          <div className="flex justify-between">
            <span className="text-gray-500">Logistics dispatch:</span>
            <span className="text-white font-medium">Standard express courier (2-4 Days)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Destination:</span>
            <span className="text-white font-medium line-clamp-1">{formData.address || '777 Luxe Rodeo Drive'}</span>
          </div>
        </div>

        <button
          onClick={handleReturnToProfile}
          className="px-8 py-3.5 bg-gradient-to-r from-purple-800 to-indigo-950 text-white rounded-xl text-xs uppercase font-bold tracking-widest hover:scale-[1.01] transition-all glow-purple cursor-pointer inline-flex items-center space-x-2"
        >
          <Truck className="h-4 w-4" />
          <span>Monitor Shipping Timeline</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 text-left page-enter-fade">
      
      {/* Return link */}
      <button
        onClick={() => setCurrentTab('cart')}
        className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white cursor-pointer mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Shopping Cart</span>
      </button>

      {isProcessing ? (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
          <RefreshCw className="h-12 w-12 text-purple-400 animate-spin" />
          <p className="font-serif italic text-lg text-purple-200">Processing Signature Billing</p>
          <p className="text-xs text-gray-500 font-mono tracking-wide animate-pulse">
            {processingStateMsg || 'Initiating secure routing...'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left shipping + billing inputs (7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Destination address details */}
            <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 block font-semibold">Couture Logistics Gate</span>
              <h3 className="text-sm sm:text-base font-display font-semibold text-white">Shipping Address</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] text-gray-400 uppercase font-medium">Full Identifier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cassandra Sterling"
                    className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] text-gray-400 uppercase font-medium">Notification Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. cassandra@sterling.com"
                    className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] text-gray-400 uppercase font-medium">Physical Street Address (Suite/Apt)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 777 Luxury Rodeo Drive, Apt 4C"
                    className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 uppercase font-medium">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Los Angeles"
                    className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 uppercase font-medium">Postal Index Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 90210"
                    className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] text-gray-400 uppercase font-medium">Courier Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 555-0199"
                    className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment switcher & forms */}
            <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 block font-semibold">Payment Protocols</span>
                <h3 className="text-sm sm:text-base font-display font-semibold text-white mt-0.5">Billing Transaction Method</h3>
              </div>

              {/* Payment switches tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 rounded-xl border text-[10px] tracking-widest uppercase font-bold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                      : 'bg-neutral-950 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`py-3 rounded-xl border text-[10px] tracking-widest uppercase font-bold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                    paymentMethod === 'apple'
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                      : 'bg-neutral-950 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-3 rounded-xl border text-[10px] tracking-widest uppercase font-bold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                      : 'bg-neutral-950 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span>PayPal</span>
                </button>
              </div>

              {/* Dynamic payments inputs details */}
              {paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-5">
                  <div className="col-span-3 space-y-1.5">
                    <label className="text-[11px] text-gray-400 uppercase font-medium">Cardholder Registered Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Cassandra Sterling"
                      className="w-full bg-neutral-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  
                  <div className="col-span-3 space-y-1.5">
                    <label className="text-[11px] text-gray-400 uppercase font-medium">PCI-Secure Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-neutral-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none tracking-wider font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400 uppercase font-medium inline-block">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-neutral-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400 uppercase font-medium inline-block">CVV/CVC</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      className="w-full bg-neutral-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                  
                  <div className="text-[10px] text-gray-500 font-mono flex items-center space-x-1.5 col-span-3 pt-2">
                    <Lock className="h-3.5 w-3.5 text-purple-400" />
                    <span>Double encryptions enabled. Card keys are instantly blinded.</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple' && (
                <div className="p-6 rounded-2xl bg-black border border-white/5 text-center space-y-3">
                  <div className="h-10 w-10 text-white flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 mx-auto">
                    
                  </div>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Apple Pay express dispatch will launch biometric authentication (FaceID) upon form submittal.
                  </p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-6 rounded-2xl bg-black border border-white/5 text-center space-y-3">
                  <span className="font-sans font-bold text-lg italic text-[#003087]">PayPal</span>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    PayPal wallet secure redirection overlay executes instantly to deduct from your registered credit limits.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Right Checkout Recapitulation Summary (5 columns) */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0a0a0c] border border-white/10 space-y-4">
              <span className="font-display font-semibold text-xs uppercase tracking-[0.2em] text-white block pb-2 border-b border-white/5">Cart Verification list</span>
              
              {/* Items listing brief */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center space-x-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-11 w-9 rounded-lg object-cover object-top flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-white font-medium block truncate text-[11px]">{item.product.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">Size {item.selectedSize} × {item.quantity}</span>
                    </div>
                    <span className="font-mono text-white">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Calculations lists */}
              <div className="space-y-2 border-t border-white/5 pt-4 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Vault Bag Total</span>
                  <span className="font-mono text-white">${subtotal}</span>
                </div>

                {couponDiscountPct > 0 && (
                  <div className="flex justify-between text-emerald-400 font-mono">
                    <span>Authorized Voucher Discount</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Priority Air Freight</span>
                  <span className="font-mono text-white">
                    {shippingCost === 0 ? <b className="text-emerald-400">COMPLIMENTARY</b> : `$${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>PCI Encrypted Duties/Tax</span>
                  <span className="font-mono text-white">${taxCost}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-white/5 flex justify-between items-baseline font-semibold">
                <span className="text-xs uppercase text-white tracking-widest font-bold">Authorized Total</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-luxury">${grandTotal}</span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-800 to-indigo-950 border border-purple-500/20 hover:from-purple-700 hover:to-indigo-900 text-white rounded-xl text-xs uppercase font-bold tracking-[0.2em] transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer mt-4 block text-center"
              >
                Authorize Order Payment
              </button>

              <div className="flex items-center justify-center space-x-1 text-[9px] text-gray-500 font-mono">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>PCI-DSS GUARANTEE • VAULT AUTHENTIC PROTECTION</span>
              </div>

            </div>
          </aside>

        </form>
      )}

    </div>
  );
}
