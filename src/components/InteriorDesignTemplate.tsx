import React from 'react';
import { Heart } from 'lucide-react';
import ContactForm from './Forms/ContactForm';

interface GalleryItem {
  image?: string;
  title?: string;
  size?: string;
  special?: boolean;
  days?: number;
}

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface InteriorDesignTemplateProps {
  heroImage: string;
  heroTitle: string;
  breadcrumbSection: string;
  description: string[];
  galleryItems?: GalleryItem[];
  serviceFeatures?: ServiceFeature[];
  estimateCardTitle?: string;
}

const InteriorDesignTemplate: React.FC<InteriorDesignTemplateProps> = ({
  heroImage,
  heroTitle,
  breadcrumbSection,
  description,
  galleryItems,
  estimateCardTitle
}) => {
  const [showMobileForm, setShowMobileForm] = React.useState(false);

  const handleSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full">
      {/* Hero Banner with Title */}
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-gray-900">
        <img 
          src={heroImage}
          alt={heroTitle} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-8 left-8">
          <h1 className="text-white text-2xl md:text-5xl font-bold">
            <span className="border-l-4 border-red-500 pl-2 mr-2"></span>
            {heroTitle}
          </h1>
        </div>

        {/* Mobile Form Button */}
        {/* <button
          onClick={() => setShowMobileForm(true)}
          className="relative md:hidden bottom-10 mx-5 bg-red-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-700 transition-colors text-sm"
        >
            Enquiry
          <span className="bg-yellow-400 text-black text-xs px-1.5 py-0.5 ml-1 rounded">
            FREE
          </span>
        </button> */}
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white py-4 px-8">
        <nav className="text-sm">
          <span className="text-red-500">Home</span>
          <span className="mx-2">/</span>
          <span className="text-red-500">Interior Design</span>
          <span className="mx-2">/</span>
          <span className="text-gray-500">{breadcrumbSection}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-white px-8 py-6">
        <div className="max-w-4xl">
          {description.map((paragraph, index) => (
            <p key={index} className="mb-6 text-gray-800">
              {paragraph}
            </p>
          ))}

        </div>


        {/* Design Gallery Section */}
        <div className="max-w-6xl mx-auto py-48">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item,index) => (
              <div key={index} className="relative rounded overflow-hidden shadow-md">
                {!item.special ? (
                  <>
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-64 object-cover"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-70 rounded-full">
                        <Heart className="text-gray-600 w-6 h-6" />
                      </button>
                      {/* Pagination dots for image sliders */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-medium text-lg text-gray-800">{item.title}</h3>
                      {item.size && <p className="text-gray-600">Size | {item.size}</p>}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-100 p-6 flex flex-col h-full justify-center">
                    <div className="flex items-start">
                      <div className="w-16 h-16 border-t-2 border-r-2 border-red-500 flex justify-center items-center">
                        <span className="text-4xl font-bold text-blue-600">{item.days}</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-800 font-medium">
                          {estimateCardTitle || `Personalized design delivered in just ${item.days} days`}
                        </p>
                        <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                          Get Free Estimate
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Form Popup */}
      {/* {showMobileForm && (
        <div className="hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 transform transition-transform duration-300 ease-out translate-y-0 z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">Meet a designer</h2>
            <button
              onClick={() => setShowMobileForm(false)}
              className="text-gray-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <ContactForm />
          </div>
        </div>
      )} */}

      {/* Desktop Form Section */}
      <div className="hidden md: md:flex absolute md:right-24  md:top-96 bg-white p-4 md:px-6 md:py-8 items-center justify-center w-full md:w-[25%] min-w-[280px] z-10 rounded-lg shadow-lg">
        <div className="w-full max-w-md md:max-w-none">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default InteriorDesignTemplate;