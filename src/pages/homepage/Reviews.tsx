import React from 'react';
import Slider from 'react-slick';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Reviews.css';

interface Review {
  id: number;
  customerNames: string;
  location: string;
  review: string;
  image: string;
}

interface ArrowProps {
  onClick?: () => void;
}

const reviews: Review[] = [
  {
    id: 1,
    customerNames: 'Avinash & Anshu',
    location: 'Orchid Blues, Ahmedabad',
    review: 'HomeLane understood in detail the requirements of the family and involved them in every step of the process. Avinash & Anshu were happy about the quality materials that HomeLane provided that too at a fair price.',
    image: 'https://super.homelane.com/testimonial/testimonials-3_chennai4%20(1)-172361603050372a6b0a5fcbd.jpg',
  },
  {
    id: 2,
    customerNames: 'Abhishek & Sradha',
    location: 'Elite Golf Greens, Noida',
    review: 'HomeLane created a home for Abhishek & Sradha that\'s a reflection of themselves and a reflection of their journey so far together. The promise of 45-day delivery and the superior aesthetics that matched their style were two things that attracted them to HomeLane.',
    image: 'https://super.homelane.com/testimonial/testimonials_13-171594642478481694326e2d3.jpg',
  },
  {
    id: 3,
    customerNames: 'Atul & Arti',
    location: 'Riddhi Siddhi Heights, Mumbai',
    review: 'Atul & Arti were elated to see that they got the house exactly the way they wanted and the way it was promised to them by HomeLane. The HomeLane team kept every family member in mind during the whole process and delivered on their requirements within 45 days.',
    image: 'https://super.homelane.com/testimonial/testimonials_14-1715946354607a98b329634c9.jpg',
  },
];

const Reviews: React.FC = () => {
  const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
    return (
      <button
        className="custom-arrow prev-arrow shadow-md"
        onClick={onClick}
        aria-label="Previous slide"
      >
        <ArrowLeft size={20} />
      </button>
    );
  };

  const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => {
    return (
      <button
        className="custom-arrow next-arrow shadow-md"
        onClick={onClick}
        aria-label="Next slide"
      >
        <ArrowRight size={20} />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-16">
        Topi Nahi Pehenaya. Bas Ghar Sajaya.
        </h2>
        
        <div className="relative">
          <Slider {...settings} className="reviews-slider">
            {reviews.map((review) => (
              <div key={review.id} className="px-3 h-full">
                <div className="overflow-hidden h-full flex flex-col">
                  <div className="aspect-w-16 aspect-h-9 flex-shrink-0">
                    <img
                      src={review.image}
                      alt={review.customerNames}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow flex flex-col py-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {review.customerNames}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {review.location}
                    </p>
                    <p className="text-sm leading-relaxed flex-grow">
                      "{review.review}""
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
