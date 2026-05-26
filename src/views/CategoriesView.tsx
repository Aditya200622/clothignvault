import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data';

interface CategoriesViewProps {
  setCurrentTab: (tab: string) => void;
  // Trigger filter in parent
  onCategorySelect: (catId: string) => void;
}

export default function CategoriesView({ setCurrentTab, onCategorySelect }: CategoriesViewProps) {
  const handleCategoryClick = (id: string) => {
    onCategorySelect(id);
    setCurrentTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 page-enter-fade text-left">
      
      {/* Editorial Header */}
      <div className="pb-8 border-b border-white/5 mb-12">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400">Atelier Curations</span>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-white mt-1">Design Chambers</h1>
        <p className="text-xs text-gray-500 font-light mt-2 max-w-md">
          Explore garments compiled under strict structural codes. Each chamber holds limited patterns of 150.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATEGORIES.map((cat, idx) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="group relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-purple-500/20 shadow-xl cursor-pointer transition-all duration-500"
          >
            {/* Background image & zoom */}
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full w-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-750"
              referrerPolicy="no-referrer"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30 transition-all duration-300 group-hover:via-black/45" />

            {/* Glowing Accent light inside cards on hover */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Content Details */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
              
              {/* Top chamber index indicator */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
                  Chamber 0{idx + 1}
                </span>
                <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse glow-purple" />
              </div>

              {/* Bottom text group */}
              <div className="space-y-2">
                <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest">{cat.count} Restricted designs</span>
                <h2 className="font-display font-semibold text-xl sm:text-2xl text-white tracking-wide">{cat.name}</h2>
                <p className="text-xs text-gray-400 leading-relaxed font-light max-w-md line-clamp-2">
                  {cat.description}
                </p>
                
                <div className="pt-3 flex items-center space-x-2 text-xs font-semibold text-purple-300 uppercase tracking-[0.16em] transform translate-x-0 group-hover:translate-x-2 transition-transform">
                  <span>Enter Chamber Vault</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Decorative prompt card */}
      <div className="mt-16 rounded-3xl bg-[#07070a] border border-white/5 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 sm:space-y-2">
          <span className="text-xs text-purple-400 font-mono uppercase tracking-widest flex items-center space-x-1.5 justify-center sm:justify-start">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Exclusive Membership Drops</span>
          </span>
          <p className="text-sm font-display font-medium text-white">Looking for bespoke tailored styling assistance?</p>
          <p className="text-xs text-gray-500 leading-normal max-w-lg font-light">
            Our atelier designers provide complimentary digital zoom silhouette fit counseling. Discover which sizes match your physique.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('contact')}
          className="px-6 py-3 bg-white hover:bg-purple-100 text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer w-full sm:w-auto shrink-0"
        >
          Contact Our Concierge
        </button>
      </div>

    </div>
  );
}
