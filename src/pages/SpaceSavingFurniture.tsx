import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const SpaceSavingFurniture = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      title: "Convertible Sofa Bed",
      size: "78\" x 38\"",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1522155174216-12bb19132151",
      title: "Wall-Mounted Desk",
      size: "48\" x 24\"",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457",
      title: "Murphy Bed System",
      size: "85\" x 64\"",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1595514535415-dae8570b0ce0",
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
      image: "https://images.unsplash.com/photo-1597072689227-8882273e8f6a",
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
      heroImage="https://interiorworld.net.in/wp-content/uploads/2021/12/space-saving-furniture-4.jpg"
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