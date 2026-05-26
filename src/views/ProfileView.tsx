import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { User, LogOut, ShieldCheck, ShoppingBag, MapPin, Phone, HelpCircle, CheckCircle, Clock } from 'lucide-react';
import { Order, UserProfile } from '../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  orders: Order[];
  onLogout: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  setCurrentTab: (tab: string) => void;
}

export default function ProfileView({
  currentUser,
  orders,
  onLogout,
  onUpdateProfile,
  setCurrentTab
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...currentUser });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [firebaseOrders, setFirebaseOrders] = useState<Order[]>([]);
  useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  const querySnapshot = await getDocs(collection(db, "orders"));

  const fetchedOrders = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as Order[];

  setFirebaseOrders(fetchedOrders.reverse());
};

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editData);
    setIsEditing(false);
    setSaveSuccessMsg('Profile updates registered successfully.');
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 text-left page-enter-fade">
      
      {/* Header section */}
      <div className="pb-8 border-b border-white/5 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400">Atelier Private Member</span>
          <h1 className="font-display font-medium text-3xl sm:text-4xl text-white mt-1">My Style Cabinet</h1>
          <p className="text-xs text-gray-500 font-light mt-2 max-w-sm">
            Manage your style preferences and track active couturial deliveries in real-time.
          </p>
        </div>
        
        {/* Logout */}
        <button
          onClick={onLogout}
          className="px-5 py-2.5 bg-neutral-950 border border-red-900/20 hover:border-red-500/30 text-red-400 font-sans text-xs uppercase tracking-widest font-semibold rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-md self-start sm:self-auto"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Silhouette Avatar & Preferences (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0a0a0c] border border-white/10 relative overflow-hidden">
            {/* ambient glow */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/5 blur-xl pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Avatar circle */}
              <div className="h-20 w-20 rounded-full overflow-hidden ring-2 ring-purple-500/20 shadow-xl bg-purple-950/40">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h4 className="font-display font-bold text-white text-base tracking-wide">{currentUser.name}</h4>
                <p className="text-xs text-purple-300 font-mono mt-0.5">{currentUser.email}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-purple-950/50 border border-purple-800/15 text-[10px] font-mono text-purple-300 rounded-full">
                  Joined: {currentUser.joinedDate}
                </span>
              </div>
            </div>

            {/* Editing / Displays details toggler */}
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 pt-6 mt-6 border-t border-white/5 text-xs text-gray-400">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-gray-500 block">Identifier Name</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-gray-500 block">Style Preference</label>
                  <select
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                    value={editData.preferredStyle}
                    onChange={(e) => setEditData({ ...editData, preferredStyle: e.target.value })}
                  >
                    <option value="Luxury Streetwear">Luxury Streetwear</option>
                    <option value="Atelier Dresses">Atelier Dresses</option>
                    <option value="Minimal Knits">Cashmere Knits</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-gray-500 block">Contact Phone</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-gray-500 block">Luxe Delivery Destination</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  />
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ ...currentUser });
                    }}
                    className="flex-1 py-2 rounded-xl border border-white/5 hover:bg-white/5 text-[10px] uppercase tracking-wider font-semibold text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-purple-800 to-indigo-950 rounded-xl text-white text-[10px] uppercase tracking-wider font-bold transition-colors shadow-lg shadow-purple"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-6 mt-6 border-t border-white/5 text-xs text-gray-400">
                <div className="flex justify-between py-1 border-b border-white/3">
                  <span className="text-gray-500">Atelier Preference:</span>
                  <span className="text-white font-medium">{currentUser.preferredStyle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/3">
                  <span className="text-gray-500">Registered Phone:</span>
                  <span className="text-white font-medium">{currentUser.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/3">
                  <span className="text-gray-500">Shipping Depot:</span>
                  <span className="text-white font-medium truncate max-w-[150px]">{currentUser.address}</span>
                </div>
                
                {saveSuccessMsg && (
                  <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 justify-center">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2.5 bg-neutral-950 border border-white/5 hover:border-purple-500/20 hover:bg-neutral-900 rounded-xl text-[10px] uppercase tracking-widest text-purple-300 hover:text-white transition-all cursor-pointer font-bold block text-center"
                >
                  Modify Cabinet Details
                </button>
              </div>
            )}
          </div>
          
          {/* Security details cards */}
          <div className="p-4 rounded-xl bg-neutral-950/20 border border-purple-500/5 text-[10px] text-gray-500 font-mono space-y-2">
            <div className="flex items-center space-x-2 text-purple-400/80 font-semibold uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>Couture Escrow Guard</span>
            </div>
            <p className="leading-normal">
              Every detail is protected by zero-trace credential masking inside our private database. We do not store credit numbers.
            </p>
          </div>
        </div>

        {/* Right: Simulated Order list with active timeline grids (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="text-left font-display font-semibold text-xs uppercase tracking-[0.2em] text-white">
            Active Vault Deliveries Ledger
          </div>

          {firebaseOrders.length === 0 ? (
            <div className="py-20 bg-[#0a0a0c] rounded-3xl border border-white/5 text-center space-y-4 flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-purple-950/10 border border-purple-800/10 flex items-center justify-center text-purple-400 mb-1">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <p className="font-serif italic text-base text-gray-300">No active drops tracked</p>
              <p className="text-xs text-gray-500 max-w-sm font-light leading-normal px-4">
                You have not placed any orders from the Vault yet. Explore the boutique, add pieces to your cart, and checkout to see live progress bars.
              </p>
              <button
                onClick={() => setCurrentTab('shop')}
                className="px-5 py-2.5 bg-purple-950/20 hover:bg-purple-900/40 text-purple-300 font-semibold border border-purple-800/10 rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer"
              >
                Enter Boutique
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {firebaseOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="rounded-3xl bg-[#0a0a0c] border border-white/10 p-5 sm:p-6 space-y-5"
                  >
                    {/* Header bar row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
                      <div className="text-left">
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Order registry index</span>
                        <p className="font-mono text-xs text-white font-bold">{order.id} • Registered on {order.date}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block">Ledger Total</span>
                        <p className="font-mono text-sm sm:text-base font-bold text-luxury">${order.total}</p>
                      </div>
                    </div>

                    {/* Progress tracking status timeline */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 animate-pulse text-purple-400" />
                          <span>Status: {order.status}</span>
                        </span>
                        <span className="text-gray-500">ESTIMATED COURIER ROUTING</span>
                      </div>

                      {/* Interactive visual loading bars */}
                      <div className="grid grid-cols-4 gap-1 sm:gap-2 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 glow-purple" />
                        <div className="h-full bg-neutral-800" />
                        <div className="h-full bg-neutral-800" />
                        <div className="h-full bg-neutral-800" />
                      </div>
                      
                      <div className="grid grid-cols-4 text-[9px] font-mono uppercase text-gray-500 text-center tracking-normal pt-1 font-semibold">
                        <span className="text-purple-400">Escrow Keys Verified</span>
                        <span>Sealing Box</span>
                        <span>Air Freight</span>
                        <span>Dispatch Courier</span>
                      </div>
                    </div>

                    {/* Items grid bought */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Consigned Outfits</span>
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                        {order.items?.map((cartItem) => (
                          <div
                            key={`${cartItem.product.id}-${cartItem.selectedSize}`}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center space-x-2.5 text-left">
                              <img
                                src={cartItem.product.images[0]}
                                alt={cartItem.product.name}
                                className="h-9 w-7 rounded bg-neutral-900 object-cover object-top"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="text-white font-medium block truncate text-[11px] max-w-[150px] sm:max-w-xs">{cartItem.product.name}</span>
                                <span className="text-[9px] text-gray-500 font-mono">Color: {cartItem.selectedColor.name} • Size {cartItem.selectedSize}</span>
                              </div>
                            </div>

                            <span className="font-mono text-white text-[11px]">
                              ${cartItem.product.price} × {cartItem.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address summaries */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5 text-[11px] text-gray-500 font-light text-left font-sans leading-normal">
                      <div>
                        <span className="text-gray-600 block text-[9px] font-mono uppercase tracking-wider font-semibold">Assigned Recipient</span>
                        <strong className="text-white">{order.shippingAddress.fullName}</strong>
                        <p className="line-clamp-1">{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                      </div>

                      <div className="flex flex-col justify-end items-end sm:text-right">
                        <span className="text-gray-600 block text-[9px] font-mono uppercase tracking-wider font-semibold">Verification</span>
                        <span>Method: {order.paymentMethod}</span>
                        <span className="text-purple-300 font-bold mt-1 uppercase text-[9px] font-mono">Double signature rider assigned</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
