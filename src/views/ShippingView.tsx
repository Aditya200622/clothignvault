import React from 'react';

export default function ShippingView() {
  return (
    <div className="bg-[#FAFAF9] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-5xl font-black mb-8 text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
          Shipping & Delivery
        </h1>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-600 font-medium">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>1. Domestic Dispatch Timeline</h2>
            <p>All ClothingVault orders are processed and dispatched within 24 to 48 hours from our logistics vault in Lucknow. Standard express shipping generally takes 2 to 4 business days to reach metropolitan cities across India, and 3 to 6 business days for other locations.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>2. Shipping Fees</h2>
            <p>We provide complimentary express shipping for all orders above ₹150. For orders under ₹150, a nominal shipping and handling fee of ₹25 is applied at checkout.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>3. Order Tracking</h2>
            <p>As soon as your package leaves our vault, a tracking link along with an SMS and email notification containing the carrier details (such as BlueDart or Delhivery) will be sent to you. You can also view the shipping progress directly from your profile dashboard under the active orders ledger.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>4. Signature Delivery</h2>
            <p>To secure your luxury items, all shipments require a physical signature upon delivery. If you are not available, our courier partner will make up to three delivery attempts before returning the casket to our vault.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
