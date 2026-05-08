import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTestimonialsStore } from "../../store/public/Testimonials.store";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Reviews.css";

const Reviews: React.FC = () => {
  const { testimonials, loading, fetchPublishedTestimonials } =
    useTestimonialsStore();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    fetchPublishedTestimonials();
  }, [fetchPublishedTestimonials]);

  const getYoutubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? match[1] : null;
  };

  const getYoutubeThumbnail = (url: string): string | null => {
    const id = getYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  };

  const published = testimonials.filter((t) => t.showOnWebsite);
  const slidesToShow = Math.min(published.length, 4);
  const showArrows = published.length > slidesToShow;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: Math.min(published.length, 4) },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(published.length, 3) },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(published.length, 2) },
      },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (published.length === 0) return null;

  // Single testimonial — show centered card without slider
  if (published.length === 1) {
    const t = published[0];
    const ytThumb = t.youtubeLink ? getYoutubeThumbnail(t.youtubeLink) : null;
    const thumbnail = ytThumb || t.image || null;
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Topi Nahi Pehenaya. Bas Ghar Sajaya.
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              Unke ghar, unki khushi, unki kahani — seedha unhi ki zubaan se.
            </p>
          </div>
          <div className="flex justify-center">
            <div
              className="hl-slide-wrapper"
              style={{ width: "100%", maxWidth: "1000px" }}
            >
              <div className="hl-slide-container">
                <div
                  className="hl-card"
                  onClick={() => t.youtubeLink && setActiveVideo(t.youtubeLink)}
                >
                  {thumbnail ? (
                    <img src={thumbnail} alt={t.name} className="hl-card-img" />
                  ) : (
                    <div className="hl-card-img hl-card-no-img">
                      <span>{t.name[0]}</span>
                    </div>
                  )}
                  <div className="hl-overlay" />
                  {t.youtubeLink && (
                    <div className="hl-play-btn">
                      <svg
                        fill="white"
                        viewBox="0 0 24 24"
                        width="28"
                        height="28"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="hl-name-bar">
                    <p className="hl-name">{t.name}</p>
                  </div>
                </div>

                {/* Info below video inside white container */}
                <div className="hl-card-info">
                  <div className="hl-card-quote-wrap">
                    {t.feedback && (
                      <p className="hl-card-quote">"{t.feedback}"</p>
                    )}
                  </div>
                  <p className="hl-card-customer">{t.name}</p>
                  {t.address && <p className="hl-card-address">{t.address}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-3xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
                aria-label="Close"
              >
                <X size={28} />
              </button>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo)}?autoplay=1`}
                  title="Customer Testimonial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Topi Nahi Pehenaya. Bas Ghar Sajaya.
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Unke ghar, unki khushi, unki kahani — seedha unhi ki zubaan se.
          </p>
        </div>

        {/* Slider + Manual Arrows wrapper */}
        <div className="hl-slider-outer">
          {/* LEFT ARROW — only when more cards than visible */}
          {showArrows && (
            <button
              className="hl-ext-arrow hl-ext-prev"
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Slider */}
          <div className="hl-slider-inner">
            <Slider
              ref={sliderRef}
              {...settings}
              className="hl-testimonial-slider"
            >
              {published.map((testimonial) => {
                const ytThumb = testimonial.youtubeLink
                  ? getYoutubeThumbnail(testimonial.youtubeLink)
                  : null;
                const thumbnail = ytThumb || testimonial.image || null;

                return (
                  <div key={testimonial._id} className="hl-slide-wrapper">
                    <div className="hl-slide-container">
                      <div
                        className="hl-card"
                        onClick={() =>
                          testimonial.youtubeLink &&
                          setActiveVideo(testimonial.youtubeLink)
                        }
                      >
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={testimonial.name}
                            className="hl-card-img"
                          />
                        ) : (
                          <div className="hl-card-img hl-card-no-img">
                            <span>{testimonial.name[0]}</span>
                          </div>
                        )}

                        <div className="hl-overlay" />

                        {testimonial.youtubeLink && (
                          <div className="hl-play-btn">
                            <svg
                              fill="white"
                              viewBox="0 0 24 24"
                              width="28"
                              height="28"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}

                        <div className="hl-name-bar">
                          <p className="hl-name">{testimonial.name}</p>
                        </div>
                      </div>

                      {/* Info below video inside white container */}
                      <div className="hl-card-info">
                        <div className="hl-card-quote-wrap">
                          {testimonial.feedback && (
                            <p className="hl-card-quote">
                              "{testimonial.feedback}"
                            </p>
                          )}
                        </div>
                        <p className="hl-card-customer">{testimonial.name}</p>
                        {testimonial.address && (
                          <p className="hl-card-address">
                            {testimonial.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>

          {/* RIGHT ARROW — only when more cards than visible */}
          {showArrows && (
            <button
              className="hl-ext-arrow hl-ext-next"
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* YouTube Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo)}?autoplay=1`}
                title="Customer Testimonial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
