import {
  X,
  ShoppingCart,
  Shield,
  Target,
  Users,
  User,
  Send,
  CreditCard,
  MessageSquare,
  Image,
  Star,
  Headphones,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isAdmin = location.pathname.includes('/admin');

  const userMenuItems = [
    { name: 'Profile', path: '/dashboard/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Projects', path: '/dashboard/projects', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Warranty Claim', path: '/dashboard/warranty', icon: <Shield className="w-5 h-5" /> },
    { name: 'Refer & Earn', path: '/dashboard/refer&earn', icon: <Send className="w-5 h-5" /> },
    { name: 'Payment', path: '/dashboard/payment', icon: <CreditCard className="w-5 h-5" /> },
  ];

  const adminMenuItems = [
    { name: 'Warranty Claims', path: '/admin/warranty', icon: <Shield className="w-5 h-5" /> },
    { name: 'Orders', path: '/admin/projects', icon: <Target className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Referrals', path: '/admin/referral', icon: <Send className="w-5 h-5" /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <Image className="w-5 h-5" /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <Star className="w-5 h-5" /> },
  ];

  const mainMenuItems = [
    { name: "Design Gallery", path: "/design-gallery" },
    { name: "Modular Kitchen", path: "/modular-kitchen" },
    { name: "Wardrobe", path: "/wardrobe" },
    { name: "Bedroom", path: "/bedroom" },
    { name: "Living Room", path: "/living-room" },
    { name: "Bathroom", path: "/bathroom" },
  ];

  const quickLinks = [
    { name: "Partner with DwellingHome", path: "/partner" },
    { name: "Refer and Earn", path: "/refer" },
    { name: "Join Us", path: "/careers" },
  ];

  const supportItems = [
    { name: "Contact Us", path: "/contact" },
    { name: "Help Center", path: "/help" },
    { name: "Live Chat", path: "/chat" },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <>
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
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{user?.name || 'Guest'}</h4>
              <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'User'}</p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Quick Links</h3>
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Main Navigation Section */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Main Menu</h3>
            {mainMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md"
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Dashboard Section */}
          {user && (
            <div className="space-y-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">
                {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
              </h3>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150
                      ${isActive
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'}
                    `}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Support Section */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Support</h3>
            <div className="px-3 py-2">
              <div className="flex items-center text-red-600">
                <Headphones className="w-4 h-4 mr-2" />
                <span className="text-sm">Customer Support</span>
              </div>
              <div className="mt-2 space-y-1 pl-6">
                {supportItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className="block text-sm text-gray-700 hover:text-red-600 py-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          {user && (
            <div className="px-3 pt-6">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full text-sm bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
          role="presentation"
        />
      )}
    </>
  );
};

export default MobileSidebar;