import { useEffect, useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { useProjectStore, type Project } from "@/store/admin/adminProject.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { useAuthStore } from "@/store/auth.store";

const statusOptions = [
  { value: "planning", label: "Planning" },
  { value: "designing", label: "Designing" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "planning":
      return "bg-purple-100 text-purple-800";
    case "designing":
      return "bg-indigo-100 text-indigo-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "on_hold":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AdminProjects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const {
    projects,
    loading,
    error,
    pagination,
    fetchProjects,
    setFilters,
    deleteProject,
  } = useProjectStore();

  useEffect(() => {
    if(projects.length === 0){
    fetchProjects();
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({
        search: searchQuery,
        status:
          selectedStatus === "all"
            ? undefined
            : (selectedStatus as Project["status"]),
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedStatus]);

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete._id);
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setProjectToDelete(null);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
        <Button
          className="bg-red-500 hover:bg-red-700"
          onClick={() => navigate("/admin/projects/create")}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.clientId.name}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(project.status)}
                    >
                      {project.status
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        project.status.slice(1).replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{project.budget.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(project.startDate).toLocaleDateString()} -
                    {new Date(project.estimatedEndDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link to={`/admin/projects/${project._id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link to={`/admin/projects/edit/${project._id}`}>Edit Project</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(project)}
                        >
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{projectToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteConfirm}
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {projects.length} of {pagination.totalItems} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={pagination.currentPage === 1 || loading}
            onClick={() => fetchProjects(pagination.currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={
              pagination.currentPage >= pagination.totalPages || loading
            }
            onClick={() => fetchProjects(pagination.currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
