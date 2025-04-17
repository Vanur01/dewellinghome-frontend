import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const BathroomInteriorDesign = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5",
      title: "Modern Spa-like Bathroom",
      size: "8' X 6'",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
      title: "Luxury Master Bathroom",
      size: "10' X 8'",
    },
    {
      id: 3,
      image: "https://nextluxury.com/wp-content/uploads/modern-bathroom-ideas.jpg",
      title: "Contemporary Guest Bath",
      size: "6' X 5'",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
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
      image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
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
      heroImage="https://hindware.com/wp-content/uploads/2025/03/Resize.png"
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