// pages/Unauthorized.tsx
import { useLocation, Link } from "react-router-dom";

const Unauthorized = () => {
  const location = useLocation();
  const reason = location.state?.reason;

  let message = "You are not authorized to access this page.";

  if (reason === "notLoggedIn") {
    message = "You must be logged in to view this page.";
  } else if (reason === "notAdmin") {
    message = "Only admins can access this page.";
  } else if (reason === "notClient") {
    message = "Only clients can access this page.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(239,68,68,0.25)] overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-red-500 to-red-300"></div>
        <div className="p-8 text-center">
          <div className="mx-auto w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-75"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-red-600">Access Restricted</h1>
          
          <div className="mb-6 px-4 py-3 bg-red-50 rounded-lg border-l-4 border-red-500">
            <p className="text-red-800">{message}</p>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Safety
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
