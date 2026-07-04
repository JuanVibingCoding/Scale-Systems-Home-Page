import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import {getAllPosts} from '@/lib/blog';

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://scalesystems.dev';

const servicesData: Record<
  string,
  {title: string; subtitle: string; desc: string[]; whatsappText: string; metaDescription?: string; ogTitle?: string}
> = {
  'diseno-web': {
    title: 'Diseño Web Vanguardista | Sitios que Convierten',
    subtitle: 'Tu vitrina digital optimizada para convertir',
    desc: [
      'Creamos sitios web ultrarrápidos, con diseño premium y enfocados en la experiencia del usuario.',
      'No más plantillas aburridas; construimos verdaderas máquinas de ventas diseñadas a la medida de tu negocio.',
      'Con un enfoque absoluto en conversiones y posicionamiento, tu nueva web destacará entre la competencia y atraerá clientes potenciales constantemente.',
    ],
    whatsappText:
      '¡Hola! Quiero cotizar un Diseño Web Vanguardista.',
    metaDescription:
      'Diseño y desarrollo de sitios web ultrarrápidos y enfocados en conversión para negocios en Venezuela. Rediseño, mantenimiento y sistemas de ventas 24/7. +25 años de experiencia.',
    ogTitle: 'Diseño Web Vanguardista | Scale Systems',
  },
  automatizacion: {
    title: 'Automatización de Procesos con IA | CRM, WhatsApp y Facturación Conectados',
    subtitle: 'Elimina el error humano y acelera tu crecimiento',
    desc: [
      'Conectamos tus herramientas (CRM, Email, WhatsApp) para que trabajen de forma sincronizada y sin intervención humana.',
      'Desde la captura del lead hasta el cobro de la factura, configuramos todo en piloto automático para escalar sin esfuerzo.',
      'Ahorra horas en tareas repetitivas cada semana y permite que tu equipo se concentre verdaderamente en lo importante: cerrar ventas y aportar valor.',
    ],
    whatsappText:
      '¡Hola! Me interesa la Automatización Pro para mi empresa.',
    metaDescription:
      'Conectamos tu CRM, WhatsApp, email y facturación en un solo sistema automático. Elimina el error humano, deja de perder leads y escala sin contratar al mismo ritmo. +25 años de experiencia en Venezuela.',
    ogTitle: 'Automatización de Procesos con IA | Scale Systems',
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
    description: data.metaDescription || `${data.subtitle}. ${data.desc[0]}`,
    alternates: {
      canonical: `/servicio/${id}`,
    },
    openGraph: {
      title: data.ogTitle || data.title,
      description: data.metaDescription || data.subtitle,
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

      {id === 'diseno-web' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {'@type': 'Question', name: 'Ya tengo una página en Instagram o Facebook, ¿de verdad necesito una web?', acceptedAnswer: {'@type': 'Answer', text: 'Las redes sociales son excelentes para conectar y mostrar tu marca, pero no reemplazan un canal de ventas propio. Un sitio web te da control total sobre tus datos, tu diseño y tu experiencia de compra.'}},
                {'@type': 'Question', name: 'Ya tengo una web pero no me trae clientes, ¿qué hacen distinto?', acceptedAnswer: {'@type': 'Answer', text: 'Empezamos con una auditoría de velocidad, experiencia de usuario y estructura de conversión, y rediseñamos sobre esa base sin perder el posicionamiento acumulado.'}},
                {'@type': 'Question', name: '¿Cuánto tiempo toma tener mi sitio funcionando?', acceptedAnswer: {'@type': 'Answer', text: 'Depende de la complejidad del proyecto. En el diagnóstico inicial se entrega un cronograma claro antes de comenzar.'}},
                {'@type': 'Question', name: '¿Se integra con WhatsApp y chatbots?', acceptedAnswer: {'@type': 'Answer', text: 'Sí, el sitio puede integrarse con atención por WhatsApp, agendamiento y CRM como parte de un sistema único.'}},
              ],
            }),
          }}
        />
      )}

      {id === 'automatizacion' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {'@type': 'Question', name: '¿Tengo que cambiar todas mis herramientas actuales?', acceptedAnswer: {'@type': 'Answer', text: 'No necesariamente. Siempre que sea posible, se conectan las herramientas que el negocio ya usa hoy.'}},
                {'@type': 'Question', name: '¿Qué pasa si se cae el internet o falla una integración?', acceptedAnswer: {'@type': 'Answer', text: 'Los flujos se diseñan con resiliencia: el sistema retoma y sincroniza automáticamente en cuanto la conexión vuelve.'}},
                {'@type': 'Question', name: '¿Esto reemplaza a mi equipo?', acceptedAnswer: {'@type': 'Answer', text: 'No. Elimina el trabajo repetitivo para que el equipo se enfoque en tareas que requieren criterio humano.'}},
                {'@type': 'Question', name: '¿Pueden automatizar la facturación con tasa BCV?', acceptedAnswer: {'@type': 'Answer', text: 'Sí, el sistema puede calcular el monto según la tasa de cambio del día automáticamente.'}},
                {'@type': 'Question', name: '¿Esto ayuda si cada empleado hace las cosas de forma distinta?', acceptedAnswer: {'@type': 'Answer', text: 'Sí. El sistema define un solo flujo que todo el equipo sigue, eliminando la dependencia de que cada quien tenga su propio método o su propia hoja de cálculo.'}},
              ],
            }),
          }}
        />
      )}

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
