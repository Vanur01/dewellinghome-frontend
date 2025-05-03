import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#fafafa] flex flex-col items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-black/[0.2] bg-[length:20px_20px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          {/* Animated Rings */}
          <div className="absolute -inset-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-2 border-transparent border-t-red-500/30"
            />
          </div>
          <div className="absolute -inset-8">
            <motion.div
              initial={{ rotate: 180 }}
              animate={{ rotate: -180 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-2 border-transparent border-t-red-500/20"
            />
          </div>
          <div className="absolute -inset-12">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-2 border-transparent border-t-red-500/10"
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4"
          >
              <img src="/images/Dwelling_home.png" alt="Dwelling Home" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-8 text-center"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Dwelling Home
          </motion.h2>
          <p className="text-gray-500 text-sm">
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              Restoring your session...
            </motion.span>
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 w-64"
        >
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 0
              }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-sm text-gray-400">
          Building dreams into reality
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen; 