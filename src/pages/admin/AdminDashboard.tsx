import { 
  Users, 
  IndianRupee, 
  AlertCircle,
  MessageSquare,
  Star,
  Shield,
  Target,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAdminDashboardStore } from '../../store/admin/adminDashboard.store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const { data, loading, error, fetchDashboardOverview, hasFetched } = useAdminDashboardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetched) {
      fetchDashboardOverview();
    }
  }, [fetchDashboardOverview, hasFetched]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };


  if (error) {
    return <div className="text-center py-16 text-lg text-red-500">{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      {/* Header - ALWAYS visible */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your interior design business</p>
        </div>
        <button
          className="px-4 py-2 bg-white text-red-500 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-60 flex items-center gap-2"
          onClick={() => fetchDashboardOverview(true)}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Content Area - Shows loading OR data */}
      {loading ? (
        <div className="text-center py-16 text-lg text-gray-500">Loading dashboard...</div>
      ) : (
        <>
          {/* All your cards and metrics go here */}
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data?.revenue?.total ?? 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{data?.revenue?.trend ?? 0}%</span> from last month
                </p>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.projects?.active ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {data?.projects?.total ?? 0} total projects
                </p>
              </CardContent>
            </Card>

            {/* New Inquiries */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
                <MessageSquare className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.inquiries?.new ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {data?.inquiries?.converted ?? 0} converted this month
                </p>
              </CardContent>
            </Card>

            {/* Outstanding Payments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data?.revenue?.outstanding ?? 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Pending payments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Project Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <Badge variant="secondary">{data?.projects?.completed ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <Badge variant="secondary">{data?.projects?.active ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Planning</span>
                    </div>
                    <Badge variant="secondary">{data?.projects?.planning ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">designing</span>
                    </div>
                    <Badge variant="secondary">{data?.projects?.designing ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">On Hold</span>
                    </div>
                    <Badge variant="secondary">{data?.projects?.onHold ?? 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer & Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer & Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Total Customers</span>
                    </div>
                    <Badge variant="secondary">{data?.customers?.total ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Avg Rating</span>
                    </div>
                    <Badge variant="secondary">{data?.testimonials?.averageRating ?? 0}/5</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Warranty Claims</span>
                    </div>
                    <Badge variant="secondary">{data?.warranty?.pending ?? 0} pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Testimonials</span>
                    </div>
                    <Badge variant="secondary">{data?.testimonials?.total ?? 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/admin/inquiries')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">View Inquiries</span>
                  </div>
                </button>
                <button
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/admin/projects')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Target className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">Manage Projects</span>
                  </div>
                </button>
                <button
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/admin/payments')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <IndianRupee className="h-6 w-6 text-purple-500" />
                    <span className="text-sm font-medium">Payment Schedule</span>
                  </div>
                </button>
                <button
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/admin/warranty')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="h-6 w-6 text-orange-500" />
                    <span className="text-sm font-medium">Warranty Claims</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default AdminDashboard;