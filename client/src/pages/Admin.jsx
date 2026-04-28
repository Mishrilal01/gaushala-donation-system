/**
 * Admin Panel Page
 * Admin dashboard for managing donations
 * - Login
 * - Approve/Reject donations
 * - View statistics
 * - Manage gallery
 */

import React, { useState, useEffect } from 'react';
import { adminAPI, donationAPI, expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import { formatDateTimeIST } from '../utils/dateFormatter';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [pendingDonations, setPendingDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [successMessage, setSuccessMessage] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalTrees, setTotalTrees] = useState(0);
  const [treesInput, setTreesInput] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);

  // Check if already logged in
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      loadAdminData();
    }
  }, [token]);

  /**
   * Handle admin login
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) {
      setLoginError('कृपया पासवर्ड दर्ज करें');
      return;
    }

    try {
      setLoading(true);
      const response = await adminAPI.login(password);

      if (response.success) {
        const newToken = response.token;
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
        setIsLoggedIn(true);
        setPassword('');
        setLoginError('');
        // Load data after login
        setTimeout(() => loadAdminData(), 500);
      }
    } catch (error) {
      setLoginError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load all admin data
   */
  const loadAdminData = async () => {
    if (!token) return;

    try {
      // Fetch pending donations
      const pendingResponse = await adminAPI.getPendingDonations(token);
      if (pendingResponse.success) {
        console.log('✅ Pending donations loaded:', pendingResponse.data);
        setPendingDonations(pendingResponse.data);
      }

      // Fetch all donations
      const allResponse = await adminAPI.getAllDonations(token);
      if (allResponse.success) {
        console.log('✅ All donations loaded:', allResponse.data);
        setAllDonations(allResponse.data);
      }

      // Fetch stats
      const statsResponse = await donationAPI.getStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch expenses
      const expensesResponse = await expenseAPI.getAllExpenses();
      if (expensesResponse.success) {
        console.log('✅ Expenses loaded:', expensesResponse.data);
        setExpenses(expensesResponse.data || []);
      }

      // Fetch total trees
      const treesResponse = await adminAPI.getTotalTrees(token);
      if (treesResponse.success) {
        console.log('✅ Total trees loaded:', treesResponse.data.totalTrees);
        setTotalTrees(treesResponse.data.totalTrees);
        setTreesInput(treesResponse.data.totalTrees.toString());
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  /**
   * Handle approve donation
   */
  const handleApprove = async (donationId) => {
    if (!token) return;

    console.log('🔍 Approving donation ID:', donationId, 'Type:', typeof donationId);

    try {
      setLoading(true);
      const response = await adminAPI.approveDonation(token, donationId);

      if (response.success) {
        setSuccessMessage('Donation approved!');
        loadAdminData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error approving donation:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle reject donation
   */
  const handleReject = async (donationId) => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await adminAPI.rejectDonation(token, donationId);

      if (response.success) {
        setSuccessMessage('Donation rejected');
        loadAdminData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error rejecting donation:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('adminToken');
    setPassword('');
  };

  /**
   * Handle update total trees
   */
  const handleUpdateTrees = async (e) => {
    e.preventDefault();
    if (!token) return;

    const newTrees = parseInt(treesInput);
    if (isNaN(newTrees) || newTrees < 0) {
      setSuccessMessage('कृपया सही संख्या दर्ज करें / Please enter a valid number');
      return;
    }

    try {
      setLoading(true);
      const response = await adminAPI.updateTotalTrees(token, newTrees);

      if (response.success) {
        setTotalTrees(newTrees);
        setSuccessMessage('🌳 पेड़ों की संख्या अपडेट की गई / Trees count updated!');
        loadAdminData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating trees:', error);
      setSuccessMessage('पेड़ों की संख्या अपडेट करने में त्रुटि / Error updating trees');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete expense
   */
  const handleDeleteExpense = async (expenseId) => {
    if (!token) return;

    if (!window.confirm('क्या आप यह खर्च हटाना चाहते हैं? / Are you sure?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await expenseAPI.deleteExpense(token, expenseId);

      if (response.success) {
        setSuccessMessage('खर्च हटाया गया / Expense deleted');
        loadAdminData();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date helper - converted to IST
   */
  const formatDate = (dateString) => {
    return formatDateTimeIST(dateString);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 max-w-md w-full border-2 border-green-300">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-8">
            🔐 Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 text-lg border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-red-700 text-center font-semibold">
                {loginError}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Default Password Note */}
          <p className="text-xs text-gray-600 text-center mt-6 italic">
            (Default: gaushala123)
          </p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-4xl font-bold text-green-700 whitespace-nowrap">
            📊 Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 md:px-4 rounded-lg text-xs md:text-base whitespace-nowrap"
          >
            Logout
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mb-6 text-green-800 text-center font-semibold">
            ✅ {successMessage}
          </div>
        )}

        {/* Statistics Summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Total Amount */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center border-2 border-green-200">
              <p className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
                💰
              </p>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                ₹{stats.totalAmount.toLocaleString()}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-semibold">
                कुल दान / Total Donated
              </p>
            </div>

            {/* Total Money Used */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center border-2 border-orange-200">
              <p className="text-3xl md:text-4xl font-bold text-orange-700 mb-2">
                💸
              </p>
              <p className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">
                ₹{stats.totalUsed.toLocaleString()}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-semibold">
                कुल खर्च / Total Used
              </p>
            </div>

            {/* Remaining Balance */}
            <div className={`bg-gradient-to-br rounded-lg p-6 text-center border-2 ${
              stats.remaining >= 0
                ? 'from-blue-50 to-blue-100 border-blue-200'
                : 'from-red-50 to-red-100 border-red-200'
            }`}>
              <p className="text-3xl md:text-4xl font-bold mb-2">
                🧾
              </p>
              <p className={`text-2xl md:text-3xl font-bold mb-1 ${
                stats.remaining >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                ₹{Math.abs(stats.remaining).toLocaleString()}
                {stats.remaining < 0 && ' '}
                {stats.remaining < 0 && <span className="text-red-600">(-)</span>}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-semibold">
                बचा हुआ / Remaining
              </p>
            </div>

            {/* Trees Planted */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center border-2 border-green-200">
              <p className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
                🌳
              </p>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                {stats.treesPlanted}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-semibold">
                पेड़ लगाए / Trees Planted
              </p>
            </div>

            {/* Total Donors */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center border-2 border-blue-200">
              <p className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
                👥
              </p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                {stats.totalDonors}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-semibold">
                दाता / Donors
              </p>
            </div>

            {/* Goal */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 text-center border-2 border-yellow-200">
              <p className="text-3xl md:text-4xl font-bold text-yellow-700 mb-2">
                🎯
              </p>
              <p className="text-2xl md:text-3xl font-bold text-yellow-600 mb-1">
                {stats.goalTrees || 100}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-semibold">
                लक्ष्य / Goal
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white border-2 border-gray-200 rounded-t-lg flex flex-wrap">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 min-w-max py-4 font-bold text-lg transition-colors ${
              activeTab === 'pending'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⏳ Pending ({pendingDonations.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 min-w-max py-4 font-bold text-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 All Donations ({allDonations.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 min-w-max py-4 font-bold text-lg transition-colors ${
              activeTab === 'expenses'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💸 Expenses ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('trees')}
            className={`flex-1 min-w-max py-4 font-bold text-lg transition-colors ${
              activeTab === 'trees'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌳 Trees
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-lg p-6">
          {activeTab === 'pending' && (
            <div>
              {pendingDonations.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No pending donations</p>
              ) : (
                <div className="space-y-4">
                  {pendingDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-6 flex justify-between items-start"
                    >
                      <div>
                        <p className="text-lg font-bold text-gray-800">{donation.name}</p>
                        <p className="text-gray-600">₹{donation.amount}</p>
                        <p className="text-sm text-gray-600">
                          📅 {formatDate(donation.date)}
                        </p>
                        {donation.screenshot && (
                          <p className="text-sm text-blue-600">📎 Screenshot attached</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleApprove(donation.id)}
                          disabled={loading}
                          className="block w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(donation.id)}
                          disabled={loading}
                          className="block w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'all' && (
            <div>
              {allDonations.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No donations yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className={`border-2 rounded-lg p-4 flex justify-between items-center ${
                        donation.status === 'approved'
                          ? 'border-green-300 bg-green-50'
                          : donation.status === 'rejected'
                          ? 'border-red-300 bg-red-50'
                          : 'border-yellow-300 bg-yellow-50'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-gray-800">
                          {donation.name}
                          <span className="ml-2 text-xs bg-gray-300 px-2 py-1 rounded-full">
                            {donation.status.toUpperCase()}
                          </span>
                        </p>
                        <p className="text-gray-600 text-sm">₹{donation.amount}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(donation.date)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div>
              {/* Add Expense Form */}
              <ExpenseForm token={token} onExpenseAdded={loadAdminData} />

              {/* Expenses List */}
              {expenses.length === 0 ? (
                <p className="text-center text-gray-600 py-8">कोई खर्च नहीं / No expenses yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 border-r-2 border-t-2 border-b-2 border-orange-200 rounded-lg p-4 md:p-5 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-102 flex flex-col md:flex-row md:justify-between md:items-center gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">💸</span>
                          <p className="font-bold text-gray-800 text-lg">{expense.title}</p>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-gray-700 mb-2 ml-7 italic">{expense.description}</p>
                        )}
                        <div className="flex gap-4 text-sm text-gray-600 ml-7">
                          <span>₹{expense.amount.toLocaleString()}</span>
                          <span>📅 {formatDate(expense.date)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col md:flex-row md:flex-wrap md:justify-end">
                        {expense.image_url && (
                          <button
                            onClick={() => setSelectedBill(expense)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            📄 View Bill
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'trees' && (
            <div>
              {/* Update Trees Count Form */}
              <form onSubmit={handleUpdateTrees} className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-bold text-green-700 mb-4">
                  🌳 कुल पेड़ लगाए / Update Total Trees Planted
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-2">
                      पेड़ों की संख्या / Trees Count
                    </label>
                    <input
                      type="number"
                      value={treesInput}
                      onChange={(e) => setTreesInput(e.target.value)}
                      placeholder="Enter number of trees"
                      className="w-full px-4 py-3 text-lg border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                      min="0"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
                  >
                    {loading ? 'अपडेट हो रहा है... / Updating...' : '✅ अपडेट करें / Update Trees'}
                  </button>
                </div>
              </form>

              {/* Current Status */}
              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">वर्तमान स्थिति / Current Status</p>
                <p className="text-4xl font-bold text-green-600 mb-2">{totalTrees} 🌳</p>
                <p className="text-gray-600">
                  लक्ष्य / Goal: 100 पेड़ / trees<br/>
                  प्रगति / Progress: {Math.round((totalTrees / 100) * 100)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bill View Modal */}
      {selectedBill && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedBill(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[55vw] h-[70vh] flex flex-col animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                📸 बिल / Bill Image
              </h3>
              <button
                onClick={() => setSelectedBill(null)}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Image (scrollable if needed) */}
            <div className="bg-gray-100 flex-1 flex items-center justify-center overflow-auto">
              <img
                src={selectedBill.image_url}
                alt="Expense Bill"
                className="w-auto h-auto max-w-full max-h-full rounded-lg shadow-md object-contain"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjE1MCIgeT0iMTAwIiBzdHlsZT0iZm9udC1zaXplOjE4cHg7ZmlsbDojOTk5Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t-2 border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedBill(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                बंद करें / Close
              </button>
              <a
                href={selectedBill.image_url}
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

      {/* Tailwind CSS animations */}
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
