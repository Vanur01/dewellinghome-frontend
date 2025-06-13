import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const SpaceSavingFurniture = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://super.homelane.com/ssf-8c-o.jpg",
      title: "Convertible Sofa Sectional Sofa Cum Bed With Ottoman",
    },
    {
      id: 2,
      image: "https://super.homelane.com/ssf-13c-o.jpg",
      title: "Vanalen 4 To 6 Extendable Glass Top Dining Table",
    },
    {
      id: 3,
      image: "https://super.homelane.com/prodsnew/HLKT0000068.jpg",
      title: "Space-Saving Furniture: Queen-Size Wall-Mounted Sofa-Cum-Storage-Bed",
    },
    {
      id: 4,
      image: "https://super.homelane.com/ssf-6c-o.jpg",
      title: "Space-Saving Furniture: Sofa-Cum-Bed",
    },
    {
      id: 5,
      special: true,
      days: 45,
    },
    {
      id: 6,
      image: "https://super.homelane.com/ssf-29g.jpg",
      title: "Space-Saving Furniture: Queen-Size Vertical Wall-Mounted Sofa-Cum-Bed",
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
      heroImage="https://www.thespruce.com/thmb/fNW8BSy54lEB9TY12MUT0dIGrJM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/transforming-furniture-for-small-spaces-4058276-0490f69ad6114680920b7545b42abb92.jpg"
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