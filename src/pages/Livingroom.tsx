import { Livingroomdata } from '@/utils/ineteriorData';
import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const LivingroomInteriorDesign = () => {
  const serviceFeatures = [
    {
      icon: <BsShieldCheck className="text-red-500 w-10 h-10" />,
      title: "Flat 10 year warranty",
      description: "Choose interiors designed with superior quality material, leaving no room for defects.",
    },
    {
      icon: <BsCalendarCheck className="text-red-500 w-10 h-10" />,
      title: "45-days delivery*",
      description: "Get beautiful interiors for your new home in just 45 days. That's our delivery guarantee.",
    },
    {
      icon: <BsAward className="text-red-500 w-10 h-10" />,
      title: "600+ design experts",
      description: "Explore design ideas and co-create your dream home with our experienced designers",
    },
    {
      icon: <BsTools className="text-red-500 w-10 h-10" />,
      title: "Post-installation service",
      description: "Complete your design journey and get unwavering support from our dedicated care team.",
    },
  ];

  const description = [
    "Create the perfect gathering space with DwellingHome's expert living room interior design solutions. Our designers craft inviting, functional spaces that blend style with comfort, ensuring your living room becomes the heart of your home.",
    "From contemporary open-plan layouts to cozy traditional settings, we offer customizable design options that match your lifestyle and preferences. Our living room designs incorporate thoughtful space planning, comfortable seating arrangements, and strategic lighting to create the perfect atmosphere.",
    "Experience the perfect harmony of style and functionality with our living room designs. Whether you prefer a modern minimalist aesthetic or a classic elegant look, our expert designers will help you create a living space that reflects your personality, complete with carefully selected furniture, lighting, and decorative elements."
  ];

  return (
    <InteriorDesignTemplate
      heroImage="https://media.designcafe.com/wp-content/uploads/2022/07/29185246/tv-unit-design-in-the-living-room-features-floating-cabinet.jpg"
      heroTitle="Living Room Interior Design"
      breadcrumbSection="Living Room"
      description={description}
      galleryItems={Livingroomdata}
      serviceFeatures={serviceFeatures}
      estimateCardTitle="Your perfect living room delivered in just 45 days"
    />
  );
};

export default LivingroomInteriorDesign;