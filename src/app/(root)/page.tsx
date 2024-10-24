"use client";

import { LinkButton } from "components/link-button";

export default function Home() {
  return (
    <div>
      <div className="bg-[url('/hands_touch_couple_212639_1280x1024.jpg')] bg-cover bg-center bg-no-repeat m-5 rounded-2xl h-[200px]">
        {/* Button */}

        <div className="absolute top-24 right-4 w-28">
          <LinkButton
            href={"/donation"}
            className="font-semibold bg-lightGreen hover:bg-darkGreen rounded-xl mr-3 "
          >
            Donate
          </LinkButton>
        </div>

        {/* Content */}
        <div className="text-white w-[294px] flex px-2 items-end relative top-28">
          <h1 className="text-7xl font-extrabold">Fund</h1>
          <p className="text-xl font-bold">Help Others</p>
        </div>
      </div>
    </div>
  );
}
