/**
 * Top Supporters Component
 * Displays top 3 donors who opted for public visibility
 * Shows their total contributions
 */

import React, { useState, useEffect } from 'react';
import { donationAPI } from '../services/api';

export default function TopSupporters() {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top supporters on component mount
  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        setLoading(true);
        const response = await donationAPI.getTopSupporters();
        if (response.success) {
          setSupporters(response.data);
        }
      } catch (error) {
        console.error('Error fetching top supporters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupporters();

    // Refresh every 60 seconds
    const interval = setInterval(fetchSupporters, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-b from-white to-yellow-50 px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-600">Loading supporters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-yellow-50 px-4 py-12 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-2">
          🏆 हमारे शीर्ष सहयोगी
        </h2>
        <p className="text-lg text-gray-600 text-center mb-10">
          Top 3 Supporters / हमारी मदद के लिए धन्यवाद
        </p>

        {/* Supporters List */}
        <div className="space-y-4 md:space-y-5">
          {supporters.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
              <p className="text-lg text-gray-600">
                अभी कोई जनता दाता नहीं / No public supporters yet
              </p>
            </div>
          ) : (
            supporters.map((supporter, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 md:p-5 transform hover:scale-105 transition-transform ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-300 to-yellow-100 border-3 border-yellow-500 shadow-lg'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-300 to-gray-100 border-2 border-gray-400 shadow-md'
                    : 'bg-gradient-to-r from-orange-200 to-orange-100 border-2 border-orange-300'
                }`}
              >
                {/* Rank Medal */}
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase">
                        {index === 0
                          ? '1st Place / प्रथम'
                          : index === 1
                          ? '2nd Place / द्वितीय'
                          : '3rd Place / तृतीय'}
                      </p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        {supporter.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white bg-opacity-60 rounded-lg p-2">
                    <p className="text-lg md:text-xl font-bold text-gray-800">
                      ₹{supporter.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Total Donated
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-60 rounded-lg p-2">
                    <p className="text-lg md:text-xl font-bold text-green-600">
                      {supporter.donationCount}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Donations
                    </p>
                  </div>
                </div>


              </div>
            ))
          )}
        </div>

        {/* Motivation Message */}
        <div className="mt-10 bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold text-green-800">
            💚 आप भी शीर्ष समर्थकों में शामिल हो सकते हैं!
          </p>
          <p className="text-base text-gray-700 mt-2">
            You can also become a Top Supporter!
          </p>
        </div>
      </div>
    </div>
  );
}
