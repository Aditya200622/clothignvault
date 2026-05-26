import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2.5 seconds premium loading window
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          id="luxury-preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -30,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 bg-gray-950 z-[9999] flex flex-col justify-between items-center p-8 text-white overflow-hidden select-none"
        >
          {/* Subtle slow moving background lighting */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute h-96 w-96 rounded-full bg-rose-500/10 blur-[120px] pointer-events-none"
          />

          {/* Top Info Header */}
          <div className="flex items-center space-x-2.5 opacity-60 mt-4 self-start sm:self-center">
            <Sparkles className="h-3.5 w-3.5 text-rose-500 animate-spin" />
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase">CLOTHINGVAULT ARCHIVE SETUP</span>
          </div>

          {/* Core Logo Animation Frame */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="overflow-hidden py-2 px-6">
              <motion.span
                initial={{ letterSpacing: "0.45em", opacity: 0, filter: "blur(10px)" }}
                animate={{ letterSpacing: "0.3em", opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-3xl sm:text-5xl tracking-[0.3em] uppercase text-white inline-block relative"
              >
                CLOTHING<span className="text-rose-500 font-light">VAULT</span>
                {/* Horizontal premium underline glow line */}
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 1.5, ease: "easeInOut" }}
                  className="absolute -bottom-1 left-0 h-[1.5px] bg-gradient-to-r from-rose-500/0 via-rose-500 to-rose-500/0 shadow-[0_0_12px_rgba(244,63,94,0.8)]"
                />
              </motion.span>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-[10px] font-mono tracking-[0.25em] text-rose-200 uppercase font-bold"
            >
              PREMIUM FASHION ATELIER
            </motion.p>
          </div>

          {/* Bottom Loading Progress Meter */}
          <div className="w-full max-w-xs space-y-3 mb-6">
            <div className="flex items-center justify-between text-[9px] font-mono tracking-wider opacity-60">
              <span>LOADING COLLECTIONS</span>
              <span>100% SECURE</span>
            </div>
            {/* Loading Capsule Bar */}
            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
