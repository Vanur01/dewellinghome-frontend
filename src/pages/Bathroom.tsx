import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const BathroomInteriorDesign = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg",
      title: "Modern Spa-like Bathroom",
      size: "8' X 6'",
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/6585761/pexels-photo-6585761.jpeg",
      title: "Luxury Master Bathroom",
      size: "10' X 8'",
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/7319316/pexels-photo-7319316.jpeg",
      title: "Contemporary Guest Bath",
      size: "6' X 5'",
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/6585754/pexels-photo-6585754.jpeg",
      title: "Minimalist Powder Room",
      size: "5' X 4'",
    },
    {
      id: 5,
      special: true,
      days: 45,
    },
    {
      id: 6,
      image: "https://images.pexels.com/photos/6585751/pexels-photo-6585751.jpeg",
      title: "Classic Family Bathroom",
      size: "8' X 7'",
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
    "Transform your bathroom into a luxurious spa-like retreat with DwellingHome's expert bathroom interior design solutions. Our designers create stunning, functional spaces that combine style with practicality, ensuring you get a perfect balance of comfort and elegance.",
    "From master bathrooms to compact powder rooms, we offer customizable design options that maximize your space while meeting your specific needs. Our bathroom designs incorporate smart storage solutions, premium fixtures, and moisture-resistant materials to create a durable and beautiful space.",
    "Experience the perfect blend of luxury and functionality with our bathroom designs. Whether you prefer a modern minimalist look or a classic traditional style, our expert designers will help you create the bathroom of your dreams, complete with carefully selected fixtures, tiles, and accessories."
  ];

  return (
    <InteriorDesignTemplate
      heroImage="https://images.pexels.com/photos/6585750/pexels-photo-6585750.jpeg"
      heroTitle="Bathroom Interior Design"
      breadcrumbSection="Bathroom"
      description={description}
      galleryItems={galleryItems}
      serviceFeatures={serviceFeatures}
      estimateCardTitle="Your dream bathroom delivered in just 45 days"
    />
  );
};

export default BathroomInteriorDesign;