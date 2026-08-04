"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, Share2 } from "lucide-react";
import { useHotCampaigns } from "hooks";

const Featured = () => {
  const { data: campaigns, isPending, handleSearch } = useHotCampaigns();

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="search"
              placeholder="Search campaigns..."
              className="w-full px-4 py-2 pl-10 border rounded-lg"
              onChange={(e) => handleSearch(e.target.value)}
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
        {!isPending && campaigns?.length === 0 && (
          <p className="text-gray-500 col-span-full">No campaigns found.</p>
        )}
        {campaigns?.map((campaign) => {
          const percentFunded = campaign.goal
            ? Math.min(100, (campaign.amountRaised / campaign.goal) * 100)
            : 0;

          return (
            <Link
              key={campaign.id}
              href={`/donation/${campaign.id}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video bg-gray-200">
                {campaign.headerImage && (
                  <Image
                    alt={campaign.title}
                    src={campaign.headerImage}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{campaign.title}</h3>
                  <Share2 size={18} className="text-gray-500" />
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {campaign.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-2 w-48 bg-darkGray rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#9FE870]"
                        style={{ width: `${percentFunded}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round(percentFunded)}% funded
                    </p>
                  </div>
                  <Heart size={18} className="text-gray-500" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Featured;
