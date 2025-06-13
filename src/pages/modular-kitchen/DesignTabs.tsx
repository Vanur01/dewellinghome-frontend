import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kitchenDesigns } from './Data';
import { motion, AnimatePresence } from 'framer-motion';

export default function DesignTabs() {
  const [activeTab, setActiveTab] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);
  const navigate = useNavigate();

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
    <div className="mx-auto px-4 py-16 border-b-[0.2rem] border-gray-200">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-8">Popular Modular Kitchen Designs</h1>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center relative">
        {tabs.map((tab) => (
          <div key={tab} className="relative">
            <button
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md border relative z-10 transition-all duration-300 ease-in-out ${
                activeTab === tab
                  ? 'text-white border-red-600'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-red-600 rounded-md -z-10"
                  initial={false}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20,
                    mass: 1
                  }}
                />
              )}
            </button>
          </div>
        ))}
      </div>
      
      {/* Kitchen Design Cards */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.03,
                ease: "easeOut"
              }}
              className="rounded-lg overflow-hidden shadow-md bg-white"
            >
              <div className="relative">
                <img
                  src={design.image}
                  alt={design.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800">{design.title}</h3>
                <Button 
                  onClick={() => navigate('/kitchen-estimate')} 
                  variant="default" 
                  className="text-sm px-4 py-2 bg-white border border-red-600 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
                >
                  Get Quote
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {filteredDesigns.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.4,
            ease: "easeInOut"
          }}
          className="text-center py-8"
        >
          <p className="text-gray-500 text-lg">No kitchen designs found for this category.</p>
        </motion.div>
      )}
      
      <div className="mt-12 text-center">
        <div className="mt-8 pt-8">
          {displayCount < (activeTab === 'All' ? kitchenDesigns.length : kitchenDesigns.filter(design => design.type === activeTab).length) && (
            <motion.button 
              onClick={handleLoadMore}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ 
                duration: 0.2,
                ease: "easeInOut"
              }}
              className="px-8 py-3 bg-white border-[.1rem] border-red-600 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              Load More Designs
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}