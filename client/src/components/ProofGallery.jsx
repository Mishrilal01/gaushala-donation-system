/**
 * Proof Gallery Component
 * Displays images of planted trees and plantation activities
 * Shows evidence of where donations are being used
 */

import React from 'react';

export default function ProofGallery() {
  // Sample gallery data - in production, fetch from API
  const galleryImages = [
    { id: 1, title: 'पेड़ लगाई गई समारोह', emoji: '🌱' },
    { id: 2, title: 'पेड़ों की वृद्धि', emoji: '🌳' },
    { id: 3, title: 'गायों के साथ पेड़', emoji: '🐄' },
    { id: 4, title: 'हरा भरा खेत', emoji: '🌿' },
    { id: 5, title: 'समुदाय की मदद', emoji: '👥' },
    { id: 6, title: 'प्रकृति की सुंदरता', emoji: '🦋' },
  ];

  return (
    <div className="w-full bg-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-2">
          📸 हमारा प्रमाण / Our Proof Gallery
        </h2>
        <p className="text-lg text-gray-600 text-center mb-10">
          यह हमारे लगाए गए पेड़ हैं / These are the trees we planted
        </p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="w-full aspect-square bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl md:text-7xl">{image.emoji}</span>
              </div>

              {/* Caption */}
              <div className="p-4 text-center">
                <p className="text-sm md:text-base font-semibold text-green-800">
                  {image.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-200 rounded-lg p-8 text-center">
          <p className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
            🌍 पर्यावरण पर प्रभाव
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-6">
            Environmental Impact / हमारे लगाए पेड़
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold text-green-600">100+</p>
              <p className="text-sm text-gray-600 mt-1">पेड़ / Trees</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">10000+</p>
              <p className="text-sm text-gray-600 mt-1">लीटर पानी / Water (L)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">500+</p>
              <p className="text-sm text-gray-600 mt-1">जानवरों को मदद / Animals</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mt-8 bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center">
          <p className="text-base md:text-lg text-green-800">
            हर पेड़ एक ज़िंदगी बदलता है - जानवर, इंसान, और पर्यावरण सभी को
          </p>
        </div>
      </div>
    </div>
  );
}
