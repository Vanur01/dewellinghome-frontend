import React, { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiChevronDown, FiChevronRight, FiLock, FiUserCheck, FiGlobe, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

interface Section {
  id: string;
  icon: JSX.Element;
  title: string;
  summary: string;
  details: string[];
}

const PrivacyPolicy: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections: Section[] = [
    {
      id: 'collection',
      icon: <FiUserCheck className="w-6 h-6" />,
      title: "Data Collection",
      summary: "Information we gather to serve you better",
      details: [
        "Personal information provided during account creation",
        "Usage data and interaction with our services",
        "Device information and location data",
        "Communication preferences and settings"
      ]
    },
    {
      id: 'usage',
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Data Usage",
      summary: "How we utilize your information",
      details: [
        "Service improvement and personalization",
        "Communication about updates and offers",
        "Analytics and performance monitoring",
        "Legal compliance and security measures"
      ]
    },
    {
      id: 'protection',
      icon: <FiLock className="w-6 h-6" />,
      title: "Data Protection",
      summary: "Keeping your information secure",
      details: [
        "Industry-standard encryption protocols",
        "Regular security audits and updates",
        "Strict access controls and monitoring",
        "Data backup and disaster recovery"
      ]
    },
    {
      id: 'updates',
      icon: <FiRefreshCw className="w-6 h-6" />,
      title: "Policy Updates",
      summary: "How we handle policy changes",
      details: [
        "Regular policy reviews and updates",
        "Notification of significant changes",
        "User consent for material changes",
        "Archive of previous versions"
      ]
    },
    {
      id: 'rights',
      icon: <FiAlertCircle className="w-6 h-6" />,
      title: "Your Rights",
      summary: "Control over your data",
      details: [
        "Right to access your data",
        "Right to correct or delete information",
        "Right to opt-out of communications",
        "Right to data portability"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white border-b border-2 border-gray-300 shadow-xl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-red-600 text-white">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <FiShield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Your privacy matters to us. Learn about our commitment to protecting your personal information.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Line */}
              {index !== sections.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200" />
              )}

              {/* Section Content */}
              <div className="relative flex items-start space-x-6">
                {/* Timeline Dot */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center"
                  >
                    <div className="text-red-600">{section.icon}</div>
                  </motion.div>
                </div>

                {/* Content Card */}
                <div className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                      <motion.div
                        animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </div>
                    <p className="mt-2 text-gray-600">{section.summary}</p>

                    <AnimatePresence>
                      {expandedSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-4 space-y-3">
                            {section.details.map((detail, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center space-x-3 text-gray-600"
                              >
                                <FiChevronRight className="flex-shrink-0 w-4 h-4 text-red-500" />
                                <span>{detail}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 bg-red-50 rounded-xl text-center"
        >
          <h3 className="text-xl font-semibold text-red-700 mb-4">Questions About Privacy?</h3>
          <p className="text-gray-600 mb-6">
            If you have any questions about our privacy practices, please don't hesitate to contact us.
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors">
            Contact Privacy Team
          </button>
        </motion.div> */}

        {/* Last Updated */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;