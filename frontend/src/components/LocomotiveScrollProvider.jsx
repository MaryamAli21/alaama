import React, { useEffect, useRef, useState, createContext, useContext } from 'react';

// Create context for scroll instance
const ScrollContext = createContext(null);

export const useLocomotiveScroll = () => {
  const scroll = useContext(ScrollContext);
  return scroll;
};

// Check if we should disable scroll effects
const shouldDisableScroll = () => {
  // Disable on mobile devices (< 768px)
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return true;
  }
  
  // Respect prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }
  
  return false;
};

const LocomotiveScrollProvider = ({ children }) => {
  const scrollRef = useRef(null);
  const locomotiveScrollRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let scroll = null;

    const initializeScroll = async () => {
      // Only initialize if not disabled
      if (shouldDisableScroll()) {
        setIsReady(true);
        return;
      }

      try {
        // Dynamic import for SSR safety
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        
        if (scrollRef.current) {
          scroll = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            multiplier: 1,
            class: 'is-inview',
            scrollbarContainer: false,
            // Ultra-subtle parallax settings
            useKeyboard: true,
            direction: 'vertical',
            gestureDirection: 'vertical',
            // Lerp for ultra-smooth transitions with low speeds
            lerp: 0.1,
            // Enhanced settings for ultra-low speeds
            offset: ['30%', 0],
            repeat: false,
            tablet: {
              smooth: false, // Disable smooth scrolling on tablet for performance
            },
            smartphone: {
              smooth: false, // Disable smooth scrolling on smartphone
            }
          });

          locomotiveScrollRef.current = scroll;

          // Update scroll on route changes or dynamic content
          scroll.on('scroll', () => {
            // Handle scroll events if needed
          });

          scroll.update();
          setIsReady(true);
        }
      } catch (error) {
        console.warn('Locomotive Scroll failed to initialize:', error);
        setIsReady(true); // Still set ready to render content
      }
    };

    // Initialize after component mount
    const timer = setTimeout(initializeScroll, 100);

    return () => {
      clearTimeout(timer);
      if (scroll) {
        scroll.destroy();
      }
    };
  }, []);

  // Update scroll when content changes
  useEffect(() => {
    if (locomotiveScrollRef.current && isReady) {
      const timer = setTimeout(() => {
        locomotiveScrollRef.current.update();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <ScrollContext.Provider value={locomotiveScrollRef.current}>
      <div 
        ref={scrollRef}
        data-scroll-container
        className={`locomotive-scroll-container ${!isReady ? 'opacity-0' : 'opacity-100'}`}
        style={{
          transition: 'opacity 0.3s ease',
        }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

export default LocomotiveScrollProvider;