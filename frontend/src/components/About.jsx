import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { missionValues, partnership, clientTypes, targetAudience } from '../data/mock';

const About = () => {
  return (
    <section id="about" className="section-padding bg-bg-page">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-1 mb-6">
            About Us
          </h2>
          <p className="body-large max-w-3xl mx-auto">
            We are a strategy-led brand and digital studio, partnered with TBU 
            for market, strategy, and growth.
          </p>
        </div>

        {/* Partnership Section */}
        <div className="mb-20">
          <div className="card p-12">
            <div className="text-center mb-12">
              <h3 className="heading-2 mb-6">{partnership.title}</h3>
              <p className="body-large max-w-3xl mx-auto">{partnership.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnership.benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} className="text-text-inverse" />
                  </div>
                  <p className="body-small font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="heading-2 mb-6">Mission & Values</h3>
            <p className="body-medium max-w-4xl mx-auto">{missionValues.mission}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {missionValues.goals.map((goal, index) => (
              <div key={index} className="card p-8">
                <h4 className="heading-4 mb-4 text-brand-primary">{goal.title}</h4>
                <p className="body-small">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Client Types */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="heading-2 mb-6">{clientTypes.title}</h3>
            <p className="body-medium max-w-4xl mx-auto mb-8">{clientTypes.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientTypes.characteristics.map((characteristic, index) => (
              <div key={index} className="card p-8 text-center">
                <h4 className="heading-4 mb-4">{characteristic.title}</h4>
                <p className="body-small">{characteristic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Who We're Speaking To */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="heading-2 mb-6">Who We're Speaking To</h3>
            <p className="body-medium max-w-3xl mx-auto">
              We work with visionary leaders across different roles and industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudience.map((audience, index) => (
              <div key={index} className="card p-6 group hover:bg-border-medium transition-colors">
                <h4 className="body-medium font-semibold mb-2 text-brand-primary group-hover:text-text-primary transition-colors">
                  {audience.title}
                </h4>
                <p className="body-small mb-2 font-medium">{audience.subtitle}</p>
                <p className="caption">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="body-medium mb-6">
            Ready to partner with us? Let's create something extraordinary together.
          </p>
          <a
            href="#contact"
            className="btn-primary inline-flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Our Partnership
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;