import DesignSlider from "./DesignSlider";
import DesignConsultationCarousel from "./DesignConsultationCarousel";
import HeroSection from "./Hero";
import {  WarrantyIcon,
  FourtyfiveIcon,
  NohiddencostIcons,
} from "../../utils/Icons";
import ServiceSection from "../modular-kitchen/ServiceSection";
import GoogleReview from "./GoogleReview";
import { ScrollReveal } from "../../components/ScrollReveal";
import { Link } from "react-router-dom";

const estimateCards = [
  {
    title: "Modular Kitchen",
    description: "Get a customised price estimate for your kitchen interiors",
    image:
      "https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/1-2025-1736068988-NDPD1/jfm-1736069001-9OxTK/kitchen-1736069015-B2aEs/ki-24-1-1742205308-oWEt9.jpg",
    alt: "Kitchen",
  },
  {
    title: "Full Home Interior Cost",
    description: "Get a price estimate for your complete home interiors",
    image:
      "https://images.livspace-cdn.com/w:1080/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/1-2025-1736068988-NDPD1/jfm-1736069001-9OxTK/living-room-1736166426-6jNnL/lr-2m-1-1739858661-fXh6J.jpg",
    alt: "Full Home Interior",
  },
];

const service = [
  {
    img: <FourtyfiveIcon width={100} height={100} />,
    label: "Delivery in 45 days",
  },
  {
    img: <NohiddencostIcons width={100} height={100} />,
    label: "No hidden costs",
  },
  {
    img: <WarrantyIcon width={100} height={100} />,
    label: "F5at 10-year warranty",
  },
  { img: <FourtyfiveIcon width={100} height={100} />, label: "Easy EMIs" },
];

const DesignGallary = () => {
  return (
    <div>
        <HeroSection />

      <section className="border-b border-gray-200">
        <div className="relative flex flex-col items-center justify-center px-6 py-28 gap-10 text-center">
          <p className="absolute top-6 left-6 text-sm text-gray-400">
            Home <span>/</span>{" "}
            <span className="text-red-500">Design-Gallery</span>
          </p>

          <ScrollReveal>
            <p className="text-[#555] max-w-4xl leading-relaxed text-justify text-base md:text-lg">
              Looking for that magical mix of style and function in your home
              interior design? Our interior design experts craft spaces that spark
              delight in every moment. With smart solutions that stretch your
              space to wallet-friendly ideas that make real sense, our interior
              designers have what it takes to create the most extraordinary homes.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
              Popular Interior Designs for Every Room
            </h2>

            <p className="text-[#737373] max-w-xl leading-relaxed">
              Browse trending designs for kitchens, living rooms, and wardrobes.
              Get inspired by the latest styles and find the perfect look for your
              home.
            </p>
          </ScrollReveal>

          <div className="w-full mt-6">
            <ScrollReveal>
              <DesignSlider />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ScrollReveal>
        <ServiceSection title="Why HomeLane? Here's Why!" service={service} />
      </ScrollReveal>

      <section className="text-center bg-[#EDEAE5] py-24 px-4">
        <ScrollReveal>
          <h2 className="text-4xl mb-10 text-[#4A4A4A]">
            Get a Free, Instant Estimate for Your Home
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto">
          {estimateCards.map((card, index) => (
            <ScrollReveal key={index}>
              <div className="flex flex-col justify-between bg-white rounded-lg shadow overflow-hidden p-3">
                <img
                  className="w-full h-48 object-cover rounded-md"
                  src={card.image}
                  alt={card.alt}
                />
                <div className="text-left">
                  <h3 className="text-2xl font-medium text-gray-700 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <Link to="/get-estimate">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition">
                    Get Free Estimate
                  </button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <ScrollReveal>
        <DesignConsultationCarousel />
      </ScrollReveal>
      
      <ScrollReveal>
        <GoogleReview />
      </ScrollReveal>
    </div>
  );
};

export default DesignGallary;
