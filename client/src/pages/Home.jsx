/**
 * Home Page
 * Main landing page with all components
 * Displays the complete donation platform
 */

import React, { useState } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import DonateSection from '../components/DonateSection';
import DonationForm from '../components/DonationForm';
import RecentDonations from '../components/RecentDonations';
import DetailedDonations from '../components/DetailedDonations';
import TopSupporters from '../components/TopSupporters';
import ProofGallery from '../components/ProofGallery';
import FundUsage from '../components/FundUsage';
import Footer from '../components/Footer';

export default function Home() {
  const [showDetailedDonations, setShowDetailedDonations] = useState(false);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Statistics Dashboard */}
      <Stats />

      {/* Donate Section with QR */}
      <DonateSection />

      {/* Donation Form */}
      <DonationForm />

      {/* Recent Donations */}
      <RecentDonations onViewAll={() => setShowDetailedDonations(true)} />

      {/* Detailed Donations Modal */}
      <DetailedDonations 
        isOpen={showDetailedDonations}
        onClose={() => setShowDetailedDonations(false)}
      />

      {/* Top Supporters */}
      <TopSupporters />

      {/* Fund Usage - Transparency Section */}
      <FundUsage />

      {/* Proof Gallery - HIDDEN FOR NOW (will be enabled when images are available) */}
      {/* <ProofGallery /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}
