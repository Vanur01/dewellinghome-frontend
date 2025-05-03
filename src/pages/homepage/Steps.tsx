import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import ContactForm from "../../components/Forms/ContactForm";
import { motion } from "framer-motion";

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Design",
    description:
      "Get personalized designs from our expert designers that perfectly match your style and requirements.",
  },
  {
    number: 2,
    title: "Order",
    description:
      "Place your order with our transparent pricing system and flexible payment options.",
  },
  {
    number: 3,
    title: "Move-in",
    description:
      "Move in with ease, with our hassle-free civil work and installation services. Experience the home of your dreams.",
  },
];

const Steps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev % 3) + 1);
        setIsAnimating(false);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FFF5F5] -skew-x-12 transform origin-top-right -z-10" />

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Left side - Image */}
          <div className="flex justify-center items-center w-full h-full md:w-1/2 relative group">
            <img
              src="https://super.homelane.com/homepage/CompleteHI-03.png"
              alt="Modern living room with yellow sofa"
              className="w-[70%] h-[70%] object-cover "
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop";
              }}
            />
          </div>

          {/* Right side - Steps content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              Complete home interiors in
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-red-600">
              3 easy steps
            </h3>

            <div className="flex flex-col items-start">
              {/* Steps indicator */}
              <div className="flex items-center md:justify-start justify-center gap-3 mb-8 w-full">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base font-bold shadow-md transition-all duration-300 transform ${
                        step.number === currentStep
                          ? "bg-red-600 text-white scale-110"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {step.number}
                    </div>
                    {step.number < 3 && (
                      <div
                        className={`w-20 h-[2px] mx-2 rounded-full transition-all duration-300 ${
                          step.number < currentStep
                            ? "bg-red-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step content */}
              <div
                className={`transform transition-all duration-200 ${
                  isAnimating
                    ? "opacity-0 -translate-y-2"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <h3 className="text-xl font-bold text-red-600 mb-3">
                  {steps[currentStep - 1].title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed max-w-md">
                  {steps[currentStep - 1].description}
                </p>
              </div>

              {/* Book now button */}
              <button
                onClick={() => setModalOpen(true)}
                className="mt-8 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transform transition-all duration-300 hover:bg-red-700 hover:scale-105 hover:shadow-lg active:scale-95 text-sm"
              >
                Book Free Design Session
              </button>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <IoMdClose className="w-6 h-6" />
              </button>

              <div className="p-6">

                <ContactForm />
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-red-500 text-xs text-center w-full underline mb-4"
              >
                close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Steps;
