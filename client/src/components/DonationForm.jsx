/**
 * Donation Form Component
 * Allows users to submit donation details
 * - Name, Amount, Screenshot, Visibility preference
 * - Form validation
 * - Success/error messages
 */

import React, { useState } from 'react';
import { donationAPI } from '../services/api';

export default function DonationForm() {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    suggestion: '',
    isPublic: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'कृपया नाम दर्ज करें' });
      return;
    }

    if (!formData.amount || formData.amount < 1) {
      setMessage({ type: 'error', text: 'कृपया सही राशि दर्ज करें' });
      return;
    }

    try {
      setLoading(true);
      const response = await donationAPI.submitDonation({
        name: formData.name,
        amount: parseInt(formData.amount),
        isPublic: formData.isPublic,
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message,
        });

        // Reset form
        setFormData({
          name: '',
          amount: '',
          suggestion: '',
          isPublic: true,
        });

        // Clear message after 8 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 8000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'दान जमा करने में त्रुटि हुई',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white px-4 py-12 overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-6">
          📝 दान की जानकारी दें / Submit Donation Details
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-lg p-4 md:p-6"
        >
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-base md:text-lg font-bold text-gray-800 mb-1.5">
              आपका नाम / Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="नाम दर्ज करें / Enter your name"
              className="w-full px-3 py-2 text-base border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
              disabled={loading}
            />
          </div>

          {/* Amount Field */}
          <div className="mb-4">
            <label className="block text-base md:text-lg font-bold text-gray-800 mb-1.5">
              राशि / Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="500 या अधिक दर्ज करें"
              min="1"
              className="w-full px-3 py-2 text-base border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
              disabled={loading}
            />
            <p className="text-xs text-gray-600 mt-1">
              
            </p>
          </div>

          {/* Suggestion/Description Field */}
          <div className="mb-4">
            <label className="block text-base md:text-lg font-bold text-gray-800 mb-1.5">
              सुझाव / Suggestion (Optional)
            </label>
            <textarea
              name="suggestion"
              value={formData.suggestion}
              onChange={handleChange}
              placeholder="अपना सुझाव या संदेश दें / Share your message or suggestion"
              className="w-full px-3 py-2 text-sm border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 resize-none"
              rows="3"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              यह Field optional है / This field is optional
            </p>
          </div>

          {/* Privacy Checkbox */}
          <div className="mb-6 bg-white border-2 border-gray-200 rounded-lg p-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-200"
                disabled={loading}
              />
              <span className="ml-2 text-base font-semibold text-gray-800">
                मेरा नाम सार्वजनिक रूप से दिखाएं
              </span>
            </label>
            <p className="text-xs text-gray-600 ml-7 mt-1">
              Show my name publicly / अगर न चुनें तो "Anonymous" दिखेगा
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg text-center font-semibold text-sm ${
                message.type === 'success'
                  ? 'bg-green-100 border-2 border-green-300 text-green-800'
                  : 'bg-red-100 border-2 border-red-300 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg text-base md:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {loading ? 'प्रस्तुत कर रहे हैं...' : '✅ दान जमा करें / Submit Donation'}
          </button>

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-600 mt-6">
            आपका दान Admin द्वारा verified के बाद दिखाई देगा
          </p>
        </form>
      </div>
    </div>
  );
}
