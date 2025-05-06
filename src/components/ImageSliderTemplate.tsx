import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import DesignModal from './DesignModal';
import { Link } from 'react-router-dom';
import useGalleryStore from '../store/public/gallery.store';
import { Design } from '../utils/publicApi';

interface ImageSliderTemplateProps {
  galleryId: string;
  title: string;
  link?: string;  // Optional link for See All button
}

const ImageSliderTemplate: React.FC<ImageSliderTemplateProps> = ({
  galleryId,
  title,
  link
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { galleryDesigns, getDesignsByGalleryId } = useGalleryStore();
  const [isLoading, setIsLoading] = useState<boolean[]>([]);

  useEffect(() => {
    getDesignsByGalleryId(galleryId);
  }, [galleryId, getDesignsByGalleryId]);

  console.log('galleryId', galleryId);
  const designs = galleryDesigns[galleryId] || [];
  console.log("designs", designs);
  const images = designs.map(design => design.images[0]?.url).filter(Boolean);
  console.log(images);

  const handleNext = useCallback(() => {
    setStartIndex(prev => Math.min(prev + 4, images.length - 4));
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setStartIndex(prev => Math.max(prev - 4, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleImageLoad = (index: number) => {
    setIsLoading(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  const handleRelatedDesignClick = (design: Design) => {
    setSelectedDesign(design);
  };

  return (
    <div className="relative w-full py-5">
      <div className="flex justify-between items-center mb-1 px-12">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          <span className="text-xs text-gray-500">
            {startIndex + 1}-{Math.min(startIndex + 4, images.length)} of {images.length}
          </span>
        </div>
       
          <Link
            to={link || '#'}
            className="bg-transparent border-none text-red-600 cursor-pointer text-sm hover:underline"
          >
            See All
          </Link>
      </div>

      <div className="relative px-12 overflow-hidden">
        <div className="relative"
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}>
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                       flex-shrink-0 bg-white shadow-lg rounded-full p-2 sm:p-3 
                       hover:bg-gray-100 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Previous images"
          >
            <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6"/>
          </button>

          <button
            onClick={handleNext}
            disabled={startIndex >= images.length - 4}
            className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10
                       flex-shrink-0 bg-white shadow-lg rounded-full p-2 sm:p-3 
                       hover:bg-gray-100 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Next images"
          >
            <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6"/>
          </button>

          <div className="relative w-full overflow-hidden">
            <div 
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${(startIndex / 4) * 100}%)`,
                width: '100%'
              }}
            >
              {designs.map((design, index) => (
                <div 
                  key={index} 
                  className="w-1/4 aspect-video overflow-hidden rounded-lg cursor-pointer relative"
                  style={{ 
                    width: 'calc(25% - 12px)',
                    flex: '0 0 calc(25% - 12px)'
                  }}
                  onClick={() => handleRelatedDesignClick(design)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View design ${index + 1} of ${designs.length}`}
                >
                  {isLoading[index] && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                  )}
                  <img 
                    src={design.images[0]?.url} 
                    alt={design.title || `Design ${index + 1}`} 
                    loading="lazy"
                    onLoad={() => handleImageLoad(index)}
                    className={`w-full h-full object-cover transition-all duration-300 
                      ${isLoading[index] ? 'opacity-0' : 'opacity-100 hover:scale-105'}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedDesign && (
        <DesignModal 
          isOpen={!!selectedDesign}
          onClose={() => setSelectedDesign(null)}
          onRelatedDesignClick={handleRelatedDesignClick}
          kitchenData={{
            title: selectedDesign.title,
            description: selectedDesign.description,
            imgSrc: selectedDesign.images[0]?.url,
            images: selectedDesign.images.map(img => img.url),
            shape: "Straight",
            relatedDesigns: designs
              .filter(d => d._id !== selectedDesign._id)
              .slice(0, 9)
              .map((design, index) => ({
                id: index + 1,
                imgSrc: design.images[0]?.url,
                design: design
              }))
          }}
        />
      )}
    </div>
  );
};

export default ImageSliderTemplate;
