import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface VideoData {
  id: number;
  url: string;
  title: string;
  description: string;
}

interface ArrowProps {
  onClick?: () => void;
}

const videos: VideoData[] = [
  {
    id: 1,
    url: 'https://www.youtube.com/embed/OzUkvzyBttA',
    title: 'Modern Living Room Design',
    description: 'Explore contemporary living room interior design ideas.'
  },
  {
    id: 2,
    url: 'https://www.youtube.com/embed/gxMUrIh5FtI?si=_hbF4JVBogkGgZqB',
    title: 'Elegant Kitchen Interior',
    description: 'Discover beautiful kitchen design concepts and layouts.'
  },
];

const NextArrow = (props: ArrowProps) => {
  const { onClick } = props;
  return (
    <button
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white mr-9"
      onClick={onClick}
    >
     <ArrowRight size={20}/>
    </button>
  );
};

const PrevArrow = (props: ArrowProps) => {
  const { onClick } = props;
  return (
    <button
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-10 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white ml-9"
      onClick={onClick}
    >
      <ArrowLeft size={20}/>
    </button>
  );
};

const VideoSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="video-slider-section">
      <div className="w-full py-8 px-4 md:px-10">
        <Slider {...settings}>
          {videos.map((video) => (
            <div key={video.id} className="px-4">
              <div className="flex flex-col">
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <div className="text-start px-2">
                    <h2 className="text-lg md:text-3xl mb-2">{video.title}</h2>
                  </div>
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-[85vh] rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default VideoSlider;
