import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ─── Sound ───────────────────────────────────────────────────────────────────
function playSound(type: ToastType) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    const freq =
      type === 'success' ? 880 :
      type === 'error'   ? 280 :
      type === 'warning' ? 600 :
      740;

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (type === 'success') osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);

    osc.type = 'sine';
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio context not supported — silently ignore
  }
}

function vibrate(type: ToastType) {
  if (!navigator.vibrate) return;
  if (type === 'success') navigator.vibrate([30, 20, 30]);
  else if (type === 'error') navigator.vibrate([60, 30, 60]);
  else navigator.vibrate(20);
}

// ─── Single Toast Item ────────────────────────────────────────────────────────
const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const { bg, border, icon } = TOAST_STYLES[toast.type];
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Animate in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Animate out just before removal
    const duration = toast.duration ?? 3500;
    const t2 = setTimeout(() => setVisible(false), duration - 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast.duration]);

  return (
    <div
      style={{
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg backdrop-blur-sm ${bg} ${border} max-w-xs w-full pointer-events-auto`}
    >
      {icon}
      <p className="text-sm font-medium text-gray-800 flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors -mr-1 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, duration = 3500) => {
    const id = `toast-${++counterRef.current}`;
    playSound(type);
    vibrate(type);
    setToasts(prev => [...prev.slice(-3), { id, type, message, duration }]); // keep max 4
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const value: ToastContextValue = {
    showToast,
    success: (msg) => showToast('success', msg),
    error:   (msg) => showToast('error',   msg),
    warning: (msg) => showToast('warning', msg),
    info:    (msg) => showToast('info',    msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
