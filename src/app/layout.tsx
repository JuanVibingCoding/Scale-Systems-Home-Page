import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({subsets: ['latin'], display: 'swap'});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://scalesystems.dev';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
  },
  title: {
    default:
      'Automatización e IA para Empresas en Venezuela | Scale Systems',
    template: '%s | Scale Systems',
  },
  description:
    'Agencia de automatización e inteligencia artificial en Venezuela. Diseñamos sistemas que trabajan por ti 24/7, optimizando tiempo, reduciendo costos y escalando tus ventas.',
  keywords: [
    'automatización',
    'inteligencia artificial',
    'chatbots',
    'diseño web',
    'Venezuela',
    'Scale Systems',
    'CRM',
    'WhatsApp bot',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    siteName: 'Scale Systems',
    title: 'Automatización e IA para Empresas en Venezuela | Scale Systems',
    description:
      'Agencia de automatización e inteligencia artificial. Diseñamos sistemas que trabajan por ti 24/7.',
    images: [
      {
        url: '/logos/ScaleSystemsLogo250.png',
        width: 250,
        height: 250,
        alt: 'Logo de Scale Systems - Agencia de Automatización e IA en Venezuela',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scale Systems | Automatización e IA',
    description:
      'Agencia de automatización e inteligencia artificial en Venezuela.',
    images: ['/logos/ScaleSystemsLogo250.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Scale Systems',
    url: SITE_URL,
    logo: `${SITE_URL}/logos/ScaleSystemsLogo250.png`,
    description:
      'Agencia de automatización e inteligencia artificial en Venezuela.',
    areaServed: {
      '@type': 'Country',
      name: 'Venezuela',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hola@scalesystems.com.ve',
      telephone: '+58-412-123-4567',
      contactType: 'customer service',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Scale Systems',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="es" className="h-full antialiased">
      <body
        className={`min-h-screen bg-scale-bg text-scale-text font-sans selection:bg-scale-accent selection:text-scale-bg flex flex-col ${inter.className}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4NRHGDQC84"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4NRHGDQC84');
          `}
        </Script>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
