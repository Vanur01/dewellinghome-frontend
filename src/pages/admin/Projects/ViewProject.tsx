import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Home,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useProjectStore } from "@/store/admin/adminProject.store";
import { useProgressStore } from "@/store/admin/adminProgress.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/admin/ProjectProgress/ConfirmDialog";

const statusColors = {
  planning: "bg-purple-100 text-purple-800",
  designing: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-yellow-100 text-yellow-800",
};

const ViewProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, loading, error, fetchProjectById, deleteProject } = useProjectStore();
  const { progressEntries, loading: progressLoading, pagination, fetchProjectProgress } = useProgressStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchProjectProgress(id,1,2);
    }
  }, [id, fetchProjectById, fetchProjectProgress]);

  const handleDeleteProject = async () => {
    if (currentProject) {
      try {
        await deleteProject(currentProject._id);
        navigate("/admin/projects");
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center text-red-500">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (!currentProject) {
    return <div className="p-6">Project not found</div>;
  }

  const formatDate = (date: string) => {
    return format(new Date(date), "PPP");
  };

  const calculateDuration = () => {
    const start = new Date(currentProject.startDate);
    const end = new Date(currentProject.estimatedEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects" className="rounded-md">
            <Button className="hover:bg-white" variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{currentProject.title}</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {currentProject.location}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/projects/edit/${currentProject._id}`)}
          >
            Edit Project
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Project Details */}
        <div className="col-span-2 space-y-6">
          {/* Status and Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <Badge
                  variant="secondary"
                  className={statusColors[currentProject.status]}
                >
                  {currentProject.status
                    .replace("_", " ")
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Budget</p>
                <p className="text-lg font-semibold">
                  ₹{currentProject.budget.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(currentProject.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estimated Completion</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(currentProject.estimatedEndDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Duration</p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {calculateDuration()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(currentProject.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project Items */}
          <Card>
            <CardHeader>
              <CardTitle>Project Items</CardTitle>
              <CardDescription>
                List of items and materials for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentProject.items && currentProject.items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Materials</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProject.items.map((item, index) => (
                      <TableRow key={item._id || index}>
                        <TableCell className="font-medium">
                          {item.category}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.units}</TableCell>
                        <TableCell>{item.materials}</TableCell>
                        <TableCell>{item.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No items added to this project yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Project Gallery</CardTitle>
              <CardDescription>
                Images and photos related to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentProject.gallery && currentProject.gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {currentProject.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={image}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      /> 
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No images in the gallery</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/admin/projects/${currentProject._id}/gallery`)}
              >
                Manage Gallery
              </Button>
            </CardFooter>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional project information and remarks</CardDescription>
            </CardHeader>
            <CardContent>
              {currentProject.notes ? (
                <p className="whitespace-pre-wrap text-gray-700">{currentProject.notes}</p>
              ) : (
                <p className="text-center py-4 text-gray-500">No notes added</p>
              )}
            </CardContent>
          </Card>

          {/* Daily Progress */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Daily Progress</CardTitle>
                <CardDescription>Track the daily progress of this project</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/projects/${currentProject._id}/progress`)}
              >
                Add Progress
              </Button>
            </CardHeader>
            <CardContent>
              {progressLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : progressEntries && progressEntries.length > 0 ? (
                <div className="space-y-6">
                  {progressEntries.map((progress) => (
                    <div key={progress._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg">{progress.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {formatDate(progress.date)}
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">by {progress.postedBy.name}</span>
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 self-start">
                          {progress.completionPercentage}% Complete
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{progress.description}</p>
                      {progress.images && progress.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {progress.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="relative aspect-square">
                              <img
                                src={image}
                                alt={`Progress image ${imgIndex + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No daily progress updates yet</p>
                </div>
              )}
              {progressEntries && progressEntries.length > 0 && pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/admin/projects/${id}/progress`)}
                  >
                    View All Progress ({pagination.totalItems} entries)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Client Information and Quick Actions */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-lg font-semibold">
                  {currentProject.clientId.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Details</p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {currentProject.clientId.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {currentProject.clientId.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    {currentProject.clientId.address}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/admin/clients/${currentProject.clientId._id}`)}
              >
                View Client Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-red-500 hover:bg-red-700" onClick={() => navigate(`/admin/projects/edit/${currentProject._id}`)}>
                Add New Item
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/projects/${currentProject._id}/progress`)}>
                View Progress
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/payments/new?projectId=${currentProject._id}`)}>
                Create Payment Schedule
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/payments/${currentProject._id}`)}>
                View Payments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteProject}
        variant="destructive"
      />
    </div>
  );
};

export default ViewProject;
