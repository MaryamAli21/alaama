import React, { useEffect } from 'react';
import './App.css';
import './styles/locomotive-scroll.css';
import LocomotiveScrollProvider from './components/LocomotiveScrollProvider';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Work from './components/Work';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import { trackPageView } from './utils/analytics';

function App() {
  useEffect(() => {
    // Track initial page view
    trackPageView(document.title, window.location.href);
    
    // Track page title changes for SPA navigation
    const observer = new MutationObserver(() => {
      trackPageView(document.title, window.location.href);
    });
    
    observer.observe(document.querySelector('title'), {
      childList: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      {/* Fixed header outside scroll container */}
      <Header />
      
      {/* Main content wrapped in locomotive scroll */}
      <LocomotiveScrollProvider>
        <main id="main-content">
          <Hero />
          <Services />
          <Work />
          <About />
          <Contact />
        </main>
        <Footer />
      </LocomotiveScrollProvider>
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

export default App;