import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import TopNavbar from './TopNavbar';
import Navbar from './Navbar';
import MobileSidebar from './MobileSidebar';
import Footer from './Footer';
import Faq from './Faq';
import { Link } from 'react-router-dom';

const RootLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Check if current path is admin or dashboard
  const isAdminOrDashboard = location.pathname.includes('/admin') || location.pathname.includes('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 h-16 bg-white shadow-sm sticky top-0 z-30">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <Link to="/" className="flex items-center justify-center">
          <img 
            className="w-12 h-12 object-cover" 
            src="/images/Dwelling_home.png" 
            alt="Dwelling Home"
          />
        </Link>
        <div className="w-10"> {/* Empty div for balanced spacing */}</div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <TopNavbar />
      </div>
      <div className="">
        <div className="hidden md:block">
          <Navbar/>
        </div>
        <Outlet />
        {!isAdminOrDashboard && (
          <>
            <Faq />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
};

export default RootLayout;