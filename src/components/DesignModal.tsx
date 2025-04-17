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

interface KitchenData {
  title: string;
  description: string;
  imgSrc: string;
  images: string[];
  shape: string;
  relatedDesigns: Array<{
    id: number;
    imgSrc: string;
  }>;
}

interface DesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  kitchenData: KitchenData;
}

const DesignModal: React.FC<DesignModalProps> = ({
  isOpen,
  onClose,
  kitchenData,
}) => {
  const [wishlist, setWishlist] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  if (!isOpen) return null;

  // Default data in case props are not provided
  const data = kitchenData || {
    title: "Sleek Seafoam Modular Kitchen Design",
    description:
      "The Sleek Seafoam Modern Kitchen Design blends contemporary aesthetics with smart functionality.",
    imgSrc: "/api/placeholder/800/600",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/601",
      "/api/placeholder/800/602",
    ],
    shape: "Straight",
    relatedDesigns: [
      { id: 1, imgSrc: "/api/placeholder/200/200" },
      { id: 2, imgSrc: "/api/placeholder/200/200" },
      { id: 3, imgSrc: "/api/placeholder/200/200" },
    ],
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      {/* Close button moved outside modal */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-200 z-20 rounded-full w-8 h-8 flex items-center justify-center overflow-hidden"
        aria-label="Close modal"
      >
        <IoMdClose className="w-6 h-6" />
      </button>

      <div
        className="relative bg-white w-[95%] max-w-[1400px] h-[90vh] flex flex-col md:flex-row overflow-hidden rounded-lg shadow-lg my-4 md:my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Left side - Image */}
        <div className="w-full md:w-[65%] h-[300px] md:h-[90vh] bg-gray-200 relative flex items-center justify-center">
          <img
            src={data.images[currentImageIndex]}
            alt={`${data.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation arrows - Only show if there are multiple images */}
          {data.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90"
                aria-label="Previous image"
              >
                <MdChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90"
                aria-label="Next image"
              >
                <MdChevronRight className="w-6 h-6" />
              </button>

              {/* Dots indicator */}
              <div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
                role="tablist"
              >
                {data.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-gray-400"
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
        <div className="w-full md:w-[35%] flex flex-col max-h-[calc(90vh-300px)] md:max-h-[90vh] relative">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-8">
            <div className="mb-8">
              <h2 id="modal-title" className="text-xl md:text-2xl font-semibold mb-3">
                {data.title}
              </h2>
              <p className="text-gray-600">
                {data.description}
                <span className="text-red-600 ml-1 cursor-pointer">More</span>
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-red-600">
                  <TiTick className="w-6 h-6" />
                </div>
                <p className="text-sm">Flat 10 year warranty</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-red-600">
                  <BsCalendar4Week className="w-6 h-6" />
                </div>
                <p className="text-sm">45-days delivery*</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-red-600">
                  <RiTeamLine className="w-6 h-6" />
                </div>
                <p className="text-sm">600+ design experts</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 text-red-600">
                  <MdOutlineHomeRepairService className="w-6 h-6" />
                </div>
                <p className="text-sm">Post-installation service</p>
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-2">Specification</h3>
              <p className="text-gray-700">Shape | {data.shape}</p>
            </div>

            {/* Share */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4">Share this Design</h3>
              <div className="flex space-x-4">
                <button className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-red-600">
                  <FaFacebook size={20} />
                </button>
                <button className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-red-600">
                  <FaTwitter size={20} />
                </button>
                <button className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-red-600">
                  <FaShare size={20} />
                </button>
                <button className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-red-600">
                  <BiMessageDetail size={20} />
                </button>
              </div>
            </div>

            {/* Related Designs */}
            <div className="mb-8 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Related Designs</h3>
              <div className="grid grid-cols-3 gap-3">
                {data.relatedDesigns.map((design) => (
                  <div key={design.id} className="cursor-pointer">
                    <img
                      src={design.imgSrc}
                      alt="Related Design"
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed CTA buttons at bottom */}
          <div className="sticky bottom-0 border-t border-gray-200 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="space-y-4">
              <button
                className="w-full bg-red-600 text-white font-medium py-3 rounded"
                onClick={() => setShowContactForm(true)}
              >
                BOOK FREE DESIGN SESSION
              </button>
              <button
                className="w-full border border-gray-300 py-3 rounded flex items-center justify-center space-x-2"
                onClick={() => setWishlist(!wishlist)}
              >
                {wishlist ? <FaHeart /> : <FaRegHeart />}
                <span>WISHLIST</span>
              </button>
            </div>
          </div>

          {/* Contact Form Overlay */}
          <div
            className={`absolute inset-0 bg-white flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              showContactForm ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setShowContactForm(false)}
                className="absolute top-2 right-2 text-gray-950 hover:text-gray-700 transition-colors duration-200"
                aria-label="Close contact form"
              >
                <IoMdClose className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className={`space-y-6 transform transition-all duration-300 ease-in-out ${
                showContactForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {/* Image */}
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={data.images[currentImageIndex]}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Message */}
                <p className="text-center text-gray-700 font-medium">
                  Our designer will call you to help with your interior requirements.
                </p>

                {/* Contact Form */}
                <ContactForm
                  onSubmit={(data) => {
                    console.log("Form submitted:", data);
                    setShowContactForm(false);
                  }}
                />
                <button onClick={() => setShowContactForm(false)} className="text-red-500 text-xs text-center w-full underline">close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignModal;
