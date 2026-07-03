import { Sparkles, ShieldCheck, Truck, RotateCcw, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const handleNavigation = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#FAEEED] border-t border-rose-100 pt-16 pb-8 overflow-hidden z-20 text-left">
      
      {/* Editorial subtle pink-red background halo glows */}
      <div className="absolute -top-32 left-[20%] w-96 h-96 rounded-full bg-rose-300/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full bg-pink-400/10 blur-[150px] pointer-events-none" />

      {/* Brand value statement ribbons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-rose-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white border border-rose-100 rounded-xl text-rose-500 shadow-xs">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-gray-950 text-xs uppercase tracking-widest font-black">Priority Air Express</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed font-semibold">Complimentary 2-4 day worldwide courier transport on orders ₹550+.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white border border-rose-100 rounded-xl text-rose-500 shadow-xs">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-gray-950 text-xs uppercase tracking-widest font-black">Concierge Exchanges</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed font-semibold">Premium 14-day slot booking for complimentary return couriers.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white border border-rose-100 rounded-xl text-rose-500 shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-gray-950 text-xs uppercase tracking-widest font-black">Signature Security</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed font-semibold">Every checkout is fully PCI-compliant with double biometric gates.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white border border-rose-100 rounded-xl text-rose-500 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-gray-950 text-xs uppercase tracking-widest font-black">Limited Drop Rarity</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed font-semibold">Garments are restricted to 150 pieces per design to ensure unique presence.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Brand Summary */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center border border-rose-250">
              <span className="font-display font-black text-white text-[10px] tracking-wider">CV</span>
            </div>
            <span className="font-display font-black text-base tracking-[0.2em] uppercase text-gray-950">
              CLOTHING<span className="text-rose-500 font-light">VAULT</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            ClothingVault is a premium Indian women's western fashion brand delivering elegant, modern and trend-focused apparel. 
            <br/><br/>
            <strong>Store Address:</strong><br/>
            Shop No. 12, Sarojini Nagar Market, New Delhi, India.
          </p>
          <div className="flex space-x-3 pt-2">
            <motion.a 
              href="https://www.instagram.com/clothingvault_co?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              whileHover={{ scale: 1.1, y: -2 }}
              className="p-2.5 bg-white border border-rose-100 rounded-full text-rose-500 hover:text-rose-600 transition-colors shadow-xs"
            >
              <Instagram className="h-4 w-4" />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.1, y: -2 }}
              className="p-2.5 bg-white border border-rose-100 rounded-full text-rose-500 hover:text-rose-600 transition-colors shadow-xs"
            >
              <Facebook className="h-4 w-4" />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.1, y: -2 }}
              className="p-2.5 bg-white border border-rose-100 rounded-full text-rose-500 hover:text-rose-600 transition-colors shadow-xs"
            >
              <Twitter className="h-4 w-4" />
            </motion.a>
          </div>
        </div>

        {/* Links Column 1: Shop */}
        <div className="md:col-span-2 space-y-4">
          <p className="font-display text-gray-950 text-[10px] uppercase tracking-[0.25em] font-black">Interactive Drops</p>
          <ul className="space-y-2 text-xs font-bold text-gray-500">
            <li>
              <button 
                onClick={() => handleNavigation('shop')} 
                className="hover:text-rose-500 transition-colors duration-200 cursor-pointer hover:translate-x-1 inline-block"
              >
                All Apparel
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('categories')} 
                className="hover:text-rose-500 transition-colors duration-200 cursor-pointer hover:translate-x-1 inline-block"
              >
                Streetwear Hub
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('categories')} 
                className="hover:text-rose-500 transition-colors duration-200 cursor-pointer hover:translate-x-1 inline-block"
              >
                Atelier Dresses
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('shop')} 
                className="hover:text-rose-500 transition-colors duration-200 cursor-pointer hover:translate-x-1 inline-block"
              >
                New Arrivals
              </button>
            </li>
          </ul>
        </div>

        {/* Links Column 2: House info */}
        <div className="md:col-span-2 space-y-4">
          <p className="font-display text-gray-950 text-[10px] uppercase tracking-[0.25em] font-black">The House</p>
          <ul className="space-y-2 text-xs font-bold text-gray-500">
            <li>
              <button 
                onClick={() => handleNavigation('about')} 
                className="hover:text-rose-500 transition-colors duration-200 cursor-pointer hover:translate-x-1 inline-block"
              >
                About Brand
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('about')} 
                className="hover:text-rose-500 transition-colors duration-200 cursor-pointer hover:translate-x-1 inline-block"
              >
                Our Atelier Craft
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('contact')} 
                className="hover:text-rose-500 transition-colors duration-200 cursor-pointer hover:translate-x-1 inline-block"
              >
                Studio Contacts
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('contact')} 
                className="hover:text-rose-500 transition-colors duration-200 cursor-pointer hover:translate-x-1 inline-block"
              >
                Boutique Locator
              </button>
            </li>
          </ul>
        </div>

        {/* newsletter section */}
        <div className="md:col-span-4 space-y-4">
          <p className="font-display text-gray-950 text-[10px] uppercase tracking-[0.25em] font-black">Newsletter Vault</p>
          <p className="text-xs text-gray-500 leading-normal font-bold">
            Subscribe to receive priority notifications for private drops, back-in-stock alerts, and lookbooks.
          </p>
          <div className="flex border border-rose-150 rounded-xl overflow-hidden bg-white p-1 shadow-xs hover:shadow-md focus-within:ring-1 focus-within:ring-rose-450 focus-within:border-rose-450 transition-all">
            <input
              type="email"
              placeholder="Enter luxury email address"
              className="bg-transparent text-xs text-gray-850 placeholder-gray-400 px-3 py-2 w-full focus:outline-none"
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-rose-500 hover:bg-rose-600 px-5 py-2 text-[9px] font-sans font-black uppercase tracking-[0.16em] text-white transition-colors cursor-pointer rounded-lg shrink-0"
            >
              Subscribe
            </motion.button>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600 font-bold">
            <Mail className="h-3.5 w-3.5 text-rose-500" />
            <span>clothingvaultcare@gmail.com</span>
          </div>
        </div>

      </div>



      {/* Corporate terms, accepted payments, copy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-rose-100 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 space-y-4 md:space-y-0 font-bold">
        <div>
          <span>© 2026 ClothingVault. All Atelier Designs Reserved. Crafted with high-contrast digital elegance.</span>
        </div>
        <div className="flex flex-wrap items-center space-x-3 sm:space-x-4">
          <button onClick={() => handleNavigation('terms')} className="cursor-pointer hover:text-rose-500 transition-colors">Terms of Service</button>
          <span>•</span>
          <button onClick={() => handleNavigation('privacy')} className="cursor-pointer hover:text-rose-500 transition-colors">Privacy Covenant</button>
          <span>•</span>
          <button onClick={() => handleNavigation('refund')} className="cursor-pointer hover:text-rose-500 transition-colors">Refund Policy</button>
          <span>•</span>
          <button onClick={() => handleNavigation('shipping')} className="cursor-pointer hover:text-rose-500 transition-colors">Shipping Policy</button>
        </div>
        
        {/* Payment Icons */}
        <div className="flex items-center space-x-2.5 font-mono text-[9px] bg-white py-1.5 px-3 rounded-lg border border-rose-100 shadow-xs">
          <span className="text-gray-900 tracking-widest font-black">VISA</span>
          <span className="text-gray-300">|</span>
          <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-black">All Pay Accepted</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-900 tracking-widest font-black">MC</span>
          <span className="text-gray-300">|</span>
          <span className="text-amber-650 font-black">AMEX</span>
        </div>
      </div>
      
    </footer>
  );
}
