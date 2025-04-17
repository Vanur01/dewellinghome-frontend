import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Shield, Target, Users } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Warranty Claims', path: '/admin/warranty', icon: <Shield className="w-5 h-5" /> },
    { name: 'Projects', path: '/admin/projects', icon: <Target className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200 w-64">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-none p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img 
              src="/images/admin-profile.jpg" 
              alt="Admin Profile" 
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">John Smith</h3>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 
                ${
                  (location.pathname === item.path || 
                  (item.path === '/admin' && location.pathname === '/admin/')) 
                    ? 'bg-red-50 text-red-600 border border-red-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-red-600 border border-transparent'
                }`}
            >
              <span className="inline-flex items-center justify-center w-8">
                {item.icon}
              </span>
              <span className="ml-3 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-none p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@dwellinghome.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;