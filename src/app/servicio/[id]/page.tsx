import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import ServiceLandingPage from '@/components/ServiceLandingPage';

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

  return (
    <>
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
    </>
  );
}
