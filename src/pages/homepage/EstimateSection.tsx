import { Link } from "react-router-dom";
const EstimateSection = () => {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
            Get an estimate for your <span className="text-red-600">home.</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base">
            Calculate the cost of doing up your home interiors now.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Full Home Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative hover:shadow-xl transition-shadow duration-300">
            {/* Calculator Icon */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
                <div className="border border-gray-300 rounded-tl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400">
                  +
                </div>
                <div className="border border-gray-300 rounded-tr w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400">
                  −
                </div>
                <div className="border border-gray-300 rounded-bl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400">
                  ×
                </div>
                <div className="border border-gray-300 rounded-br w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400">
                  ÷
                </div>
              </div>
            </div>

            {/* Icon and Content */}
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="w-full h-full"
                  >
                    <rect
                      x="2"
                      y="7"
                      width="20"
                      height="14"
                      rx="2"
                      strokeWidth="1"
                      className="stroke-gray-800"
                    />
                    <path
                      d="M5 7V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"
                      strokeWidth="1"
                      className="stroke-gray-800"
                    />
                    <rect
                      x="9"
                      y="12"
                      width="6"
                      height="2"
                      className="fill-gray-800"
                    />
                    <path
                      d="M4 12h2v2H4z M14 8h2v2h-2z"
                      className="fill-gray-800"
                    />
                    <path d="M18 12h2v2h-2z" className="fill-gray-800" />
                    <path
                      d="M4 16h16"
                      strokeWidth="1"
                      className="stroke-gray-800"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-12 sm:w-8 sm:h-16 text-red-600"
                  >
                    <path d="M8 2v2H4v18h16V4h-4V2h1a1 1 0 0 1 1 1v20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h5z" />
                    <path d="M16 2v8h-2V8h-4v2H8V2h8zm-2 4V4h-4v2h4z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                Full Home Interiors
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                Get the estimate price for your full home interiors.
              </p>
            </div>

            {/* Button */}
            <Link to={'/get-estimate'}>
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 sm:px-5 rounded text-xs sm:text-sm transition duration-300 w-full sm:w-auto">
              Get Free Estimate
            </button>
            </Link>
          </div>

          {/* Kitchen Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative hover:shadow-xl transition-shadow duration-300">
            {/* Calculator Icon */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
                <div className="border border-gray-300 rounded-tl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400">
                  +
                </div>
                <div className="border border-gray-300 rounded-tr w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400">
                  −
                </div>
                <div className="border border-gray-300 rounded-bl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400">
                  ×
                </div>
                <div className="border border-gray-300 rounded-br w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-400">
                  ÷
                </div>
              </div>
            </div>

            {/* Icon and Content */}
            <div className="mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="w-full h-full"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    className="stroke-gray-800"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="6"
                    height="6"
                    fill="#e53e3e"
                    className="stroke-gray-800"
                  />
                  <path
                    d="M3 9h18 M9 3v18 M15 9v12"
                    className="stroke-gray-800"
                  />
                  <path d="M12 12h6v6h-6z" className="stroke-gray-800" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Kitchen</h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                Get costing for your kitchen interiors.
              </p>
            </div>

            {/* Button */}
            <Link to={'/kitchen-estimate'}>
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 sm:px-5 rounded text-xs sm:text-sm transition duration-300 w-full sm:w-auto">
              Get Free Estimate
            </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200"></div>
    </>
  );
};

export default EstimateSection;
