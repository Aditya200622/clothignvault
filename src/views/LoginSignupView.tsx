import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, ShieldCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { UserProfile } from '../types';
import { signupUser, loginUser } from "../firebase/auth";
interface LoginSignupViewProps {
  onLogin: (user: UserProfile) => void;
  setCurrentTab: (tab: string) => void;
}

export default function LoginSignupView({ onLogin, setCurrentTab }: LoginSignupViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Input fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('Luxury Streetwear');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

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
      name:
        firebaseUser.displayName ||
        name ||
        email.split("@")[0],

      email: firebaseUser.email || email,

      phone: phone || "+91 0000000000",

      preferredStyle:
        preferredStyle || "Luxury Streetwear",

      joinedDate: new Date()
        .toISOString()
        .split("T")[0],

      address: "Luxury Member Access",

      city: "India",

      postalCode: "000000",

      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    };

    onLogin(generatedProfile);

    setCurrentTab("profile");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

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
    setPhone('+1 (415) 888-9999');
    setPassword('•••••••••');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 relative z-20 text-left page-enter-fade">
      
      <div className="p-6 sm:p-9 rounded-[2.5rem] bg-white border border-rose-100 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Swapper triggers */}
        <div className="flex border-b border-rose-50 pb-4 items-center justify-between">
          <div className="flex space-x-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`font-display text-sm uppercase tracking-widest font-black pb-2 border-b-2 transition-all duration-300 cursor-pointer ${
                isLogin ? 'border-rose-500 text-gray-950 font-black' : 'border-transparent text-gray-400 hover:text-rose-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`font-display text-sm uppercase tracking-widest font-black pb-2 border-b-2 transition-all duration-300 cursor-pointer ${
                !isLogin ? 'border-rose-500 text-gray-950 font-black' : 'border-transparent text-gray-400 hover:text-rose-500'
              }`}
            >
              Join Drops
            </button>
          </div>
          <Sparkles className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
        </div>

        {/* Brand visual header */}
        <div className="space-y-1">
          <h2 className="font-display font-black text-lg sm:text-xl text-gray-950 uppercase tracking-tight">
            {isLogin ? 'Welcome to the Vault' : 'Enlist inside the Registry'}
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            {isLogin 
              ? 'Provide credentials to verify your active membership keys.' 
              : 'Sign up to receive private lookbook dropdown notifications.'}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya G."
                  className="w-full bg-rose-50/50 border border-rose-100 focus:border-rose-400 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-800 focus:outline-none focus:ring-0 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <User className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Secure Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. adityaworkspace22@gmail.com"
                className="w-full bg-rose-50/50 border border-rose-100 focus:border-rose-400 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-800 focus:outline-none focus:ring-0 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-rose-50/50 border border-rose-100 focus:border-rose-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none font-medium"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Preferred Style</label>
                <select
                  className="w-full bg-rose-50/50 border border-rose-100 focus:border-rose-400 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none font-bold"
                  value={preferredStyle}
                  onChange={(e) => setPreferredStyle(e.target.value)}
                >
                  <option value="Atelier Dresses">Atelier Dresses</option>
                  <option value="Luxury Streetwear">Luxury Streetwear</option>
                  <option value="Minimal Knits">Cashmere Knits</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Account Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••••"
                className="w-full bg-rose-50/50 border border-rose-100 focus:border-rose-400 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-800 focus:outline-none focus:ring-0 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs uppercase font-extrabold tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
            ) : isLogin ? (
              <LogIn className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            <span>{loading ? 'Authenticating...' : isLogin ? 'Access House Vault' : 'Secure Drop Access'}</span>
          </button>
        </form>

        {/* Demo login shortcut for fast testing */}
        <div className="pt-4 border-t border-rose-100 text-center">
          <button
            type="button"
            onClick={handleShortcutGuest}
            className="text-[10px] font-mono text-rose-500 hover:text-rose-600 underline font-black cursor-pointer"
          >
            ⚡ Auto-populate Guest Credentials (Test)
          </button>
        </div>

        {/* Secure badge footer */}
        <div className="flex items-center justify-center space-x-1.5 text-[9px] text-gray-400 font-mono font-bold pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>VAULT COVENANT SECURE ACCESS ACTIVE</span>
        </div>

      </div>

    </div>
  );
}

// Inline Spinner loader inside component
function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
