import React from 'react';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/mock';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      {/* Background with ultra-low vertical parallax */}
      <div 
        className="hero-background hero-parallax" 
        data-scroll 
        data-scroll-speed="0.1"
      >
        <div className="hero-overlay"></div>
      </div>

      {/* Decorative elements with counter-motion */}
      <div 
        className="absolute top-20 right-20 w-32 h-32 opacity-10"
        data-scroll 
        data-scroll-speed="-0.05"
        aria-hidden="true"
      >
        <div className="w-full h-full border-2 border-brand-primary rounded-full"></div>
      </div>

      <div 
        className="absolute bottom-40 left-10 w-16 h-16 opacity-20"
        data-scroll 
        data-scroll-speed="-0.08"
        data-scroll-direction="horizontal"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-brand-primary rounded-lg transform rotate-45"></div>
      </div>

      <div className="container relative z-10">
        <div className="hero-content">
          {/* Main Headline with subtle reveal */}
          <h1 
            className="brand-display mb-6"
            data-scroll
            data-scroll-speed="0.05"
          >
            We craft
            <br />
            bold brands
            <br />
            & speak
            <br />
            visuals
          </h1>

          {/* Tagline with horizontal drift */}
          <p 
            className="body-large mb-8 max-w-2xl"
            data-scroll
            data-scroll-direction="horizontal"
            data-scroll-speed="0.12"
          >
            {siteConfig.tagline} for the makers, the dreamers, and the future leaders.
          </p>

          {/* Partnership Info with counter-motion */}
          <div 
            className="mb-12"
            data-scroll
            data-scroll-speed="-0.03"
          >
            <p className="caption mb-2">In Partnership With</p>
            <p className="body-medium text-brand-primary font-semibold">
              TBU — The Business United
            </p>
            <p className="body-small">Strategy Partner</p>
          </div>

          {/* CTA Buttons with staggered reveal */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="#contact"
              className="btn-primary flex items-center gap-2"
              data-scroll
              data-scroll-speed="0.08"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {siteConfig.cta.primary}
              <ArrowRight size={16} />
            </a>
            <a
              href="#work"
              className="btn-secondary"
              data-scroll
              data-scroll-speed="0.15"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {siteConfig.cta.secondary}
            </a>
          </div>

          {/* Value Proposition with horizontal drift */}
          <div 
            className="max-w-3xl"
            data-scroll
            data-scroll-direction="horizontal"
            data-scroll-speed="0.06"
          >
            <p className="body-medium mb-4 text-text-primary font-medium">
              We specialize in transforming ideas into visually compelling solutions
            </p>
            <p className="body-small">
              From design to code — and everything in between — we don't just create.
              We are a strategy-led brand and digital studio.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with counter-motion */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        data-scroll
        data-scroll-speed="-0.1"
      >
        <div className="w-6 h-10 border-2 border-brand-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-brand-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;