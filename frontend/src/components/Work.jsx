import React, { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';

const Work = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const data = await apiService.getCaseStudies(true); // Featured only
        setCaseStudies(data);
      } catch (err) {
        setError('Failed to load case studies');
        console.error('Error fetching case studies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  if (loading) {
    return (
      <section id="work" className="section-padding bg-bg-card">
        <div className="container">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            <p className="mt-4 body-medium">Loading case studies...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="work" className="section-padding bg-bg-card">
        <div className="container">
          <div className="text-center">
            <p className="body-medium text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="section-padding bg-bg-card">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-1 mb-6">
            Our Work
          </h2>
          <p className="body-large max-w-3xl mx-auto">
            Selected case studies showcasing our approach to brand development 
            and digital transformation
          </p>
        </div>

        {/* Featured Case Studies */}
        <div className="space-y-16 mb-16">
          {caseStudies.map((study, index) => (
            <div 
              key={study.id} 
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
              data-scroll
              data-scroll-speed={index % 2 === 0 ? "0.1" : "0.2"}
              data-scroll-direction={index % 2 === 0 ? undefined : "horizontal"}
            >
              {/* Case Study Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="mb-4">
                  <span className="caption text-brand-primary">{study.category}</span>
                </div>
                
                <h3 className="heading-2 mb-4">{study.title}</h3>
                <p className="body-large mb-6 text-brand-primary font-medium">
                  {study.subtitle}
                </p>

                {/* Challenge */}
                <div className="mb-6">
                  <h4 className="body-medium font-semibold mb-3 text-text-primary">Challenge:</h4>
                  <p className="body-small">{study.challenge}</p>
                </div>

                {/* Position */}
                <div className="mb-6">
                  <h4 className="body-medium font-semibold mb-3 text-text-primary">Position:</h4>
                  <p className="body-small">{study.position}</p>
                </div>

                {/* Key Moves */}
                <div className="mb-6">
                  <h4 className="body-medium font-semibold mb-3 text-text-primary">Key Identity Moves:</h4>
                  <ul className="space-y-2">
                    {study.identity.map((move, idx) => (
                      <li key={idx} className="body-small flex items-start gap-2">
                        <ArrowRight size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
                        <span>{move}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact */}
                <div className="mb-8">
                  <h4 className="body-medium font-semibold mb-3 text-text-primary">Observable Impact:</h4>
                  <ul className="space-y-2">
                    {study.impact.map((impact, idx) => (
                      <li key={idx} className="body-small flex items-start gap-2">
                        <ArrowRight size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* View Project Link */}
                <a
                  href={`#case-${study.id}`}
                  className="body-medium font-medium text-brand-primary hover:text-brand-hover transition-colors flex items-center gap-2 group"
                >
                  View Full Case Study
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Case Study Image */}
              <div className={`card overflow-hidden ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="aspect-[4/3] bg-bg-page flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="heading-3 text-text-inverse">{study.title.charAt(0)}</span>
                    </div>
                    <p className="body-medium text-text-secondary">
                      {study.title} Project Visual
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Concepts Section */}
        <div className="text-center">
          <h3 className="heading-3 mb-8">More Concepts</h3>
          
          {/* Concept Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div 
                key={item} 
                className="card aspect-square overflow-hidden group cursor-pointer"
                data-scroll
                data-scroll-speed={`0.${5 + (item * 2)}`} // Vary from 0.07 to 0.17
                data-scroll-direction={item % 3 === 0 ? "horizontal" : undefined}
              >
                <div className="w-full h-full bg-bg-page flex items-center justify-center group-hover:bg-border-medium transition-colors">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <span className="body-medium font-bold text-text-inverse">C{item}</span>
                    </div>
                    <p className="caption">Concept {item}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <p className="body-medium mb-6">
              Interested in seeing how we can transform your brand?
            </p>
            <a
              href="#contact"
              className="btn-primary inline-flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Discuss Your Project
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;