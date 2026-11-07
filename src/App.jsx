import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Contact from './pages/Contact.jsx';
import Support from './pages/Support.jsx';
import Videos from './pages/Videos.jsx';
import GateDesigns from './pages/GateDesigns.jsx';
import NotFound from './pages/NotFound.jsx';
import QuoteModal from './components/QuoteModal.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const openQuote = () => setIsQuoteModalOpen(true);

  return (
    <>
      <a href="#main" className="skip-link">Seedhe content par jaayein</a>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <main id="main">
              <Home onOpenQuote={openQuote} />
              <Services />
              <GateDesigns />
              <Portfolio />
              <Videos />
              <Contact />
              <Support />
            </main>
          }
        />
        <Route path="*" element={<main id="main"><NotFound /></main>} />
      </Routes>
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
      <ScrollToTop />
      <WhatsAppButton />

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
}
