import { IoMdClose } from "react-icons/io";
import {
  MdKitchen,
  MdChair,
  MdTv,
  MdDesk,
  MdLightbulb,
  MdWallpaper,
  MdBrush,
  MdBathtub,
  MdTempleHindu,
  MdDoorFront,
  MdChairAlt,
  MdBed,
  MdOutlineBedroomParent,
  MdRoofing,
} from "react-icons/md";
import ContactForm from "../../components/Forms/ContactForm";
import { useState } from "react";
import { motion } from "framer-motion";

export default function InteriorSolutionsGrid() {
  const [modalOpen, setModalOpen] = useState(false);

  const solutionItems = [
    { icon: MdKitchen, title: "Modular Kitchen", accent: true },
    {
      icon: MdOutlineBedroomParent,
      title: "Storage and Wardrobe",
      accent: true,
    },
    { icon: MdKitchen, title: "Crockery Units", accent: true },
    { icon: MdChair, title: "Space Saving Furniture", accent: true },
    { icon: MdTv, title: "TV Units", accent: true },
    { icon: MdDesk, title: "Study Tables", accent: true },
    { icon: MdRoofing, title: "False Ceiling", accent: true },
    { icon: MdLightbulb, title: "Lights", accent: true },
    { icon: MdWallpaper, title: "Wallpaper", accent: true },
    { icon: MdBrush, title: "Wall Paint", accent: true },
    { icon: MdBathtub, title: "Bathroom", accent: true },
    { icon: MdTempleHindu, title: "Pooja Unit", accent: true },
    { icon: MdDoorFront, title: "Foyer Designs", accent: true },
    { icon: MdChairAlt, title: "Movable Furniture", accent: true },
    { icon: MdBed, title: "Kids Bedroom", accent: true },
  ];

  const addAccent = (iconElement: React.ReactElement) => (
    <div className="relative inline-block">
      {iconElement}
      <div className="absolute top-0 right-0">
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-16">
          End-to-end interior solutions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 py-8">
          {solutionItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-4 text-[#656564]">
                {item.accent ? (
                  addAccent(<item.icon size={40} />)
                ) : (
                  <item.icon size={40} />
                )}
              </div>
              <p className="text-center font-medium">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-md uppercase"
          >
            Book Free Design Session
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
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
}
