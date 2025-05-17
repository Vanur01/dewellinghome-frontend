import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaShare, FaRegHeart, FaHeart } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { BsCalendar4Week } from "react-icons/bs";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlineHomeRepairService } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ContactForm from "./Forms/ContactForm";
import { Design } from "../utils/publicApi";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/utils/Image";

interface KitchenData {
  title: string;
  description: string;
  imgSrc: string;
  images: string[];
  shape: string;
  relatedDesigns: Array<{
    id: number;
    imgSrc: string;
    design: Design;
  }>;
}

interface DesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRelatedDesignClick: (design: Design) => void;
  kitchenData: KitchenData;
}

const DesignModal: React.FC<DesignModalProps> = ({
  isOpen,
  onClose,
  onRelatedDesignClick,
  kitchenData,
}) => {
  const [wishlist, setWishlist] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!isOpen) return null;

  const data = kitchenData;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === data.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 pt-16 sm:pt-20 px-2 pb-2 sm:p-4"
        >
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="fixed top-[4.5rem] sm:top-6 right-2 sm:right-4 text-white hover:text-gray-200 z-20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
            aria-label="Close modal"
          >
            <IoMdClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white w-full max-w-[1400px] h-[85vh] sm:h-[90vh] flex flex-col md:flex-row overflow-hidden rounded-lg sm:rounded-xl shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Left side - Image Gallery */}
            <div className="w-full md:w-[65%] h-[35vh] md:h-auto bg-gray-100 relative flex items-center justify-center">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={getImageUrl(data.images[currentImageIndex])}
                alt={`${data.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {data.images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-4 bg-white/80 hover:bg-white rounded-full p-2 sm:p-3 transition-all"
                    aria-label="Previous image"
                  >
                    <MdChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 bg-white/80 hover:bg-white rounded-full p-2 sm:p-3 transition-all"
                    aria-label="Next image"
                  >
                    <MdChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/30 rounded-full px-3 py-2">
                    {data.images.map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Show image ${index + 1}`}
                        aria-selected={index === currentImageIndex}
                        role="tab"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right side - Content */}
            <div className="w-full md:w-[35%] flex flex-col h-[50vh] md:h-auto overflow-hidden relative">
              <AnimatePresence mode="wait">
                {showContactForm ? (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="absolute inset-0 bg-white flex flex-col overflow-y-auto"
                  >
                    <div className="p-4 sm:p-6 md:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowContactForm(false)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Back to details"
                        >
                          <IoMdClose className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.button>
                      </div>

                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <h3 className="text-lg font-medium mb-2">{data.title}</h3>
                          <p className="text-gray-600 text-sm">
                            Our designer will call you to help with your interior requirements.
                          </p>
                        </div>

                        <ContactForm />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="flex-1 overflow-y-auto"
                  >
                    <div className="px-4 py-4 sm:p-6 md:p-8">
                      {/* Title and Description */}
                      <div className="mb-6 sm:mb-8">
                        <h2 id="modal-title" className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                          {data.title}
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {showFullDescription ? data.description : `${data.description.slice(0, 150)}${data.description.length > 150 ? '...' : ''}`}
                          {data.description.length > 150 && (
                            <button 
                              onClick={() => setShowFullDescription(!showFullDescription)}
                              className="text-red-600 ml-2 hover:underline font-medium"
                            >
                              {showFullDescription ? 'Show Less' : 'Read More'}
                            </button>
                          )}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
                        {[
                          { Icon: TiTick, text: "Flat 10 year warranty" },
                          { Icon: BsCalendar4Week, text: "45-days delivery*" },
                          { Icon: RiTeamLine, text: "600+ design experts" },
                          { Icon: MdOutlineHomeRepairService, text: "Post-installation service" }
                        ].map(({ Icon, text }) => (
                          <div key={text} className="flex flex-col items-center text-center group">
                            <div className="mb-2 sm:mb-3 text-red-600 transform group-hover:scale-110 transition-transform">
                              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <p className="text-xs sm:text-sm font-medium">{text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Specifications */}
                      <div className="mb-6 sm:mb-10">
                        <h3 className="text-base sm:text-lg font-semibold mb-3">Specification</h3>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <p className="text-gray-700 text-sm sm:text-base">Shape | {data.shape}</p>
                        </div>
                      </div>

                      {/* Share */}
                      <div className="mb-6 sm:mb-10">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Share this Design</h3>
                        <div className="flex space-x-3 sm:space-x-4">
                          {[
                            { Icon: FaFacebook, label: 'Share on Facebook' },
                            { Icon: FaTwitter, label: 'Share on Twitter' },
                            { Icon: FaShare, label: 'Share' },
                            { Icon: BiMessageDetail, label: 'Message' }
                          ].map(({ Icon, label }) => (
                            <button 
                              key={label}
                              className="bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-red-600 transition-all transform hover:scale-110"
                              aria-label={label}
                            >
                              <Icon size={18} className="sm:w-5 sm:h-5" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Related Designs */}
                      <div className="mb-6 sm:mb-8">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Related Designs</h3>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                          {data.relatedDesigns.map(({ id, imgSrc, design }) => (
                            <motion.div 
                              key={id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="cursor-pointer"
                              onClick={() => {
                                setCurrentImageIndex(0);
                                onRelatedDesignClick(design);
                              }}
                              role="button"
                              tabIndex={0}
                              aria-label={`View related design ${design.title}`}
                            >
                              <img
                                src={getImageUrl(imgSrc)}
                                alt={design.title}
                                className="w-full aspect-video object-cover rounded-lg shadow-md"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CTA buttons */}
                    <div className="sticky bottom-0 border-t border-gray-200 p-3 sm:p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                      <div className="flex gap-3 sm:gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
                          onClick={() => setShowContactForm(true)}
                        >
                          BOOK FREE DESIGN SESSION
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 sm:w-14 border border-gray-300 hover:border-red-600 rounded-lg flex items-center justify-center transition-all hover:bg-red-50"
                          onClick={() => setWishlist(!wishlist)}
                          aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <motion.div
                            initial={false}
                            animate={{ scale: wishlist ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {wishlist ? (
                              <FaHeart className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                              <FaRegHeart className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                          </motion.div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DesignModal;
