/**
 * Main App Component
 * Router setup for Home and Admin pages
 * Handles navigation and page rendering
 */

import React, { useState } from 'react';
import Home from './pages/Home';
import Admin from './pages/Admin';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-3 md:py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Brand */}
          <button
            onClick={() => setCurrentPage('home')}
            className="text-base md:text-3xl font-bold text-white hover:text-green-100 transition whitespace-nowrap"
          >
            🌱 GreenArk Mission
          </button>

          {/* Navigation Links */}
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`font-bold py-2 px-2 md:px-4 rounded-lg transition text-xs md:text-base ${
                currentPage === 'home'
                  ? 'bg-white text-green-700'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setCurrentPage('admin')}
              className={`font-bold py-2 px-2 md:px-4 rounded-lg transition text-xs md:text-base ${
                currentPage === 'admin'
                  ? 'bg-white text-green-700'
                  : 'text-white hover:bg-green-500'
              }`}
            >
              🔐 Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="w-full">
        {currentPage === 'home' && <Home />}
        {currentPage === 'admin' && <Admin />}
      </main>
    </div>
  );
}
