import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTestimonialsStore } from '../../store/public/Testimonials.store';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Reviews.css';

interface ArrowProps {
  onClick?: () => void;
}

const Reviews: React.FC = () => {
  const { testimonials, loading, fetchPublishedTestimonials } = useTestimonialsStore();

  useEffect(() => {
    fetchPublishedTestimonials();
  }, [fetchPublishedTestimonials]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-16">
          Topi Nahi Pehenaya. Bas Ghar Sajaya.
        </h2>
        
        <div className="relative">
          <Slider {...settings} className="reviews-slider">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="px-3 h-full">
                <div className="overflow-hidden h-full flex flex-col">
                  <div className="aspect-w-16 aspect-h-9 flex-shrink-0">
                    <img
                      src={testimonial.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={testimonial.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow flex flex-col py-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {testimonial.address || 'Happy Customer'}
                    </p>
                    <p className="text-sm leading-relaxed flex-grow">
                      "{testimonial.feedback}"
                    </p>
                    {testimonial.youtubeLink && (
                      <a
                        href={testimonial.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Watch Video Review
                      </a>
                    )}
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
