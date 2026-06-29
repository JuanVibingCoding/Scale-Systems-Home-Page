import type {Metadata} from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: {
    default: 'Scale Systems | Automatización e IA para empresas en Venezuela',
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://scalesystems.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    siteName: 'Scale Systems',
    title: 'Scale Systems | Automatización e IA para empresas en Venezuela',
    description:
      'Agencia de automatización e inteligencia artificial. Diseñamos sistemas que trabajan por ti 24/7.',
    images: [
      {
        url: '/logos/ScaleSystemsLogo250.png',
        width: 250,
        height: 250,
        alt: 'Scale Systems Logo',
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
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-scale-bg text-scale-text font-sans selection:bg-scale-accent selection:text-scale-bg flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
