import HeroSection from "../../components/Hero";
import VideoSlider from "./VideoSlider";
import Why from "./Why";
import ImageSlider from "./ImageSlider";
import EstimateSection from "./EstimateSection";
import DesignSessionSteps from "./DesignSessionSteps";
import Steps from "./Steps";
import Reviews from "./Reviews";
import ReferSection from "../../components/Refersection";
import InteriorDesignServices from "./Services";
import InteriorSolutionsGrid from "./SolutionsGrid";
import {  ReferIcon } from "../../utils/Icons";
import { ScrollReveal } from "../../components/ScrollReveal";
import { useNavigate } from "react-router-dom";
import TrustedPartners from "./TrustedPartners";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <HeroSection
        imageUrl="https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/1-2025-1736068988-NDPD1/jfm-1736069001-9OxTK/living-room-1736166426-6jNnL/lr-22-1740834657-PIsi8.jpg"
        imageAlt="Modern Interior Design"
        headingLines={["Hassle-free interiors", "from start to finish"]}
      />

        <Why />
      <ScrollReveal>
        <VideoSlider />
      </ScrollReveal>
      <ScrollReveal>
        <ImageSlider />
      </ScrollReveal>
      <ScrollReveal>
        <EstimateSection />
      </ScrollReveal>
      <ScrollReveal>
        <DesignSessionSteps />
      </ScrollReveal>
      <ScrollReveal>
        <Steps />
      </ScrollReveal>
      <ScrollReveal>
        <Reviews />
      </ScrollReveal>
      <ScrollReveal>
        <ReferSection Icon={<ReferIcon width={300} height={300} />} onButtonClick={()=>navigate('/dashboard/refer&earn')}/>
      </ScrollReveal>
      <ScrollReveal>
        <InteriorSolutionsGrid />
      </ScrollReveal>
      <ScrollReveal>
        <InteriorDesignServices />
      </ScrollReveal>
      <TrustedPartners/>
    </div>
  );
};

export default Home;
