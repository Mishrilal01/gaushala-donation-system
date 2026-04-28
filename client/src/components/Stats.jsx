/**
 * Stats Dashboard Component
 * Displays key metrics and progress toward plantation goal
 * - Total amount collected
 * - Trees planted
 * - Total donors
 * - Progress bar animation
 */

import React, { useState, useEffect } from 'react';
import { donationAPI } from '../services/api';

export default function Stats() {
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalUsed: 0,
    remaining: 0,
    treesPlanted: 0,
    totalDonors: 0,
    goalTrees: 100,
    progressPercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await donationAPI.getStats();
        if (response.success) {
          setStats(response.data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Could not load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white px-4 py-12 text-center">
        <p className="text-lg text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white px-4 py-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-8">
          📊 हमारी प्रगति / Our Progress
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
          {/* Total Amount */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:p-5 text-center border-2 border-green-200">
            <p className="text-2xl md:text-3xl font-bold text-green-700 mb-1">
              💰
            </p>
            <p className="text-xl md:text-2xl font-bold text-green-600 mb-0.5">
              ₹{stats.totalAmount.toLocaleString()}
            </p>
            <p className="text-xs md:text-sm text-gray-600 font-semibold">
              कुल दान / Total Donated
            </p>
          </div>

          {/* Total Money Used */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 md:p-5 text-center border-2 border-orange-200">
            <p className="text-2xl md:text-3xl font-bold text-orange-700 mb-1">
              💸
            </p>
            <p className="text-xl md:text-2xl font-bold text-orange-600 mb-0.5">
              ₹{stats.totalUsed.toLocaleString()}
            </p>
            <p className="text-xs md:text-sm text-gray-600 font-semibold">
              कुल खर्च / Total Used
            </p>
          </div>

          {/* Remaining Balance */}
          <div className={`bg-gradient-to-br rounded-lg p-4 md:p-5 text-center border-2 ${
            stats.remaining >= 0
              ? 'from-blue-50 to-blue-100 border-blue-200'
              : 'from-red-50 to-red-100 border-red-200'
          }`}>
            <p className="text-2xl md:text-3xl font-bold mb-1">
              🧾
            </p>
            <p className={`text-xl md:text-2xl font-bold mb-0.5 ${
              stats.remaining >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              ₹{Math.abs(stats.remaining).toLocaleString()}
              {stats.remaining < 0 && ' '}
              {stats.remaining < 0 && <span className="text-red-600">(-)</span>}
            </p>
            <p className="text-xs md:text-sm text-gray-600 font-semibold">
              बचा हुआ / Remaining
            </p>
            {stats.remaining < 0 && (
              <p className="text-xs text-red-600 font-semibold mt-1">
                अभी खर्च दान से अधिक है
              </p>
            )}
          </div>

          {/* Trees Planted */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:p-5 text-center border-2 border-green-200">
            <p className="text-2xl md:text-3xl font-bold text-green-700 mb-1">
              🌳
            </p>
            <p className="text-xl md:text-2xl font-bold text-green-600 mb-0.5">
              {stats.treesPlanted}
            </p>
            <p className="text-xs md:text-sm text-gray-600 font-semibold">
              पेड़ लगाए / Trees Planted
            </p>
          </div>

          {/* Total Donors */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 md:p-5 text-center border-2 border-blue-200">
            <p className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">
              👥
            </p>
            <p className="text-xl md:text-2xl font-bold text-blue-600 mb-0.5">
              {stats.totalDonors}
            </p>
            <p className="text-xs md:text-sm text-gray-600 font-semibold">
              दाता / Donors
            </p>
          </div>

          {/* Goal */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 md:p-5 text-center border-2 border-yellow-200">
            <p className="text-2xl md:text-3xl font-bold text-yellow-700 mb-1">
              🎯
            </p>
            <p className="text-xl md:text-2xl font-bold text-yellow-600 mb-0.5">
              {stats.goalTrees}
            </p>
            <p className="text-xs md:text-sm text-gray-600 font-semibold">
              लक्ष्य / Goal
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-2 border-green-200 rounded-lg p-4 md:p-6">
          <div className="mb-3 flex justify-between items-center">
            <p className="text-base md:text-lg font-bold text-green-700">
              लक्ष्य की ओर प्रगति / Progress Toward Goal
            </p>
            <p className="text-xl font-bold text-green-600">
              {stats.progressPercentage}%
            </p>
          </div>

          {/* Progress Bar Animation */}
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
              style={{ width: `${stats.progressPercentage}%` }}
            >
              {stats.progressPercentage > 20 && (
                <span className="text-white font-bold text-xs">
                  {stats.treesPlanted}/{stats.goalTrees}
                </span>
              )}
            </div>
          </div>

          {/* Progress Message */}
          <p className="text-center mt-4 text-gray-600 text-sm md:text-base">
            {stats.treesPlanted < stats.goalTrees
              ? `${stats.goalTrees - stats.treesPlanted} और पेड़ लगाने हैं / ${
                  stats.goalTrees - stats.treesPlanted
                } more trees to go`
              : '🎉 लक्ष्य पूरा हो गया! / Goal Achieved!'}
          </p>
        </div>

        {error && (
          <div className="mt-6 bg-red-100 border-2 border-red-300 rounded-lg p-4 text-red-700 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
