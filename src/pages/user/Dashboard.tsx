import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row h-[85vh]">
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-10rem)]"> */}
              <div className="p-6">
                <Outlet />
              {/* </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 