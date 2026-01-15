import RequirementForm from '../components/Forms/RequirementForm';
import ContactStepForm from '../components/Forms/ContactStepForm';
import enquiryStore from '../store/public/InquiryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { CheckCircle2, Calendar, PhoneCall, ClipboardList, User, Mail, Phone, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { inquiryApi } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type FormStage = 'contact' | 'requirements' | 'summary' | 'success';

const steps = [
  { id: 1, name: 'Contact Information', stage: 'contact' },
  { id: 2, name: 'Design Requirements', stage: 'requirements' },
  { id: 3, name: 'Review & Submit', stage: 'summary' },
];

const SummarySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

export default function GetEstimate() {
  const { userDetails, projectDetails, resetEnquiryData } = enquiryStore();
  const [currentStage, setCurrentStage] = useState<FormStage>(() => {
    if (!userDetails?.name || !userDetails?.email || !userDetails?.phone) {
      return 'contact';
    }
    return 'requirements';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRequirementsValid, setIsRequirementsValid] = useState(false);
  const [isUserValid, setIsuservalid] = useState(false);


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  // const handleContactComplete = () => {
  //   setCurrentStage('requirements');
  // };

  const handleRequirementsValidation = useCallback((isValid: boolean) => {
    setIsRequirementsValid(isValid);
  }, []);

  const handleUserValidation = useCallback((isValid: boolean) => {
    setIsuservalid(isValid);
  }, []);
  
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!projectDetails || !userDetails) {
        throw new Error('Missing required information');
      }

      const payload = {
        name: userDetails.name,
        email: userDetails.email,
        phone: `${userDetails.phone}`,
        address: userDetails.address || '',
        message: userDetails.message || '',
        items: projectDetails.items,
        countryCode: userDetails.countryCode,
        homeType: projectDetails.homeType,
        purpose: projectDetails.purpose
      };
      
      await inquiryApi.createInquiry(payload);
      setCurrentStage('success');
      resetEnquiryData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit inquiry');
      console.error('Error submitting inquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNextStep = () => {
    if (currentStage === 'contact') {
      return isUserValid
    }
    if (currentStage === 'requirements') {
      return isRequirementsValid 
    }
    return true;
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.stage === currentStage);
  };

  const handleNext = async () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1 && canProceedToNextStep()) {
      if (currentStage === 'contact') {
        setCurrentStage('requirements');
      } else if (currentStage === 'requirements') {
        if (projectDetails?.items && projectDetails.items.length > 0 && 
            projectDetails.homeType && projectDetails.purpose) {
          setCurrentStage('summary');
        } else {
          setError('Please complete all required fields before proceeding');
        }
      }
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStage(steps[currentIndex - 1].stage as FormStage);
    }
  };

  const renderStepsIndicator = () => (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              <div className={`group pl-4 py-2 flex flex-col border-l-4 ${
                step.stage === currentStage ? 'border-red-600' : 'border-gray-200'
              } hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`}>
                <span className={`text-xs font-semibold tracking-wide uppercase ${
                  step.stage === currentStage ? 'text-red-600' : 'text-gray-500'
                }`}>
                  Step {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );

  const renderNavigationButtons = () => {
    if (currentStage === 'success') return null;
    
    const currentIndex = getCurrentStepIndex();
    const showNext = currentIndex < steps.length - 1;
    const showPrev = currentIndex > 0;
    const isLastStep = currentIndex === steps.length - 1;

    return (
      <div className="flex justify-between gap-4 mt-6">
        {showPrev && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex-1"
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Step
          </Button>
        )}
        {showNext ? (
          <Button
            onClick={handleNext}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
            disabled={!canProceedToNextStep() || isSubmitting}
          >
            Next Step
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : isLastStep ? (
          <Button
            onClick={handleFinalSubmit}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
          </Button>
        ) : null}
      </div>
    );
  };

  const SummaryScreen = () => {
    const groupedItems = Object.entries((projectDetails?.items || []).reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof projectDetails.items>));

    return (
      <div className="space-y-6">
        <div className="grid gap-6">
          {/* Contact Information Section */}
          <SummarySection title="Contact Information">
            <div className="grid gap-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <User size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-base">{userDetails?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{userDetails?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-base">{userDetails?.countryCode} {userDetails?.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Pincode</p>
                  <p className="text-base">{userDetails?.pincode}</p>
                </div>
              </div>
            </div>
          </SummarySection>

          {/* Requirements Section */}
          <SummarySection title="Design Requirements">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Home Type</p>
                  <p className="text-base text-gray-800">{projectDetails?.homeType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Purpose</p>
                  <p className="text-base text-gray-800">{projectDetails?.purpose}</p>
                </div>
              </div>

              <Separator className="my-4" />

              {groupedItems.map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            {item.size && (
                              <p className="text-sm text-gray-500">Size: {item.size}</p>
                            )}
                          </div>
                          <Badge variant="secondary">
                            {item.units} unit(s)
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                  {category !== groupedItems[groupedItems.length - 1][0] && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </SummarySection>

        </div>
      </div>
    );
  };

  const SuccessScreen = () => (
    <Card className="w-full max-w-3xl mx-auto p-8">
      <CardContent className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mb-6"
        >
          <CheckCircle2 size={64} className="text-green-500 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Requirements Submitted Successfully!
          </h2>
          
          <p className="text-gray-600 max-w-lg mx-auto">
            Thank you for sharing your design requirements with us. Our team is excited to bring your vision to life!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
            <Card className="p-4">
              <CardContent className="text-center pt-4">
                <PhoneCall size={24} className="text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Quick Response</h3>
                <p className="text-sm text-gray-600">We'll contact you within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="text-center pt-4">
                <Calendar size={24} className="text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Free Consultation</h3>
                <p className="text-sm text-gray-600">Schedule your design consultation</p>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="text-center pt-4">
                <ClipboardList size={24} className="text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Custom Design</h3>
                <p className="text-sm text-gray-600">Personalized design proposal</p>
              </CardContent>
            </Card>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 space-y-4"
          >
            <p className="text-sm text-gray-600">
              Have questions? Contact us at{" "}
              <a href="tel:+919876543210" className="text-red-600 font-medium hover:text-red-700 transition-colors">
                +91 8328973166
              </a>
            </p>

            <Button
              onClick={() => {
                resetEnquiryData();
                setCurrentStage('contact');
                setIsRequirementsValid(false);
                setError(null);
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Submit Another Request
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="w-full max-w-3xl"
        >
          {currentStage !== 'success' && renderStepsIndicator()}
          
          <Card>
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                  {error}
                </div>
              )}

              {currentStage === 'contact' && (
                <ContactStepForm onUserValidationChange={handleUserValidation}/>
              )}
              {currentStage === 'requirements' && (
                <RequirementForm 
                  onValidationChange={handleRequirementsValidation}
                />
              )}
              {currentStage === 'summary' && <SummaryScreen />}
              {currentStage === 'success' && <SuccessScreen />}
              
              {renderNavigationButtons()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
