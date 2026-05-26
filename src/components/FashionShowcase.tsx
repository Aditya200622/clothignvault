import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface CampaignItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  year: string;
  glow: string;
}

const CAMPAIGN_ITEMS: CampaignItem[] = [
  {
    id: "01",
    tag: "Paris Runway",
    title: "Atelier Seams",
    subtitle: "STRICTLY CAPPED LOOKBOOK NO: 1",
    desc: "A bold collision of classic French tailoring and modern structural presence. Handcrafted using high-density organic linen and woven fibers.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    year: "Collection '26",
    glow: "from-rose-500/20 to-pink-500/5",
  },
  {
    id: "02",
    tag: "Milan Atelier",
    title: "Satin Solace",
    subtitle: "SCULPTURAL SHEENS",
    desc: "Sculptured drapery designed to mirror twilight movement. Reflects ambient light with custom metallic highlights woven organically at the bodice.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    year: "Limited No: 151",
    glow: "from-amber-500/15 to-rose-400/5",
  },
  {
    id: "03",
    tag: "London Streets",
    title: "Oversized Apex",
    subtitle: "NEO-URBAN GRIT",
    desc: "Heavyweight premium streetwear crafted from premium 460GSM loopback cotton. Inspired by the sharp geometry of London architectural corners.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    year: "Atelier '26",
    glow: "from-rose-600/20 to-[#E11D48]/5",
  },
  {
    id: "04",
    tag: "Tokyo Minimal",
    title: "Cashmere Mist",
    subtitle: "AESTHETIC THERMAL ENVELOPES",
    desc: "Seamless double-layer cashmere knits. Delivers absolute warmth while offering a flowing, weightless presence that contours natural posture.",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=800&auto=format&fit=crop",
    year: "Vault Edition",
    glow: "from-pink-500/20 to-purple-600/5",
  }
];

interface FashionShowcaseProps {
  setCurrentTab: (tab: string) => void;
}

export default function FashionShowcase({ setCurrentTab }: FashionShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // useScroll tracks scroll of the containerRef
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // Smooth progress to make the horizontal scroll slide feel exceptionally luxury and soft
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 120,
    mass: 0.4
  });

  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const calcScrollWidth = () => {
      if (trackRef.current) {
        // Find how far the track should translate
        const totalWidth = trackRef.current.scrollWidth;
        const screenWidth = window.innerWidth;
        // Compensate for viewport padding (keep some margin at the end)
        const maxScroll = totalWidth - screenWidth + (screenWidth > 768 ? 96 : 32);
        setScrollWidth(Math.max(0, maxScroll));
      }
    };

    // Calculate on load, with a small delay for image renderings
    const timer = setTimeout(calcScrollWidth, 400);

    window.addEventListener('resize', calcScrollWidth);
    return () => {
      window.removeEventListener('resize', calcScrollWidth);
      clearTimeout(timer);
    };
  }, []);

  // Map the smooth scrollProgress to a pixel translation
  const x = useTransform(smoothProgress, [0, 1], [0, -scrollWidth]);

  return (
    <div 
      id="fashion-showcase" 
      ref={containerRef} 
      className="relative w-full h-[220vh] bg-gray-950 text-white select-none z-30"
    >
      {/* Background radial soft light gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.06)_0%,transparent_75%)] pointer-events-none" />

      {/* Grid line guidelines simulation (Fashion studio runway drafting layout) */}
      <div className="absolute inset-y-0 left-[10%] w-[1px] bg-white/5 pointer-events-none hidden md:block" />
      <div className="absolute inset-y-0 left-[50%] w-[1px] bg-white/5 pointer-events-none hidden md:block" />
      <div className="absolute inset-y-0 right-[15%] w-[1px] bg-white/5 pointer-events-none hidden md:block" />

      {/* Sticky Inner Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-12 px-6 sm:px-12 overflow-hidden">
        
        {/* Top bar details */}
        <div className="flex items-center justify-between w-full border-b border-white/10 pb-4 max-w-7xl mx-auto shrink-0">
          <div className="flex items-center space-x-3 text-left">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-400 font-extrabold">Fashion Showcase Series</span>
          </div>
          <div className="text-right font-serif italic text-xs text-stone-400">
            <span>“Presence precedes permission”</span>
          </div>
        </div>

        {/* MID TRACK CONTAINER (Framer Motion translates this horizontally) */}
        <div className="flex-1 flex items-center justify-start py-6">
          <motion.div 
            ref={trackRef} 
            style={{ x }}
            className="flex space-x-8 sm:space-x-16 items-center pl-4 pr-16"
          >
            {/* Introductory Statement Panel Card */}
            <div className="w-[85vw] sm:w-[500px] flex-shrink-0 text-left space-y-6 pr-4 sm:pr-12">
              <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-rose-300 uppercase px-3.5 py-1.5 rounded-full inline-block font-black leading-none tracking-widest">
                LOOKBOOK COVENANT
              </span>
              <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.95]">
                CAMP <br />
                <span className="text-rose-500 font-serif italic font-light lowercase">de</span> <br />
                COUTURE
              </h2>
              <div className="h-[1px] w-24 bg-rose-500" />
              <p className="text-xs sm:text-sm text-stone-400 font-medium leading-relaxed max-w-sm">
                Scroll vertically to reveal our exclusive cinematic fashion campaigns. Each layout is captured directly in our Milan studio utilizing real tailored aesthetics.
              </p>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-500 tracking-wider animate-pulse flex-nowrap shrink-0">
                <span>SCROLL DOWN</span>
                <ArrowRight className="h-3 w-3 text-rose-500" />
              </div>
            </div>

            {/* Campaign Cards list */}
            {CAMPAIGN_ITEMS.map((item) => (
              <div
                key={item.id}
                className="w-[85vw] sm:w-[650px] aspect-[16/10] sm:aspect-[1.7] flex-shrink-0 relative rounded-[2.5rem] overflow-hidden bg-[#121214] border border-white/10 group flex flex-col justify-end p-6 sm:p-10 text-left shadow-2xl hover:border-rose-500/30 transition-all duration-500"
              >
                {/* Image Stage background */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 transition-opacity duration-500 group-hover:via-black/20" />
                  <div className={`absolute inset-0 bg-gradient-to-tr ${item.glow} opacity-65 mix-blend-screen z-10`} />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Overlaid details content */}
                <div className="relative z-20 space-y-3 sm:space-y-4 max-w-xl">
                  {/* Tag and Index */}
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest font-black bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                      {item.tag}
                    </span>
                    <span className="font-mono text-stone-500 text-[10px]">{item.id} / 04</span>
                  </div>

                  {/* Title pair mixing sans and serif italic */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-stone-400 tracking-[0.25em] block uppercase font-bold">
                      {item.subtitle}
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-4xl leading-none text-white uppercase tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description paragraph */}
                  <p className="text-xs text-stone-300 font-medium leading-relaxed max-w-md hidden sm:block">
                    {item.desc}
                  </p>

                  {/* Action buttons list */}
                  <div className="pt-1.5 flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setCurrentTab('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group/btn inline-flex items-center space-x-2 bg-white text-gray-950 font-extrabold text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg transition-transform hover:scale-102 cursor-pointer"
                    >
                      <span>Secure Drops</span>
                      <ArrowRight className="h-3 w-3 text-rose-500 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="font-mono text-[10px] text-stone-500 font-bold uppercase">{item.year}</span>
                  </div>
                </div>

                {/* Custom glowing biometric line accent */}
                <div className="absolute top-0 right-10 h-1.5 w-16 bg-gradient-to-r from-rose-500/0 via-rose-500 to-rose-500/0 rounded-b-full blur-xs group-hover:w-28 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom index status and aesthetic signatures */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full border-t border-white/10 pt-4 max-w-7xl mx-auto text-[10px] font-mono text-stone-500 tracking-widest uppercase gap-3 shrink-0">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="h-4 w-4 text-rose-500" />
            <span>EXCLUSIVE COUTURE RUNWAY ACCESS DETECTED</span>
          </div>
          <span>CLOTHINGVAULT EDITORIAL © 2026</span>
        </div>

      </div>
    </div>
  );
}
