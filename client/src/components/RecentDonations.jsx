/**
 * Recent Donations Component
 * Displays top 10 recently approved donations
 * Shows names (if public), amounts, and dates
 * Auto-refreshes every 30 seconds
 * Includes button to view all donations in detailed view
 * Includes search functionality to filter by donor name
 */

import React, { useState, useEffect } from 'react';
import { donationAPI } from '../services/api';
import { formatDateIST } from '../utils/dateFormatter';

export default function RecentDonations({ onViewAll }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Fetch approved donations from API
   */
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donationAPI.getApprovedDonations();
      if (response.success) {
        setDonations(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Could not load donations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations on component mount
  useEffect(() => {
    fetchDonations();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDonations, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Format date to readable format - converted to IST
   */
  const formatDate = (dateString) => {
    return formatDateIST(dateString);
  };

  /**
   * Filter donations based on search query
   * Case-insensitive search by donor name
   */
  const filteredDonations = donations.filter((donation) =>
    (donation.name || "Anonymous").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show only top 10 donations from filtered results
  const topDonations = filteredDonations.slice(0, 10);

  if (error && donations.length === 0) {
    return (
      <div className="w-full bg-gray-50 px-4 py-12">
        <div className="max-w-2xl mx-auto text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 px-4 py-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-8">
          🕐 हाल के दान / Recent Donations
        </h2>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम से खोजें / Search by name"
              className="w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-green-600">
              🔍
            </span>
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              {filteredDonations.length} result(s) found
            </p>
          )}
        </div>

        {/* Donations List */}
        <div className="space-y-3">
          {loading && topDonations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading donations...</p>
            </div>
          ) : topDonations.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
              <p className="text-lg text-gray-600">
                {searchQuery
                  ? '🔍 कोई रिकॉर्ड नहीं मिला / No records found'
                  : '📭 अभी तक कोई दान approved नहीं हुआ / No donations yet'}
              </p>
            </div>
          ) : (
            topDonations.map((donation, index) => (
              <div
                key={donation.id}
                className="bg-white border-l-4 border-green-500 rounded-lg p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3"
              >
                {/* Left Side - Name and Date */}
                <div className="flex-1">
                  <p className="text-base md:text-lg font-bold text-gray-800">
                    {donation.name || "Anonymous"}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                    📅 {donation.date ? formatDate(donation.date) : "N/A"}
                  </p>
                </div>

                {/* Right Side - Amount */}
                <div className="text-right ml-2 flex-shrink-0">
                  <p className="text-lg md:text-2xl font-bold text-green-600">
                    ₹{(donation.amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button - Show only if there are more than 10 donations and no search filter */}
        {!searchQuery && donations.length > 10 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onViewAll}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg md:text-xl shadow-lg"
            >
              📋 View All Detailed Donations ({donations.length} total)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
