import {
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaFacebookF,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {


  const socialMediaIcons = [
    {
      icon: FaInstagram,
      link:"https://www.instagram.com/dewelling.homes"
    },
    {
      icon: FaYoutube,
      link:"https://www.youtube.com/@DewellingHome"
    },
    {
      icon: FaLinkedin,
      link:"https://www.linkedin.com/company/dewellinghomes/"
    },
    {
      icon: FaFacebookF,
      link:"https://www.facebook.com/profile.php?id=100089446819851"
    },
  ]
  return (
    <footer className="bg-white border-t shadow-xl border-[0.1rem] border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-8">
            <Link to="/" className="flex justify-left items-center gap-3 "> 
              <img
                src="/images/Dwelling_home.png"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
              <p className="font-semibold text-2xl">
              <span className="">Dewelling</span>
              <span className="text-red-500">Home</span>
              </p>
             
            </Link>
            <p className="text-gray-600 text-lg max-w-md">
              Transforming spaces into extraordinary homes. Your vision, our expertise.
            </p>
            <div className="flex items-center gap-6">
              {socialMediaIcons.map((Icon, idx) => (
                <a
                  key={idx}
                  href={Icon.link}
                  className="text-gray-400 hover:text-gray-900 hover:scale-110 transform transition-all duration-300 text-xl"
                >
                  <Icon.icon/>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Dewelling Home</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/team" className="text-gray-600 hover:text-gray-900 transition-colors">Our Team</Link>
                </li>
                <li>
                  <Link to="/contact-us" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
                </li>
                <li>
                  <Link to="/dashboard/refer&earn" className="text-gray-600 hover:text-gray-900 transition-colors">Refer & Earn</Link>
                </li>
                <li>
                  <Link to="/get-estimate" className="text-gray-600 hover:text-gray-900 transition-colors">Get Estimate</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Services</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/design-gallery" className="text-gray-600 hover:text-gray-900 transition-colors">Interior Design</Link>
                </li>
                <li>
                  <Link to="/modular-kitchen" className="text-gray-600 hover:text-gray-900 transition-colors">Modular Kitchen</Link>
                </li>
                <li>
                  <Link to="/kitchen-estimate" className="text-gray-600 hover:text-gray-900 transition-colors">Kitchen Estimate</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Support</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-and-conditions" className="text-gray-600 hover:text-gray-900 transition-colors">Terms and Conditions</Link>
                </li>
                <li>
                  <Link to="/refund-cancellation" className="text-gray-600 hover:text-gray-900 transition-colors">Refund & Cancellation Policy</Link>
                </li>
                <li>
                  <a 
                    href="/DEWELLING_HOMES_PO_2...pdf (1).pdf" 
                    download
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Download Scope of Work
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <a
                href="mailto:Hello@dewellinghome.com"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <MdEmail className="text-xl group-hover:scale-110 transition-transform" />
                <span>hello@dewellinghome.com</span>
              </a>
              <a
                href="tel:8328973166"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <FaPhoneAlt className="group-hover:scale-110 transition-transform" />
                <span>8328973166</span>
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Dewelling Home. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
