import { ChevronDown, Headphones, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

const Navbar = () => {
  const {accessToken,user} = useAuthStore();

  const redirectTo = user?.role === 'admin' ? '/admin/projects' : 'dashboard/projects';

  return (
    <nav className="w-full border-b border-gray-200">
      <div className="px-10 ">
        <div className="flex justify-between h-14">
          {/* Left side navigation items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard/refer&earn" className="text-xs text-gray-700 hover:text-red-600 font-normal">
              Refer and Earn
            </Link>
            <Link to="/team" className="text-xs text-gray-700 hover:text-red-600 font-normal">
              Our Team
            </Link>
          </div>
          
          {/* Right side navigation items */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <div className="flex items-center text-xs text-red-600 hover:text-red-700 font-normal cursor-pointer">
                <span className="mr-1"> <Headphones className="h-3 w-3" /></span> Customer Support <ChevronDown className="ml-1 h-3 w-3" />
              </div>
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute right-0 z-30 w-48 bg-white shadow-lg rounded-md py-1 transition-all duration-300 ease-in-out">
                <Link to="/contact-us" className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal">Contact Us</Link>
              </div>
            </div>
            {accessToken ? (
              <Link to={redirectTo} className="text-xs text-gray-700 hover:text-red-600 font-normal">
                <div>
                  <UserCircle className="h-6 w-6 mr-2" />
                </div>
              </Link>
            ) : (
              <Link to="/login" className="text-xs text-gray-700 hover:text-red-600 font-normal">
                Login/Register
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;