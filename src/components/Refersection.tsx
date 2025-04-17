import React from 'react';

interface ReferSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  Icon: React.ReactElement;
}

const ReferSection: React.FC<ReferSectionProps> = ({
  title = "Loved us? Now refer us!",
  description = "Refer and earn ₹ 10,000 every time your friends try HomeLane.",
  buttonText = "Refer Now",
  onButtonClick = () => {},
  Icon
}) => {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-pink-100 py-16">
      <div className="container max-w-3xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-extralight text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {description}
          </p>
          <button
            onClick={onButtonClick}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-md transition duration-300"
          >
            {buttonText}
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            
              <div className="flex space-x-8">
              {Icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferSection;
