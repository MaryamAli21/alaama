import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
    
    // If user declines, we should disable analytics
    // This would require more complex implementation to actually disable GA
    console.log('User declined cookies - analytics should be disabled');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fadeIn">
      <div className="bg-bg-card border-t border-border-medium backdrop-blur-sm">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1">
                <Cookie size={24} className="text-brand-primary" />
              </div>
              <div className="flex-1">
                <h3 className="body-medium font-semibold text-text-primary mb-2">
                  We use cookies to enhance your experience
                </h3>
                <p className="body-small text-text-secondary">
                  We use cookies and similar technologies to understand how you use our website 
                  and to improve your experience. This includes analytics cookies that help us 
                  analyze site traffic and usage patterns. You can manage your preferences at any time.
                </p>
                <button 
                  className="body-small text-brand-primary hover:text-brand-hover transition-colors mt-2 underline"
                  onClick={() => {
                    // This could open a detailed privacy policy
                    window.open('/privacy-policy', '_blank');
                  }}
                >
                  Learn more about our privacy policy
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleDecline}
                className="btn-secondary text-sm px-6 py-2"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="btn-primary text-sm px-6 py-2"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Close cookie banner"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;