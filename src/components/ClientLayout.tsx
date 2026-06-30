'use client';

import dynamic from 'next/dynamic';
import ScrollRestoration from '@/components/ScrollRestoration';

const Navbar = dynamic(() => import('@/components/Navbar'), {ssr: false});
const ContactFooter = dynamic(() => import('@/components/ContactFooter'));

export default function ClientLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <ContactFooter />
    </>
  );
}
