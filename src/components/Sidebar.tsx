import {
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
  Wallet,
  LogOut,
  Building2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
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

const Sidebar = () => {
  const location = useLocation();
  const { logout, user  } = useAuthStore();

  const isAdmin = location.pathname.includes('/admin');

  const userMenuItems = [
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Projects', path: '/dashboard/projects', icon: ShoppingCart },
    { name: 'Warranty Claim', path: '/dashboard/warranty', icon: Shield },
    { name: 'Refer & Earn', path: '/dashboard/refer&earn', icon: Send },
    { name: 'Payment', path: '/dashboard/payment', icon: CreditCard },
    { name: 'Transactions', path: '/dashboard/transactions', icon:  Wallet},
  ];

  const adminMenuItems = [
    { name: 'Warranty Claims', path: '/admin/warranty', icon: Shield },
    { name: 'Orders', path: '/admin/projects', icon: Target },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Referrals', path: '/admin/referral', icon: Send },
    { name: 'Payment', path: '/admin/payments', icon: CreditCard },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Partners', path: '/admin/partners', icon: Building2 },
    { name: 'Transactions', path: '/admin/transactions', icon: Wallet },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col">
      {/* Profile */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</h4>
            <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'User'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150
                ${isActive
                  ? 'bg-red-50 text-red-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'}
              `}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="w-full text-sm bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
            >
              <LogOut className="w-5 h-5 mr-2 inline" />
              Logout
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be redirected to the login page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className='bg-red-600 bg-red-700 text-white' onClick={logout}>Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Sidebar;
