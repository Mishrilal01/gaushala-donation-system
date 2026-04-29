/**
 * Fund Usage Component
 * Displays how donated funds have been used
 * Shows list of expenses with transparency
 * Includes "View Bill" button to display bill images in modal
 */

import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { formatDateTimeIST } from '../utils/dateFormatter';

export default function FundUsage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Fetch all expenses on component mount
   */
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await expenseAPI.getAllExpenses();
        if (response.success) {
          setExpenses(response.data || []);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('खर्चों को लोड करने में त्रुटि / Could not load expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  /**
   * Open image modal
   */
  const openImageModal = (imagePath) => {
    setSelectedImage(imagePath);
    setIsModalOpen(true);
  };

  /**
   * Close image modal
   */
  const closeImageModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedImage(null), 300); // Clear after animation
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-b from-white to-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600">
            खर्चों को लोड किया जा रहा है... / Loading expenses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 px-4 py-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-12">
          🧾 पैसा कहाँ उपयोग हुआ / Fund Usage
        </h2>

        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-red-700 text-center mb-6">
            {error}
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-2">
              ℹ️ अभी कोई खर्च नहीं / No expenses yet
            </p>
            <p className="text-gray-500">
              आपके दान का उपयोग जल्द ही शुरू होगा / Expense details will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-5 md:space-y-6">
            {/* Total Expense Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5 md:p-6 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">कुल खर्च / Total Expenses</p>
              <p className="text-3xl md:text-4xl font-bold text-orange-600">
                ₹{expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {expenses.length} खर्चे / expenses logged
              </p>
            </div>

            {/* Expenses List */}
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 border border-orange-200 rounded-lg p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-3">
                  {/* Left Section - Title and Description */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">💸</span>
                      <h3 className="text-base md:text-lg font-bold text-gray-800">
                        {expense.title}
                      </h3>
                    </div>
                    {expense.description && (
                      <p className="text-xs text-gray-700 mb-1 ml-7 italic border-l-2 border-orange-300 pl-2">
                        "{expense.description}"
                      </p>
                    )}
                    <p className="text-xs text-gray-600 ml-7">
                      📅 {formatDateTimeIST(expense.date)}
                    </p>
                  </div>

                  {/* Right Section - Amount and View Bill Button */}
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-2">
                    <div className="text-right ml-7">
                      <p className="text-2xl md:text-3xl font-bold text-orange-600">
                        ₹{(expense.amount || 0).toLocaleString()}
                      </p>
                      {/* <p className="text-xs text-gray-600">खर्च / Expense</p> */}
                    </div>

                    {/* View Bill Button */}
                    {expense.image_url && (
                      <button
                        onClick={() => openImageModal(encodeURI(expense.image_url))}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all duration-200 font-semibold whitespace-nowrap cursor-pointer shadow-sm hover:shadow-md"
                      >
                        📸 बिल देखें
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transparency Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-5 md:p-6 shadow-sm">
          <p className="text-center text-gray-700">
            <span className="font-semibold text-blue-600">🔍 पारदर्शिता / Transparency:</span>
            <br />
            हम सभी खर्चों को साफ-साफ दिखाते हैं ताकि आप जान सकें आपका दान कहाँ खर्च हुआ।
            <br />
            <span className="text-sm text-gray-600">
              We show all expenses transparently so you know exactly how your donation is used.
            </span>
          </p>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeImageModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[70vw] h-[70vh] flex flex-col animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                📸 बिल / Bill Image
              </h3>
              <button
                onClick={closeImageModal}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Image (scrollable if needed) */}
            <div className="bg-gray-100 flex-1 flex items-center justify-center overflow-auto">
              <img
                src={encodeURI(selectedImage)}
                alt="Expense Bill"
                className="w-auto h-auto max-w-full max-h-full rounded-lg shadow-md object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t-2 border-gray-200 px-6 py-4 flex gap-3 justify-end flex-shrink-0">
              <button
                onClick={closeImageModal}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                बंद करें / Close
              </button>
              <a
                href={encodeURI(selectedImage)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                नई टैब में खोलें / Open in New Tab
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Tailwind CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
