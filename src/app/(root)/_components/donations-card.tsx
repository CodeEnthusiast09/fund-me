import { DonationsCardProps } from "./types";
import Image from "next/image";
import { HiOutlineShare } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";

const DonationsCard = ({
  image = "/pexels-rdne-7414284.jpg",
  creator,
  title,
  amount,
  daysLeft,
}: DonationsCardProps) => {
  return (
    <div className="w-full mt-10 max-w-md rounded-xl overflow-hidden bg-white p-4 hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative w-full h-60">
        <Image
          alt={`${title} campaign image`}
          src={image}
          fill
          className="object-cover rounded-xl"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="py-4 space-y-3">
        {/* Title and Verification */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-medium text-gray-900">{creator}</span>

          <HiOutlineShare className="text-xl text-gray-500 hover:text-black cursor-pointer" />
        </div>

        {/* Campaign Name */}
        <h3 className="text-xl font-normal text-gray-600">{title}</h3>

        {/* Progress Bar and Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-72 bg-black rounded-full h-2 flex">
              <div
                className="bg-lightGreen h-2 rounded-full"
                style={{ width: "75%" }}
              />
            </div>
            <FaRegHeart className="text-xl hover:text-red-500 cursor-pointer" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              ${amount}
            </span>
            <span className="text-gray-500 text-sm">{daysLeft} days left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationsCard;
