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
  ChevronRight,
  Wallet,
  Building2,
  Home,
  LogOut,
  UserPlus,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isAdmin = location.pathname.includes("/admin");

  const userMenuItems = [
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      name: "Projects",
      path: "/dashboard/projects",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      name: "Warranty Claim",
      path: "/dashboard/warranty",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      name: "Refer & Earn",
      path: "/dashboard/refer&earn",
      icon: <Send className="w-5 h-5" />,
    },
    {
      name: "Payment",
      path: "/dashboard/payment",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: "Transactions",
      path: "/dashboard/transactions",
      icon: <Wallet className="w-5 h-5" />,
    },
  ];

  const adminMenuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Warranty Claims",
      path: "/admin/warranty",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      name: "Orders",
      path: "/admin/projects",
      icon: <Target className="w-5 h-5" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Referrals",
      path: "/admin/referral",
      icon: <Send className="w-5 h-5" />,
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: "Inquiries",
      path: "/admin/inquiries",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: "Gallery",
      path: "/admin/gallery",
      icon: <Image className="w-5 h-5" />,
    },
    {
      name: "Testimonials",
      path: "/admin/testimonials",
      icon: <Star className="w-5 h-5" />,
    },
    {
      name: "Partners",
      path: "/admin/partners",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      name: "Team",
      path: "/admin/team",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: <Wallet className="w-5 h-5" />,
    },
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
    { name: "Refer and Earn", path: "dashboard/refer&earn" },
    { name: "Our Team", path: "/team" },
  ];

  const supportItems = [{ name: "Contact Us", path: "/contact-us" }];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[998]"
            onClick={onClose}
            role="presentation"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-80 bg-white h-screen z-[999] overflow-hidden flex flex-col md:hidden"
          >
            <div className="sticky top-0 bg-white z-[999] p-4 flex items-center justify-between border-b border-gray-200 p-">
              <Link
                to={"/"}
                className="flex items-center gap-2"
                onClick={onClose}
              >
                <img
                  className="w-10"
                  src="/images/Dwelling_home.png"
                  alt="Logo"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  Dewelling Home
                </h2>
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>

            {/* Login/Signup at top if not logged in */}
            {!user && (
              <>
                <div className="px-4 pt-6 flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="w-full flex items-center justify-center text-sm bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors shadow-sm text-center"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={onClose}
                    className="w-full flex items-center justify-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors shadow-sm text-center"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Signup
                  </Link>
                </div>
                <div className="my-4 border-t border-gray-200" />
              </>
            )}

            <motion.div
              className="flex-1 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="px-4 py-6 space-y-8">
                {/* User Profile Section */}
                {user && (
                  <motion.div
                    className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {isAdmin ? "Admin" : "User"}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Quick Links Section */}
                <div className="space-y-3">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Quick Links
                  </h3>
                  {quickLinks.map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md group"
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Main Navigation Section */}
                <div className="space-y-3">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Main Menu
                  </h3>
                  {mainMenuItems.map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md group"
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Dashboard Section */}
                {user && (
                  <div className="space-y-3">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {isAdmin ? "Admin Dashboard" : "Dashboard"}
                    </h3>
                    {menuItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.path}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150
                              ${
                                isActive
                                  ? "bg-red-50 text-red-600 font-medium"
                                  : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                              }
                            `}
                          >
                            <>{item.icon}</>
                            <span className="ml-3">{item.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Support Section */}
                <div className="space-y-3">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Support
                  </h3>
                  <div className="px-3 py-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-red-600 mb-3">
                      <Headphones className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        Customer Support
                      </span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {supportItems.map((item) => (
                        <motion.div
                          key={item.path}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to={item.path}
                            onClick={onClose}
                            className="block text-sm text-gray-700 hover:text-red-600 py-1"
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logout Button or Login/Signup */}
                {user && (
                  <div className="px-3 pt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full text-sm bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          Logout
                        </motion.button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="z-[1000]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be redirected to the login page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className='bg-red-600 hover:bg-red-700 text-white' 
                            onClick={() => {
                              logout();
                              onClose();
                            }}
                          >
                            Logout
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
