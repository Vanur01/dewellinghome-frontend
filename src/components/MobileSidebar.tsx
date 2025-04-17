import { X, ShoppingCart, Shield, User, Headphones, Send } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const location = useLocation();

  const dashboardMenuItems = [
    { name: 'Order Management', path: '/dashboard/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Warranty Claim', path: '/dashboard/warranty', icon: <Shield className="w-5 h-5" /> },
    { name: 'Refer & Earn', path: '/dashboard/refer&earn', icon: <Send className="w-5 h-5" /> },
  ];

  const mainMenuItems = [
    { name: "Design Gallery", href: "/design-gallary" },
    { name: "Modular Kitchen", href: "/modular-kitchen" },
    { name: "Wardrobe", href: "/wardrobe" },
    { name: "Bedroom", href: "/bedroom" },
    { name: "Living Room", href: "/living-room" },
    { name: "Bathroom", href: "/bathroom" },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out w-80 bg-white h-screen z-50 overflow-y-auto md:hidden`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-200">
          <Link to={'/'} className="flex items-center gap-3" onClick={onClose}>
            <img className='w-16' src='/images/Dwelling_home.png' alt="Logo"/>
            <h2 className="text-xl font-semibold text-gray-800">Dwelling Home</h2>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <User className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-gray-800 font-medium">John Doe</h3>
              <p className="text-gray-500 text-sm">Admin</p>
            </div>
          </div>

          {/* Top Navigation Items */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Quick Links</h3>
            <div className="space-y-1">
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Partner with DwellingHome
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Refer and Earn
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Join Us
              </a>
            </div>
          </div>

          {/* Main Navigation Items */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Main Menu</h3>
            <div className="space-y-1">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Dashboard Items (if user is logged in) */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Dashboard</h3>
            <div className="space-y-1">
              {dashboardMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                    location.pathname === item.path
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-8">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Support and Account */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Support & Account</h3>
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm text-red-600">
                <div className="flex items-center">
                  <Headphones className="w-4 h-4 mr-2" />
                  <span>Customer Support</span>
                </div>
                <div className="pl-6 mt-2 space-y-1">
                  <a href="#" className="block text-gray-700 hover:text-red-600">Contact Us</a>
                  <a href="#" className="block text-gray-700 hover:text-red-600">Help Center</a>
                  <a href="#" className="block text-gray-700 hover:text-red-600">Live Chat</a>
                </div>
              </div>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Visit Us
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Login/Register
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileSidebar;