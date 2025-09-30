import React, { useState, useEffect } from 'react';
import { Mail, Instagram, Globe } from 'lucide-react';
import { apiService } from '../services/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [config, setConfig] = useState({
    contact_email: 'info@alaama.co',
    instagram: '@alaama.bh',
    website: 'www.alaama.co'
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

  return (
    <footer className="bg-bg-page border-t border-border-medium">
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="brand-display text-2xl mb-2">ALAAMA</h3>
              <p className="caption text-text-secondary">Creative Studio</p>
            </div>
            <p className="body-medium max-w-md mb-6">
              {siteConfig.description}
            </p>
            <div className="flex gap-4">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="w-12 h-12 bg-border-medium rounded-lg flex items-center justify-center hover:bg-brand-primary transition-colors group"
                aria-label="Email us"
              >
                <Mail size={20} className="text-brand-primary group-hover:text-text-inverse transition-colors" />
              </a>
              <a
                href={`https://instagram.com/${siteConfig.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-border-medium rounded-lg flex items-center justify-center hover:bg-brand-primary transition-colors group"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} className="text-brand-primary group-hover:text-text-inverse transition-colors" />
              </a>
              <a
                href={`https://${siteConfig.contact.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-border-medium rounded-lg flex items-center justify-center hover:bg-brand-primary transition-colors group"
                aria-label="Visit our website"
              >
                <Globe size={20} className="text-brand-primary group-hover:text-text-inverse transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="heading-4 mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Services', href: '#services' },
                { label: 'Work', href: '#work' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block body-small text-text-secondary hover:text-brand-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="heading-4 mb-6">Services</h4>
            <nav className="space-y-3">
              {[
                'Brand Strategy & Identity',
                'Digital Experience',
                'Content Systems',
                'Go-to-Market & Growth',
                'Training & Handover'
              ].map((service) => (
                <a
                  key={service}
                  href="#services"
                  className="block body-small text-text-secondary hover:text-brand-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {service}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Partnership Section */}
        <div className="py-8 border-t border-border-medium">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="body-small text-text-secondary mb-1">In Partnership With</p>
              <p className="body-medium text-brand-primary font-semibold">TBU — The Business United</p>
              <p className="caption text-text-muted">Strategy Partner</p>
            </div>
            <div className="text-center md:text-right">
              <a
                href="#contact"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {siteConfig.cta.primary}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border-medium">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <p className="caption">
                © {currentYear} Alaama Creative Studio. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#privacy" className="caption hover:text-brand-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#terms" className="caption hover:text-brand-primary transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="caption">Made with</span>
              <span className="text-brand-primary">💚</span>
              <span className="caption">by Alaama</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;