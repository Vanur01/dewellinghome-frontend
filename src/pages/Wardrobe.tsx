import { wardrobeData } from '@/utils/ineteriorData';
import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const WardrobeInteriorDesign = () => {


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
    "Upgrade your bedroom with DwellingHome's designer wardrobes! We're your one-stop shop for trendy and functional wardrobe design solutions. We offer a stunning selection of modern wardrobe designs that are not only beautiful but built for functionality. Go beyond aesthetics and add practicality, with our ergonomically designed wardrobe interior design.",
    "We offer a variety of customisable wardrobe design ideas, including hanging rods, pull-out drawers, shelving units, and compartments – all designed to stretch your storage and keep your clothes organised with ease. Whether you're searching for a space-saving and affordable storage solution for a compact room or a luxurious walk-in closet, HomeLane has the best wardrobe designs you've ever seen!",
    "Our user-friendly wardrobe designs are stylish and trendy, guaranteed to transform your bedroom into a clutter-free, stylish sanctuary you'll never want to leave! Explore our collection of modular wardrobes, featuring a wide range of colours, finishes, and materials to find the perfect fit for your style and storage needs."
  ];

  return (
    <InteriorDesignTemplate
      heroImage="https://greentechinteriors.in/wp-content/uploads/2023/08/wardrobe-design-scaled.jpg"
      heroTitle="Wardrobe Interior Design"
      breadcrumbSection="Wardrobe"
      description={description}
      galleryItems={wardrobeData}
      serviceFeatures={serviceFeatures}
      estimateCardTitle="Personalized walk-in wardrobe delivered in just 45 days"
    />
  );
};

export default WardrobeInteriorDesign;