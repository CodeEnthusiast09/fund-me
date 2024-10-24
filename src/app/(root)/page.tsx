"use client";

import { LinkButton } from "components/link-button";
import FeaturesCard from "./_components/features-card";
import { FaGift } from "react-icons/fa";
import { IoMdFlash } from "react-icons/io";
import { ImEarth } from "react-icons/im";

export default function Home() {
  return (
    <div>
      {/* image */}
      <div className="bg-[url('/hands_touch_couple_212639_1280x1024.jpg')] bg-cover bg-center bg-no-repeat m-5 rounded-2xl h-[200px] lg:h-[700px] lg:mx-9">
        {/* Button */}

        {/* <div className="absolute top-24 right-4 w-28 lg:hidden"> */}
        <LinkButton
          href={"/donation"}
          className="absolute top-24 right-4 w-28 lg:hidden font-semibold bg-lightGreen hover:bg-darkGreen rounded-xl mr-3 "
        >
          Donate
        </LinkButton>
        {/* </div> */}

        {/* Content */}
        <div className="flex items-end justify-between relative lg:top-96">
          <div className="text-white w-[294px] flex px-2 items-end relative top-28 lg:static">
            <h1 className="text-7xl font-extrabold lg:text-[18rem]">Fund</h1>
            <p className="text-xl font-bold lg:text-6xl lg:mb-7">Help Others</p>
          </div>
          <LinkButton
            size="lg"
            href={"/donation"}
            className="text-3xl font-semibold bg-lightGreen hover:bg-darkGreen hidden lg:block rounded-3xl mr-5 mb-7"
          >
            Donate
          </LinkButton>
        </div>
      </div>

      {/* About */}
      <div className="m-5 lg:m-9">
        <h1 className="text-4xl font-bold mb-4 lg:text-5xl">
          Fund, Fast As <span className="italic">Flash</span>
        </h1>
        <p className="text-lg text-darkGray lg:text-2xl">
          Fundraise at the speed of thought! Elevate your cause in just a minute
          with our lightening-fast fundraising platform
        </p>
        <div>
          <FeaturesCard
            title="Ignite Impact"
            description="Spark joy by sharing your cause and the positive impact it brings. Clearly express how contributions will make a meaningful difference"
            icon={FaGift}
            iconColor="darkGreen"
            iconBgColor="lightGreen"
          />

          <FeaturesCard
            title="Spread The Word"
            description="Leverage the speed of social media and online networks. Share your fundraising campaign swiftly across various platforms"
            icon={IoMdFlash}
            iconColor="darkGreen"
            iconBgColor="lightGreen"
          />

          <FeaturesCard
            title="Connect Globally"
            description="Build a strong social network around your cause. Encourage supporters to share the campaign within their local communities"
            icon={ImEarth}
            iconColor="darkGreen"
            iconBgColor="lightGreen"
          />
        </div>
      </div>
    </div>
  );
}
