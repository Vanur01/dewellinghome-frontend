import DesignTabs from "./DesignTabs";
import HeroSection from "./Hero";
import ServiceSection from "./ServiceSection";
import { ScrollReveal } from "../../components/ScrollReveal";
import { Flat10YearWarranty,
  FourtyfiveIcon,
  NohiddencostIcons,
} from "../../utils/Icons";
import { useNavigate } from "react-router-dom";

const ModularKitchen = () => {
const navigate = useNavigate();
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
      img: <Flat10YearWarranty width={100} height={100} />,
      label: "F5at 10-year warranty",
    },
    { img: <FourtyfiveIcon width={100} height={100} />, label: "Easy EMIs" },
  ];

  const Materials = [{
    img: 'https://super.homelane.com/category-page/MK-Page-Images/hydroguard.webp',
    label: "Plywood",
  },
  {
    img: 'https://super.homelane.com/category-page/MK-Page-Images/plywood.webp',
    label: "MDF",
  },
  {
    img: 'https://super.homelane.com/category-page/MK-Page-Images/mdf.webp',
    label: "HDF-Hydroguard Plus",
  },]
  return (
    <div>
      <HeroSection />
      <ScrollReveal>
        <div className="relative flex justify-center items-center flex-col p-12 gap-6 text-center py-36 border-b border-gray-200 border-[.2rem]">
          <p className="absolute top-5 left-10 text-sm text-gray-400">
            Home <span>/</span>{" "}
            <span className="text-red-500">Modular Kitchen</span>
          </p>
          <p className="text-gray-500 max-w-5xl leading-7 text-lg">
            Looking for the perfect modular kitchen? HomeLane's modular kitchen
            designs combine stunning style with smart functionality. From
            minimalist elegance to entertainment-ready spaces, our customisable
            modular kitchen layouts make cooking a joy. With thoughtful storage
            and exquisite finishes, we'll craft your dream modular kitchen
            interiors to suit your every need. Explore our latest designs and find
            one tailored just for you!
          </p>
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <DesignTabs />
      </ScrollReveal>
      <ScrollReveal>
        <ServiceSection title="Why Choose a HomeLane Kitchen?" service={service}/>
      </ScrollReveal>
      <ScrollReveal>
        <section className="text-center bg-[#EDEAE5] py-24 px-4">
          <h2 className="text-4xl mb-10 text-[#4A4A4A]">
            Know Your Kitchen Cost Instantly
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 w-full max-w-5xl mx-auto rounded-lg shadow">
            <img
              className="w-full md:w-[70%] object-cover rounded-lg"
              src="https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/1-2025-1736068988-NDPD1/jfm-1736069001-9OxTK/kitchen-1736069015-B2aEs/ki-24-1-1742205308-oWEt9.jpg"
              alt="Kitchen"
            />
            <div className="text-left w-full md:px-8">
              <p className="text-[#4A4A4A] text-2xl mb-4">
                Get costing for your kitchen interiors.
              </p>
              <button onClick={()=>navigate('/kitchen-estimate')} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition">
                Get Free Estimate
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>
      <ScrollReveal>
        <section>
          <div className="flex flex-col items-center justify-center px-12 gap-6 py-20">
            <h2 className="text-4xl text-[#4A4A4A] text-center">
            What Goes Into a Modular Kitchen?
            </h2>
            <h1 className="text-4xl">Materials</h1>
            <p className="text-gray-500 max-w-5xl leading-7 text-lg text-center">
            The foundation of your modular kitchen begins with premium materials designed for durability and beauty. Imagine a space that handles daily cooking, splashes, and spills without losing its charm. From robust plywood and MDF to advanced options like Hydroguard Plus, we use high-quality materials to ensure your kitchen remains stunning and built to last, no matter what.
            </p>
            <div className="flex md:flex-row flex-col justify-center items-center gap-20 p-12">
              {Materials.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 p-6 border-b border-gray-200"
                >
                  <img className="object-cover md:h-full rounded-md" src={item.img} alt="" />
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};

export default ModularKitchen;
