import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
} from "react-icons/fa6";

const Footer = () => {
  const navLinks = {
    Donate: ["Education", "Social", "Medicine", "Disaster"],
    Help: ["FAQ", "Privacy Policy", "Accessibility", "Contact Us"],
    Company: ["About Us", "Careers", "Services", "Pricing"],
  };

  return (
    <footer className="bg-black text-white px-6 py-8 rounded-3xl m-5 lg:m-9">
      <div className="max-w-7xl mx-auto">
        {/* Top section with logo and navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Logo and tagline section */}
          <div className="space-y-2 flex justify-between lg:flex-col lg:justify-normal">
            <div className="flex items-center gap-2">
              <span className="text-[#9FE870] text-2xl">✱</span>
              <span className="text-xl font-semibold">fundlyNest</span>
            </div>
            <p className="text-sm text-gray-300 leading-tight">
              Elevating Experience & Seize <br />
              Control Of Your Smart Home!
            </p>
          </div>

          {/* Navigation sections */}
          <div className="flex justify-between">
            {Object.entries(navLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-medium mb-4">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section with copyright and social links */}
        <div className="pt-8 border-t border-gray-800 flex lg:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-300">
            © Fundtic 2023
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> - </span>All Rights Reserved.
          </div>

          {/* Social media links */}
          <div className="flex gap-4">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
