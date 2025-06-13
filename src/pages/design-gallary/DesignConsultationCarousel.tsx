import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import ContactForm from '@/components/Forms/ContactForm';

export default function DesignConsultationCarousel() {
  const [activeStep, setActiveStep] = useState(1);
  
  const steps = [
    { id: 1, title: "Design Consultation", description: "Share your ideas and floor plan to receive personalised 3D designs and an instant quote." },
    { id: 2, title: "Design Review", description: "Review your personalized designs and make any necessary adjustments." },
    { id: 3, title: "Final Approval", description: "Approve your final design and prepare for the next steps." },
    { id: 4, title: "Material Acquisition & Implementation", description: "We manufacture your custom furniture according to your approved design." },
    { id: 5, title: "Project Handover", description: "We coordinate a convenient handover time that works with your schedule." },
    { id: 6, title: "Move-In", description: "Our team delivers and installs your furniture in your space." }
  ];

  // Direction for animations
  const [direction, setDirection] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const nextStep = () => {
    if (activeStep < steps.length) {
      setDirection(1);
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setDirection(-1);
      setActiveStep(activeStep - 1);
    }
  };
  
  // Animation variants with faster transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  // Progress indicator animation simplified
  const progressVariants = {
    inactive: { scale: 1, backgroundColor: "#E5E7EB" },
    active: { scale: 1.05, backgroundColor: "#DC2626" }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <motion.h1 
        className="text-2xl sm:text-3xl lg:text-4xl text-center font-medium text-gray-700 mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        From Design to Move-In
      </motion.h1>
      
      {/* Progress Indicator */}
      <div className="relative mb-16 sm:mb-24">
        <div className="absolute w-full h-0.5 bg-gray-200 top-1/2 -translate-y-1/2"></div>
        <motion.div 
          className="absolute h-0.5 bg-red-600 top-1/2 -translate-y-1/2"
          style={{ width: `${(activeStep - 1) * 20}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${(activeStep - 1) * 20}%` }}
          transition={{ duration: 0.3 }}
        ></motion.div>
        <div className="flex justify-between relative">
          {steps.map(step => (
            <motion.div 
              key={step.id} 
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold relative z-10 text-white"
              variants={progressVariants}
              animate={step.id === activeStep ? "active" : "inactive"}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 300
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection(step.id > activeStep ? 1 : -1);
                setActiveStep(step.id);
              }}
            >
              {step.id}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Carousel Content */}
      <div className="flex flex-col lg:flex-row items-center mb-6 lg:mb-16">
        <motion.button 
          className="hidden lg:block p-1.5 mb-4 lg:mb-0 lg:mr-6 rounded-full border border-gray-300"
          onClick={prevStep}
          disabled={activeStep === 1}
          whileHover={{ scale: 1.1, backgroundColor: "#F3F4F6" }}
          whileTap={{ scale: 0.9 }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ChevronLeft size={20} className={activeStep === 1 ? "text-gray-300" : "text-gray-700"} />
        </motion.button>
        
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div 
              key={activeStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 30 },
                opacity: { duration: 0.15 }
              }}
              className="flex flex-col lg:flex-row w-full"
            >
              <div className="w-full lg:w-1/2 lg:pr-8 mb-6 lg:mb-0">
                <motion.h2 
                  className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {steps[activeStep-1].title}
                </motion.h2>
                <motion.p 
                  className="text-base sm:text-lg text-gray-700 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {steps[activeStep-1].description}
                </motion.p>
                
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button 
                   onClick={()=>setModalOpen(true)}
                    className="bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    BOOK FREE DESIGN SESSION
                  </motion.button>
                </motion.div>
              </div>
              
              <div className="w-full lg:w-1/2">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Pink elements with reduced animations */}
                  <motion.div 
                    className="absolute right-0 top-0 w-32 h-28 border-4 border-pink-200 opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                  <motion.div 
                    className="absolute right-32 top-16 w-24 h-20 border-4 border-pink-200 opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                  <motion.div 
                    className="absolute right-12 top-32 w-36 h-24 border-4 border-pink-200 opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                  
                  {/* Lamp */}
                  <motion.div 
                    className="absolute top-0 left-1/2 w-8 h-40 flex flex-col items-center"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-1 h-24 bg-pink-200"></div>
                    <div className="w-24 h-12 bg-pink-200 opacity-60 rounded-t-full"></div>
                  </motion.div>
                  
                  {/* People illustration */}
                  <motion.svg 
                    className="w-full h-64" 
                    viewBox="0 0 400 200"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <g transform="translate(0, 10)">
                      {/* Person 1 */}
                      <motion.circle 
                        cx="320" cy="90" r="20" fill="#000" 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M320 110 V160" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M320 120 L350 140" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M320 120 L290 140" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M320 160 L340 180" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M320 160 L300 180" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M330 80 Q340 70 330 60 Q320 70 330 80" fill="#000" 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Person 2 */}
                      <motion.circle 
                        cx="230" cy="90" r="20" fill="#000" 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.rect 
                        x="220" y="105" width="20" height="60" fill="#fff" stroke="#000" strokeWidth="2" 
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.rect 
                        x="225" y="120" width="10" height="15" fill="red" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M220 110 L200 130" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M240 110 L260 140" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M220 165 L210 185" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M240 165 L250 185" stroke="#000" strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.rect 
                        x="220" y="85" width="20" height="5" fill="#fff" stroke="#000" 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.rect 
                        x="233" y="80" width="4" height="10" fill="#000" 
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.rect 
                        x="223" y="80" width="4" height="10" fill="#000" 
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Laptop */}
                      <motion.rect 
                        x="270" y="140" width="40" height="30" fill="#fff" stroke="#000" strokeWidth="2" 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.rect 
                        x="270" y="170" width="40" height="2" fill="#000" 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.circle 
                        cx="290" cy="155" r="8" fill="red" 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, type: "spring" }}
                      />
                      
                      {/* Plant */}
                      <motion.rect 
                        x="350" y="160" width="15" height="15" fill="#fff" stroke="#000" strokeWidth="2" 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.path 
                        d="M350 160 Q350 140 360 150 Q370 140 370 160" fill="none" stroke="#000" strokeWidth="2" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </g>
                  </motion.svg>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <motion.button 
          className="hidden lg:block p-1.5 ml-4 rounded-full border border-gray-300"
          onClick={nextStep}
          disabled={activeStep === steps.length}
          whileHover={{ scale: 1.1, backgroundColor: "#F3F4F6" }}
          whileTap={{ scale: 0.9 }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ChevronRight size={20} className={activeStep === steps.length ? "text-gray-300" : "text-gray-700"} />
        </motion.button>
      </div>

      {/* Mobile Dots Navigation */}
      <div className="flex lg:hidden justify-center items-center space-x-2 mb-8">
        {steps.map((step) => (
          <motion.button
            key={step.id}
            onClick={() => {
              setDirection(step.id > activeStep ? 1 : -1);
              setActiveStep(step.id);
            }}
            className={`w-2.5 h-2.5 rounded-full ${
              activeStep === step.id ? 'bg-red-600' : 'bg-gray-300'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: activeStep === step.id ? 1.2 : 1,
              backgroundColor: activeStep === step.id ? "#DC2626" : "#E5E7EB"
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>




      {modalOpen && <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-[999]"
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
          </motion.div>}
    </div>
  );
}