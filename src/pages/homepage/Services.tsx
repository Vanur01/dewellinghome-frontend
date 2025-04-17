import { useState } from "react";
import {
  BsShieldCheck,
  BsCalendarCheck,
  BsAward,
  BsTools,
} from "react-icons/bs";
import ContactForm from '../../components/Forms/ContactForm';
import { IoMdClose } from "react-icons/io";
import { motion} from 'framer-motion';

export default function InteriorDesignServices() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const services = [
    {
      icon: <BsShieldCheck className="text-red-500 w-10 h-10" />,
      title: "Flat 10 year warranty",
      description:
        "Choose interiors designed with superior quality material, leaving no room for defects.",
    },
    {
      icon: <BsCalendarCheck className="text-red-500 w-10 h-10" />,
      title: "45-days delivery*",
      description:
        "Get beautiful interiors for your new home in just 45 days. That's our delivery guarantee.",
    },
    {
      icon: <BsAward className="text-red-500 w-10 h-10" />,
      title: "600+ design experts",
      description:
        "Explore design ideas and co-create your dream home with our experienced designers",
    },
    {
      icon: <BsTools className="text-red-500 w-10 h-10" />,
      title: "Post-installation service",
      description:
        "Complete your design journey and get unwavering support from our dedicated care team.",
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-16 px-4 border-t-[.02rem] border-b-[.02rem] border-gray-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-4 py-6 border-r last:border-r-0 border-gray-100"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-lg font-medium mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md uppercase"
          >
            Book Free Design Session
          </button>
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
          initial={{scale:0.5}}
          animate={{scale:1}}
          transition={{duration:0.2}}
          className="fixed inset-0 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <IoMdClose className="w-6 h-6" />
              </button>

              <div className="p-6">
                <p className="text-xl mb-6 text-gray-900">Meet a Designer</p>

                <ContactForm
                  onSubmit={() => {
                    setModalOpen(false);
                  }}
                />
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
}
