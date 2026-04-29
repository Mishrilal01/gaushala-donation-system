/**
 * Hero Component
 * Landing section with emotional call-to-action
 * Professional 2-column layout with real imagery
 */

import React from 'react';

export default function Hero() {
  const scrollToDonation = () => {
    const donationElement = document.getElementById('donation-section');
    if (donationElement) {
      donationElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-green-50 via-green-25 to-white px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Responsive Layout - Centered on Mobile, 2-Column on Desktop */}
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-12 items-center md:items-start">
          
          {/* TEXT CONTENT - Left column on desktop, centered on mobile */}
          <div className="flex flex-col justify-center space-y-5 w-full text-center md:text-left">
            
            {/* Main Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 leading-snug mb-2">
                🔱 महादेव गौशाला मथानिया
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-green-700 font-semibold">
                संस्थान: शिव नंदी गौशाला सेवा संस्थान मथानिया
              </p>
            </div>

            {/* Mission Box */}
            <div className="bg-green-100 rounded-xl px-5 md:px-6 py-5 md:py-6 border-2 border-green-300 shadow-md">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 mb-1">
                100+ पेड़ लगाने का संकल्प 🌳
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-green-700 font-semibold">
                Tree Plantation Mission
              </p>
            </div>

            {/* Emotional Tagline */}
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 leading-snug mb-3">
                "एक पेड़ कई ज़िंदगियों को राहत देता है"
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">
                "One Tree Brings Relief to Many Lives"
              </p>
            </div>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold leading-relaxed">
              आपका सहयोग प्रकृति और गौसेवा दोनों के लिए महत्वपूर्ण है
            </p>

            {/* CTA Button */}
            <div className="pt-2 flex justify-center md:justify-start">
              <button
                onClick={scrollToDonation}
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-5 sm:px-6 md:px-8 rounded-xl text-base sm:text-lg md:text-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                🌱 अभी सहयोग करें
              </button>
            </div>
          </div>

          {/* IMAGE - Right column on desktop, centered below text on mobile */}
          <div className="flex justify-center items-center mt-8 md:mt-0 w-full">
            <div className="relative w-full h-80 md:h-96 lg:h-[450px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/cow.PNG"
                alt="Gaushala - Cows and Nature"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {/* Subtle Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-16 md:mt-20 border-b-4 border-green-200"></div>
      </div>

      {/* Smooth scroll enhancement */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
