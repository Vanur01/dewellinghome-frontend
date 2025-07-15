import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { partnerApi, Partner } from '../../utils/api';

const TrustedPartners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await partnerApi.getAllPartners();
        setPartners(response.data.data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const settings = {
    dots: partners.length > 1,
    infinite: partners.length > 1,
    slidesToShow: Math.min(5, partners.length),
    slidesToScroll: Math.min(5, partners.length),
    autoplay: partners.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, partners.length),
          slidesToScroll: Math.min(4, partners.length),
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, partners.length),
          slidesToScroll: Math.min(3, partners.length),
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(2, partners.length),
          slidesToScroll: Math.min(2, partners.length),
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="bg-white py-16 px-8 border-b-2 border-gray-100">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      </div>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-16 px-8 border-b-2 border-gray-100">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-8 md:mb-12">
        Our Trusted Partners
      </h2>
      <div className="relative">
        <Slider {...settings}>
          {partners.map((partner) => (
            <div key={partner._id} className="px-4">
              <div className="flex justify-center items-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-[150px] h-20 object-contain transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <style>
        {`
          .slick-dots {
            bottom: -40px;
          }
          .slick-dots li button:before {
            font-size: 12px;
            color: #666;
          }
          .slick-dots li.slick-active button:before {
            color: #333;
          }
        `}
      </style>
    </div>
  );
};

export default TrustedPartners;
