import { useAdminUsersStore } from "@/store/admin/adminUsers.store";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  FileText,
  Shield,
  ArrowLeft,
  Building2,
  Clock,
  Users,
} from "lucide-react";
import { projectApi, referralApi, warrantyApi } from "@/utils/api";
import { FaRupeeSign } from "react-icons/fa";

const UserInfo = () => {
  const { fetchUserById, selectedUser } = useAdminUsersStore();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [claims, setClaims] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchUserById(userId);

        if (userId) {
          const [projectsResponse, claimsResponse, referralsResponse] = await Promise.all([
            projectApi.getUserProjects({ userId }),
            warrantyApi.getUserClaims({ userId }),
            referralApi.getReferrals({ userId })
          ]);

          setProjects(projectsResponse?.data?.projects ?? []);
          setClaims(claimsResponse?.data?.data?.claims ?? []);
          setReferrals(referralsResponse?.data?.data ?? []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, fetchUserById]);

  const getStatusColor = (status) => {
    const statusColors = {
      active: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      "in-progress": "bg-purple-100 text-purple-800 border-purple-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return (
      statusColors[status?.toLowerCase()] ??
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const handleViewProject = (projectId) => {
    navigate(`/admin/projects/${projectId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="text-red-600 text-lg font-medium">
                Error fetching user information
              </div>
              <Button onClick={handleGoBack} variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8  min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleGoBack}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
              <p className="text-gray-600">
                Detailed information and activity overview
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-white text-black rounded-t-lg">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                {selectedUser?.image ? (
                  <img
                    src={selectedUser?.image}
                    alt={selectedUser?.name}
                  />
                ) : (
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xl font-semibold">
                    {selectedUser?.name?.slice(0,1)
                      ?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {selectedUser?.name}
                </CardTitle>
                <p className="text-gray-600">User ID: {selectedUser?._id}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <Mail className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Email
                  </span>
                </div>
                <p className="text-gray-900 font-medium break-all">
                  {selectedUser?.email}
                </p>
              </div>

              <div className="group p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Phone
                  </span>
                </div>
                <p className="text-gray-900 font-medium">
                  {selectedUser?.phone ?? "Not provided"}
                </p>
              </div>

              <div className="group p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all duration-200 md:col-span-2">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Address
                  </span>
                </div>
                <p className="text-gray-900 font-medium">
                  {selectedUser?.address ?? "Not provided"}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">
                      Total Projects
                    </p>
                    <p className="text-3xl font-bold text-red-900">
                      {projects?.length ?? 0}
                    </p>
                  </div>
                  <Building2 className="w-10 h-10 text-red-600/60" />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">
                      Warranty Claims
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      {claims?.length ?? 0}
                    </p>
                  </div>
                  <Shield className="w-10 h-10 text-purple-600/60" />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Total Budget
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      ₹
                      {projects
                        ?.reduce(
                          (sum, project) => sum + (project?.budget ?? 0),
                          0
                        )
                        ?.toLocaleString() ?? '0'}
                    </p>
                  </div>
                  <FaRupeeSign className="w-10 h-10 text-green-600/60" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    Projects
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    All projects associated with this user
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{projects?.length ?? 0} total</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {projects?.length > 0 ? (
              <div className="grid gap-6">
                {projects.map((project, index) => (
                  <div
                    key={project?._id}
                    className="group p-6 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                            {project?.title}
                          </h4>
                          <Badge
                            className={`${getStatusColor(
                              project?.status
                            )} text-xs font-medium`}
                          >
                            {project?.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Started:{" "}
                              {new Date(project?.startDate ?? '').toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FaRupeeSign className="w-4 h-4" />
                            <span>
                              Budget: ₹
                              {project?.budget?.toLocaleString() ?? "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Project #{index + 1}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleViewProject(project?._id)}
                        size="sm"
                        className="ml-4 bg-red-600 hover:bg-red-700 text-white shadow-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No projects found</p>
                <p className="text-gray-400">
                  This user hasn't been assigned to any projects yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warranty Claims Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    Warranty Claims
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    All warranty claims submitted by this user
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{claims?.length ?? 0} total</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {claims?.length > 0 ? (
              <div className="grid gap-6">
                {claims.map((claim, index) => (
                  <div
                    key={claim?._id}
                    className="p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {claim?.project}
                          </h4>
                          <Badge
                            className={`${getStatusColor(
                              claim?.status
                            )} text-xs font-medium`}
                          >
                            {claim?.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>Item: {claim?.item}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>Ticker ID: {claim?.ticketId}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Created:{" "}
                              {new Date(claim?.createdAt ?? '').toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Claim #{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No warranty claims found
                </p>
                <p className="text-gray-400">
                  This user hasn't submitted any warranty claims yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    Referrals
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    All referrals associated with this user
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{referrals?.length ?? 0} total</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {referrals?.length > 0 ? (
              <div className="grid gap-6">
                {referrals.map((referral) => (
                  <div key={referral?._id} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {referral?.referralName}
                          </h4>
                          <Badge className={`${getStatusColor(referral?.status)} text-xs font-medium`}>
                            {referral?.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>Ref ID: {referral?.refId}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>Email: {referral?.referralEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>Phone: {referral?.referralPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(referral?.createdAt ?? '').toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No referrals found</p>
                <p className="text-gray-400">
                  This user hasn't made any referrals yet.
                </p>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default UserInfo;
