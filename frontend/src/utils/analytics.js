// Google Analytics 4 integration
import { apiService } from '../services/api';

class GoogleAnalytics {
  constructor() {
    this.initialized = false;
    this.measurementId = null;
    this.initializeGA();
  }

  async initializeGA() {
    try {
      // Try to get GA measurement ID from environment first, then backend config
      this.measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
      
      if (!this.measurementId) {
        try {
          const config = await apiService.getConfig();
          this.measurementId = config.ga_measurement_id;
        } catch (configError) {
          console.warn('Could not fetch backend config for GA ID:', configError.message);
        }
      }

      if (!this.measurementId) {
        console.warn('Google Analytics Measurement ID not configured in environment or backend');
        return;
      }

      // Load Google Analytics script
      this.loadGAScript();
      
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  loadGAScript() {
    // Create and append GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      // Privacy-friendly settings
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    this.initialized = true;
    console.log('Google Analytics initialized with ID:', this.measurementId);
  }

  // Track page views
  trackPageView(page_title, page_location) {
    if (!this.initialized || !window.gtag) return;

    window.gtag('config', this.measurementId, {
      page_title,
      page_location,
    });
  }

  // Track events
  trackEvent(action, category = 'engagement', label = null, value = null) {
    if (!this.initialized || !window.gtag) return;

    const eventData = {
      event_category: category,
      event_label: label,
      value: value
    };

    // Remove null values
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === null) {
        delete eventData[key];
      }
    });

    window.gtag('event', action, eventData);
  }

  // Track contact form submissions
  trackContactSubmission(method = 'form') {
    this.trackEvent('contact_submission', 'contact', method);
  }

  // Track CTA clicks
  trackCTAClick(cta_text, location = null) {
    this.trackEvent('cta_click', 'engagement', `${cta_text}${location ? ` - ${location}` : ''}`);
  }

  // Track navigation
  trackNavigation(destination) {
    this.trackEvent('navigation', 'engagement', destination);
  }

  // Track scroll depth
  trackScrollDepth(percent) {
    this.trackEvent('scroll_depth', 'engagement', `${percent}%`);
  }

  // Track file downloads
  trackDownload(file_name, file_type = null) {
    this.trackEvent('file_download', 'engagement', file_name);
  }

  // Track external link clicks
  trackExternalLink(url) {
    this.trackEvent('external_link_click', 'engagement', url);
  }

  // Track search
  trackSearch(search_term) {
    if (!this.initialized || !window.gtag) return;
    
    window.gtag('event', 'search', {
      search_term: search_term
    });
  }
}

// Create singleton instance
const analytics = new GoogleAnalytics();

// Export convenience functions
export const trackPageView = (title, location) => analytics.trackPageView(title, location);
export const trackEvent = (action, category, label, value) => analytics.trackEvent(action, category, label, value);
export const trackContactSubmission = (method) => analytics.trackContactSubmission(method);
export const trackCTAClick = (text, location) => analytics.trackCTAClick(text, location);
export const trackNavigation = (destination) => analytics.trackNavigation(destination);
export const trackScrollDepth = (percent) => analytics.trackScrollDepth(percent);
export const trackDownload = (fileName, fileType) => analytics.trackDownload(fileName, fileType);
export const trackExternalLink = (url) => analytics.trackExternalLink(url);
export const trackSearch = (term) => analytics.trackSearch(term);

export default analytics;