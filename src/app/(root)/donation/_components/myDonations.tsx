// "use client";

// import { Search } from "lucide-react";

// const DonationContent = () => {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-5">My Donations</h2>
//       <div className="flex flex-wrap gap-4 mb-8">
//         <div className="flex-1 min-w-[200px]">
//           <div className="relative">
//             <input
//               type="search"
//               placeholder="Search campaigns..."
//               className="w-full px-4 py-2 pl-10 border rounded-lg"
//             />
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               size={18}
//             />
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <select className="px-4 py-2 border rounded-lg hover:bg-gray-50">
//             <option>Most Recent</option>
//             <option>Most Funded</option>
//             <option>Ending Soon</option>
//           </select>
//         </div>
//       </div>

//       {/* Campaign Categories */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
//         {["Education", "Healthcare", "Environment", "Disaster Relief"].map(
//           (category) => (
//             <button
//               key={category}
//               className="p-4 bg-white border rounded-xl text-center hover:bg-lightGreen transition-colors"
//             >
//               {category}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default DonationContent;

"use client";

import { Search } from "lucide-react";
import { useSignIn } from "hooks/useSignIn";
import { LinkButton } from "components/link-button";

const DonationContent = () => {
  const { isSuccess, data } = useSignIn();

  if (!isSuccess || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold mb-6">
          Sign In to view your donations
        </h2>
        <LinkButton
          href="/auth/login"
          className="bg-lightGreen hover:bg-darkGreen hidden md:block lg:rounded-full lg:text-black"
        >
          Sign In
        </LinkButton>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">My Donations</h2>
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

      {/* You can add the actual donations list here */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Recent Donations</h3>
        {/* This is a placeholder. Replace with actual donation data */}
        <p>No donations yet. Start supporting a cause today!</p>
      </div>
    </div>
  );
};

export default DonationContent;
