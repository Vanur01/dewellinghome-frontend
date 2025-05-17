import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../../../store/user/ProjectStore';
import { useUserProgressStore } from '../../../store/user/ProgressStore';
import { useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Phone, Mail, Home, ArrowRight ,IndianRupee} from 'lucide-react';
import { getImageUrl } from '@/utils/Image';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { currentProject, fetchProjectById, isLoading: projectLoading } = useProjectStore();
  const { progressEntries, fetchProjectProgress, loading: progressLoading } = useUserProgressStore();

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
      fetchProjectProgress(projectId,1,2);
    }
  }, [projectId, fetchProjectById, fetchProjectProgress]);

  if (projectLoading || progressLoading) {
    return <div>Loading...</div>;
  }

  if (!currentProject) {
    return <div>Project not found</div>;
  }

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      designing: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Get only the first 2 progress entries
  const recentProgressEntries = progressEntries.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{currentProject.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{currentProject.location}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
            {currentProject.status.replace('_', ' ').charAt(0).toUpperCase() + currentProject.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Project Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{new Date(currentProject.startDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Estimated End Date</p>
                <p className="font-medium">{new Date(currentProject.estimatedEndDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IndianRupee className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">${currentProject.budget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{currentProject.clientId.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentProject.clientId.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{currentProject.clientId.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{currentProject.clientId.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Items */}
      {currentProject.items && currentProject.items.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Project Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProject.items.map((item) => (
              <div key={item._id} className="border rounded-lg p-4">
                <h3 className="font-medium">{item.name}</h3>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Category:</span> {item.category}</p>
                  <p><span className="font-medium">Units:</span> {item.units}</p>
                  <p><span className="font-medium">Size:</span> {item.size}</p>
                  <p><span className="font-medium">Materials:</span> {item.materials}</p>
                  {item.notes && <p><span className="font-medium">Notes:</span> {item.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Gallery */}
      {currentProject.gallery && currentProject.gallery.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Project Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentProject.gallery.map((image, index) => (
              <div key={index} className="aspect-square">
                <img
                  src={getImageUrl(image)}
                  alt={`Project image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Notes */}
      {currentProject.notes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Project Notes</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{currentProject.notes}</p>
        </div>
      )}

      {/* Recent Progress Updates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Recent Progress Updates</h2>
            <p className="text-gray-600 mt-1">Latest updates on project progress</p>
          </div>
          {recentProgressEntries.length > 2 && (
            <Link 
              to={`/dashboard/projects/${projectId}/progress`} 
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-600 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {recentProgressEntries.map((entry) => (
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
                </div>
              </div>

              {/* Photo Gallery */}
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

              {/* Completion Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Completion Status</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
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
      </div>
    </div>
  );
};

export default ProjectDetails;