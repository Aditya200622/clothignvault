import React, { useEffect, useState, useRef } from 'react';
import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { LogOut, ShieldCheck, ShoppingBag, MapPin, Heart, Star, Package, CreditCard, CheckCircle, Clock, ChevronRight, Pencil, X, Save, Camera } from 'lucide-react';
import { Order, UserProfile } from '../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  orders: Order[];
  onLogout: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  setCurrentTab: (tab: string) => void;
}

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const count = useAnimatedCounter(value);
  return <span>{prefix}{count}{suffix}</span>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  Processing: { label: 'Processing', color: '#D97706', bg: '#FEF3C7', dot: '#F59E0B' },
  Shipped:    { label: 'Shipped',    color: '#2563EB', bg: '#DBEAFE', dot: '#3B82F6' },
  Delivered:  { label: 'Delivered',  color: '#059669', bg: '#D1FAE5', dot: '#10B981' },
  Cancelled:  { label: 'Cancelled',  color: '#DC2626', bg: '#FEE2E2', dot: '#EF4444' },
};

const STEPS = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    Processing: 1,
    Confirmed: 2,
    Packed: 3,
    Shipped: 3,
    Delivered: 4,
    Cancelled: -1,
  };
  return map[status] ?? 0;
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
  const [mounted, setMounted] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>(
    () => localStorage.getItem(`avatar_${currentUser.email}`) || currentUser.avatar
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatarSrc(base64);
      localStorage.setItem(`avatar_${currentUser.email}`, base64);
      onUpdateProfile({ ...currentUser, avatar: base64 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    fetchOrders();
    setTimeout(() => setMounted(true), 50);
  }, []);

  const fetchOrders = async () => {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", currentUser.email)
    );
    const querySnapshot = await getDocs(q);
    const fetchedOrders = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as Order[];
    setFirebaseOrders(fetchedOrders.reverse());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editData);
    setIsEditing(false);
    setSaveSuccessMsg('Profile updated successfully.');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const totalSpend = firebaseOrders.reduce((sum, o) => sum + (parseFloat(String(o.total)) || 0), 0);

  const stats = [
    { label: 'Total Orders',      value: firebaseOrders.length, prefix: '',  suffix: '',  icon: <Package className="w-5 h-5" /> },
    { label: 'Total Spend',       value: Math.round(totalSpend),  prefix: '₹', suffix: '',  icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Saved Addresses',   value: 1,                        prefix: '',  suffix: '',  icon: <MapPin className="w-5 h-5" /> },
    { label: 'Wishlist',          value: 0,                        prefix: '',  suffix: '',  icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FFF5F8 0%, #FFF0F4 40%, #F8F0FF 100%)',
        minHeight: '100vh',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
      className={`px-4 sm:px-6 lg:px-8 py-10 relative z-20 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', top: '-120px', right: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,79,135,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(180,100,220,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Top Header ── */}
        <div
          style={{ animationDelay: '0ms' }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 fade-in-up"
        >
          <div>
            <p style={{ color: '#FF4F87', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'sans-serif', fontWeight: 600, textTransform: 'uppercase' }}>
              Private Member Area
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 'clamp(28px, 5vw, 44px)', color: '#1a0a12', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              My Account
            </h1>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '50px',
              border: '1px solid rgba(220,38,38,0.2)',
              background: 'rgba(255,255,255,0.7)',
              color: '#DC2626', fontSize: '11px',
              fontFamily: 'sans-serif', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#FEE2E2')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.7)')}
          >
            <LogOut style={{ width: 14, height: 14 }} />
            Sign Out
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,79,135,0.12)',
                borderRadius: '20px',
                padding: '20px 22px',
                boxShadow: '0 4px 24px rgba(255,79,135,0.06)',
                animationDelay: `${i * 80}ms`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              className="fade-in-up hover-lift"
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(255,79,135,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(255,79,135,0.06)'; }}
            >
              <div style={{ color: '#FF4F87', marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: 'sans-serif', fontSize: '22px', fontWeight: 700, color: '#1a0a12', lineHeight: 1 }}>
                <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: 'sans-serif', fontSize: '10px', color: '#9ca3af', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Main 2-col grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ────── LEFT COLUMN ────── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Profile Card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.78)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,79,135,0.14)',
                borderRadius: '28px',
                padding: '32px 28px',
                boxShadow: '0 8px 40px rgba(255,79,135,0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="fade-in-up"
            >
              {/* Decorative gradient blob inside card */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: 'radial-gradient(circle at top right, rgba(255,79,135,0.08), transparent 70%)', pointerEvents: 'none' }} />

              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
                <div style={{ position: 'relative' }}>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  {/* Clickable avatar wrapper */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: 96, height: 96, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF4F87, #ff8fb3)',
                      padding: '3px',
                      boxShadow: '0 0 0 4px rgba(255,79,135,0.12)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    title="Change profile photo"
                  >
                    <img
                      src={avatarSrc}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Hover overlay */}
                    <div className="avatar-overlay" style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.2s ease',
                    }}>
                      <Camera style={{ width: 18, height: 18, color: 'white' }} />
                    </div>
                  </div>
                  {/* Floating camera icon badge */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute', bottom: 22, left: -4,
                      background: 'linear-gradient(135deg, #FF4F87, #ff2d6f)',
                      borderRadius: '50%', width: 24, height: 24,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(255,79,135,0.45)',
                      border: '2px solid white',
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                    title="Upload photo"
                  >
                    <Camera style={{ width: 10, height: 10, color: 'white' }} />
                  </div>
                  {/* Gold tier badge */}
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                    borderRadius: '50%', width: 26, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
                    border: '2px solid white',
                  }}>
                    <Star style={{ width: 11, height: 11, color: 'white', fill: 'white' }} />
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: '#1a0a12', margin: 0 }}>
                    {currentUser.name}
                  </h3>
                  <p style={{ fontFamily: 'sans-serif', fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                    {currentUser.email}
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    marginTop: 10, padding: '5px 14px',
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(252,211,77,0.15))',
                    border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: 50,
                  }}>
                    <Star style={{ width: 10, height: 10, color: '#D97706', fill: '#D97706' }} />
                    <span style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 700, color: '#D97706', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Gold Member
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ margin: '24px 0', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,79,135,0.15), transparent)' }} />

              {/* Details / Edit form */}
              {isEditing ? (
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Full Name', key: 'name', type: 'text' },
                    { label: 'Phone', key: 'phone', type: 'text' },
                    { label: 'Delivery Address', key: 'address', type: 'text' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ fontFamily: 'sans-serif', fontSize: 9, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={(editData as any)[field.key]}
                        onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '9px 13px', borderRadius: 12,
                          border: '1px solid rgba(255,79,135,0.2)',
                          background: 'rgba(255,245,248,0.8)',
                          fontFamily: 'sans-serif', fontSize: 12, color: '#1a0a12',
                          outline: 'none',
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ fontFamily: 'sans-serif', fontSize: 9, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
                      Style Preference
                    </label>
                    <select
                      value={editData.preferredStyle}
                      onChange={e => setEditData({ ...editData, preferredStyle: e.target.value })}
                      style={{
                        width: '100%', padding: '9px 13px', borderRadius: 12,
                        border: '1px solid rgba(255,79,135,0.2)',
                        background: 'rgba(255,245,248,0.8)',
                        fontFamily: 'sans-serif', fontSize: 12, color: '#1a0a12',
                        outline: 'none', cursor: 'pointer',
                      }}
                    >
                      <option value="Luxury Streetwear">Luxury Streetwear</option>
                      <option value="Atelier Dresses">Atelier Dresses</option>
                      <option value="Minimal Knits">Cashmere Knits</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setEditData({ ...currentUser }); }}
                      style={{
                        flex: 1, padding: '10px', borderRadius: 12,
                        border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.8)',
                        fontFamily: 'sans-serif', fontSize: 11, fontWeight: 600,
                        color: '#6b7280', cursor: 'pointer', letterSpacing: '0.06em',
                        textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <X style={{ width: 12, height: 12 }} /> Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1, padding: '10px', borderRadius: 12,
                        border: 'none',
                        background: 'linear-gradient(135deg, #FF4F87, #ff2d6f)',
                        fontFamily: 'sans-serif', fontSize: 11, fontWeight: 700,
                        color: 'white', cursor: 'pointer', letterSpacing: '0.06em',
                        textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: '0 4px 16px rgba(255,79,135,0.3)',
                      }}
                    >
                      <Save style={{ width: 12, height: 12 }} /> Save
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Style', value: currentUser.preferredStyle },
                    { label: 'Phone', value: currentUser.phone },
                    { label: 'Member Since', value: currentUser.joinedDate },
                    { label: 'Address', value: currentUser.address },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>{row.label}</span>
                      <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#1a0a12', fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>{row.value}</span>
                    </div>
                  ))}

                  {saveSuccessMsg && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, background: '#D1FAE5', marginTop: 4 }}>
                      <CheckCircle style={{ width: 13, height: 13, color: '#059669' }} />
                      <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#059669' }}>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      marginTop: 6, padding: '11px', borderRadius: 14,
                      border: '1px solid rgba(255,79,135,0.2)',
                      background: 'rgba(255,79,135,0.04)',
                      fontFamily: 'sans-serif', fontSize: 11, fontWeight: 700,
                      color: '#FF4F87', cursor: 'pointer', letterSpacing: '0.1em',
                      textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,79,135,0.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,79,135,0.04)'; }}
                  >
                    <Pencil style={{ width: 12, height: 12 }} />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Security note */}
            <div style={{
              background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,79,135,0.08)', borderRadius: 16,
              padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <ShieldCheck style={{ width: 15, height: 15, color: '#FF4F87' }} />
                <span style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 700, color: '#FF4F87', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Secure & Private
                </span>
              </div>
              <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
                Your details are protected with zero-trace credential masking. We never store payment card numbers.
              </p>
            </div>
          </div>

          {/* ────── RIGHT COLUMN ────── */}
          <div className="lg:col-span-8 space-y-5">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: '#1a0a12', margin: 0 }}>
                Order History
              </h2>
              <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#9ca3af' }}>
                {firebaseOrders.length} order{firebaseOrders.length !== 1 ? 's' : ''}
              </span>
            </div>

            {firebaseOrders.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,79,135,0.1)', borderRadius: 28,
                padding: '60px 40px', textAlign: 'center',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(255,79,135,0.06)',
                  border: '1px solid rgba(255,79,135,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <ShoppingBag style={{ width: 24, height: 24, color: '#FF4F87' }} />
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 400, color: '#1a0a12', margin: '0 0 8px' }}>
                  Your wardrobe awaits
                </p>
                <p style={{ fontFamily: 'sans-serif', fontSize: 12, color: '#9ca3af', maxWidth: 320, margin: '0 auto 24px', lineHeight: 1.7 }}>
                  You haven't placed any orders yet. Explore the boutique and discover your next favourite piece.
                </p>
                <button
                  onClick={() => setCurrentTab('shop')}
                  style={{
                    padding: '12px 28px', borderRadius: 50,
                    background: 'linear-gradient(135deg, #FF4F87, #ff2d6f)',
                    border: 'none', color: 'white',
                    fontFamily: 'sans-serif', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,79,135,0.3)',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.2s ease',
                  }}
                >
                  Shop Now <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {firebaseOrders.map((order, idx) => {
                  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG['Processing'];
                  const stepIdx = getStepIndex(order.status);
                  const cancelled = order.status === 'Cancelled';

                  return (
                    <div
                      key={order.id}
                      style={{
                        background: 'rgba(255,255,255,0.78)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,79,135,0.1)',
                        borderRadius: 24,
                        padding: '24px',
                        boxShadow: '0 4px 24px rgba(255,79,135,0.05)',
                        animationDelay: `${idx * 60}ms`,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      className="fade-in-up"
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 36px rgba(255,79,135,0.1)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(255,79,135,0.05)'; }}
                    >
                      {/* Order header */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 9, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 3px' }}>
                            Order
                          </p>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 12, fontWeight: 700, color: '#1a0a12', margin: 0 }}>
                            {order.id}
                          </p>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>
                            {order.date}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          {/* Status badge */}
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: '6px 14px', borderRadius: 50,
                            background: statusCfg.bg,
                            border: `1px solid ${statusCfg.dot}30`,
                          }}>
                            <span style={{
                              width: 7, height: 7, borderRadius: '50%',
                              background: statusCfg.dot,
                              display: 'inline-block',
                              boxShadow: `0 0 0 3px ${statusCfg.dot}25`,
                              animation: 'pulse-dot 2s infinite',
                            }} />
                            <span style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 700, color: statusCfg.color, letterSpacing: '0.06em' }}>
                              {statusCfg.label}
                            </span>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontFamily: 'sans-serif', fontSize: 9, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 2px' }}>Total</p>
                            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#FF4F87', margin: 0 }}>
                              ₹{order.total}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ maxHeight: 140, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {order.items?.map((cartItem) => (
                            <div
                              key={`${cartItem.product.id}-${cartItem.selectedSize}`}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img
                                  src={cartItem.product.images[0]}
                                  alt={cartItem.product.name}
                                  referrerPolicy="no-referrer"
                                  style={{ width: 44, height: 54, borderRadius: 10, objectFit: 'cover', objectPosition: 'top', background: '#f9f0f4', flexShrink: 0 }}
                                />
                                <div>
                                  <p style={{ fontFamily: 'sans-serif', fontSize: 12, fontWeight: 500, color: '#1a0a12', margin: '0 0 3px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {cartItem.product.name}
                                  </p>
                                  <p style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#9ca3af', margin: 0 }}>
                                    {cartItem.selectedColor.name} · Size {cartItem.selectedSize}
                                  </p>
                                </div>
                              </div>
                              <span style={{ fontFamily: 'sans-serif', fontSize: 12, fontWeight: 600, color: '#1a0a12', flexShrink: 0 }}>
                                ₹{cartItem.product.price} × {cartItem.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step tracker */}
                      {!cancelled ? (
                        <div style={{ padding: '20px 0 4px' }}>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 9, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px', fontWeight: 600 }}>
                            Tracking
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                            {STEPS.map((step, si) => {
                              const done = si <= stepIdx;
                              const active = si === stepIdx;
                              return (
                                <React.Fragment key={step}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                                    <div style={{
                                      width: active ? 28 : 22, height: active ? 28 : 22,
                                      borderRadius: '50%',
                                      background: done
                                        ? (active ? 'linear-gradient(135deg, #FF4F87, #ff2d6f)' : 'linear-gradient(135deg, #FF4F87, #ff8fb3)')
                                        : '#f3f4f6',
                                      border: active ? '2px solid rgba(255,79,135,0.4)' : (done ? 'none' : '2px solid #e5e7eb'),
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      boxShadow: active ? '0 0 0 5px rgba(255,79,135,0.12)' : (done ? '0 2px 8px rgba(255,79,135,0.2)' : 'none'),
                                      transition: 'all 0.3s ease',
                                      animation: active ? 'step-pulse 2s infinite' : 'none',
                                      flexShrink: 0,
                                    }}>
                                      {done && !active && <CheckCircle style={{ width: 12, height: 12, color: 'white' }} />}
                                      {active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', display: 'block' }} />}
                                    </div>
                                    <span style={{
                                      fontFamily: 'sans-serif', fontSize: 8.5, marginTop: 6,
                                      color: done ? '#FF4F87' : '#9ca3af',
                                      fontWeight: active ? 700 : 500,
                                      letterSpacing: '0.03em',
                                      textAlign: 'center',
                                      maxWidth: 54, lineHeight: 1.3,
                                    }}>
                                      {step}
                                    </span>
                                  </div>
                                  {si < STEPS.length - 1 && (
                                    <div style={{
                                      flex: 1, height: 2, margin: '0 4px', marginBottom: 20,
                                      background: si < stepIdx ? 'linear-gradient(90deg, #FF4F87, #ff8fb3)' : '#e5e7eb',
                                      borderRadius: 2, minWidth: 8,
                                      transition: 'background 0.4s ease',
                                    }} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div style={{ paddingTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                          <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#DC2626', fontWeight: 600 }}>
                            This order was cancelled
                          </span>
                        </div>
                      )}

                      {/* Shipping */}
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 9, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 5px', fontWeight: 600 }}>
                            Ship to
                          </p>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 12, color: '#1a0a12', fontWeight: 600, margin: '0 0 2px' }}>
                            {order.shippingAddress.fullName}
                          </p>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                            {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 9, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 5px', fontWeight: 600 }}>
                            Payment
                          </p>
                          <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#1a0a12', margin: 0 }}>
                            {order.paymentMethod}
                          </p>
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        .fade-in-up {
          animation: fadeInUp 0.55s ease both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px var(--dot-color, rgba(255,79,135,0.2)); }
          50%       { box-shadow: 0 0 0 6px transparent; }
        }

        @keyframes step-pulse {
          0%, 100% { box-shadow: 0 0 0 5px rgba(255,79,135,0.12); }
          50%       { box-shadow: 0 0 0 8px rgba(255,79,135,0.06); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,79,135,0.2); border-radius: 4px; }

        [title="Change profile photo"]:hover .avatar-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}