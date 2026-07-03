import React from 'react';

export default function TermsView() {
  return (
    <div className="bg-[#FAFAF9] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-5xl font-black mb-8 text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-600 font-medium">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>1. Acceptance of Terms</h2>
            <p>By accessing and using the ClothingVault website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>2. Privacy</h2>
            <p>Your use of our website is also subject to our Privacy Covenant. Please review our Privacy Covenant, which also governs the site and informs users of our data collection practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>3. Intellectual Property</h2>
            <p>All content included on this site, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the site, is the property of ClothingVault or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>4. Product Information and Orders</h2>
            <p>We attempt to be as accurate as possible. However, ClothingVault does not warrant that product descriptions, pricing, or other content on this site is accurate, complete, reliable, current, or error-free. We reserve the right to refuse or cancel any order placed for a product listed at the incorrect price.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>5. Modification of Terms</h2>
            <p>We reserve the right to change, modify, add, or remove portions of these terms at any time. Please check these terms periodically for changes. Your continued use of the site following the posting of changes to these terms will mean you accept those changes.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
