import { MenuIcon, ShoppingCart, Shield, User, Send } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Order Management', path: '/dashboard/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Warranty Claim', path: '/dashboard/warranty', icon: <Shield className="w-5 h-5" /> },
    { name: 'Refer & Earn', path: '/dashboard/refer&earn', icon: <Send className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile menu button */}
      {!isOpen && <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors duration-200"
        aria-label="Toggle Menu"
      >
         <MenuIcon className="w-5 h-5 text-gray-700" />
      </button>}

      {/* Sidebar */}
      <div
        className={`fixed md:static md:translate-x-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out w-64 bg-white h-full border-r border-gray-200 z-40 flex flex-col`}
      >
        <div className="flex-none px-3 py-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <User className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-gray-800 font-medium">John Doe</h3>
              <p className="text-gray-500 text-sm">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 
                ${location.pathname === item.path 
                  ? 'border border-red-100 bg-red-50 text-red-600 ' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-red-600 border border-white'
                }`}
            >
              <span className="inline-flex items-center justify-center w-8">
                {item.icon}
              </span>
              <span className="ml-3 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 