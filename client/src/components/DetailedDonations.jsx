/**
 * Detailed Donations Component
 * Displays all donations with tabbed filtering by contribution level
 * Groups: Small, Tree Planters, Silver, Gold, Platinum
 * Uses modal overlay with tab navigation
 */

import React, { useState, useEffect } from 'react';
import { donationAPI } from '../services/api';
import { formatDateIST } from '../utils/dateFormatter';

export default function DetailedDonations({ isOpen, onClose }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  /**
   * Fetch all donations from API
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

  useEffect(() => {
    if (isOpen) {
      fetchDonations();
      setActiveTab('all'); // Reset to 'all' tab when modal opens
    }
  }, [isOpen]);

  /**
   * Group donations by amount categories
   */
  const groupDonations = () => {
    const groups = {
      small: {
        label: '🤝 Small',
        label_full: 'Small Contributions',
        label_hi: 'छोटे दान (< ₹500)',
        range: '< ₹500',
        color: 'blue',
        donations: [],
      },
      tree: {
        label: '🌳 Tree Planters',
        label_full: 'Tree Planters',
        label_hi: 'वृक्ष रोपणकर्ता (₹500 - ₹999)',
        range: '₹500 - ₹999',
        color: 'green',
        donations: [],
      },
      silver: {
        label: '🥈 Silver',
        label_full: 'Silver Supporters',
        label_hi: 'चांदी समर्थक (₹1000 - ₹1499)',
        range: '₹1000 - ₹1499',
        color: 'gray',
        donations: [],
      },
      gold: {
        label: '🥇 Gold',
        label_full: 'Gold Supporters',
        label_hi: 'सोना समर्थक (₹1500 - ₹1999)',
        range: '₹1500 - ₹1999',
        color: 'yellow',
        donations: [],
      },
      platinum: {
        label: '💎 Platinum',
        label_full: 'Platinum Supporters',
        label_hi: 'प्लेटिनम समर्थक (₹2000+)',
        range: '₹2000+',
        color: 'purple',
        donations: [],
      },
    };

    // Categorize donations
    donations.forEach((donation) => {
      const amount = donation.amount || 0;
      if (amount < 500) {
        groups.small.donations.push(donation);
      } else if (amount < 1000) {
        groups.tree.donations.push(donation);
      } else if (amount < 1500) {
        groups.silver.donations.push(donation);
      } else if (amount < 2000) {
        groups.gold.donations.push(donation);
      } else {
        groups.platinum.donations.push(donation);
      }
    });

    return groups;
  };

  const groups = groupDonations();

  // Color mapping for groups
  const colorMap = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
      tab: 'bg-blue-100 text-blue-800',
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800',
      tab: 'bg-green-100 text-green-800',
    },
    gray: {
      border: 'border-gray-400',
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      badge: 'bg-gray-100 text-gray-800',
      tab: 'bg-gray-100 text-gray-800',
    },
    yellow: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800',
      tab: 'bg-yellow-100 text-yellow-800',
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800',
      tab: 'bg-purple-100 text-purple-800',
    },
  };

  /**
   * Render donation card
   */
  const renderDonationCard = (donation, colorClass, isSmallCard = false) => (
    <div
      key={donation.id}
      className={`bg-white border-l-4 ${colorClass.border} rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow ${
        isSmallCard
          ? 'flex flex-col items-center text-center'
          : 'flex items-center justify-between'
      }`}
    >
      {/* Content */}
      <div className={isSmallCard ? 'w-full' : 'flex-1'}>
        <p className="text-base md:text-lg font-bold text-gray-800">
          {donation.name || "Anonymous"}
        </p>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          📅 {donation.date ? formatDateIST(donation.date) : "N/A"}
        </p>
      </div>

      {/* Amount - Always on right or below for small cards */}
      <div className={isSmallCard ? 'mt-3 w-full text-center' : 'text-right ml-4'}>
        <p className="text-xl md:text-2xl font-bold text-green-600">
          ₹{(donation.amount || 0).toLocaleString()}
        </p>
      </div>
    </div>
  );

  /**
   * Get donations to display based on active tab
   */
  const getDisplayedDonations = () => {
    if (activeTab === 'all') {
      return null; // Return null to show all groups
    }
    return groups[activeTab]?.donations || [];
  };

  /**
   * Render tab button
   */
  const renderTabButton = (tabId, tabLabel, range, colorClass) => {
    const isActive = activeTab === tabId;
    const borderColor = isActive 
      ? `border-b-4 ${colorClass.border}` 
      : 'border-b-2 border-gray-300';
    
    return (
      <button
        key={tabId}
        onClick={() => setActiveTab(tabId)}
        className={`flex-1 px-2 py-3 md:px-3 md:py-4 font-semibold text-xs md:text-sm transition-all flex flex-col items-center justify-center ${borderColor} border-l border-r border-t-2 ${
          isActive
            ? `${colorClass.tab} border-gray-200`
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
        }`}
      >
        <div>{tabLabel}</div>
        {range && <div className="text-xs opacity-80 mt-0.5">{range}</div>}
      </button>
    );
  };

  if (!isOpen) return null;

  const displayedDonations =
    activeTab === 'all' ? null : getDisplayedDonations();

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-lg max-w-5xl w-full max-h-[85vh] overflow-hidden z-50 shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between border-b-4 border-green-800 flex-shrink-0">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              📊 सभी दान / All Donations
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation - Sticky */}
          <div className="sticky top-0 bg-white border-b-2 border-gray-300 flex-shrink-0">
            <div className="flex gap-0 px-0 py-0 w-full bg-white">
              {/* All Tab */}
              {renderTabButton(
                'all',
                '📋 All',
                '',
                colorMap.green
              )}

              {/* Category Tabs - Only show if category has donations */}
              {groups.small.donations.length > 0 &&
                renderTabButton(
                  'small',
                  groups.small.label,
                  groups.small.range,
                  colorMap.blue
                )}
              {groups.tree.donations.length > 0 &&
                renderTabButton(
                  'tree',
                  groups.tree.label,
                  groups.tree.range,
                  colorMap.green
                )}
              {groups.silver.donations.length > 0 &&
                renderTabButton(
                  'silver',
                  groups.silver.label,
                  groups.silver.range,
                  colorMap.gray
                )}
              {groups.gold.donations.length > 0 &&
                renderTabButton(
                  'gold',
                  groups.gold.label,
                  groups.gold.range,
                  colorMap.yellow
                )}
              {groups.platinum.donations.length > 0 &&
                renderTabButton(
                  'platinum',
                  groups.platinum.label,
                  groups.platinum.range,
                  colorMap.purple
                )}
            </div>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="overflow-y-auto flex-1 p-6 md:p-8 bg-gray-50">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Loading donations...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                <p className="text-lg">{error}</p>
              </div>
            ) : activeTab === 'all' ? (
              // Show All Groups
              <div className="space-y-12">
                {Object.entries(groups).map(([key, group]) => {
                  // Skip if group is empty
                  if (group.donations.length === 0) return null;

                  const colors = colorMap[group.color];

                  return (
                    <div key={key}>
                      {/* Group Header */}
                      <div
                        className={`mb-6 pb-4 border-b-2 ${colors.border}`}
                      >
                        <h3
                          className={`text-2xl md:text-3xl font-bold ${colors.text} mb-2`}
                        >
                          {group.label} / {group.label_hi}
                        </h3>
                        <p className="text-gray-600">
                          {group.range} • {group.donations.length} donation(s)
                        </p>
                      </div>

                      {/* Group Donations */}
                      {key === 'small' ? (
                        // Grid layout for small contributions
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                          {group.donations.map((donation) =>
                            renderDonationCard(
                              donation,
                              colors,
                              true
                            )
                          )}
                        </div>
                      ) : (
                        // Normal layout for other groups
                        <div className="space-y-3 mb-8">
                          {group.donations.map((donation) =>
                            renderDonationCard(
                              donation,
                              colors,
                              false
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : displayedDonations && displayedDonations.length > 0 ? (
              // Show Single Category
              <div>
                {/* Category Header */}
                <div
                  className={`mb-6 pb-4 border-b-2 ${
                    colorMap[groups[activeTab].color].border
                  }`}
                >
                  <h3
                    className={`text-2xl md:text-3xl font-bold ${
                      colorMap[groups[activeTab].color].text
                    } mb-2`}
                  >
                    {groups[activeTab].label_full} /{' '}
                    {groups[activeTab].label_hi}
                  </h3>
                  <p className="text-gray-600">
                    {groups[activeTab].range} •{' '}
                    {displayedDonations.length} donation(s)
                  </p>
                </div>

                {/* Donations for this category */}
                {activeTab === 'small' ? (
                  // Grid layout for small contributions
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedDonations.map((donation) =>
                      renderDonationCard(
                        donation,
                        colorMap[groups[activeTab].color],
                        true
                      )
                    )}
                  </div>
                ) : (
                  // Normal layout for other groups
                  <div className="space-y-3">
                    {displayedDonations.map((donation) =>
                      renderDonationCard(
                        donation,
                        colorMap[groups[activeTab].color],
                        false
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              // Empty state
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  No donations in this category yet.
                </p>
              </div>
            )}

            {/* Summary Footer */}
            {donations.length > 0 && (
              <div className="mt-8 pt-6 border-t-2 border-gray-300 bg-white rounded-lg p-4 text-center">
                <p className="text-base md:text-lg font-semibold text-gray-800">
                  कुल दान: {donations.length} | Total Amount: ₹
                  {donations
                    .reduce((sum, d) => sum + (d.amount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-100 px-6 py-4 border-t-2 border-gray-300 flex justify-center flex-shrink-0">
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
