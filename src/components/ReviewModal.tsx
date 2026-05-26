import React, { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface ReviewModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (reviewerName: string, rating: number, comment: string) => void;
}

export default function ReviewModal({ product, onClose, onSubmit }: ReviewModalProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    onSubmit(name, rating, comment);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="w-full max-w-lg bg-neutral-950 rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl relative">
        
        {/* Decorative ambient color */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-purple-400 font-mono">Submit Couture Feedback</span>
            <h3 className="text-sm sm:text-base font-display font-semibold text-white mt-1">Reviewing: {product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 relative z-10">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-purple-400 animate-ping absolute" />
              <CheckCircle className="h-12 w-12 text-purple-400 relative" />
              <p className="font-serif italic text-lg text-purple-200 pt-4">Feedback Authenticated</p>
              <p className="font-sans text-xs text-gray-400">Your style review has been written to the Vault ledger.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating Star Group */}
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium block mb-2">My Luxury Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setRating(star)}
                      className="p-1 text-gray-500 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 transition-transform ${
                          (hovered !== null ? star <= hovered : star <= rating)
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium block mb-1.5">Profile Handle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cassandra S."
                  className="w-full bg-neutral-900 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 placeholder-gray-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Review Comment Details */}
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-400 font-medium block mb-1.5">Detail Commentary</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the density, stitch drapes, flow, and exact comfort level..."
                  className="w-full bg-neutral-900 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 placeholder-gray-600 resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {/* Action Rows */}
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-xs font-semibold uppercase tracking-widest text-gray-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-950 text-xs font-semibold uppercase tracking-widest text-white transition-all glow-purple hover:scale-[1.01] cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
