"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, Share2 } from "lucide-react";
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

      {activeTab === "browse" ? (
        <div>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search campaigns..."
                  className="w-full px-4 py-2 pl-10 border rounded-lg"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                <option>Most Recent</option>
                <option>Most Funded</option>
                <option>Ending Soon</option>
              </select>
            </div>
          </div>

          {/* Campaign Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {["Education", "Healthcare", "Environment", "Disaster Relief"].map(
              (category) => (
                <button
                  key={category}
                  className="p-4 bg-white border rounded-xl text-center hover:bg-lightGreen transition-colors"
                >
                  {category}
                </button>
              )
            )}
          </div>

          {/* Featured Campaigns */}
          <h2 className="text-2xl font-bold mb-6">Featured Campaigns</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Campaign Title</h3>
                    <button className="text-gray-500 hover:text-black">
                      <Share2 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Brief description of the campaign goes here...
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="h-2 w-48 bg-darkGray rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-[#9FE870]"></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">75% funded</p>
                    </div>
                    <button className="text-gray-500 hover:text-red-500">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DonationContent />
      )}

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
