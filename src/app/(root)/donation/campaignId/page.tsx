"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
} from "react-icons/fa6";
import Story from "./_components/story";
import Supporters from "./_components/supporters";
import { LinkButton } from "components/link-button";

const Page = () => {
  const [activeTab, setActiveTab] = useState("story");
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:flex justify-between items-center mb-8">
        <h1 className="text-center text-2xl font-bold">Title</h1>
        <LinkButton
          href="/donation/campaignId/donate"
          className="bg-lightGreen hover:bg-darkGreen hidden lg:block"
        >
          Donate Now
        </LinkButton>
      </div>
      <div className="flex flex-col items-center lg:flex-row gap-8">
        <div className=" relative w-full h-60 md:w-1/2">
          <Image
            src="/pexels-rdne-7414284.jpg"
            alt="Campaign Image"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">104 donors</h2>
          <p className="text-gray-600 mb-2">$9,850 raised</p>
          <p className="text-gray-600 mb-4">Goal: $12,000</p>
          <div className="h-2 w-full bg-gray-300 rounded-full mb-2">
            <div
              className="h-full bg-lightGreen rounded-full"
              style={{ width: "82.08%" }}
            ></div>
          </div>
          <p className="text-gray-600 text-sm mb-6">82.08% funded</p>
          <div className="flex gap-4 mb-8 lg:mb-0">
            <a
              href="#instagram"
              className="hover:text-[#9FE870] transition-colors flex gap-3 items-center"
            >
              <FaInstagram size={30} />
              <span className="hidden lg:block">Instagram</span>
            </a>
            <a
              href="#facebook"
              className="hover:text-[#9FE870] transition-colors flex gap-3 items-center"
            >
              <FaFacebook size={30} />
              <span className="hidden lg:block">Facebook</span>
            </a>
            <a
              href="#twitter"
              className="hover:text-[#9FE870] transition-colors flex gap-3 items-center"
            >
              <FaXTwitter size={30} />
              <span className="hidden lg:block">Twitter</span>
            </a>
            <a
              href="#linkedin"
              className="hover:text-[#9FE870] transition-colors flex gap-3 items-center"
            >
              <FaLinkedin size={30} />
              <span className="hidden lg:block">LinkedIn</span>
            </a>
          </div>
          <LinkButton
            href="/campaignId/donate"
            className="bg-lightGreen hover:bg-darkGreen lg:hidden"
          >
            Donate Now
          </LinkButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 my-8 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "story" ? "border-b-2 border-black" : ""
          }`}
          onClick={() => setActiveTab("story")}
        >
          Story
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "supporters" ? "border-b-2 border-black" : ""
          }`}
          onClick={() => setActiveTab("supporters")}
        >
          Supporters
        </button>
      </div>
      {activeTab === "story" ? <Story /> : <Supporters />}
    </div>
  );
};

export default Page;
