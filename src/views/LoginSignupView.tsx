import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Sparkles, ShieldCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { UserProfile } from '../types';
import { signupUser, loginUser } from "../firebase/auth";

// ─── Placeholder model image URLs (replace with real transparent PNGs) ────────
const BACK_MODEL = "/LOGIN.png";
const FRONT_MODEL = "LOGIN.png";

// ─── Particle definition ──────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 6 + 5,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.6 + 0.2,
  }));
}

const PARTICLES = generateParticles(28);

// ─── Floating input with label ────────────────────────────────────────────────
interface FloatInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon: React.ReactNode;
}

function FloatInput({ label, type, value, onChange, placeholder, required, icon }: FloatInputProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative group">
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300 transition-colors duration-200 group-focus-within:text-rose-500"
        style={{ pointerEvents: 'none' }}
      >
        {icon}
      </div>
      <input
        type={type}
        required={required}
        placeholder={active ? (placeholder ?? '') : ''}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-5 pb-2 pl-9 pr-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-[13px] text-gray-800 font-medium placeholder:text-gray-300 focus:outline-none focus:border-rose-400 transition-all duration-200 peer"
        style={{
          boxShadow: focused ? '0 0 0 3px rgba(244,63,94,0.12)' : 'none',
        }}
      />
      <label
        className="absolute left-9 transition-all duration-200 pointer-events-none font-semibold"
        style={{
          top: active ? '7px' : '50%',
          transform: active ? 'none' : 'translateY(-50%)',
          fontSize: active ? '9px' : '12px',
          color: active ? (focused ? '#f43f5e' : '#9ca3af') : '#9ca3af',
          letterSpacing: active ? '0.08em' : '0.02em',
          textTransform: active ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>
    </div>
  );
}

// ─── Inline spinner ───────────────────────────────────────────────────────────
function Spinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface LoginSignupViewProps {
  onLogin: (user: UserProfile) => void;
  setCurrentTab: (tab: string) => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginSignupView({ onLogin, setCurrentTab }: LoginSignupViewProps) {
  const [isLogin, setIsLogin] = useState(true);

  // Input fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('Luxury Streetwear');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // ── Removed 3-D card tilt to prevent GPU text blur ──

  // ── Parallax for model images ──────────────────────────────────────────────
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setParallax({
        x: (e.clientX / window.innerWidth - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Firebase logic (untouched) ─────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let firebaseUser;
      if (isLogin) {
        firebaseUser = await loginUser(email, password);
      } else {
        firebaseUser = await signupUser(name, email, password);
      }
      const generatedProfile: UserProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || name || email.split("@")[0],
        email: firebaseUser.email || email,
        phone: phone || "+91 0000000000",
        preferredStyle: preferredStyle || "Luxury Streetwear",
        joinedDate: new Date().toISOString().split("T")[0],
        address: "Luxury Member Access",
        city: "India",
        postalCode: "000000",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      };
      onLogin(generatedProfile);
      setCurrentTab("profile");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShortcutGuest = () => {
    setEmail('adityaworkspace22@gmail.com');
    setName('Aditya G.');
    setPhone('+91 9876543210');
    setPassword('password123');
  };

  // ── Fade animation state ───────────────────────────────────────────────────
  const fadeVariants = {
    login: { opacity: 1, x: 0, zIndex: 10, transition: { duration: 0.4 } },
    signup: { opacity: 0, x: -20, zIndex: -1, transition: { duration: 0.4 } },
  };
  const signupFadeVariants = {
    signup: { opacity: 1, x: 0, zIndex: 10, transition: { duration: 0.4 } },
    login: { opacity: 0, x: 20, zIndex: -1, transition: { duration: 0.4 } },
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8"
      style={{
        background: 'linear-gradient(135deg, #fff0f3 0%, #ffe4ec 40%, #ffd6e7 70%, #ffb3cc 100%)',
        fontFamily: "'Playfair Display', 'Georgia', serif",
      }}
    >
      {/* Google fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .dm { font-family: 'DM Sans', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif; }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0) scale(1); opacity: var(--op); }
          50% { transform: translateY(-30px) scale(1.3); opacity: calc(var(--op) * 0.6); }
          100% { transform: translateY(0) scale(1); opacity: var(--op); }
        }
        .float-slow { animation: floatY 5s ease-in-out infinite; }
        .float-slow-2 { animation: floatY 7s ease-in-out infinite 1s; }
        select { appearance: none; -webkit-appearance: none; }
      `}</style>

      {/* Big outer glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(255,182,193,0.35) 0%, transparent 70%)',
        }}
      />

      {/* ── 2-D card wrapper (No 3D transforms to ensure crisp text) ── */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row bg-white"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        style2={{ height: '700px' }}
        // We handle height via CSS below
      >
        {/* ─── LEFT: Form container ─── */}
        <div className="relative lg:w-[45%] w-full min-h-[520px]">
          {/* ── FRONT: Login ── */}
          <motion.div
            animate={isLogin ? 'login' : 'signup'}
            variants={fadeVariants}
            initial="login"
            className="absolute inset-0 bg-white flex flex-col justify-center px-8 sm:px-12 py-10"
          >
            <LoginForm
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              loading={loading}
              handleSubmit={handleSubmit}
              onSwitchToSignup={() => setIsLogin(false)}
              onGuestFill={handleShortcutGuest}
            />
          </motion.div>

          {/* ── BACK: Signup ── */}
          <motion.div
            animate={isLogin ? 'login' : 'signup'}
            variants={signupFadeVariants}
            initial="signup"
            className="absolute inset-0 bg-white flex flex-col justify-center px-8 sm:px-10 py-8 overflow-y-auto"
          >
            <SignupForm
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              name={name} setName={setName}
              phone={phone} setPhone={setPhone}
              preferredStyle={preferredStyle} setPreferredStyle={setPreferredStyle}
              agreedTerms={agreedTerms} setAgreedTerms={setAgreedTerms}
              loading={loading}
              handleSubmit={handleSubmit}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          </motion.div>
        </div>

        {/* ─── RIGHT: Fashion showcase ─── */}
        <div
          className="relative lg:w-[55%] w-full overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #ffb3cc 0%, #ff7aab 40%, #ff4d8d 75%, #e83e8c 100%)',
            minHeight: 340,
          }}
        >
          {/* Radial glow overlays */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 70% at 60% 30%, rgba(255,255,255,0.22) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 50% at 30% 80%, rgba(255,100,150,0.3) 0%, transparent 60%)' }} />

          {/* Light rays */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.18 }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 origin-top"
                style={{
                  width: 2,
                  height: '120%',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)',
                  transform: `rotate(${-20 + i * 12}deg) translateX(-50%)`,
                }}
              />
            ))}
          </div>

          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {PARTICLES.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: 'rgba(255,255,255,0.85)',
                  boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(255,255,255,0.4)`,
                  '--op': p.opacity,
                  animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* Sparkle icons */}
          <div className="absolute top-8 right-10 text-white/30 float-slow">
            <Sparkles size={28} />
          </div>
          <div className="absolute bottom-16 left-8 text-white/20 float-slow-2">
            <Sparkles size={18} />
          </div>

          {/* Model images (parallax layers) */}
          <div className="absolute inset-0 flex items-end justify-center" style={{ zIndex: 2 }}>
            {/* Background model */}
            <motion.img
              src={BACK_MODEL}
              alt="Fashion background model"
              className="absolute bottom-0 h-[88%] object-contain object-bottom select-none"
              animate={{
                x: parallax.x * 0.5,
                y: parallax.y * 0.5,
              }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
              style={{ filter: 'brightness(0.92) saturate(1.1)', opacity: 0.7 }}
              draggable={false}
            />
            {/* Foreground model */}
            <motion.img
              src={FRONT_MODEL}
              alt="Fashion foreground model"
              className="relative bottom-0 h-[96%] object-contain object-bottom select-none float-slow"
              animate={{
                x: parallax.x,
                y: parallax.y,
              }}
              transition={{ type: 'spring', stiffness: 50, damping: 18 }}
              draggable={false}
            />
          </div>

          {/* Editorial text */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 z-10">
            <div
              className="inline-block mb-2 px-3 py-1 rounded-full text-white/90 dm font-semibold tracking-widest uppercase"
              style={{ fontSize: 9, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              ✦ New Collection 2026
            </div>
            <h3
              className="playfair font-black text-white leading-tight"
              style={{ fontSize: 'clamp(22px, 3.5vw, 38px)', textShadow: '0 4px 20px rgba(180,20,70,0.35)' }}
            >
              Clothing VULT
            </h3>
            <p className="dm text-white/70 font-medium mt-1" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Premium Indian Western Fashion
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({
  email, setEmail, password, setPassword, loading, handleSubmit, onSwitchToSignup, onGuestFill,
}: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onSwitchToSignup: () => void;
  onGuestFill: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Brand mark */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="dm font-black text-rose-500 tracking-widest uppercase text-xs"></span>
      </div>

      {/* Heading */}
      <div className="space-y-1.5">
        <h2 className="playfair font-black text-gray-950" style={{ fontSize: 'clamp(22px, 2.5vw, 30px)' }}>
          Welcome Back
        </h2>
        <p className="dm text-gray-400 leading-relaxed" style={{ fontSize: 12 }}>
          Access your ClothingVault account and continue your fashion journey.
        </p>
      </div>

      {/* Inputs */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatInput label="Email Address" type="email" value={email} onChange={setEmail}
          placeholder="you@example.com" required icon={<Mail size={15} />} />
        <FloatInput label="Password" type="password" value={password} onChange={setPassword}
          placeholder="••••••••••" required icon={<Lock size={15} />} />

        {/* CTA */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(244,63,94,0.4)' }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-2xl text-white dm font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors"
          style={{
            fontSize: 11,
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
          }}
        >
          {loading ? <Spinner className="animate-spin" /> : <LogIn size={15} />}
          <span>{loading ? 'Signing In…' : 'Sign In'}</span>
        </motion.button>
      </form>

      {/* Social row */}
      <SocialRow />

      {/* Switch + guest */}
      <div className="pt-2 space-y-2 text-center">
        <p className="dm text-gray-400" style={{ fontSize: 11 }}>
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-rose-500 font-bold hover:text-rose-600 transition-colors cursor-pointer">
            Create one
          </button>
        </p>
        <button onClick={onGuestFill} className="dm text-[10px] font-mono text-rose-400 hover:text-rose-600 underline cursor-pointer">
          ⚡ Auto-populate guest credentials
        </button>
      </div>

      <SecureBadge />
    </div>
  );
}

// ─── Signup Form ───────────────────────────────────────────────────────────────
function SignupForm({
  email, setEmail, password, setPassword,
  name, setName, phone, setPhone,
  preferredStyle, setPreferredStyle,
  agreedTerms, setAgreedTerms,
  loading, handleSubmit, onSwitchToLogin,
}: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  name: string; setName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  preferredStyle: string; setPreferredStyle: (v: string) => void;
  agreedTerms: boolean; setAgreedTerms: (v: boolean) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-2">
        <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="dm font-black text-rose-500 tracking-widest uppercase text-xs">ClothingVault</span>
      </div>

      <div className="space-y-1">
        <h2 className="playfair font-black text-gray-950" style={{ fontSize: 'clamp(20px, 2.2vw, 27px)' }}>
          Create Your Account
        </h2>
        <p className="dm text-gray-400 leading-relaxed" style={{ fontSize: 11 }}>
          Join ClothingVault and unlock exclusive fashion collections.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <FloatInput label="Full Name" type="text" value={name} onChange={setName}
          placeholder="Aditya G." required icon={<User size={14} />} />
        <FloatInput label="Email Address" type="email" value={email} onChange={setEmail}
          placeholder="you@example.com" required icon={<Mail size={14} />} />

        <div className="grid grid-cols-2 gap-3">
          <FloatInput label="Phone" type="tel" value={phone} onChange={setPhone}
            placeholder="+91 00000 00000" icon={<span className="text-rose-300 text-xs">📞</span>} />

          {/* Preferred style select */}
          <div className="relative">
            <label className="absolute top-1.5 left-4 text-[9px] uppercase tracking-widest text-gray-400 font-semibold dm pointer-events-none" style={{ zIndex: 1 }}>
              Style
            </label>
            <select
              value={preferredStyle}
              onChange={(e) => setPreferredStyle(e.target.value)}
              className="w-full pt-5 pb-2 pl-4 pr-8 rounded-2xl bg-rose-50/70 border border-rose-100 text-[12px] text-gray-700 font-semibold dm focus:outline-none focus:border-rose-400 transition-all"
            >
              <option value="Atelier Dresses">Atelier Dresses</option>
              <option value="Luxury Streetwear">Luxury Streetwear</option>
              <option value="Minimal Knits">Cashmere Knits</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-300 pointer-events-none text-xs">▾</span>
          </div>
        </div>

        <FloatInput label="Password" type="password" value={password} onChange={setPassword}
          placeholder="••••••••••" required icon={<Lock size={14} />} />

        {/* Terms checkbox */}
        <div className="flex items-start gap-2.5">
          <div
            onClick={() => setAgreedTerms(!agreedTerms)}
            className="mt-0.5 w-4 h-4 rounded-md border-2 flex items-center justify-center cursor-pointer flex-shrink-0 transition-all"
            style={{ borderColor: agreedTerms ? '#f43f5e' : '#fca5a5', background: agreedTerms ? '#f43f5e' : 'transparent' }}
          >
            {agreedTerms && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <p className="dm text-gray-400 leading-snug" style={{ fontSize: 10 }}>
            I agree to all statements in{' '}
            <a href="#" className="text-rose-500 font-semibold hover:underline">terms of service.</a>
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(244,63,94,0.4)' }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-2xl text-white dm font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors"
          style={{ fontSize: 11, background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}
        >
          {loading ? <Spinner className="animate-spin" /> : <UserPlus size={15} />}
          <span>{loading ? 'Creating Account…' : 'Create Account'}</span>
        </motion.button>
      </form>

      <div className="text-center">
        <p className="dm text-gray-400" style={{ fontSize: 11 }}>
          Already a member?{' '}
          <button onClick={onSwitchToLogin} className="text-rose-500 font-bold hover:text-rose-600 transition-colors cursor-pointer">
            Sign in
          </button>
        </p>
      </div>

      <SecureBadge />
    </div>
  );
}

// ─── Social row ────────────────────────────────────────────────────────────────
function SocialRow() {
  const socials = [
    { label: 'F', color: '#1877F2', title: 'Facebook' },
    { label: 'G', color: '#EA4335', title: 'Google' },
    { label: 'T', color: '#1DA1F2', title: 'Twitter' },
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-rose-100" />
      <span className="dm text-gray-300 font-semibold" style={{ fontSize: 10 }}>or continue with</span>
      <div className="flex-1 h-px bg-rose-100" />
      <div className="flex gap-2">
        {socials.map((s) => (
          <motion.button
            key={s.title}
            type="button"
            whileHover={{ scale: 1.12, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md cursor-pointer"
            style={{ background: s.color }}
          >
            {s.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Secure badge ─────────────────────────────────────────────────────────────
function SecureBadge() {
  return (
    <div className="flex items-center justify-center gap-1.5 dm" style={{ fontSize: 9, color: '#9ca3af' }}>
      <ShieldCheck size={12} className="text-emerald-400" />
      <span className="font-bold tracking-wide uppercase">Secure Login Protected</span>
    </div>
  );
}