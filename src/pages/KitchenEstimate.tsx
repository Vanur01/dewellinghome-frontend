import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Minus,
  Plus,
  ChevronLeft,
  PencilIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import ContactKitchenForm from "@/components/Forms/ContactStepForm";
import InquiryStore from "@/store/public/InquiryStore";
import { inquiryApi } from "@/utils/api";
import { toast } from "sonner";
import {
  LShapeDiagram,
  ParallelDiagram,
  StraightDiagram,
  UShapeDiagram,
} from "@/utils/Icons";
import { accessoryProducts } from "../utils/kitchenAccessory";

const steps = [
  { id: 1, name: "Contact Information" },
  { id: 2, name: "Kitchen Configuration" },
  { id: 3, name: "Confirmation" },
];

export default function KitchenConfigurator() {
  const {
    userDetails,
    projectDetails,
    setKitchenConfiguration,
    resetEnquiryData,
  } = InquiryStore();
  const [currentStep, setCurrentStep] = useState(() =>
    userDetails.name ? 2 : 1
  );
  const [editingContact, setEditingContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);
  const [homeConfig, setHomeConfig] = useState("1 BHK");
  const [kitchenShape, setKitchenShape] = useState("L-Shape");
  const [wallALength, setWallALength] = useState("12");
  const [wallAInch, setWallAInch] = useState("0");
  const [wallAHeight, setWallAHeight] = useState("8");
  const [wallAHeightInch, setWallAHeightInch] = useState("0");
  const [wallBLength, setWallBLength] = useState("5");
  const [wallBInch, setWallBInch] = useState("0");
  const [wallBHeight, setWallBHeight] = useState("8");
  const [wallBHeightInch, setWallBHeightInch] = useState("0");
  const [wallCLength, setWallCLength] = useState("0");
  const [wallCInch, setWallCInch] = useState("0");
  const [wallCHeight, setWallCHeight] = useState("8");
  const [wallCHeightInch, setWallCHeightInch] = useState("0");
  const [cabinetMaterial, setCabinetMaterial] = useState("Particle Board");
  const [shutterMaterial, setShutterMaterial] = useState(
    "BWP Ply Matte Laminate"
  );
  const [carcassMaterial, setCarcassMaterial] = useState(
    "HDHMR Ply Matte Laminate"
  );
  const [accessories, setAccessories] = useState({
    detergentHolder: 1,
    bottlePullOut: 1,
    tandemDrawer: 1,
    cutleryTray: 1,
    detergentBinHolder: 0,
    plainBasket: 0,
    plateTray: 0,
    dTray: 0,
    pantryPullout: 0,
    magicCorner: 0,
    worktopExtension: 0,
    lemansCorner: 0,
    wickerBasket: 0,
    larderPullout: 0,
    microwaveOtg: 0,
    pullOutBaskets: 0,
  });

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isUserValid, setIsUserValid] = useState(false);



  // FIRST: Reset walls when kitchen shape changes
useEffect(() => {
  if (kitchenShape === 'Straight') {
    setWallBLength("0");
    setWallBInch("0");
    setWallBHeight("0");
    setWallBHeightInch("0");
    setWallCLength("0");
    setWallCInch("0");
    setWallCHeight("0");
    setWallCHeightInch("0");
  } else if (kitchenShape === 'L-Shape' || kitchenShape === 'Parallel') {
    setWallCLength("0");
    setWallCInch("0");
    setWallCHeight("0");
    setWallCHeightInch("0");
  }
}, [kitchenShape]);

  

  // Update kitchen configuration in store when values change
  useEffect(() => {
    const kitchenConfig = {
      homeType: homeConfig,
      kitchenLayout: kitchenShape,
      wallDimensions: {
        wallA: {
          length: { feet: Number(wallALength), inches: Number(wallAInch) },
          height: {
            feet: Number(wallAHeight),
            inches: Number(wallAHeightInch),
          },
        },
        wallB: {
          length: { feet: Number(wallBLength), inches: Number(wallBInch) },
          height: {
            feet: Number(wallBHeight),
            inches: Number(wallBHeightInch),
          },
        },
        wallC: {
          length: { feet: Number(wallCLength), inches: Number(wallCInch) },
          height: {
            feet: Number(wallCHeight),
            inches: Number(wallCHeightInch),
          },
        },
      },
      cabinetMaterial,
      shutterMaterial,
      carcassMaterial,
      accessories,
    };
    setKitchenConfiguration(kitchenConfig);
  }, [
    homeConfig,
    kitchenShape,
    wallALength,
    wallAInch,
    wallAHeight,
    wallAHeightInch,
    wallBLength,
    wallBInch,
    wallBHeight,
    wallBHeightInch,
    wallCLength,
    wallCInch,
    wallCHeight,
    wallCHeightInch,
    cabinetMaterial,
    shutterMaterial,
    carcassMaterial,
    accessories,
  ]);

  // Set initial step based on whether we have user details
  useEffect(() => {
    if (!userDetails.name) {
      setCurrentStep(1);
    }
  }, [userDetails.name]);

  // When editing contact info is enabled, go back to step 1
  useEffect(() => {
    if (editingContact) {
      setCurrentStep(1);
    }
  }, [editingContact]);

  const incrementAccessory = (type) => {
    setAccessories({
      ...accessories,
      [type]: accessories[type] + 1,
    });
  };

  const decrementAccessory = (type) => {
    if (accessories[type] > 0) {
      setAccessories({
        ...accessories,
        [type]: accessories[type] - 1,
      });
    }
  };

  const scrollPrev = () => {
    if (carouselApi) {
      carouselApi.scrollPrev();
    }
  };

  const scrollNext = () => {
    if (carouselApi) {
      carouselApi.scrollNext();
    }
  };

  const handleuserValidationChange = (isValid) => {
    setIsUserValid(isValid);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Prepare the inquiry data
      const inquiryData = {
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address || "",
        countryCode: userDetails.countryCode,
        message: userDetails.message || "",
        // Set homeType from the kitchen configuration
        homeType: homeConfig,
        // For kitchen inquiries, set purpose as "Renovate"
        purpose: "Renovate",
        kitchenConfiguration: projectDetails.kitchenConfiguration,
      };

      // Make the API call
      await inquiryApi.createInquiry(inquiryData);

      // Show success message and set success state
      toast.success("Kitchen estimate request submitted successfully!");
      setIsSubmissionSuccessful(true);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error(
        "Failed to submit kitchen estimate request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      resetEnquiryData();
    }
  };

  const renderStepsIndicator = () => (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={`group pl-4 py-2 flex flex-col border-l-4 ${
                  step.id === currentStep ? "border-red-600" : "border-gray-200"
                } hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`}
              >
                <span
                  className={`text-xs font-semibold tracking-wide uppercase ${
                    step.id === currentStep ? "text-red-600" : "text-gray-500"
                  }`}
                >
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

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingContact(true)}
            className="flex items-center gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {userDetails.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {userDetails.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {userDetails.countryCode} {userDetails.phone}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {userDetails.address}
            </p>
            <p>
              <span className="font-medium">Pincode:</span>{" "}
              {userDetails.pincode}
            </p>
            {userDetails.message && (
              <p>
                <span className="font-medium">Additional Notes:</span>{" "}
                {userDetails.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kitchen Configuration</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Basic Configuration</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Home Type:</span> {homeConfig}
                </p>
                <p>
                  <span className="font-medium">Kitchen Layout:</span>{" "}
                  {kitchenShape}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Dimensions</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Wall A:</span> Length:{" "}
                  {wallALength}' {wallAInch}", Height: {wallAHeight}'{" "}
                  {wallAHeightInch}"
                </p>
                {(kitchenShape === "L-Shape" ||
                  kitchenShape === "U-Shape" ||
                  kitchenShape === "Parallel") && (
                  <p>
                    <span className="font-medium">Wall B:</span> Length:{" "}
                    {wallBLength}' {wallBInch}", Height: {wallBHeight}'{" "}
                    {wallBHeightInch}"
                  </p>
                )}
                {kitchenShape === "U-Shape" && (
                  <p>
                    <span className="font-medium">Wall C:</span> Length:{" "}
                    {wallCLength}' {wallCInch}", Height: {wallCHeight}'{" "}
                    {wallCHeightInch}"
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Materials</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Cabinet Material:</span>{" "}
                  {cabinetMaterial}
                </p>
                <p>
                  <span className="font-medium">Shutter Material:</span>{" "}
                  {shutterMaterial}
                </p>
                <p>
                  <span className="font-medium">Carcass Material:</span>{" "}
                  {carcassMaterial}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Selected Accessories</h3>
              <div className="space-y-1">
                {Object.entries(accessories)
                  .filter(([, count]) => count > 0)
                  .map(([key, count]) => (
                    <p key={key}>
                      <span className="font-medium">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>{" "}
                      {count}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      // Check if all required contact fields are filled
      return isUserValid;
    }
    return true;
  };

  const nextStep = () => {
    if (canProceedToNextStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderNavigationButtons = () => (
    <div className="flex justify-between gap-4 w-full">
      {currentStep > 1 && (
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1"
          disabled={isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Step
        </Button>
      )}
      {currentStep < steps.length && (
        <Button
          onClick={nextStep}
          className="flex-1 bg-red-600 text-white hover:bg-red-700"
          disabled={!canProceedToNextStep() || isSubmitting}
        >
          {currentStep === 2 ? "Review Information" : "Next Step"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
      {currentStep === steps.length && (
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-red-600 text-white hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Kitchen Estimate Request"}
        </Button>
      )}
    </div>
  );

  const renderThankYouScreen = () => (
    <div className="text-center space-y-6 py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <svg
          className="w-10 h-10 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900">Thank You!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Your kitchen estimate request has been successfully submitted. Our team
        will review your requirements and get back to you shortly.
      </p>
      <div className="mt-8">
        <Button
          onClick={() => {
            setIsSubmissionSuccessful(false);
            setCurrentStep(1);
            window.location.reload();
          }}
          variant="outline"
          className="mx-auto"
        >
          Submit Another Request
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {isSubmissionSuccessful ? (
        renderThankYouScreen()
      ) : (
        <>
          {renderStepsIndicator()}

          {currentStep === 1 && (
            <ContactKitchenForm
              isEditing={editingContact}
              onUserValidationChange={handleuserValidationChange}
            />
          )}

          {currentStep === 2 && (
            <>
              {/* Step 1: Home Configuration */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-base font-semibold">
                    Step 1 : Home Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <RadioGroup
                    value={homeConfig}
                    onValueChange={setHomeConfig}
                    className="flex justify-between max-w-2xl"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="1 BHK"
                        id="1bhk"
                        className="text-red-500"
                      />
                      <Label htmlFor="1bhk">1 BHK</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2 BHK" id="2bhk" />
                      <Label htmlFor="2bhk">2 BHK</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3 BHK" id="3bhk" />
                      <Label htmlFor="3bhk">3 BHK</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4 BHK" id="4bhk" />
                      <Label htmlFor="4bhk">4 BHK</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Step 2: Kitchen Shape */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-base font-semibold">
                    Step 2 : Kitchen Shape
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <div className="grid grid-cols-4 gap-4">
                    {/* L-Shape Layout */}
                    <div className="flex flex-col items-center">
                      <div className="border p-2 mb-4 w-full h-36 flex justify-center items-center">
                        <LShapeDiagram className="w-full max-w-md h-auto" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroup
                          value={kitchenShape}
                          onValueChange={setKitchenShape}
                          className="flex"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="L-Shape"
                              id="l-shape"
                              className="text-red-500"
                            />
                            <Label htmlFor="l-shape">L-Shape</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* U-Shape Layout */}
                    <div className="flex flex-col items-center">
                      <div className="border p-2 mb-4 w-full h-36 flex justify-center items-center">
                        <UShapeDiagram className="w-full max-w-md h-auto" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroup
                          value={kitchenShape}
                          onValueChange={setKitchenShape}
                          className="flex"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="U-Shape" id="u-shape" />
                            <Label htmlFor="u-shape">U-Shape</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Parallel Layout */}
                    <div className="flex flex-col items-center">
                      <div className="border p-2 mb-4 w-full h-36 flex justify-center items-center">
                        <ParallelDiagram className="w-full max-w-md h-auto" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroup
                          value={kitchenShape}
                          onValueChange={setKitchenShape}
                          className="flex"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Parallel" id="parallel" />
                            <Label htmlFor="parallel">Parallel</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Straight Layout */}
                    <div className="flex flex-col items-center">
                      <div className="border p-2 mb-4 w-full h-36 flex justify-center items-center">
                        <StraightDiagram className="w-full max-w-md h-auto" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroup
                          value={kitchenShape}
                          onValueChange={setKitchenShape}
                          className="flex"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Straight" id="straight" />
                            <Label htmlFor="straight">Straight</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {/* Wall A */}
                    <div className="space-y-2">
                      <Label className="block font-medium">Wall A</Label>
                      <div className="flex items-center space-x-2">
                        <Label className="w-16">Length</Label>
                        <input
                          type="number"
                          value={wallALength}
                          onChange={(e) => setWallALength(e.target.value)}
                          className="w-28 h-10 px-3 rounded-md border border-input bg-background"
                          min="1"
                          step="1"
                        />
                        <span>Feet</span>
                        <Select value={wallAInch} onValueChange={setWallAInch}>
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Inch" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i).map(
                              (num) => (
                                <SelectItem
                                  key={`inch-${num}`}
                                  value={num.toString()}
                                >
                                  {num}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <span>Inch</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="w-16">Height</Label>
                        <input
                          type="number"
                          value={wallAHeight}
                          onChange={(e) => setWallAHeight(e.target.value)}
                          className="w-28 h-10 px-3 rounded-md border border-input bg-background"
                          min="7"
                          step="1"
                        />
                        <span>Feet</span>
                        <Select
                          value={wallAHeightInch}
                          onValueChange={setWallAHeightInch}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Inch" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i).map(
                              (num) => (
                                <SelectItem
                                  key={`inch-${num}`}
                                  value={num.toString()}
                                >
                                  {num}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <span>Inch</span>
                      </div>
                    </div>

                    {/* Wall B */}
                    {(kitchenShape === "L-Shape" ||
                      kitchenShape === "U-Shape" ||
                      kitchenShape === "Parallel") && (
                      <div className="space-y-2">
                        <Label className="block font-medium">Wall B</Label>
                        <div className="flex items-center space-x-2">
                          <Label className="w-16">Length</Label>
                          <input
                            type="number"
                            value={wallBLength}
                            onChange={(e) => setWallBLength(e.target.value)}
                            className="w-28 h-10 px-3 rounded-md border border-input bg-background"
                            min="1"
                            step="1"
                          />
                          <span>Feet</span>
                          <Select
                            value={wallBInch}
                            onValueChange={setWallBInch}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="Inch" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i).map(
                                (num) => (
                                  <SelectItem
                                    key={`inch-${num}`}
                                    value={num.toString()}
                                  >
                                    {num}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <span>Inch</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="w-16">Height</Label>
                          <input
                            type="number"
                            value={wallBHeight}
                            onChange={(e) => setWallBHeight(e.target.value)}
                            className="w-28 h-10 px-3 rounded-md border border-input bg-background"
                            min="7"
                            step="1"
                          />
                          <span>Feet</span>
                          <Select
                            value={wallBHeightInch}
                            onValueChange={setWallBHeightInch}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="Inch" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i).map(
                                (num) => (
                                  <SelectItem
                                    key={`inch-${num}`}
                                    value={num.toString()}
                                  >
                                    {num}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <span>Inch</span>
                        </div>
                      </div>
                    )}

                    {/* Wall C */}
                    {kitchenShape === "U-Shape" && (
                      <div className="space-y-2">
                        <Label className="block font-medium">Wall C</Label>
                        <div className="flex items-center space-x-2">
                          <Label className="w-16">Length</Label>
                          <input
                            type="number"
                            value={wallCLength}
                            onChange={(e) => setWallCLength(e.target.value)}
                            className="w-28 h-10 px-3 rounded-md border border-input bg-background"
                            min="1"
                            step="1"
                          />
                          <span>Feet</span>
                          <Select
                            value={wallCInch}
                            onValueChange={setWallCInch}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="Inch" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i).map(
                                (num) => (
                                  <SelectItem
                                    key={`inch-${num}`}
                                    value={num.toString()}
                                  >
                                    {num}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <span>Inch</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="w-16">Height</Label>
                          <input
                            type="number"
                            value={wallCHeight}
                            onChange={(e) => setWallCHeight(e.target.value)}
                            className="w-28 h-10 px-3 rounded-md border border-input bg-background"
                            min="7"
                            step="1"
                          />
                          <span>Feet</span>
                          <Select
                            value={wallCHeightInch}
                            onValueChange={setWallCHeightInch}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="Inch" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i).map(
                                (num) => (
                                  <SelectItem
                                    key={`inch-${num}`}
                                    value={num.toString()}
                                  >
                                    {num}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <span>Inch</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Cabinet Material */}
              <Card>
                <CardHeader className="border-b flex flex-row justify-between">
                  <CardTitle className="text-base font-semibold">
                    Step 3 : Cabinet Material
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <Select
                    value={cabinetMaterial}
                    onValueChange={setCabinetMaterial}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select cabinet material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Particle Board">
                        Particle Board
                      </SelectItem>
                      <SelectItem value="MDF">MDF</SelectItem>
                      <SelectItem value="Plywood">Plywood</SelectItem>
                      <SelectItem value="Solid Wood">Solid Wood</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Step 4: Shutter Material  */}
              <Card>
                <CardHeader className="border-b flex flex-row justify-between">
                  <CardTitle className="text-base font-semibold">
                    Step 4 : Shutter Material
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <Select
                    value={shutterMaterial}
                    onValueChange={setShutterMaterial}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select shutter material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BWP Ply Matte Laminate">
                        BWP Ply Matte Laminate
                      </SelectItem>
                      <SelectItem value="BWP Ply Gloss Laminate">
                        BWP Ply Gloss Laminate
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Step 5: Carcass Material */}
              <Card>
                <CardHeader className="border-b flex flex-row justify-between">
                  <CardTitle className="text-base font-semibold">
                    Step 5 : Carcass Material
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <Select
                    value={carcassMaterial}
                    onValueChange={setCarcassMaterial}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select carcuss material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HDHMR Ply Matte Laminate">
                        HDHMR Ply Matte Laminate
                      </SelectItem>
                      <SelectItem value="HDHMR Ply Gloss Laminate">
                        HDHMR Ply Gloss Laminate
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Step 6: Accessories */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-base font-semibold">
                    Step 6 : Accessories
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-4">
                  <div className="relative px-6">
                    <Carousel
                      opts={{
                        align: "start",
                        breakpoints: {
                          "(min-width: 768px)": { slidesToScroll: 4 },
                        },
                        slidesToScroll: 1,
                        startIndex: 0,
                      }}
                      className="w-full"
                      setApi={setCarouselApi}
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {accessoryProducts.map((product) => (
                          <CarouselItem
                            key={product.product_id}
                            className="pl-2 md:pl-4 basis-full md:basis-1/4"
                          >
                            <div className="flex flex-col items-center justify-between h-full">
                              <div className="h-48 border rounded mb-2 overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="text-xs text-center mb-2">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 border border-gray-300 rounded-l"
                                  onClick={() =>
                                    decrementAccessory(product.key)
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <div className="px-3 py-1 border-t border-b bg-red-500 text-white text-sm">
                                  {accessories[product.key]}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 border border-gray-300 rounded-r"
                                  onClick={() =>
                                    incrementAccessory(product.key)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="mt-1 text-xs">
                                ₹{product.price}
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="absolute -left-10 top-1/3 transform -translate-y-1/2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-gray-300"
                          onClick={scrollPrev}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute -right-10 top-1/3 transform -translate-y-1/2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-gray-300"
                          onClick={scrollNext}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Carousel>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {currentStep === 3 && renderConfirmationStep()}

          <Card>
            <CardContent className="pt-6 pb-4">
              {renderNavigationButtons()}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
