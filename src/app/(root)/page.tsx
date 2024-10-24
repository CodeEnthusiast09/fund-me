"use client";

import { LinkButton } from "components/link-button";

export default function Home() {
  return (
    <div>
      <div className="bg-[url('/hands_touch_couple_212639_1280x1024.jpg')] bg-cover bg-center bg-no-repeat m-5 rounded-2xl h-[200px] lg:h-[700px] lg:mx-9">
        {/* Button */}

        <div className="absolute top-24 right-4 w-28 lg:hidden">
          <LinkButton
            href={"/donation"}
            className="font-semibold bg-lightGreen hover:bg-darkGreen rounded-xl mr-3 "
          >
            Donate
          </LinkButton>
        </div>

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
    </div>
  );
}
