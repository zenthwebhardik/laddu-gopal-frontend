import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import LavaCursor from './components/LavaCursor.jsx';
import ThreeDScene from './components/ThreeDScene.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Contact from './pages/Contact.jsx';
import Support from './pages/Support.jsx';

export default function App() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      {/* Global Background and Effects */}
      <ThreeDScene />
      <LavaCursor />
      <WhatsAppButton />
      
      {/* Overlay Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main style={{ paddingBottom: '4rem' }}>
          <Home />
          <Services />
          <Portfolio />
          <Contact />
          <Support />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
