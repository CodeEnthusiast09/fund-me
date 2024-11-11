import Link from "next/link";
import { Search, Heart, Share2 } from "lucide-react";

const Featured = () => {
  return (
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
      {/* <div> */}
      <Link
        href="/donation/campaignId"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
      </Link>
      {/* </div> */}
    </div>
  );
};

export default Featured;
