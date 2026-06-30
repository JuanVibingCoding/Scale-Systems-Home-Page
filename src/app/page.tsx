import type {Metadata} from 'next';
import HomeContent from '@/components/HomeContent';

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Escala tu empresa en Venezuela con Inteligencia Artificial y Automatización. Dejamos atrás los procesos manuales.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title:
      'Automatización e IA para Empresas en Venezuela | Scale Systems',
    description:
      'Escala tu empresa en Venezuela con Inteligencia Artificial y Automatización.',
    url: '/',
  },
};

export default function HomePage() {
  return <HomeContent />;
}
