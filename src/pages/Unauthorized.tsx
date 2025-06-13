import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from "react-router-dom";

const Unauthorized = () => {
  const location = useLocation();
  const reason = location.state?.reason;

  let title = "Access Restricted";
  let message = "You don't have permission to view this page.";
  let suggestion = "If you believe this is a mistake, please contact support or return home.";
  let action = null;

  if (reason === "notAdmin") {
    title = "Admins Only";
    message = "This page is only for admin users.";
    suggestion = "If you need admin access, please contact your administrator.";
  } else if (reason === "notClient") {
    title = "Clients Only";
    message = "This page is only for client users.";
    suggestion = "Please sign in with a client account if you have one.";
    action = <Button asChild variant="default" className="w-full"><Link to="/login">Sign In as Client</Link></Button>;
  } else if (reason === "unauthorized") {
    title = "Unauthorized";
    message = "You do not have the required role to access this page.";
    suggestion = "If you think you should have access, please contact support.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-md border-0">
        <CardHeader className="flex flex-col items-center">
          <div className="w-20 h-20 mb-4">
            {/* Neutral lock icon SVG */}
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
              <rect x="16" y="28" width="32" height="24" rx="6" fill="#F5F5DC" stroke="#D6C7A1" strokeWidth="2" />
              <path d="M32 28v-8a8 8 0 1 0-16 0v8" stroke="#D6C7A1" strokeWidth="2" fill="none" />
              <circle cx="32" cy="40" r="3" fill="#D6C7A1" />
              <rect x="30.5" y="43" width="3" height="6" rx="1.5" fill="#D6C7A1" />
            </svg>
          </div>
          <CardTitle className="text-xl font-semibold text-stone-700 mb-2">{title}</CardTitle>
          <CardDescription className="text-center text-gray-700 mb-4">
            <p className="mb-1">{message}</p>
            <span className="text-sm text-gray-500">{suggestion}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          {action}
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Go to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
