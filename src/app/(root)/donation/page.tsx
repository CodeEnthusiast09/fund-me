"use client";

import { useState } from "react";
import Link from "next/link";
import Featured from "./_components/featured";
import DonationContent from "./_components/myDonations";

const Donation = () => {
  const [activeTab, setActiveTab] = useState("browse");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gray-100 rounded-2xl p-8 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Make a Difference Today
        </h1>
        <p className="text-gray-600 mb-8">
          Choose how you want to contribute to causes that matter
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/donation/new-campaign"
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Start a Campaign
          </Link>
          <Link
            href="/donations/campaign"
            className="bg-lightGreen px-8 py-3 rounded-full hover:bg-darkGreen transition-opacity"
          >
            Browse Campaigns
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "browse" ? "border-b-2 border-black" : ""
          }`}
          onClick={() => setActiveTab("browse")}
        >
          Campaigns
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "my" ? "border-b-2 border-black" : ""
          }`}
          onClick={() => setActiveTab("my")}
        >
          My Donations
        </button>
      </div>

      {/* Search and Filter */}

      {activeTab === "browse" ? <Featured /> : <DonationContent />}

      {/* Impact Stats */}
      <div className="bg-gray-100 rounded-2xl p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Impact Matters</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold mb-2">$2.5M+</div>
            <p className="text-gray-600">Raised this month</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">1,234</div>
            <p className="text-gray-600">Active campaigns</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">50K+</div>
            <p className="text-gray-600">Donors this month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
