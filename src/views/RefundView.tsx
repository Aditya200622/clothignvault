import React from 'react';

export default function RefundView() {
  return (
    <div className="bg-[#FAFAF9] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-5xl font-black mb-8 text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
          Refund Policy
        </h1>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-600 font-medium">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>1. Return Eligibility</h2>
            <p>At ClothingVault, we create premium luxury fashion. If you are not entirely satisfied with your purchase, we accept return requests within 14 days of delivery. To be eligible for a return, the item must be unworn, unwashed, and in the same condition that you received it, with all original tags and luxury box packaging intact.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>2. Returns and Exchange Process</h2>
            <p>To initiate a return, please log in to your account and go to your profile, or email our support team at supportclothingvault@gmail.com with your order number. Once approved, we will arrange a complimentary pickup of the package from your address. The returned products will undergo a quality control check at our warehouse.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>3. Refund Timeline</h2>
            <p>Upon successful quality inspection, refunds are processed immediately. The refund will be credited back to your original payment method (such as credit/debit card, netbanking, or UPI via Razorpay) within 5 to 7 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>4. Non-Returnable Items</h2>
            <p>Certain items cannot be returned or refunded for hygiene reasons, including custom tailored pieces, intimate apparel, and items purchased during high-exclusive archival flash sales.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
