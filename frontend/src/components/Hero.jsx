import React from 'react';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/mock';
import { scrollToSection } from '../utils/navigation';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      {/* Background with ultra-low vertical parallax */}
      <div 
        className="hero-background hero-parallax" 
        data-scroll 
        data-scroll-speed="0.1"
        style={{
          backgroundImage: 'url(/images/hero-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[80vh]">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-8">
            {/* Main Headline - 2 words per line */}
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-none mb-6"
              style={{ color: '#ff3131' }}
              data-scroll
              data-scroll-speed="0.05"
            >
              Creative <span className="text-white">&</span>
              <br />
              Bold Brands
              <br />
              That Speak
              <br />
              <span className="text-white">Visuals</span>
            </h1>

            {/* Tagline - One line, readable */}
            <p 
              className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl leading-relaxed"
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="0.12"
            >
              Strategy-led brand and digital studio crafting memorable experiences for ambitious businesses.
            </p>

            {/* CTA Buttons - Fixed styling */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                className="bg-brand-primary hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-base whitespace-nowrap"
                data-scroll
                data-scroll-speed="0.08"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
              >
                Book Discovery Call
                <ArrowRight size={18} />
              </button>
              <button
                className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 text-base whitespace-nowrap"
                data-scroll
                data-scroll-speed="0.15"
                onClick={() => scrollToSection('#work')}
              >
                See Our Work
              </button>
            </div>

            {/* Partnership Info - Compact */}
            <div 
              className="text-sm text-gray-400"
              data-scroll
              data-scroll-speed="-0.03"
            >
              <span className="text-gray-500">In Partnership With</span> 
              <span className="text-brand-primary font-semibold ml-2">TBU — The Business United</span>
            </div>
          </div>

          {/* Right Side - Supporting Content */}
          <div className="lg:col-span-4 lg:pl-8 lg:pt-4">
            <div 
              className="space-y-6 lg:mt-0 mt-8"
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="0.06"
            >
              {/* Key Points */}
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
                <h3 className="text-brand-primary font-semibold mb-3 text-lg">What We Do</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Brand Strategy & Identity</li>
                  <li>• Digital Experience Design</li>
                  <li>• Content Systems</li>
                  <li>• Go-to-Market Strategy</li>
                </ul>
              </div>

              {/* Stats or Highlights */}
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
                <h3 className="text-brand-primary font-semibold mb-3 text-lg">Our Approach</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We don't just design — we craft strategic solutions that connect, convert, and scale your business.
                </p>
              </div>
            </div>
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