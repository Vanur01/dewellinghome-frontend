import { useState } from "react";
import ContactForm from "./Forms/ContactForm";
import { X } from "lucide-react";

interface HeroSectionProps {
  imageUrl: string;
  imageAlt?: string;
  headingLines: string[];
}

const HeroSection = ({
  imageUrl,
  imageAlt = "Hero Image",
  headingLines = [],
}: HeroSectionProps) => {
  const [showMobileForm, setShowMobileForm] = useState(false);


  return (
    <div className="relative flex flex-col md:flex-row md:min-h-screen w-full">
      {/* Image Section */}
      <div className="relative w-full h-[60vh] md:h-screen bg-green-800">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 transform -translate-y-1/2 left-4 md:left-16 z-10 p-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
            {headingLines.map((line, index) => (
              <span key={index}>
                <span className="bg-white text-transparent bg-clip-text drop-shadow-lg">
                  {line}
                </span>
                {index < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
        </div>

        {/* Mobile Form Button */}
        <button
          onClick={() => setShowMobileForm(true)}
          className="absolute md:hidden bottom-3 left-0 right-0 mx-5 bg-red-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-700 transition-colors text-sm"
        >
          { "Book 3D Design Session"}{" "}
          <span className="bg-yellow-400 text-black text-xs px-1.5 py-0.5 ml-1 rounded">
            FREE
          </span>
        </button>
      </div>

      {/* Mobile Form Popup */}
      {showMobileForm && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 transform transition-transform duration-300 ease-out translate-y-0 z-10">
          <div className="flex justify-center items-center relative mb-4">
            <button
              onClick={() => setShowMobileForm(false)}
              className="text-gray-500"
            >
              <X className="absolute right-0 top-0 w-6 h-6"/>
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <ContactForm/>
          </div>
        </div>
      )}

      {/* Desktop Form Section */}
      <div className="hidden md:flex md:absolute relative right-0 md:right-24 top-0 md:top-16 bg-white p-4 md:px-6 md:py-8 items-center justify-center w-full md:w-[25%] min-w-[280px] z-10 rounded-lg">
        <div className="w-full max-w-md md:max-w-none">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;