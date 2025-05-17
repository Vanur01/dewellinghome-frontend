import { useParams } from 'react-router-dom';
import { useUserProgressStore } from '../../../store/user/ProgressStore';
import { useProjectStore } from '../../../store/user/ProjectStore';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils/Image';

const ITEMS_PER_PAGE = 5;

const ProgressDetails = () => {
  const { projectId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { progressEntries, fetchProjectProgress, loading: progressLoading, pagination } = useUserProgressStore();
  const { currentProject, fetchProjectById, isLoading: projectLoading } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
      fetchProjectProgress(projectId, currentPage, ITEMS_PER_PAGE);
    }
  }, [projectId, currentPage, fetchProjectById, fetchProjectProgress]);

  if (progressLoading || projectLoading) {
    return <div>Loading...</div>;
  }

  if (!currentProject) {
    return <div>Project not found</div>;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = pagination.totalPages;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/dashboard/projects/${projectId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Project
          </Link>
          <h1 className="text-2xl font-bold">{currentProject.title} - Progress Updates</h1>
        </div>
      </div>

      {/* Progress Updates List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Progress Updates</h2>
          <p className="text-gray-600 mt-1">
            Showing {progressEntries.length} of {pagination.totalItems} updates
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {progressEntries.map((entry) => (
            <div key={entry._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <p className="text-gray-600 mt-1">{entry.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted by: {entry.postedBy.name}
                  </p>
                </div>
              </div>

              {/* Photo Gallery */}
              {entry.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {entry.images.map((image, photoIndex) => (
                    <div key={photoIndex} className="group relative">
                      <img
                        src={getImageUrl(image)}
                        alt={`Progress update ${photoIndex + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Completion Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Completion Status</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${entry.completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {entry.completionPercentage}% Complete
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && renderPagination()}
      </div>
    </div>
  );
};

export default ProgressDetails;
