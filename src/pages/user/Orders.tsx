import { Camera, Plus } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import PieChartCard from './Piechart';
import MobilePieChart from './MobilePieChart';
import { useWindowSize } from '../../hooks/useWindowSize';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface SiteUpdate {
  date: string;
  photos: {
    url: string;
    caption: string;
  }[];
  description: string;
  workDone: string[];
}

// Example data - In real app, this would come from an API
const siteUpdates: SiteUpdate[] = [
  {
    date: '2024-03-20',
    photos: [
      {
        url: '/images/site1.jpg',
        caption: 'Kitchen foundation work'
      },
      {
        url: '/images/site2.jpg',
        caption: 'Wall tiling progress'
      }
    ],
    description: 'Completed the kitchen foundation work and started wall tiling.',
    workDone: [
      'Foundation preparation',
      'Waterproofing application',
      'Initial tile layout'
    ]
  },
  {
    date: '2024-03-19',
    photos: [
      {
        url: '/images/site3.jpg',
        caption: 'Material delivery'
      }
    ],
    description: 'Received all necessary materials for kitchen renovation.',
    workDone: [
      'Material inspection',
      'Inventory check',
      'Site preparation'
    ]
  }
];

const Orders = () => {
  const { width } = useWindowSize();
  // Changed from 768px to 1024px to include tablets (md -> lg breakpoint)
  const isSmallScreen = width ? width < 1024 : false;

  const data = [
    { name: 'Category A', value: 400, color: '#0088FE' },
    { name: 'Category B', value: 300, color: '#00C49F' },
    { name: 'Category C', value: 300, color: '#FFBB28' },
    { name: 'Category D', value: 200, color: '#FF8042' },
  ];

  const projectValue = 50000; // Example project value

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Site Update
        </button>
      </div>

      {/* Project Overview Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold">Project Overview</h2>
        <div className="flex flex-col gap-4 mt-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-900">Work Completed by Phase</h3>
            {isSmallScreen ? (
              <MobilePieChart
                data={data}
                width={400}
                height={300}
              />
            ) : (
              <PieChartCard />
            )}
          </div>
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-900">Project Value</h3>
            <p className="text-gray-600 text-lg">${projectValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Site Management Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Site Management</h2>
          <p className="text-gray-600 mt-1">Track daily progress and site updates</p>
        </div>

        <div className="divide-y divide-gray-200">
          {siteUpdates.map((update) => (
            <div key={update.date} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {new Date(update.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <p className="text-gray-600 mt-1">{update.description}</p>
                </div>
                <button className="text-red-600 hover:text-red-700 flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  Add Photos
                </button>
              </div>

              {/* Photo Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {update.photos.map((photo, photoIndex) => (
                  <div key={photoIndex} className="group relative">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-lg">
                      <p className="text-white text-sm">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Work Done List */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Work Completed</h4>
                <ul className="list-disc list-inside space-y-1">
                  {update.workDone.map((work, workIndex) => (
                    <li key={workIndex} className="text-gray-600 text-sm">
                      {work}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;