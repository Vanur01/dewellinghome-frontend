import { useState } from 'react';
import { ChevronDown, Menu, X, Headphones } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200">
      <div className="px-10 ">
        <div className="flex justify-between h-14">
          {/* Left side navigation items */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-xs text-gray-700 hover:text-red-600 font-normal">
              Partner with DwellingHome
            </a>
            <a href="#" className="text-xs text-gray-700 hover:text-red-600 font-normal">
              Refer and Earn
            </a>
            <a href="#" className="text-xs text-gray-700 hover:text-red-600 font-normal">
              Join Us
            </a>
            <div className="relative group">
              <div className="flex items-center text-xs text-gray-700 hover:text-red-600 font-normal cursor-pointer">
                Cities <ChevronDown className="ml-1 h-3 w-3" />
              </div>
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute z-30 w-48 bg-white shadow-lg rounded-md py-1 transition-all duration-300 ease-in-out">
                <a href="#" className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal">New York</a>
                <a href="#" className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal">Los Angeles</a>
                <a href="#" className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal">Chicago</a>
                <a href="#" className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal">Houston</a>
              </div>
            </div>
          </div>
          
          {/* Right side navigation items */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <div className="flex items-center text-xs text-red-600 hover:text-red-700 font-normal cursor-pointer">
                <span className="mr-1"> <Headphones className="h-3 w-3" /></span> Customer Support <ChevronDown className="ml-1 h-3 w-3" />
              </div>
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute right-0 z-30 w-48 bg-white shadow-lg rounded-md py-1 transition-all duration-300 ease-in-out">
                <a href="#" className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal">Contact Us</a>
                <a href="#" className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal">Help Center</a>
                <a href="#" className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal">Live Chat</a>
              </div>
            </div>
            <a href="#" className="text-xs text-gray-700 hover:text-red-600 font-normal">
              Visit Us
            </a>
            <a href="#" className="text-xs text-gray-700 hover:text-red-600 font-normal">
              Login/Register
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:bg-gray-100 rounded-md">
              Partner with HomeLane
            </a>
            <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:bg-gray-100 rounded-md">
              Refer and Earn
            </a>
            <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:bg-gray-100 rounded-md">
              Join Us
            </a>
            <div className="relative group">
              <div className="flex items-center w-full text-left px-3 py-2 text-xs font-normal text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                Cities <ChevronDown className="ml-1 h-3 w-3" />
              </div>
              <div className="hidden group-hover:block pl-4">
                <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:text-red-600 rounded-md">New York</a>
                <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:text-red-600 rounded-md">Los Angeles</a>
                <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:text-red-600 rounded-md">Chicago</a>
                <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:text-red-600 rounded-md">Houston</a>
              </div>
            </div>
            <div className="relative group">
              <div className="flex items-center w-full text-left px-3 py-2 text-xs font-normal text-red-600 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="mr-1">🔔</span> Customer Support <ChevronDown className="ml-1 h-3 w-3" />
              </div>
              <div className="hidden group-hover:block pl-4">
                <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:text-red-600 rounded-md">Contact Us</a>
                <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:text-red-600 rounded-md">Help Center</a>
                <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:text-red-600 rounded-md">Live Chat</a>
              </div>
            </div>
            <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:bg-gray-100 rounded-md">
              Visit Us
            </a>
            <a href="#" className="block px-3 py-2 text-xs font-normal text-gray-700 hover:bg-gray-100 rounded-md">
              Login/Register
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;