import { Sparkles, Award, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 text-left page-enter-fade">
      
      {/* 1. HEADER */}
      <div className="pb-8 border-b border-white/5 mb-12">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400">Brand Manifesto</span>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-white mt-1">The ClothingVault Heritage</h1>
        <p className="text-xs text-gray-500 font-light mt-2 max-w-sm">
          A study in modern western silhouette prestige, limited runs, and uncompromising textiles.
        </p>
      </div>

      {/* 2. CORE STATEMENT PANEL - Dual Column Image text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        
        {/* Left text column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/15">
            <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-purple-200">The 150-Piece Vault Covenant</span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-wide leading-tight">
            Restricted blueprints. Hand-stamped serial indexes. Zero dilution.
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
            ClothingVault was founded with a singular, quiet objective: to deliver high-tier, structural garments to girls aged 16-30 without resorting to mass-market dilution. 
          </p>

          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
            Every dress, trench, or knit set is strictly capped at <strong className="text-white font-mono">150 pieces worldwide</strong>. Once a drop sells out, the blueprint is permanently locked inside our physical archives. There are no restocks, no revisions, and no compromises. You own an item of certified status.
          </p>
        </div>

        {/* Right gorgeous fashion layout */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-md aspect-[16/10] sm:aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
              alt="Model tailoring blueprint in studio"
              className="h-full w-full object-cover object-center scale-100 hover:scale-[1.01] transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>

      {/* 3. MATERIAL CRITERIAS BENTO GRID */}
      <div className="space-y-6 mb-16">
        <div className="text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400">Atelier specifications</span>
          <h3 className="font-display font-medium text-lg sm:text-xl text-white mt-1">Our Material Criterias</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-950/20 border border-purple-800/20 flex items-center justify-center text-purple-400">
              <Award className="h-5 w-5" />
            </div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide">Heavy French Terry Loopwear</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
              All street hoodies and lounge cardigans are spun utilizing heavy 520GSM organic loop-pile cotton from selected Italian knit mills. They fall with precision, draping cleanly on the shoulders without loss of structure over washes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-950/20 border border-purple-800/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide">Couture Bias-Cut Satin</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
              Our cocktail dresses and slips employ 92% heavy silk-satin bias cuts, hand-stitched with premium internal cords. It drapes following the body's natural hourglass lines with a liquid gloss reaction under ambient lights.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-950/20 border border-purple-800/20 flex items-center justify-center text-purple-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide">Structured Pagoda Shoulders</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
              Blazers and heavy leather trenches combine canvas backing and internal pagoda cushions. This structural tailoring creates high posture confidence, mimicking classic 1980s Paris and Milan runways.
            </p>
          </div>

        </div>
      </div>

      {/* 4. THE ETHICS COVENANT */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-purple-500/10 text-center space-y-4 max-w-3xl mx-auto">
        <Sparkles className="h-6 w-6 text-purple-400 mx-auto animate-pulse" />
        <h4 className="font-display font-semibold text-base text-white">Ethical Handcraft Manufacturing</h4>
        <p className="text-xs text-gray-400 leading-relaxed font-light max-w-xl mx-auto">
          We reject fast-fashion waste. Our localized design studios in Beverly Hills, London and Rome pay 1.5x livable wages to local master tailors. By producing only 150 pieces per style, we maintain zero inventory landfill deposits, fully dedicating carbon coordinates to priority express logistics offsets.
        </p>
      </div>

    </div>
  );
}
