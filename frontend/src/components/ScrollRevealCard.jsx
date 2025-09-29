import React, { forwardRef } from 'react';

// Wrapper component for scroll reveal effects
const ScrollRevealCard = forwardRef(({ 
  children, 
  className = "", 
  speed = 0, 
  delay = 0,
  direction = "up",
  ...props 
}, ref) => {
  // Calculate transform based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(30px)';
      case 'down':
        return 'translateY(-30px)';
      case 'left':
        return 'translateX(30px)';
      case 'right':
        return 'translateX(-30px)';
      default:
        return 'translateY(30px)';
    }
  };

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className}`}
      data-scroll
      data-scroll-speed={speed}
      data-scroll-delay={delay}
      style={{
        transform: getInitialTransform(),
        opacity: 0,
        transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

ScrollRevealCard.displayName = 'ScrollRevealCard';

export default ScrollRevealCard;