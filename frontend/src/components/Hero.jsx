import React from 'react';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/mock';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      {/* Background with overlay - subtle parallax */}
      <div 
        className="hero-background hero-parallax" 
        data-scroll 
        data-scroll-speed="-0.5"
      >
        <div className="hero-overlay"></div>
      </div>

      <div className="container relative z-10">
        <div className="hero-content animate-fadeIn">
          {/* Main Headline */}
          <h1 className="brand-display mb-6">
            We craft
            <br />
            bold brands
            <br />
            & speak
            <br />
            visuals
          </h1>

          {/* Tagline */}
          <p className="body-large mb-8 max-w-2xl">
            {siteConfig.tagline} for the makers, the dreamers, and the future leaders.
          </p>

          {/* Partnership Info */}
          <div className="mb-12">
            <p className="caption mb-2">In Partnership With</p>
            <p className="body-medium text-brand-primary font-semibold">
              TBU — The Business United
            </p>
            <p className="body-small">Strategy Partner</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="#contact"
              className="btn-primary flex items-center gap-2"
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
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {siteConfig.cta.secondary}
            </a>
          </div>

          {/* Value Proposition */}
          <div className="max-w-3xl">
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-brand-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-brand-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;