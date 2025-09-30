import React, { useState, useEffect } from 'react';
import { Send, Mail, Instagram, Globe, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    honeypot: '' // Hidden field for spam protection
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [config, setConfig] = useState({
    contact_email: 'info@alaama.co',
    instagram: '@alaama.bh',
    website: 'www.alaama.co',
    calendly_link: null
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await apiService.getConfig();
        setConfig(data);
      } catch (err) {
        console.error('Failed to fetch config:', err);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await apiService.submitContact({
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        message: formData.message,
        honeypot: formData.honeypot // Should be empty for legitimate submissions
      });
      
      if (response.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', message: '', honeypot: '' });
      } else {
        setSubmitStatus('error');
      }
      
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoLink = `mailto:${config.contact_email}?subject=Project Inquiry&body=Hello Alaama Creative Studio, I'd like to discuss a project...`;

  return (
    <section id="contact" className="section-padding bg-bg-card">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-1 mb-6">
            Let's Create Together
          </h2>
          <p className="body-large max-w-3xl mx-auto">
            Ready to transform your brand? Get in touch to discuss your project 
            and book a discovery call.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h3 className="heading-3 mb-8">Send us a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="body-small font-medium text-text-primary block mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="body-small font-medium text-text-primary block mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="body-small font-medium text-text-primary block mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-4 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="message" className="body-small font-medium text-text-primary block mb-2">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full p-4 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors resize-vertical"
                  placeholder="Tell us about your project, goals, and timeline..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-text-inverse border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>

                {/* Backup mailto link */}
                <a
                  href={mailtoLink}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  Or Email Directly
                  <Mail size={16} />
                </a>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-900 border border-green-700 rounded-lg">
                  <p className="body-small text-green-100">
                    Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
                  <p className="body-small text-red-100">
                    Sorry, there was an error sending your message. Please try the direct email link above.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information & Meeting Scheduler */}
          <div className="space-y-12">
            {/* Meeting Scheduler */}
            <div>
              <h3 className="heading-3 mb-6">Book a Discovery Call</h3>
              <p className="body-medium mb-6">
                Skip the back-and-forth emails and schedule a 30-minute discovery call 
                to discuss your project in detail.
              </p>
              
              {/* Calendly Placeholder - will be replaced with actual integration */}
              <div className="card p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto">
                    <ArrowRight size={32} className="text-text-inverse" />
                  </div>
                </div>
                <h4 className="heading-4 mb-4">Schedule Your Call</h4>
                <p className="body-small mb-6 text-text-secondary">
                  30-minute discovery session to understand your goals and how we can help.
                </p>
                {config.calendly_link ? (
                  <a
                    href={config.calendly_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Book Now
                  </a>
                ) : (
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      alert('Calendly integration coming soon! Please use the contact form or email for now.');
                    }}
                  >
                    Book Now (Coming Soon)
                  </button>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="heading-3 mb-6">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-border-medium rounded-lg flex items-center justify-center">
                    <Mail size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="body-small font-medium text-text-primary">Email</p>
                    <a 
                      href={`mailto:${config.contact_email}`}
                      className="body-small text-brand-primary hover:text-brand-hover transition-colors"
                    >
                      {config.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-border-medium rounded-lg flex items-center justify-center">
                    <Instagram size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="body-small font-medium text-text-primary">Instagram</p>
                    <a 
                      href={`https://instagram.com/${config.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-small text-brand-primary hover:text-brand-hover transition-colors"
                    >
                      {config.instagram}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-border-medium rounded-lg flex items-center justify-center">
                    <Globe size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="body-small font-medium text-text-primary">Website</p>
                    <a 
                      href={`https://${config.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-small text-brand-primary hover:text-brand-hover transition-colors"
                    >
                      {config.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;