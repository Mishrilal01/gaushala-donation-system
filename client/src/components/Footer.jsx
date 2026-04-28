/**
 * Footer Component
 * Shows contact information, social media, and copyright
 */

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-b from-green-800 to-green-900 text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-10">
          {/* About Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">🌱 गौशाला</h3>
            <p className="text-gray-200 text-sm md:text-base leading-7 line-clamp-3">
              हम पेड़ लगाने और गायों की देखभाल के लिए समर्पित हैं। हर दान एक नया पेड़ लगाता है।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">🔗 Quick Links</h3>
            <ul className="space-y-3 text-sm md:text-base text-gray-200">
              <li>
                <a href="/" className="hover:text-white hover:underline transition-colors duration-200 cursor-pointer">
                  📊 Dashboard
                </a>
              </li>
              <li>
                <a href="#donation-section" className="hover:text-white hover:underline transition-colors duration-200 cursor-pointer">
                  💳 Donate
                </a>
              </li>
              {/* <li>
                <a href="#fund-usage" className="hover:text-white transition-colors">
                  📸 Gallery
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white transition-colors">
                  ⚙️ Admin Panel
                </a>
              </li> */}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">📞 Contact Us</h3>
            <ul className="space-y-4 text-sm md:text-base text-gray-200">
              <li className="flex items-center gap-3">
                <span>📧</span>
                <a 
                  href="mailto:mahadevgaushala07@gmail.com"
                  className="hover:text-white hover:underline transition-colors duration-200 cursor-pointer break-all"
                >
                  mahadevgaushala07@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span>📱</span>
                <div className="flex flex-col gap-2">
                  <a 
                    href="tel:+919468661167"
                    className="hover:text-white hover:underline transition-colors duration-200 cursor-pointer"
                  >
                    9468661167
                  </a>
                  <a 
                    href="tel:+917357130221"
                    className="hover:text-white hover:underline transition-colors duration-200 cursor-pointer"
                  >
                    7357130221
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0">📍</span>
                <span>GXVG+56, Bhainser Kootri,<br />Rajasthan 342305, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-700 my-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:justify-center md:items-center md:gap-12 text-sm md:text-base text-gray-200 text-center">
          {/* Copyright */}
          <p className="leading-relaxed">
            © {currentYear} Gaushala Tree Donation System. All rights reserved. 🌍
          </p>

          {/* Social Links */}
          <div className="mt-6 md:mt-0">
            <a 
              href="https://www.instagram.com/mahadevgaushala_07?igsh=Mm56YW14MXhlZXl0" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-white hover:underline transition-colors duration-200 cursor-pointer"
            >
              📱 Instagram
            </a>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center mt-10 text-gray-300 italic leading-relaxed">
          "एक पेड़ कई ज़िंदगियों को राहत देता है" 🌳💚
        </div>
      </div>
    </footer>
  );
}
