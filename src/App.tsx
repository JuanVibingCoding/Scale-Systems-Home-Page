/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import Services from './components/Services';
import TrustBanner from './components/TrustBanner';
import ContactFooter from './components/ContactFooter';

export default function App() {
  return (
    <div className="min-h-screen bg-scale-bg text-scale-text font-sans selection:bg-scale-accent selection:text-scale-bg">
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Services />
        <TrustBanner />
      </main>
      <ContactFooter />
    </div>
  );
}
