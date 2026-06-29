'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/Hero'), {ssr: false});
const PainPoints = dynamic(() => import('@/components/PainPoints'), {
  ssr: false,
});
const Services = dynamic(() => import('@/components/Services'), {ssr: false});
const PortfolioSection = dynamic(
  () =>
    import('@/components/portfolio/PortfolioSection').then((mod) => ({
      default: mod.PortfolioSection,
    })),
  {ssr: false}
);
const TrustBanner = dynamic(() => import('@/components/TrustBanner'), {
  ssr: false,
});

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
