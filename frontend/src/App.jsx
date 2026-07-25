import { useEffect, useState } from 'react';
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
import Videos from './pages/Videos.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import QuoteModal from './components/QuoteModal.jsx';

const API_BASE = 'http://localhost:8000/api/v1';

export default function App() {
  const { pathname } = useLocation();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Track site visitor on mount / location change
  useEffect(() => {
    fetch(`${API_BASE}/visitors/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
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
          <Home onOpenQuote={() => setIsQuoteModalOpen(true)} />
          <Services />
          <Portfolio />
          <Videos />
          <Contact />
          <Support />
          <AdminDashboard />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
      
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </>
  );
}
