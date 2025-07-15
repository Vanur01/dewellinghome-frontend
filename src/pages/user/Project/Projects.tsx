import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProjectStore } from "../../../store/user/ProjectStore";
import {
  Loader2,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const getStatusBadgeStyle = (status: string) => {
  const baseStyle = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status.toLowerCase()) {
    case "planning":
      return `${baseStyle} bg-blue-100 text-blue-800`;
    case "designing":
      return `${baseStyle} bg-purple-100 text-purple-800`;
    case "in_progress":
      return `${baseStyle} bg-yellow-100 text-yellow-800`;
    case "completed":
      return `${baseStyle} bg-green-100 text-green-800`;
    case "on_hold":
      return `${baseStyle} bg-red-100 text-red-800`;
    default:
      return `${baseStyle} bg-gray-100 text-gray-800`;
  }
};

const PaginationButton = ({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center px-3 py-1 border rounded-md text-sm
      ${
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100"
      }
    `}
  >
    {children}
  </button>
);

const Projects = () => {
  const {
    projects,
    isLoading,
    error,
    fetchUserProjects,
    totalPages,
    currentPage,
    totalItems,
  } = useProjectStore();

  const [limit] = useState(9); // Number of items per page
  const { user } = useAuthStore();

  useEffect(() => {
    fetchUserProjects({userId:user._id, page: 1, limit });
  }, [ limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUserProjects({userId: user._id, page: newPage, limit });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={() => fetchUserProjects({userId: user._id, page: 1, limit })}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        {totalItems > 0 && (
          <p className="text-sm text-gray-600">
            Showing {((currentPage ?? 1) - 1) * (limit ?? 9) + 1} to{" "}
            {Math.min((currentPage ?? 1) * (limit ?? 9), totalItems ?? 0)} of {totalItems ?? 0} projects
          </p>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">
              No Projects Found
            </h3>
            <p className="mt-2 text-gray-600">
              You don't have any active projects at the moment.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project?._id}
                to={`/dashboard/projects/${project?._id}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {project?.title}
                      </h2>
                      <div className="flex items-center mt-2 text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <p className="text-sm">{project?.location}</p>
                      </div>
                    </div>
                    <span className={getStatusBadgeStyle(project?.status ?? '')}>
                      {project?.status?.replace("_", " ")?.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Budget:</span>
                      <span className="ml-auto font-medium text-gray-900">
                        ${(project?.budget ?? 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Start Date:</span>
                      <span className="ml-auto font-medium text-gray-900">
                        {new Date(project?.startDate ?? '').toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Est. Completion:</span>
                      <span className="ml-auto font-medium text-gray-900">
                        {new Date(
                          project?.estimatedEndDate ?? ''
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <PaginationButton
                onClick={() => handlePageChange((currentPage ?? 1) - 1)}
                disabled={(currentPage ?? 1) === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </PaginationButton>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages ?? 0 }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                      w-8 h-8 rounded-md text-sm flex items-center justify-center
                      ${
                        pageNum === (currentPage ?? 1)
                          ? "bg-red-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      }
                    `}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>

              <PaginationButton
                onClick={() => handlePageChange((currentPage ?? 1) + 1)}
                disabled={(currentPage ?? 1) === (totalPages ?? 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </PaginationButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
