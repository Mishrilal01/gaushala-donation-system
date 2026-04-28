/**
 * API Service
 * Centralized API communication with the backend
 * Handles all HTTP requests to the server
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 */
const apiFetch = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE}${endpoint}`;
    
    const { headers, ...restOptions } = options;
    
    const fetchOptions = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    
    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Donation API Methods
 */
export const donationAPI = {
  /**
   * Submit new donation
   */
  submitDonation: async (donationData) => {
    return apiFetch('/donations/submit', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  },

  /**
   * Get approved donations for display
   */
  getApprovedDonations: async () => {
    return apiFetch('/donations/approved', { method: 'GET' });
  },

  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    return apiFetch('/donations/stats', { method: 'GET' });
  },

  /**
   * Get top 3 supporters
   */
  getTopSupporters: async () => {
    return apiFetch('/donations/top-supporters', { method: 'GET' });
  },
};

/**
 * Admin API Methods
 */
export const adminAPI = {
  /**
   * Admin login with password
   */
  login: async (password) => {
    return apiFetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },

  /**
   * Get pending donations (requires auth token)
   */
  getPendingDonations: async (token) => {
    return apiFetch('/admin/pending', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Get all donations (requires auth token)
   */
  getAllDonations: async (token) => {
    return apiFetch('/admin/all-donations', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Approve a donation (requires auth token)
   */
  approveDonation: async (token, donationId) => {
    return apiFetch('/admin/approve', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ donationId }),
    });
  },

  /**
   * Reject a donation (requires auth token)
   */
  rejectDonation: async (token, donationId) => {
    return apiFetch('/admin/reject', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ donationId }),
    });
  },

  /**
   * Upload gallery image (requires auth token)
   */
  uploadGalleryImage: async (token, filename, caption) => {
    return apiFetch('/admin/upload-image', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filename, caption }),
    });
  },

  /**
   * Get gallery images
   */
  getGalleryImages: async (token) => {
    return apiFetch('/admin/gallery', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Update donation amount (requires auth token)
   */
  updateDonationAmount: async (token, donationId, newAmount) => {
    return apiFetch('/admin/update-donation', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ donationId, newAmount }),
    });
  },

  /**
   * Update total trees planted (requires auth token)
   */
  updateTotalTrees: async (token, totalTrees) => {
    return apiFetch('/admin/update-trees', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ totalTrees }),
    });
  },

  /**
   * Get total trees planted
   */
  getTotalTrees: async (token) => {
    return apiFetch('/admin/total-trees', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

/**
 * Expense API Methods
 */
export const expenseAPI = {
  /**
   * Upload expense bill image (requires auth token)
   */
  uploadExpenseImage: async (token, file) => {
    try {
      const formData = new FormData();
      formData.append('billImage', file);

      const url = `${API_BASE}/expenses/upload-image`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  /**
   * Add new expense (requires auth token)
   */
  addExpense: async (token, expenseData) => {
    return apiFetch('/expenses/add', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(expenseData),
    });
  },

  /**
   * Get all expenses (public endpoint)
   */
  getAllExpenses: async () => {
    return apiFetch('/expenses/all', { method: 'GET' });
  },

  /**
   * Delete an expense (requires auth token)
   */
  deleteExpense: async (token, expenseId) => {
    return apiFetch('/expenses/delete', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ expenseId }),
    });
  },
};

export default { donationAPI, adminAPI, expenseAPI };
