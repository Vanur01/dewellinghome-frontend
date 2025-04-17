const DesignSessionSteps = () => {
  const steps = [
    {
      id: 1,
      title: "Meet Your Designer",
      image: "https://img.freepik.com/free-vector/social-interaction-concept-illustration_114360-4260.jpg?t=st=1744118474~exp=1744122074~hmac=6e510760924041669dac520d194bc544ede481be6fbe0dbd31484ffc2a6a5722&w=1800",
      description:
        "Schedule a consultation with our expert designer to discuss your vision and requirements.",
    },
    {
      id: 2,
      title: "Walkthrough of HomeLane Studio",
      image: "https://img.freepik.com/free-vector/friends-walking-concept-illustration_114360-12857.jpg?t=st=1744118566~exp=1744122166~hmac=0208aa609b1dddb9bb8b809a5ae9f8a6b14f450accac87b6baa31834acdb9ca1&w=1380",
      description:
        "Experience our state-of-the-art design studio and explore material options firsthand.",
    },
    {
      id: 3,
      title: "Free Personalised 3D Designs",
      image: "https://img.freepik.com/free-vector/interior-design-concept-illustration_114360-5217.jpg?t=st=1744118665~exp=1744122265~hmac=95da350464205b4de908bfce7b9a256f333fd0277c57e97677db4098ac4e9635&w=1800",
      description:
        "Visualize your dream space with custom 3D designs created using our SpaceCraft Pro software.",
    },
    {
      id: 4,
      title: "Get an Instant Quote",
      image: "https://img.freepik.com/free-vector/construction-costs-concept-illustration_114360-7398.jpg?t=st=1744118759~exp=1744122359~hmac=971b003c89cdb084d91b97aa8079ad6c2dc37071f2ea95cacd0d168e788b654e&w=1380",
      description:
        "Receive a detailed quote with transparent pricing and flexible payment options.",
    },
  ];

  return (
    <>
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
    </>
  );
};

export default DesignSessionSteps;
