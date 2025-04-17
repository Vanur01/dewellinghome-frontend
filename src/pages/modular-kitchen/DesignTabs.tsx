import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function DesignTabs() {
  const [activeTab, setActiveTab] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);
  
  // Kitchen designs data
  const kitchenDesigns = [
    {
      id: 1,
      title: 'Coastal Chic Modular Kitchen Design',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f',
      type: 'L-Shaped',
    },
    {
      id: 2,
      title: 'Sleek Seafoam Modular Kitchen Design',
      image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7',
      type: 'Straight',
    },
    {
      id: 3,
      title: 'Sleek Serenity Modern Kitchen Design',
      image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d',
      type: 'Straight Island',
    },
    {
      id: 4,
      title: 'Nordic Wood Kitchen Design',
      image: 'https://images.unsplash.com/photo-1556910638-64dc96845c3d',
      type: 'Parallel',
    },
    {
      id: 5,
      title: 'Urban Grey Kitchen Suite',
      image: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f',
      type: 'U-Shaped',
    },
    {
      id: 6,
      title: 'Modern Luxury Kitchen',
      image: 'https://images.unsplash.com/photo-1556909190-eccf4a8bf97a',
      type: 'L-Shaped Island',
    },
    {
      id: 7,
      title: 'Contemporary Open Plan Kitchen',
      image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77',
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
           {/* Heart Icon */}
           <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition">
            <Heart className='text-gray-600'/>
           </button>
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
           <button className="text-sm px-4 py-2 bg-white border border-red-600 text-red-600 rounded-md hover:bg-red-500 hover:text-white  transition">
             Get Quote
           </button>
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