import { useState, useCallback, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

// Component imports
import TopNavbar from './TopNavbar';
import Navbar from './Navbar';
import MobileSidebar from './MobileSidebar';
import Footer from './Footer';
import Faq from './Faq';

/**
 * Root layout component that handles the overall application structure
 * and responsive behavior with fixed sticky mobile navigation.
 */
const RootLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Check if current path is admin-related or dashboard
  const isAdminOrDashboard = location.pathname.includes('/admin') || 
                            location.pathname.includes('/dashboard');
  
  const handleToggleSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);
  
  const handleCloseSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-50">
      {/* Fixed Mobile Header - Consistently fixed at top */}
      <header className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 h-16 bg-white shadow-md z-[999]">
        <button
          onClick={handleToggleSidebar}
          aria-label="Open menu"
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
        
        <div className="w-10" aria-hidden="true" /> {/* Spacer for balanced layout */}
      </header>

      {/* Mobile Sidebar */}
      <div>
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={handleCloseSidebar}
      />
      </div>
      

      {/* Desktop Navigation Components */}
      <div className="hidden md:block">
        <TopNavbar />
      </div>
      
      {/* Main Content - With padding to account for fixed mobile header */}
      <main className="flex-grow mt-16 md:mt-0">
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        
        {/* Main Content */}
        <Outlet />
      </main>

      {/* Conditional Footer Components */}
      {!isAdminOrDashboard && (
        <footer>
          <Faq />
          <Footer />
        </footer>
      )}
    </div>
  );
};

export default memo(RootLayout);