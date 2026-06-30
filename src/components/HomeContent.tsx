'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/Hero'), {ssr: false});
const PainPoints = dynamic(() => import('@/components/PainPoints'));
const Services = dynamic(() => import('@/components/Services'));
const PortfolioSection = dynamic(
  () =>
    import('@/components/portfolio/PortfolioSection').then((mod) => ({
      default: mod.PortfolioSection,
    })),
  {ssr: false}
);
const TrustBanner = dynamic(() => import('@/components/TrustBanner'));

export default function HomeContent() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Services />
      <PortfolioSection />
      <TrustBanner />
    </>
  );
}
