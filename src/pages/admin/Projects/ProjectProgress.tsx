import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProjectStore } from "@/store/admin/adminProject.store";
import { useProgressStore, ProgressEntry } from "@/store/admin/adminProgress.store";
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
import { format } from "date-fns";
import { toast } from "sonner";
import { ProgressDialog } from "@/components/admin/ProjectProgress/ProgressDialog";
import { EditProgressSheet } from "@/components/admin/ProjectProgress/EditProgressSheet";
import { ConfirmDialog } from "@/components/admin/ProjectProgress/ConfirmDialog";
import { getImageUrl } from "@/utils/Image";

const ProjectProgress = () => {
  const { id } = useParams<{ id: string }>();
  const { currentProject, loading: projectLoading, error: projectError, fetchProjectById } = useProjectStore();
  const { 
    progressEntries, 
    loading: progressLoading, 
    error: progressError, 
    pagination,
    fetchProjectProgress,
    deleteProgress
  } = useProgressStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [progressToEdit, setProgressToEdit] = useState<ProgressEntry | null>(null);
  const [progressToDelete, setProgressToDelete] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchProjectProgress(id, currentPage, limit);
    }
  }, [id, fetchProjectById, fetchProjectProgress, currentPage]);

  const loading = projectLoading || progressLoading;
  const error = projectError || progressError;

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

  const handleAddProgress = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditProgress = (progress: ProgressEntry) => {
    setProgressToEdit(progress);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (progressId: string) => {
    setProgressToDelete(progressId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (progressToDelete) {
      try {
        await deleteProgress(progressToDelete);
        toast.success("Progress update deleted successfully");
        setIsDeleteDialogOpen(false);
        setProgressToDelete(null);
      } catch (err) {
        console.error("Error deleting progress:", err);
        toast.error("Failed to delete progress update");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={`/admin/projects/${id}`} className="rounded-md">
            <Button className="hover:bg-white" variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Project Progress</h1>
            <p className="text-gray-500">{currentProject.title}</p>
          </div>
        </div>
        <Button onClick={handleAddProgress} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Progress Update
        </Button>
      </div>

      {/* Progress Timeline */}
      <div className="space-y-6">
        {progressEntries.length > 0 ? (
          <>
            {progressEntries.map((progress) => (
              <Card key={progress._id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{progress.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {progress.completionPercentage}% Complete
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProgress(progress)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(progress._id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {formatDate(progress.date)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 mb-4">{progress.description}</p>
                  {progress.images && progress.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {progress.images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={getImageUrl(image)}
                            alt={`Progress image ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Posted by {progress.postedBy.name}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">No Progress Updates</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first progress update.
                </p>
                <div className="mt-6">
                  <Button onClick={handleAddProgress} className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Progress Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Progress Dialog */}
      {id && (
        <ProgressDialog
          projectId={id}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      )}

      {/* Edit Progress Sheet */}
      {id && progressToEdit && (
        <EditProgressSheet
          projectId={id}
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          progressToEdit={progressToEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Progress Update"
        description="Are you sure you want to delete this progress update? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
};

export default ProjectProgress;
