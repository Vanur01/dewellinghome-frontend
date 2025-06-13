import InteriorDesignTemplate from '../components/InteriorDesignTemplate';
import { BsShieldCheck, BsCalendarCheck, BsAward, BsTools } from "react-icons/bs";

const BathroomInteriorDesign = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://super.homelane.com/Nera%20Bathroom/1681379115910b60be0c57fe0-HLKT00000842_batch-3-800x600_19-main.jpg",
      title: "Monochrome Marvel Bathroom Design",

    },
    {
      id: 2,
      image: "https://super.homelane.com/Nera%20Bathroom/1681203312305779436e031f3-HLKT00000825_batch-3-800x600_15-main.jpg",
      title: "Luxury Terrazzo Lagoon Bathroom Design Bathroom",

    },
    {
      id: 3,
      image: "https://super.homelane.com/Nera%20Bathroom/1681198945791cad1a97c2a26-HLKT00000824_batch-3-800x600_29-main.jpg",
      title: "Contemporary Guest Enchanted Garden Bathroom Design",

    },
    {
      id: 4,
      image: "https://super.homelane.com/Nera%20Bathroom/163230056353048a7bd10d435-HLKT00000749_9-main.jpg",
      title: "Spruce Mirrored Bathroom Cabinet with Sliding Shutters",

    },
    {
      id: 5,
      special: true,
      days: 45,
    },
    {
      id: 6,
      image: "https://super.homelane.com/Nera%20Bathroom/1632300235527e073fde6423e-HLKT00000748_12-main.jpg",
      title: "Dapper Bathroom Cabinet with Open Storage",
    },
    {
      id: 7,
      image: "https://super.homelane.com/Nera%20Bathroom/163229810927569e341ff8d3c-HLKT00000739_2-main.jpg",
      title: "Elegance Single Shutter Mirrored Bathroom Cabinet",
    },
    {
      id: 8,
      image: "https://super.homelane.com/Nera%20Bathroom/1632299074637edd329a30cc8-HLKT00000744_6-main.jpg",
      title: "Radiance 3-Shutter Mirrored Bathroom Cabinet",
    },
    {
      id: 9,
      image: "https://super.homelane.com/Nera%20Bathroom/163229887678665e9044a0a1b-HLKT00000743_5-main.jpg",
      title: "Elementary Hidden Storage Bathroom Cabinet",
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