import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ─── Web Audio API Synthetic Sounds ──────────────────────────────────────────

const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return null;
};

// A soft, low-frequency pop for subtle interactions (Add to Cart, Wishlist)
export const playSoftPop = () => {
  try {
    const ctx = createAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn("Audio feedback disabled or not supported", e);
  }
};

// A slightly deeper pop for delete actions
export const playDeletePop = () => {
  try {
    const ctx = createAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn("Audio feedback disabled or not supported", e);
  }
};

// A premium multi-oscillator chime for success (Order Placed, Payment)
export const playSuccessChime = () => {
  try {
    const ctx = createAudioContext();
    if (!ctx) return;
    
    const playTone = (freq: number, delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.5);
    };

    // Play a gentle major chord arpeggio
    playTone(440, 0);     // A4
    playTone(554.37, 0.1); // C#5
    playTone(659.25, 0.2); // E5
  } catch (e) {
    console.warn("Audio feedback disabled or not supported", e);
  }
};

// ─── Haptics & Confetti ─────────────────────────────────────────────────────

export const triggerVibration = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn("Vibration not supported");
    }
  }
};

export const triggerSuccessConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f43f5e', '#fbbf24', '#e879f9', '#a78bfa'] // Rose, Gold, Fuchsia, Violet
  });
};

// ─── Compound Action Triggers ────────────────────────────────────────────────

export const triggerAddToCartFeedback = () => {
  playSoftPop();
  triggerVibration(50);
};

export const triggerWishlistFeedback = () => {
  playSoftPop();
  triggerVibration(30);
};

export const triggerOrderSuccessFeedback = () => {
  playSuccessChime();
  triggerVibration([100, 50, 100]);
  triggerSuccessConfetti();
};

export const triggerPaymentSuccessFeedback = () => {
  playSuccessChime();
  triggerVibration([100, 50, 100]);
};

export const triggerLoginSuccessFeedback = () => {
  playSoftPop();
};

export const triggerAdminSuccessFeedback = () => {
  playSoftPop();
};

export const triggerAdminDeleteFeedback = () => {
  playDeletePop();
};
