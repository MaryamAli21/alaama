import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Monitor, 
  Camera, 
  TrendingUp, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';

const iconComponents = {
  Palette,
  Monitor, 
  Camera,
  TrendingUp,
  BookOpen
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiService.getServices();
        setServices(data);
      } catch (err) {
        setError('Failed to load services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="section-padding bg-bg-page">
        <div className="container">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            <p className="mt-4 body-medium">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="section-padding bg-bg-page">
        <div className="container">
          <div className="text-center">
            <p className="body-medium text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section-padding bg-bg-page">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-1 mb-6">
            What We Do
          </h2>
          <p className="body-large max-w-3xl mx-auto">
            Overview of our services - from strategy to execution, 
            we handle every aspect of brand and digital development
          </p>
        </div>

        {/* Section divider with counter-motion */}
        <div 
          className="w-full h-px bg-gradient-to-r from-transparent via-border-medium to-transparent mb-12"
          data-scroll 
          data-scroll-speed="-0.05"
          aria-hidden="true"
        ></div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = iconComponents[service.icon];
            
            // Alternate horizontal and vertical motion for variety
            const isEven = index % 2 === 0;
            const scrollDirection = isEven ? "horizontal" : undefined;
            const scrollSpeed = isEven ? "0.15" : "0.12";
            
            return (
              <article 
                key={service.id} 
                className="card p-8 group hover:transform hover:scale-105 transition-all duration-300"
                data-scroll
                data-scroll-direction={scrollDirection}
                data-scroll-speed={scrollSpeed}
              >
                {/* Service Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mb-4">
                    <IconComponent size={32} className="text-text-inverse" />
                  </div>
                </div>

                {/* Service Content */}
                <h3 className="heading-4 mb-2">{service.title}</h3>
                <p className="caption mb-4 text-text-secondary">{service.subtitle}</p>
                <p className="body-small mb-6">{service.description}</p>

                {/* Outcomes List */}
                <div className="mb-6">
                  <h4 className="body-medium font-semibold mb-3 text-text-primary">Key Outcomes:</h4>
                  <ul className="space-y-2">
                    {service.outcomes.map((outcome, index) => (
                      <li key={index} className="body-small flex items-start gap-2">
                        <ArrowRight size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learn More Link */}
                <div className="mt-auto">
                  <a
                    href="#contact"
                    className="body-small font-medium text-brand-primary hover:text-brand-hover transition-colors flex items-center gap-2 group"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Learn More
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA with subtle horizontal drift */}
        <div 
          className="text-center"
          data-scroll
          data-scroll-direction="horizontal"
          data-scroll-speed="0.08"
        >
          <p className="body-medium mb-6">
            Ready to transform your brand? Let's discuss your project.
          </p>
          <a
            href="#contact"
            className="btn-primary inline-flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Your Project
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;