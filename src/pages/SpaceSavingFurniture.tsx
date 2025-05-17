import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const SpaceSavingFurniture = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/6580227/pexels-photo-6580227.jpeg",
      title: "Convertible Sofa Bed",
      size: "78\" x 38\"",
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/6580228/pexels-photo-6580228.jpeg",
      title: "Wall-Mounted Desk",
      size: "48\" x 24\"",
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/6580229/pexels-photo-6580229.jpeg",
      title: "Murphy Bed System",
      size: "85\" x 64\"",
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/6580230/pexels-photo-6580230.jpeg",
      title: "Expandable Dining Table",
      size: "30-60\" x 36\"",
    },
    {
      id: 5,
      special: true,
      days: 45,
    },
    {
      id: 6,
      image: "https://images.pexels.com/photos/6580231/pexels-photo-6580231.jpeg",
      title: "Modular Storage Unit",
      size: "72\" x 84\"",
    },
  ];

  const serviceFeatures = [
    {
      icon: <BsShieldCheck className="text-red-500 w-10 h-10" />,
      title: "Quality Guarantee",
      description: "Premium space-saving solutions with durable mechanisms and materials built to last.",
    },
    {
      icon: <BsCalendarCheck className="text-red-500 w-10 h-10" />,
      title: "45-days delivery*",
      description: "Transform your space with our efficient furniture solutions in just 45 days.",
    },
    {
      icon: <BsAward className="text-red-500 w-10 h-10" />,
      title: "Expert Consultation",
      description: "Get personalized advice on maximizing your space from our furniture specialists.",
    },
    {
      icon: <BsTools className="text-red-500 w-10 h-10" />,
      title: "Professional Installation",
      description: "Expert assembly and installation of all space-saving furniture pieces.",
    },
  ];

  const description = [
    "Maximize your living space with DwellingHome's innovative space-saving furniture solutions. Our collection features smart, multi-functional pieces designed specifically for modern urban homes and compact living spaces.",
    "From murphy beds and convertible sofas to expandable dining tables and wall-mounted desks, our furniture combines practicality with style. Each piece is carefully engineered to provide maximum functionality without compromising on aesthetics.",
    "Discover clever storage solutions and transformable furniture that adapts to your needs. Our space-saving furniture collection helps you make the most of every square foot while maintaining a clean, uncluttered look in your home."
  ];

  return (
    <InteriorDesignTemplate
      heroImage="https://images.pexels.com/photos/6580226/pexels-photo-6580226.jpeg"
      heroTitle="Space-Saving Furniture Solutions"
      breadcrumbSection="Space-Saving Furniture"
      description={description}
      galleryItems={galleryItems}
      serviceFeatures={serviceFeatures}
      estimateCardTitle="Transform your space with smart furniture in 45 days"
    />
  );
};

export default SpaceSavingFurniture;