/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import Services from './components/Services';
import TrustBanner from './components/TrustBanner';
import ContactFooter from './components/ContactFooter';

// Pages
import ServiceLandingPage from './pages/ServiceLandingPage';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Services />
        <TrustBanner />
      </main>
      <ContactFooter />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-scale-bg text-scale-text font-sans selection:bg-scale-accent selection:text-scale-bg flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicio/:id" element={<ServiceLandingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
