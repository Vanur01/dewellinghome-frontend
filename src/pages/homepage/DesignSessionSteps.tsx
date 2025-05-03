const DesignSessionSteps = () => {
  const steps = [
    {
      id: 1,
      title: "Meet Your Designer",
      image: "/images/steps/step1.svg",
      description:
        "Schedule a consultation with our expert designer to discuss your vision and requirements.",
    },
    {
      id: 2,
      title: "Walkthrough of Dwelling Home Studio",
      image: "/images/steps/step2.svg",
      description:
        "Experience our state-of-the-art design studio and explore material options firsthand.",
    },
    {
      id: 3,
      title: "Free Personalised 3D Designs",
      image: "/images/steps/step3.svg",
      description:
        "Visualize your dream space with custom 3D designs created using our SpaceCraft Pro software.",
    },
    {
      id: 4,
      title: "Get an Instant Quote",
      image: "/images/steps/step4.svg",
      description:
        "Receive a detailed quote with transparent pricing and flexible payment options.",
    },
  ];

  return (
    <div className="bg-white">
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-2xl font-semibold text-center mb-16 text-gray-800">
          What is a Design Session?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center group transition-all duration-300 hover:-translate-y-2"
            >
              <div className="mb-6 w-full">
                <img
                  src={step.image}
                  alt={`Step ${step.id}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="text-center px-4">
                <p className=" text-primary-600 mb-2">
                  Step {step.id}. {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200"></div>
    </div>
  );
};

export default DesignSessionSteps;
