import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const BedroomInteriorDesign = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/3754595/pexels-photo-3754595.jpeg",
      title: "Modern Minimalist Bedroom",
      size: "14' X 12'",
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
      title: "Luxurious Master Suite",
      size: "16' X 14'",
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg",
      title: "Contemporary Kids Bedroom",
      size: "12' X 10'",
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/3701434/pexels-photo-3701434.jpeg",
      title: "Rustic Guest Bedroom",
      size: "12' X 12'",
    },
    {
      id: 5,
      special: true,
      days: 45,
    },
    {
      id: 6,
      image: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg",
      title: "Scandinavian Style Bedroom",
      size: "14' X 12'",
    },
  ];

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
    "Transform your bedroom into a peaceful sanctuary with DwellingHome's expert bedroom interior design solutions. Our designers create beautiful, functional spaces that perfectly balance style and comfort, ensuring you get the restful environment you deserve.",
    "From luxurious master bedrooms to cozy guest rooms, we offer customizable design options that cater to your specific needs and preferences. Our bedroom designs incorporate smart storage solutions, optimal furniture placement, and carefully selected color schemes to create the perfect ambiance.",
    "Experience the perfect blend of aesthetics and functionality with our bedroom designs. Whether you're looking for a modern minimalist look or a classic traditional style, our expert designers will help you create the bedroom of your dreams, complete with carefully curated furniture, lighting, and decor elements."
  ];

  return (
    <InteriorDesignTemplate
      heroImage="https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg"
      heroTitle="Bedroom Interior Design"
      breadcrumbSection="Bedroom"
      description={description}
      galleryItems={galleryItems}
      serviceFeatures={serviceFeatures}
      estimateCardTitle="Your dream bedroom delivered in just 45 days"
    />
  );
};

export default BedroomInteriorDesign;