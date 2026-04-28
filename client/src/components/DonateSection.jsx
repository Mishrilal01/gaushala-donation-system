/**
 * Donate Section Component
 * QR code display and payment instructions
 * Simple UPI/payment method via QR code
 */

import React from 'react';

export default function DonateSection() {
  return (
    <div id="donation-section" className="w-full bg-gradient-to-b from-white to-green-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-8">
          💳 दान करें / Donate Now
        </h2>

        {/* Instruction */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-5 md:p-6 mb-8 text-center shadow-sm">
          <p className="text-base md:text-lg font-bold text-green-800 mb-3">
            QR कोड को स्कैन करके दान करें
          </p>
          <p className="text-sm md:text-base text-gray-700">
            Scan QR Code to Donate via UPI
          </p>
        </div>

        {/* QR Code Display */}
        <div className="bg-white border border-green-300 rounded-lg p-6 md:p-8 text-center mb-8 shadow-sm">
          {/* QR Code Image */}
          <div className="inline-block bg-white border border-gray-300 rounded-lg p-4 mb-4">
            <img 
              src="/qr.jpeg" 
              alt="UPI QR Code" 
              className="w-64 h-64 md:w-80 md:h-80"
            />
          </div>

          {/* Note about QR code */}
          <p className="text-sm md:text-base text-gray-600 italic">
            (QR कोड को अपने UPI ऐप से स्कैन करें / Scan with your UPI app)
          </p>
        </div>

        {/* Amount Suggestion */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 md:p-6 shadow-sm">
          <p className="text-center text-base md:text-lg font-semibold text-yellow-800 mb-4">
            💡 सुझाए गए दान:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[500, 1000, 2500, 5000].map((amount) => (
              <button
                key={amount}
                className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            
          </p>
        </div>

        {/* Call to Action - IMPORTANT NOTICE */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-6 md:p-8 mb-8">
          <div className="flex gap-4 items-start">
            <div className="text-3xl md:text-4xl flex-shrink-0">ℹ️</div>
            <div>
              <p className="text-lg md:text-xl font-bold text-yellow-900 mb-2">
                ⚠️ महत्वपूर्ण / IMPORTANT
              </p>
              <p className="text-base md:text-lg font-semibold text-yellow-900 mb-3">
                दान करने के बाद आगे की जानकारी दें
              </p>
              <p className="text-sm md:text-base text-yellow-800">
                After payment, please fill the form below to submit your donation details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
