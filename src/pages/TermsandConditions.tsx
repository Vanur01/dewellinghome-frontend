import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiCheckCircle, FiAlertCircle, FiHelpCircle, FiCreditCard, FiShield } from 'react-icons/fi';

const TermsAndConditions: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);

  const sections = [
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: "By accessing and using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services."
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account."
    },
    {
      icon: <FiCreditCard className="w-6 h-6" />,
      title: "Payment Terms",
      content: "Payment for our services must be made in full before service delivery. All prices are subject to change without notice. Refunds are subject to our refund policy."
    },
    {
      icon: <FiAlertCircle className="w-6 h-6" />,
      title: "Limitation of Liability",
      content: "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services."
    },
    {
      icon: <FiHelpCircle className="w-6 h-6" />,
      title: "Dispute Resolution",
      content: "Any disputes arising from the use of our services shall be resolved through arbitration in accordance with the laws of the jurisdiction where we operate."
    }
  ];

  const scrollToSection = (index: number) => {
    setActiveSection(index);
    const element = document.getElementById(`section-${index}`);
    if (element) {
      // Offset for the sticky header
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((_, index) =>
        document.getElementById(`section-${index}`)
      );

      const currentSection = sectionElements.findIndex((element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection !== -1 && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4">
            <FiBook className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Terms and Conditions</h1>
          </div>
          <p className="mt-4 text-lg text-red-100 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto py-4 scrollbar-hide">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeSection === index
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-8"
              id={`section-${index}`}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-red-500">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Agreement Section */}
        <div className="mt-16 p-8 bg-red-50 rounded-xl border border-red-100">
          <h3 className="text-xl font-semibold text-red-700 mb-4">Your Agreement</h3>
          <p className="text-gray-700">
            By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </div>

        {/* Last Updated */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;