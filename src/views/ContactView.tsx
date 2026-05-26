import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send, Sparkles, ShieldCheck } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Bespoke Fit Counseling');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitted(true);
    // Clear fields
    setTimeout(() => {
      setName('');
      setEmail('');
      setTopic('Bespoke Fit Counseling');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 text-left page-enter-fade">
      
      {/* Page Header */}
      <div className="pb-8 border-b border-white/5 mb-12">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400">Concierge Desk</span>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-white mt-1">Contact The Vault</h1>
        <p className="text-xs text-gray-500 font-light mt-2 max-w-sm">
          Have an inquiry regarding sizing, deliveries, or private preview drops? Speak to our concierge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Handled Form input fields (7 columns) */}
        <div className="lg:col-span-7 bg-[#0a0a0c] border border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          {/* background glowing effect */}
          <div className="absolute top-0 left-0 h-28 w-28 bg-purple-500/5 blur-2xl pointer-events-none" />

          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-purple-400 animate-pulse" />
              <p className="font-serif italic text-lg text-purple-200">Concierge Request Authorized</p>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-light">
                Your luxury style inquiry has been routed to our Beverly Hills design studio. A specialist will follow up in under an hour.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-neutral-950 border border-white/5 hover:border-purple-500/20 text-purple-300 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer transition-all"
              >
                Send New Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Identifier Name</label>
                  <input
                    type="text"
                    required
                    maxLength={40}
                    placeholder="e.g. Aditya"
                    className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aditya@gmail.com"
                    className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Inquiry Topic</label>
                <select
                  className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="Bespoke Fit Counseling">Bespoke Silhouette Fit counseling</option>
                  <option value="Priority Drop Waitlist">Priority drop waitlist registrations</option>
                  <option value="Signature returns">Signature door-to-door courier returns</option>
                  <option value="Boutique Showroom preview">Boutique Showroom private preview bookings</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Inquiry Details</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what size, drop name or detail specifications you need compiled..."
                  className="w-full bg-neutral-950 border border-white/5 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-800 to-indigo-950 hover:from-purple-700 hover:to-indigo-900 border border-purple-500/20 text-white rounded-xl text-xs uppercase font-bold tracking-[0.2em] flex items-center justify-center space-x-2.5 transition-all glow-purple hover:scale-[1.01] cursor-pointer pt-3"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Transmit to Concierge</span>
              </button>

            </form>
          )}

        </div>

        {/* Right Column: Address cards details (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#0a0a0c] border border-white/5 space-y-6">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-semibold block">The Design Chambers</span>
            
            <div className="space-y-4">
              
              {/* Showroom 1 */}
              <div className="flex items-start space-x-3 text-xs text-gray-400">
                <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-semibold text-white">Kaveri Garments</h4>
                  <p className="mt-1">Laxmi nagar, Delhi</p>
                  <p>Beverly Hills, CA 90210</p>
                  <div className="flex items-center space-x-2 mt-1.5 text-purple-300 font-mono text-[10px]">
                    <Phone className="h-3 w-3" />
                    <span>+91 8447928772</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5 max-w-sm" />

              {/* Showroom 2 */}
              <div className="flex items-start space-x-3 text-xs text-gray-400">
                <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-semibold text-white">London Atelier Chamber</h4>
                  <p className="mt-1">45 Savile Row, Mayfair</p>
                  <p>London W1S 3PG, United Kingdom</p>
                  <div className="flex items-center space-x-2 mt-1.5 text-purple-300 font-mono text-[10px]">
                    <Phone className="h-3 w-3" />
                    <span>+44 20 7946 0958</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-gray-400">
              <h5 className="font-semibold text-white uppercase tracking-wider text-[10px] font-mono">Chamber Operations Hours</h5>
              <p>Mondays - Saturdays: 10:00 AM - 8:00 PM EST</p>
              <p>Sundays (Private preview bookings): 12:00 PM - 6:00 PM EST</p>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-neutral-950/30 border border-purple-500/5 text-[10px] text-gray-500 font-mono flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span>Guaranteed same-day custom sizing call schedules.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
