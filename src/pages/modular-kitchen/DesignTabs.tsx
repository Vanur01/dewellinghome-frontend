import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DesignTabs() {
  const [activeTab, setActiveTab] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);
  const navigate = useNavigate();
  
  // Kitchen designs data
  const kitchenDesigns = [
    {
      id: 1,
      title: 'Modern L-Shaped Kitchen Design',
      image: 'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg',
      type: 'L-Shaped',
    },
    {
      id: 2,
      title: 'Contemporary Straight Kitchen',
      image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
      type: 'Straight',
    },
    {
      id: 3,
      title: 'Luxury Island Kitchen',
      image: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg',
      type: 'Straight Island',
    },
    {
      id: 4,
      title: 'Minimalist Parallel Kitchen',
      image: 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg',
      type: 'Parallel',
    },
    {
      id: 5,
      title: 'Modern U-Shaped Kitchen',
      image: 'https://images.pexels.com/photos/3935325/pexels-photo-3935325.jpeg',
      type: 'U-Shaped',
    },
    {
      id: 6,
      title: 'Contemporary L-Shaped Island Kitchen',
      image: 'https://images.pexels.com/photos/7061674/pexels-photo-7061674.jpeg',
      type: 'L-Shaped Island',
    },
    {
      id: 7,
      title: 'Spacious U-Shaped Island Kitchen',
      image: 'https://images.pexels.com/photos/7061665/pexels-photo-7061665.jpeg',
      type: 'U-shaped Island',
    },
  ];

  // Filter tabs
  const tabs = [
    'All',
    'L-Shaped',
    'Straight',
    'Parallel',
    'U-Shaped',
    'L-Shaped Island',
    'U-shaped Island',
    'Straight Island',
  ];

  // Filter kitchen designs based on active tab and display count
  const filteredDesigns = (activeTab === 'All' 
    ? kitchenDesigns 
    : kitchenDesigns.filter(design => design.type === activeTab)).slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  return (
    <div className="mx-auto px-4 py-16 border-b-[0.2rem] border-gray-200 ">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-8">Popular Modular Kitchen Designs</h1>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md border ${
              activeTab === tab
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Kitchen Design Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredDesigns.map((design) => (
         <div key={design.id} className="rounded-lg overflow-hidden shadow-md bg-white">
         <div className="relative">
           <img
             src={design.image}
             alt={design.title}
             className="w-full h-64 object-cover"
           />
           {/* Dots */}
           <div className="absolute bottom-4 left-4 flex space-x-1">
             {[...Array(5)].map((_, i) => (
               <div
                 key={i}
                 className="w-2 h-2 rounded-full bg-white opacity-70"
               />
             ))}
           </div>
         </div>
         {/* Title & Button */}
         <div className="p-4 flex items-center justify-between">
           <h3 className="text-sm font-medium text-gray-800">{design.title}</h3>
           <Button onClick={() => navigate('/kitchen-estimate')} variant="default" className="text-sm px-4 py-2 bg-white border border-red-600 text-red-600 rounded-md hover:bg-red-500 hover:text-white  transition">
             Get Quote
           </Button>
         </div>
       </div>
       
        ))}
      </div>
      
      {filteredDesigns.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No kitchen designs found for this category.</p>
        </div>
      )}
      
      <div className="mt-12 text-center">
        <div className="mt-8 pt-8">
          {displayCount < (activeTab === 'All' ? kitchenDesigns.length : kitchenDesigns.filter(design => design.type === activeTab).length) && (
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 bg-white border-[.1rem] border-red-600 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200 "
            >
              Load More Designs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}