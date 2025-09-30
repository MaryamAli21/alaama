import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminApp from './components/admin/AdminApp';
import { trackPageView } from './utils/analytics';

// Public website component
const PublicSite = () => {
  return (
    <>
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
    </>
  );
};

function App() {
  useEffect(() => {
    // Track initial page view
    trackPageView(document.title, window.location.href);
    
    // Track page title changes for SPA navigation
    const observer = new MutationObserver(() => {
      trackPageView(document.title, window.location.href);
    });
    
    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, {
        childList: true
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminApp />} />
          
          {/* Public site */}
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;