import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import {getAllPosts} from '@/lib/blog';

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://scalesystems.dev';

const servicesData: Record<
  string,
  {title: string; subtitle: string; desc: string[]; whatsappText: string}
> = {
  'diseno-web': {
    title: 'Diseño Web Vanguardista',
    subtitle: 'Tu vitrina digital optimizada para convertir',
    desc: [
      'Creamos sitios web ultrarrápidos, con diseño premium y enfocados en la experiencia del usuario.',
      'No más plantillas aburridas; construimos verdaderas máquinas de ventas diseñadas a la medida de tu negocio.',
      'Con un enfoque absoluto en conversiones y posicionamiento, tu nueva web destacará entre la competencia y atraerá clientes potenciales constantemente.',
    ],
    whatsappText:
      '¡Hola! Quiero cotizar un Diseño Web Vanguardista.',
  },
  automatizacion: {
    title: 'Automatización Pro',
    subtitle: 'Elimina el error humano y acelera tu crecimiento',
    desc: [
      'Conectamos tus herramientas (CRM, Email, WhatsApp) para que trabajen de forma sincronizada y sin intervención humana.',
      'Desde la captura del lead hasta el cobro de la factura, configuramos todo en piloto automático para escalar sin esfuerzo.',
      'Ahorra horas en tareas repetitivas cada semana y permite que tu equipo se concentre verdaderamente en lo importante: cerrar ventas y aportar valor.',
    ],
    whatsappText:
      '¡Hola! Me interesa la Automatización Pro para mi empresa.',
  },
  chatbots: {
    title: 'AI Chatbots',
    subtitle: 'Atención instantánea que cierra ventas por ti',
    desc: [
      'Entrenamos agentes de Inteligencia Artificial utilizando la información de tu empresa, documentos, manuales y casos de uso específicos.',
      'Tu chatbot personalizado será capaz de responder dudas, agendar citas y cerrar ventas 24/7 en plataformas como WhatsApp, Instagram y tu sitio web.',
      'Ofrece una experiencia de cliente superior mientras reduces costos operativos drásticamente.',
    ],
    whatsappText:
      '¡Hola! Necesito un Chatbot con IA para mi negocio.',
  },
};

type Props = {
  params: Promise<{id: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id} = await params;
  const data = servicesData[id];

  if (!data) {
    return {title: 'Servicio no encontrado'};
  }

  return {
    title: data.title,
    description: `${data.subtitle}. ${data.desc[0]}`,
    alternates: {
      canonical: `/servicio/${id}`,
    },
    openGraph: {
      title: data.title,
      description: data.subtitle,
      url: `/servicio/${id}`,
    },
  };
}

export default async function ServicePage({params}: Props) {
  const {id} = await params;

  if (!id || !servicesData[id]) {
    notFound();
  }

  const data = servicesData[id];
  const relatedPosts = getAllPosts().filter(
    (post) => post.relatedService === id
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: SITE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Servicios',
                item: `${SITE_URL}/#servicios`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: data.title,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: data.title,
            description: data.subtitle,
            provider: {
              '@type': 'Organization',
              name: 'Scale Systems',
            },
            areaServed: {
              '@type': 'Country',
              name: 'Venezuela',
            },
          }),
        }}
      />
      <ServiceLandingPage
        id={id}
        title={data.title}
        subtitle={data.subtitle}
        desc={data.desc}
        whatsappText={data.whatsappText}
      />

      {relatedPosts.length > 0 && (
        <section className="bg-scale-bg py-16 sm:py-24 border-t border-scale-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
            <p className="text-scale-accent font-mono text-sm tracking-widest uppercase mb-3">
              Artículos relacionados
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Aprende más sobre este servicio
            </h2>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-scale-card border border-scale-border rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-scale-accent/30 hover:shadow-[0_0_30px_rgba(3,250,110,0.05)]"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-scale-accent transition-colors duration-300 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-scale-muted text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[#63635d] font-mono">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-scale-border" />
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
