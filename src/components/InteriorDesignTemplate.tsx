import React from "react";
import { ArrowRight, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import ContactForm from "./Forms/ContactForm";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/utils/Image";

interface GalleryItem {
  id: string | number;
  image?: string;
  title?: string;
  size?: string;
  special?: boolean;
  days?: number;
  specialDescription?: string;
  specialFeatures?: string[];
  description?: string;
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
  loading?: boolean;
  error?: string | null;
}

const InteriorDesignTemplate: React.FC<InteriorDesignTemplateProps> = ({
  heroImage,
  heroTitle,
  breadcrumbSection,
  description,
  galleryItems = [],
  serviceFeatures,
  estimateCardTitle,
  loading,
  error,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Banner with Title */}
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-gray-900">
        <img
          src={getImageUrl(heroImage)}
          alt={heroTitle}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-8 container mx-auto px-4 md:px-8 lg:px-16 xl:px-20">
          <h1 className="text-white text-2xl md:text-5xl font-bold">
            <span className="border-l-4 border-red-500 pl-2 mr-2"></span>
            {heroTitle}
          </h1>
        </div>
        {/* Contact Form Section */}
        <div className="relative -mt-36 container mx-auto px-4 md:px-8 lg:px-16 xl:px-20">
          <div className="absolute right-0 bg-white p-4 md:px-6 md:py-8 w-full md:w-[400px] min-w-[350px] shadow-lg rounded-lg">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white py-4 mt-[400px] md:mt-0">
        <nav className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-20 text-sm">
          <span className="text-red-500">Home</span>
          <span className="mx-2">/</span>
          <span className="text-red-500">Interior Design</span>
          <span className="mx-2">/</span>
          <span className="text-gray-500">{breadcrumbSection}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-white py-2">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-20">
          <div className="max-w-4xl">
            {description.map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-800">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Design Gallery Section */}
          <div className="max-w-7xl mx-auto py-48">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <div
                  key={index}
                  className="relative rounded overflow-hidden shadow-md"
                >
                  {!item.special ? (
                    <>
                      <div className="relative">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="w-full h-64 object-cover"
                        />
                        {/* Pagination dots for image sliders */}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-medium text-lg text-gray-800">
                          {item.title}
                        </h3>
                        {item.size && (
                          <p className="text-gray-600">Size | {item.size}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="bg-white p-6 flex flex-col h-full justify-between min-h-[320px] border border-gray-200 rounded-lg hover:border-red-300 transition-all duration-300">
                      <div className="space-y-6">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-6 h-6 text-red-500 mt-1" />
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {item.title ||
                                estimateCardTitle ||
                                "Get Your Dream Design"}
                            </h3>
                            <p className="text-gray-600 mt-2">
                              {item.specialDescription ||
                                "Transform your space with our expert design team. Get started with a free consultation."}
                            </p>
                          </div>
                        </div>

                        {item.specialFeatures && (
                          <ul className="space-y-3 ml-9">
                            {item.specialFeatures.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-center text-gray-700"
                              >
                                <CheckCircle2 className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {item.days && (
                        <div className="flex items-center gap-2 text-gray-600 ml-9 mb-4">
                          <Clock className="w-4 h-4" />
                          <span>Completed in {item.days} days</span>
                        </div>
                      )}

                      <Button
                        onClick={() => navigate("/get-estimate")}
                        className="bg-red-500 hover:bg-red-600 text-white w-full flex items-center justify-center gap-2 py-3 rounded-md"
                      >
                        Get Free Consultation
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteriorDesignTemplate;
