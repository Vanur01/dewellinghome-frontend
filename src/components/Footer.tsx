import {
  FaInstagram,
  FaYoutube,
  FaPinterest,
  FaLinkedin,
  FaFacebookF,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-12 shadow-xl border-t-[0.03rem] border-gray-300">
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Logo and Socials */}
          <div className="flex flex-col gap-6 md:max-w-sm">
            <div className="flex items-center gap-3 text-2xl font-bold text-red-600">
              <img src="/images/Dwelling_home.png" alt="H" className="w-30 h-30 object-cover" />
            </div>
            <p className="text-sm text-gray-600">
              Beautiful Interiors. Delivered in 45 Days. That's our guarantee.
            </p>
            <div className="flex gap-4 text-red-600 text-lg">
              {[FaInstagram, FaYoutube, FaPinterest, FaLinkedin, FaFacebookF].map((Icon, i) => (
                <Icon key={i} className="hover:scale-110 transition-transform cursor-pointer" />
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Dwelling Home</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Team</li>
                <li>Join Us</li>
                <li>The Design Journal</li>
                <li>Get Estimate</li>
                <li>Privacy Policy</li>
                <li>Refer and Earn</li>
                <li>Tech@dwellinghome.com</li>
                <li>Book Virtual Meeting</li>
                <li>Modular Kitchen Cost Calculator</li>
                <li>Bathroom Designs</li>
                <li>Kids Bedroom</li>
                <li>Business Interiors</li>
                <li>FAQ</li>
                <li>Disclaimer</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Customer Support</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Raise issue</li>
                <li>My issues</li>
                <li>Contact us</li>
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
                <li>Terms & Conditions</li>
                <li>FAQs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-800">The Design Journal</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Buying Guides</li>
                <li>Style Your Home</li>
                <li>Interior 101</li>
                <li>Interiors By Dwelling Home</li>
                <li>Dwelling Home in Your City</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm border-t pt-6 gap-4">
          <p className="text-center md:text-left text-gray-500">
            © {new Date().getFullYear()} Dwelling Home Decor and Furnishings Pvt Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-gray-700">
            <div className="flex items-center gap-2">
              <MdEmail className="" />
              hello@dwellinghome.com
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="" />
              1800-102-4663
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
