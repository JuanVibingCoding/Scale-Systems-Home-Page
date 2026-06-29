import type {Metadata} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
      <h1 className="text-6xl font-bold text-scale-accent mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-6">
        Página no encontrada
      </h2>
      <p className="text-scale-muted mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="bg-[#03fa6e] hover:bg-[#02d65e] text-[#171810] font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(3,250,110,0.3)]"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
