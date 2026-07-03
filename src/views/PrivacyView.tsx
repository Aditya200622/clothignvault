import React from 'react';

export default function PrivacyView() {
  return (
    <div className="bg-[#FAFAF9] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-5xl font-black mb-8 text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
          Privacy Covenant
        </h1>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-600 font-medium">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>1. Information Collection</h2>
            <p>At ClothingVault, we collect personal information such as your name, email address, shipping address, and payment details when you create an account, place an order, or subscribe to our newsletter. We use this information to process your transactions and provide you with a tailored luxury shopping experience.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>2. Data Security</h2>
            <p>Your security is paramount. We implement strict, industry-standard security protocols to protect your data. All transactions are securely processed, and we do not store sensitive payment card information on our servers. Your payment details are fully encrypted and transmitted directly to our payment gateways (e.g., Razorpay, Stripe).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>3. Data Usage</h2>
            <p>We use your information solely to fulfill orders, improve our services, and communicate with you about exclusive drops and collections. We will never sell or rent your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>4. Cookies and Tracking</h2>
            <p>Our website uses cookies to enhance your browsing experience, analyze site traffic, and understand where our audience is coming from. You can control cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. If you wish to exercise these rights, please contact our support team at supportclothingvault@gmail.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
