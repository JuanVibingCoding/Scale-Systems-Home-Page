/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import Services from './components/Services';
import { PortfolioSection } from './components/portfolio/PortfolioSection';
import TrustBanner from './components/TrustBanner';
import ContactFooter from './components/ContactFooter';

// Components
import { SEO } from './components/SEO';
import { JsonLd } from './components/JsonLd';
// Pages
import ServiceLandingPage from './pages/ServiceLandingPage';
import BlogIndex from './pages/BlogIndex';
import BlogPostPage from './pages/BlogPost';

function HomePage() {
  return (
    <>
      <SEO
        title="Scale Systems — Agencia de Automatización e IA en Venezuela"
        description="Agencia de automatización e inteligencia artificial en Valencia, Venezuela. Diseño web vanguardista, chatbots con IA y automatización de procesos que escalan tu negocio 24/7."
        canonical="https://scalesystems.com.ve/"
      />
      <JsonLd schema={{
        '@type': 'Organization',
        name: 'Scale Systems',
        url: 'https://scalesystems.com.ve',
        logo: 'https://scalesystems.com.ve/logos/ScaleSystemsLogo250.png',
        description: 'Agencia de automatización e inteligencia artificial en Valencia, Venezuela.',
        address: { '@type': 'PostalAddress', addressLocality: 'Valencia', addressCountry: 'VE' },
        email: 'hola@scalesystems.com.ve',
        telephone: '+584121234567',
        sameAs: [],
      }} />
      <JsonLd schema={{
        '@type': 'WebSite',
        name: 'Scale Systems',
        url: 'https://scalesystems.com.ve',
      }} />
      <Navbar />
      <main id="main-content">
        <Hero />
        <PainPoints />
        <Services />
        <PortfolioSection />
        <TrustBanner />
      </main>
      <ContactFooter />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[200] focus-visible:bg-[#03fa6e] focus-visible:text-[#171810] focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-semibold focus-visible:text-sm">
        Saltar al contenido principal
      </a>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-scale-bg text-scale-text font-sans selection:bg-scale-accent selection:text-scale-bg flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicio/:id" element={<ServiceLandingPage />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </div>
      </MotionConfig>
    </BrowserRouter>
  );
}
