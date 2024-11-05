import Image from "next/image";
import { LinkButton } from "components/link-button";

const Community = () => {
  return (
    <section className="lg:py-16 px-2 max-w-4xl mx-auto">
      <div className="relative">
        {/* Top Images */}
        <div className="hidden lg:block absolute -left-48 -top-8 h-52">
          <Image
            width={150}
            height={200}
            src="/pexels-rdne-7414284.jpg"
            alt="Fundraiser member"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="hidden lg:block absolute -right-48 -top-4 h-52">
          <Image
            width={150}
            height={200}
            src="/pexels-rdne-7414284.jpg"
            alt="Fundraiser member"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Bottom Images */}
        <div className="hidden lg:block absolute left-12 -bottom-10">
          <Image
            width={150}
            height={200}
            src="/pexels-rdne-7414284.jpg"
            alt="Fundraiser member"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="hidden lg:block absolute right-8 -bottom-10">
          <Image
            width={150}
            height={200}
            src="/pexels-rdne-7414284.jpg"
            alt="Fundraiser member"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Central Content */}
        <div className="flex flex-col items-center py-12 px-8">
          <h2 className="text-lg font-medium text-gray-600 mb-4">
            Be The Part Of FundRaisers With Over
          </h2>

          <div className="text-5xl md:text-6xl font-bold mb-4">
            217,924<span className="text-primary">+</span>
          </div>

          <p className="text-lg text-gray-600 mb-8">
            People From Around The World Joined
          </p>

          <LinkButton
            href="/donation"
            className="w-60 items-center bg-lightGreen hover:bg-darkGreen text-black rounded-full"
          >
            Join FundRaisers Now!
          </LinkButton>
        </div>
      </div>
    </section>
  );
};

export default Community;
