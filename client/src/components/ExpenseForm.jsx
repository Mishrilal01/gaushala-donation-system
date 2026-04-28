/**
 * Expense Form Component
 * Admin form to add new expenses
 * - Title input
 * - Amount input
 * - Description input (optional)
 * - Bill/Photo upload (optional, max 2MB)
 * - Submit button
 */

import React, { useState } from 'react';
import { expenseAPI } from '../services/api';

export default function ExpenseForm({ token, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('केवल JPG और PNG छवियाँ स्वीकार्य हैं / Only JPG and PNG images are allowed');
      setSelectedFile(null);
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('फाइल आकार 2MB से अधिक नहीं हो सकता / File size cannot exceed 2MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  /**
   * Upload image to server
   */
  const uploadImage = async () => {
    if (!selectedFile) return null;

    try {
      setUploading(true);
      const response = await expenseAPI.uploadExpenseImage(token, selectedFile);

      if (response.success) {
        setUploadedImagePath(response.imagePath);
        return response.imagePath;
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'बिल अपलोड करने में त्रुटि / Error uploading bill image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('कृपया शीर्षक दर्ज करें / Please enter title');
      setLoading(false);
      return;
    }

    if (!formData.amount || formData.amount < 1) {
      setError('कृपया सही राशि दर्ज करें / Please enter valid amount');
      setLoading(false);
      return;
    }

    try {
      let imagePath = uploadedImagePath;

      // Upload image if selected but not yet uploaded
      if (selectedFile && !uploadedImagePath) {
        imagePath = await uploadImage();
        if (!imagePath) {
          setLoading(false);
          return;
        }
      }

      // Prepare expense data
      const expenseData = {
        title: formData.title.trim(),
        amount: parseInt(formData.amount),
        description: formData.description.trim() || null,
        image_url: imagePath || null,
        date: new Date().toISOString(),
      };

      const response = await expenseAPI.addExpense(token, expenseData);

      if (response.success) {
        setSuccess(response.message);
        setFormData({
          title: '',
          amount: '',
          description: '',
        });
        setSelectedFile(null);
        setUploadedImagePath('');

        // Call parent callback to refresh expenses list
        if (onExpenseAdded) {
          onExpenseAdded();
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err.message || 'खर्च जोड़ने में त्रुटि / Error adding expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-green-200 rounded-lg p-6 mb-6">
      <h3 className="text-2xl font-bold text-green-700 mb-4">
        💸 खर्च जोड़ें / Add Expense
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            शीर्षक / Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., पेड़ के लिए खाद खरीदना / Tree Guard Purchase"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            disabled={loading || uploading}
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            राशि / Amount (₹) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g., 5000"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            min="1"
            disabled={loading || uploading}
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            विवरण / Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="अतिरिक्त जानकारी जोड़ें / Add additional details"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 h-24"
            disabled={loading || uploading}
          />
        </div>

        {/* Bill/Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📸 बिल / फोटो अपलोड करें / Upload Bill/Photo (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileSelect}
              disabled={loading || uploading}
              className="w-full cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-2">
              JPG या PNG / Supported: JPG, PNG | Max Size: 2MB
            </p>
            {selectedFile && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            {uploadedImagePath && (
              <p className="text-sm text-blue-600 mt-2">
                ✓ बिल सफलतापूर्वक अपलोड किया गया / Bill uploaded successfully
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm">
            ✅ {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          {uploading ? 'बिल अपलोड किया जा रहा है... / Uploading bill...' : loading ? 'जोड़ा जा रहा है... / Adding...' : '✅ खर्च जोड़ें / Add Expense'}
        </button>
      </form>
    </div>
  );
}
