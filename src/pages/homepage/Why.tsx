'use client';

import { useReducedMotion } from 'framer-motion';
import { MapPin, Home, Store, Shield, CreditCard, Banknote, Clock3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: <Shield strokeWidth={1} width={64} height={64} className="text-red-500" />,
    title: 'Flat 10 Year Warranty',
    subtitle: '',
  },
  {
    icon: <CreditCard strokeWidth={1} width={64} height={64} className="text-red-500" />,
    title: 'No Hidden Costs',
    subtitle: '',
  },
  {
    icon: <MapPin strokeWidth={1} width={64} height={64} className="text-red-500" />,
    title: '25+ Cities',
    subtitle: '',
  },
  {
    icon: <Home strokeWidth={1} width={64} height={64} className="text-red-500" />,
    title: '45,000+',
    subtitle: 'Home Deliveries',
  },
  {
    icon: <Store strokeWidth={1} width={64} height={64} className="text-red-500" />,
    title: '45+',
    subtitle: 'Studios',
  },
  {
    icon: <Banknote strokeWidth={1} width={64} height={64} className="text-red-500" />,
    title: 'Easy EMIs',
    subtitle: '',
  },
  {
    icon: <Clock3 strokeWidth={1} width={64} height={64} className="text-red-500" />,
    title: 'Delivery in 45 Days',
    subtitle: 'or we pay the rent*',
  },
];


const Why = () => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Track animation instance
  const animationRef = useRef(null);

  useEffect(() => {
    // Get the container width once it's mounted
    if (containerRef.current) {
      const width = containerRef.current.scrollWidth;
      // We need half the width since we're duplicating the items
      const itemsWidth = width / 2;
      setContainerWidth(itemsWidth);
    }
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || containerWidth === 0) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // For a seamless loop, we need to go from 0 to -containerWidth
    // (negative value to move from right to left)
    const animation = container.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${containerWidth}px)` }
      ], 
      {
        duration: 20000,
        iterations: Infinity,  // Run forever
        easing: 'linear'      // Constant speed
      }
    );
    
    // Store animation reference
    animationRef.current = animation;
    
    // Initial state - play or pause based on hover state
    if (isHovered) {
      animation.pause();
    } else {
      animation.play();
    }
    
    return () => {
      if (animation) {
        animation.cancel();
      }
    };
  }, [containerWidth, shouldReduceMotion]);
  
  // Handle hover state changes
  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;
    
    if (isHovered) {
      animation.pause();
    } else {
      animation.play();
    }
  }, [isHovered]);

  return (
    <section className="py-8 md:py-16 text-center overflow-hidden min-h-[50vh]">
      <h2 className="text-xl md:text-3xl font-medium text-gray-800 mb-6 md:mb-24">
        Why Choose Us
      </h2>
      <div className="relative w-full overflow-hidden">
        <div 
          className="flex"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={containerRef}
            className="flex gap-8 px-4 md:px-8"
          >
            {/* Double the features for seamless looping */}
            {[...features, ...features].map((feature, index) => (
              <div
                key={index}
                className="min-w-[180px] md:min-w-[200px] flex flex-col items-center space-y-2 md:space-y-3"
              >
                <div className="mb-2">{feature.icon}</div>
                <div className="text-lg font-semibold text-gray-800">{feature.title}</div>
                {feature.subtitle && (
                  <div className="text-sm text-gray-600">{feature.subtitle}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;