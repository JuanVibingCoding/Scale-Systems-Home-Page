'use client';

import {motion, AnimatePresence} from 'motion/react';
import {GlowingEffect} from '@/components/ui/glowing-effect';
import {RobotIcon} from '@/components/ui/robot-icon';
import {useGlobalMouse} from '@/lib/use-global-mouse';
import Link from 'next/link';
import {ArrowLeft, MessageCircle, Zap, XCircle, Lock, Smartphone, Shield, BarChart3, Search, Clock, GitMerge, FileSpreadsheet, Database, Receipt, UserX, EyeOff, TrendingUp, Cpu, CheckCircle, DollarSign, Inbox, ClipboardList, ShoppingCart, Calendar, Truck, Wifi, UserCheck, Users, AlertTriangle, Star, Target, Globe} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useState, useEffect, lazy, Suspense} from 'react';

const ChatWindow = lazy(() => import('./ChatWindow'));

const painPoints = [
  {
    icon: <BarChart3 className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Dependes del algoritmo',
    desc: 'Un día tu alcance orgánico cae, y no hay nadie a quien reclamarle. La plataforma decide, no tú.',
  },
  {
    icon: <XCircle className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Tus seguidores no son tuyos',
    desc: 'Son de la plataforma. Si tu cuenta se cae, se bloquea o decides irte, ese "activo" desaparece contigo.',
  },
  {
    icon: <Lock className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Meta restringe la venta directa a WhatsApp',
    desc: 'Cada vez es más difícil convertir un seguidor en cliente sin fricción usando solo campañas pagas.',
  },
  {
    icon: <Smartphone className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Compites en el mismo feed',
    desc: 'Justo al lado de tu publicación, el algoritmo le muestra a tu cliente potencial la oferta de tu competencia.',
  },
  {
    icon: <Shield className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'No hay marca, hay perfil',
    desc: 'Es difícil transmitir seriedad ante clientes corporativos cuando tu única presencia digital es una cuenta de red social.',
  },
  {
    icon: <Zap className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'No hay datos, no hay CRM',
    desc: 'No puedes construir una base de clientes real, ni automatizar seguimiento, ni conectar un chatbot a tu propio sistema.',
  },
];

const benefits = [
  {
    icon: <Zap className="w-5 h-5 text-scale-accent" />,
    title: 'Velocidad real, no promesas',
    desc: 'Sitios optimizados para cargar en segundos. Cada segundo de más cuesta visitantes y ventas.',
  },
  {
    icon: <Smartphone className="w-5 h-5 text-scale-accent" />,
    title: 'Diseño a la medida, cero plantillas',
    desc: 'Cada proyecto se diseña desde cero, pensado para tu negocio y tu cliente ideal, no un tema genérico reciclado.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-scale-accent" />,
    title: 'Enfocado en conversión, no solo estética',
    desc: 'Cada botón, formulario y página está pensada para guiar al visitante hacia una acción: comprar, agendar o escribir.',
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-scale-accent" />,
    title: 'Se integra con IA y automatización',
    desc: 'Conectamos tu web con tu chatbot, tu CRM y tu sistema de facturación, para que trabajen como un solo sistema.',
  },
  {
    icon: <Shield className="w-5 h-5 text-scale-accent" />,
    title: 'Seguridad y disponibilidad',
    desc: 'Infraestructura confiable, para que tu sitio esté disponible incluso en los momentos de mayor tráfico.',
  },
  {
    icon: <Search className="w-5 h-5 text-scale-accent" />,
    title: 'SEO pensado para Venezuela',
    desc: 'Optimizamos para que te encuentren en Google cuando alguien busca lo que tú vendes, en tu ciudad.',
  },
];

const serviceModes = [
  {
    tag: 'Desde cero',
    title: 'Diseño Web desde Cero',
    desc: 'Para negocios que quieren construir su primer terreno propio, o dejar atrás una plantilla genérica que no representa su marca.',
    items: ['Arquitectura y diseño 100% a la medida', 'Ecommerce, corporativo o landing de conversión', 'Optimizado para velocidad y SEO desde el día uno'],
    featured: false,
  },
  {
    tag: 'Más solicitado',
    title: 'Rediseño de Sitios Existentes',
    desc: 'Tu web ya existe, pero no convierte, se ve anticuada o carga lento. La auditamos y reconstruimos sin perder lo que ya funciona.',
    items: ['Auditoría de velocidad, UX y SEO', 'Conservamos tu posicionamiento acumulado', 'Nueva estructura enfocada en conversión'],
    featured: true,
  },
  {
    tag: 'Continuo',
    title: 'Mantenimiento y Actualización',
    desc: 'Planes para mantener tu sitio actualizado, seguro y funcionando, sin que tengas que pensarlo tú.',
    items: ['Actualizaciones y respaldos periódicos', 'Monitoreo de seguridad y disponibilidad', 'Ajustes de contenido bajo demanda'],
    featured: false,
  },
];

const processSteps = [
  {num: '01', title: 'Diagnóstico', desc: 'Entendemos tu negocio, tu cliente y qué te está costando tu web actual (o no tener una).'},
  {num: '02', title: 'Diseño', desc: 'Prototipo visual a la medida, con foco en marca y conversión. Apruebas antes de escribir una sola línea de código.'},
  {num: '03', title: 'Desarrollo', desc: 'Construcción con tecnología moderna, optimizada para velocidad, seguridad y SEO desde el primer día.'},
  {num: '04', title: 'Lanzamiento y soporte', desc: 'Publicamos, medimos y seguimos optimizando. Tu web nunca queda "terminada y olvidada".'},
];

const faqs = [
  {
    q: 'Ya tengo una página en Instagram o Facebook, ¿de verdad necesito una web?',
    a: 'Las redes sociales son excelentes para conectar y mostrar tu marca, pero no reemplazan un canal de ventas propio. Un sitio web te da control total sobre tus datos, tu diseño y tu experiencia de compra, algo que ninguna plataforma externa te puede garantizar.',
  },
  {
    q: 'Ya tengo una web pero no me trae clientes, ¿qué hacen distinto?',
    a: 'Empezamos con una auditoría real: velocidad, experiencia de usuario y estructura de conversión. La mayoría de las webs que "no funcionan" tienen buen contenido pero una arquitectura que no guía al visitante hacia la compra. Rediseñamos sobre esa base, sin perder tu posicionamiento acumulado.',
  },
  {
    q: '¿Cuánto tiempo toma tener mi sitio funcionando?',
    a: 'Depende de la complejidad del proyecto: no es lo mismo una landing page que un ecommerce completo. En el diagnóstico inicial te entregamos un cronograma claro, sin sorpresas ni promesas genéricas.',
  },
  {
    q: '¿Se integra con WhatsApp y mis chatbots?',
    a: 'Sí. Como también diseñamos sistemas de automatización y chatbots con IA, tu sitio puede conectarse directamente con tu atención por WhatsApp, tu agendamiento y tu CRM, funcionando como un solo sistema.',
  },
  {
    q: '¿Y si mi negocio es pequeño todavía?',
    a: 'Precisamente por eso conviene empezar temprano. Un sitio bien construido crece contigo: hoy puede ser una landing de conversión simple, y en el futuro escalar a un ecommerce completo, sin rehacer todo desde cero.',
  },
];

const automationPainPoints = [
  {
    icon: <Clock className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Leads que se enfrían',
    desc: 'Un mensaje sin responder a tiempo, sea por WhatsApp, Instagram o el formulario de tu web, es una venta que se va con la competencia.',
  },
  {
    icon: <GitMerge className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Canales que no se hablan entre sí',
    desc: 'Un lead te escribe por Instagram, otro por WhatsApp, otro llena el formulario de tu web, y cada uno vive en un mundo aparte.',
  },
  {
    icon: <FileSpreadsheet className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Cada empleado, su propio método',
    desc: 'Un vendedor lleva sus pedidos en un Excel que solo él entiende, otro anota todo en un cuaderno, y cuando algo se pierde, nadie sabe de quién fue la culpa.',
  },
  {
    icon: <Database className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Información dispersa',
    desc: 'Un mismo cliente, con datos regados entre WhatsApp, redes sociales, hojas sueltas y la memoria de quien lo atendió.',
  },
  {
    icon: <Receipt className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Errores de facturación',
    desc: 'Un cero de más o de menos, escrito a mano, puede costarte más que todo lo que ahorraste no automatizando.',
  },
  {
    icon: <UserX className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Todo depende de una persona',
    desc: 'Si esa persona falta, sale de vacaciones o cambia de trabajo, el proceso se detiene con ella.',
  },
  {
    icon: <EyeOff className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Cero visibilidad',
    desc: 'No sabes cuántos leads entraron esta semana, ni en qué paso del embudo se quedaron atascados.',
  },
  {
    icon: <TrendingUp className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'No escalas sin contratar',
    desc: 'Cada cliente nuevo significa más carga manual para el mismo equipo, en vez de más eficiencia.',
  },
];

const automationBenefits = [
  {
    icon: <Cpu className="w-5 h-5 text-scale-accent" />,
    title: 'Un solo sistema conectado',
    desc: 'CRM, WhatsApp, redes sociales, tu web y facturación hablando entre sí, no piezas sueltas que alguien tiene que reconciliar a mano.',
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-scale-accent" />,
    title: 'Cero leads perdidos',
    desc: 'Cada mensaje se registra, se clasifica y recibe seguimiento automático, sin depender de que alguien se acuerde.',
  },
  {
    icon: <Shield className="w-5 h-5 text-scale-accent" />,
    title: 'Menos error humano',
    desc: 'Las reglas se ejecutan siempre igual, sin importar qué tan cansado esté tu equipo un viernes a las cinco de la tarde.',
  },
  {
    icon: <DollarSign className="w-5 h-5 text-scale-accent" />,
    title: 'Facturación sin dolores de cabeza',
    desc: 'Cálculo automático con la tasa de cambio del día, sin hojas de cálculo improvisadas ni ajustes de último minuto.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-scale-accent" />,
    title: 'Visibilidad total',
    desc: 'Un panel que muestra qué está pasando en tu negocio en tiempo real, sin tener que pedirle un reporte a nadie.',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-scale-accent" />,
    title: 'Escala sin contratar al mismo ritmo',
    desc: 'Crecer no debería significar necesariamente sumar más gente para hacer lo mismo, una y otra vez.',
  },
  {
    icon: <Inbox className="w-5 h-5 text-scale-accent" />,
    title: 'Todos tus canales, un mismo lugar',
    desc: 'Ya sea que el cliente te escriba por WhatsApp, Instagram, tu web o Facebook, la información llega al mismo sistema.',
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-scale-accent" />,
    title: 'Un mismo proceso, sin importar quién atienda',
    desc: 'Cada miembro del equipo sigue el mismo flujo automático. El resultado deja de depender de quién estaba de turno ese día.',
  },
];

const useCases = [
  {
    tag: 'Ecommerce & Retail',
    title: 'Pedidos multicanal: WhatsApp, Instagram y web',
    reto: 'Pedidos que llegan por WhatsApp, Instagram y la web, cada uno gestionado de forma distinta, e inventario que nunca coincide con lo que realmente hay en stock.',
    solution: 'Catálogo conectado a todos los canales de venta, confirmación automática de pedido y actualización de inventario en el mismo momento.',
    resultado: 'El equipo deja de perseguir pedidos en tres pantallas distintas y se enfoca en atender bien al cliente.',
  },
  {
    tag: 'Servicios profesionales',
    title: 'Agendamiento de citas y consultas',
    reto: 'Citas agendadas por teléfono o WhatsApp que se duplican, se olvidan o nadie confirma a tiempo.',
    solution: 'Agendamiento automático con disponibilidad en tiempo real, recordatorios y seguimiento después de la cita.',
    resultado: 'Menos inasistencias, y el personal deja de perder tiempo confirmando citas una por una.',
  },
  {
    tag: 'Distribución & mayoristas',
    title: 'Pedidos recurrentes y facturación',
    reto: 'Clientes que compran cada mes, gestionados a mano, con facturas atrasadas y alertas de stock que llegan tarde.',
    solution: 'Pedidos recurrentes programados, alertas automáticas de stock bajo y facturación generada sola.',
    resultado: 'El equipo de ventas deja de hacer trabajo administrativo y se dedica a conseguir nuevos clientes.',
  },
];

const veAdvantages = [
  {
    icon: <Smartphone className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Todos los canales donde vende tu cliente',
    desc: 'Diseñamos alrededor de los canales que tu cliente realmente usa (WhatsApp, Instagram, Facebook o tu propia web), no alrededor de uno solo.',
  },
  {
    icon: <DollarSign className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Facturación en bolívares y dólares',
    desc: 'Cálculo automático con la tasa de cambio del día, sin depender de que alguien la actualice a mano cada mañana.',
  },
  {
    icon: <Wifi className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Resiliente ante fallas de conexión',
    desc: 'Si la conexión se cae, el sistema retoma y sincroniza automáticamente en cuanto vuelve, sin perder información.',
  },
  {
    icon: <UserCheck className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Menos dependencia de una sola persona',
    desc: 'Con la rotación de personal que existe en el país, el proceso queda documentado en el sistema, no solo en la cabeza de quien lo hacía.',
  },
];

const automationProcessSteps = [
  {num: '01', title: 'Diagnóstico de procesos', desc: 'Mapeamos cómo funciona hoy tu operación, y dónde exactamente se está perdiendo tiempo o dinero.'},
  {num: '02', title: 'Diseño del flujo', desc: 'Definimos, contigo, cómo debería fluir la información entre tus herramientas de principio a fin.'},
  {num: '03', title: 'Integración', desc: 'Conectamos las herramientas que ya usas (o las que necesites) para que trabajen como un solo sistema.'},
  {num: '04', title: 'Monitoreo y ajuste', desc: 'Medimos cómo funciona en la práctica y ajustamos las reglas, porque tu negocio sigue cambiando.'},
];

const automationFaqs = [
  {q: '¿Tengo que cambiar todas mis herramientas actuales?', a: 'No necesariamente. Siempre que sea posible, conectamos las herramientas que ya usas hoy. Solo recomendamos cambiar algo cuando la herramienta actual realmente no puede integrarse o te está limitando.'},
  {q: '¿Qué pasa si se cae el internet o falla una integración?', a: 'Diseñamos los flujos con resiliencia: si algo se interrumpe, el sistema retoma y sincroniza la información automáticamente en cuanto la conexión vuelve, sin perder registros en el camino.'},
  {q: '¿Esto reemplaza a mi equipo?', a: 'No. Elimina el trabajo repetitivo y mecánico, para que tu equipo se enfoque en lo que de verdad requiere criterio humano: vender, negociar y atender bien a un cliente difícil.'},
  {q: '¿Pueden automatizar la facturación con tasa de cambio BCV?', a: 'Sí, es una de las automatizaciones más solicitadas en Venezuela: el sistema calcula el monto según la tasa del día, sin que nadie tenga que revisarla y actualizarla a mano.'},
  {q: '¿Cuánto tiempo toma implementar una automatización?', a: 'Depende de cuántas herramientas y procesos estén involucrados. En el diagnóstico inicial te entregamos un cronograma claro antes de empezar, sin sorpresas.'},
  {q: '¿Esto ayuda si cada empleado hace las cosas de forma distinta?', a: 'Sí, es justamente uno de los problemas que más resolvemos. El sistema define un solo flujo que todo el equipo sigue, sin importar quién esté de turno, así que dejas de depender de que cada quien tenga su propio método para hacer lo mismo.'},
];

const chatbotPainPoints = [
  {
    icon: <Clock className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Ventas que se evaporan de noche',
    desc: 'Te escriben a las 11 de la noche y para cuando respondes a las 8 a.m., el cliente ya compró con la competencia. Cada noche pierdes ventas que ni siquiera sabes que existieron.',
  },
  {
    icon: <Inbox className="w-[18px] h-[18px] text-scale-accent" />,
    title: '200 mensajes sin leer',
    desc: 'No sabes cuál es urgente, cuál es una venta caliente y cuál es spam. La bandeja de WhatsApp se vuelve un caos que te quita el sueño.',
  },
  {
    icon: <Users className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Personal que no responde en horarios clave',
    desc: 'Contratas a alguien para atender WhatsApp, pero los fines de semana, feriados y después de las 6 p.m. no responde nadie. Y cuando renuncia, se va todo el conocimiento.',
  },
  {
    icon: <DollarSign className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Pierdes ventas por no responder el precio',
    desc: 'El cliente pregunta "¿cuánto cuesta?", tardas en contestar y se va. En Venezuela, donde la competencia está a un toque de distancia, la lentitud mata más ventas que el precio.',
  },
  {
    icon: <Smartphone className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Pegado al celular todo el día',
    desc: 'No puedes dedicarte a lo que de verdad importa: crecer el negocio, cerrar acuerdos grandes, pensar estrategia. Te convertiste en empleado de tu propio negocio.',
  },
  {
    icon: <AlertTriangle className="w-[18px] h-[18px] text-scale-accent" />,
    title: 'Canales desbordados y sin control',
    desc: 'Comentarios en Instagram, mensajes en Facebook, correos que se pierden. Cada canal es un incendio aparte y no hay bomberos suficientes.',
  },
];

const chatbotFeatures = [
  {icon: <Zap className="w-5 h-5 text-scale-accent" />, title: 'Responde al instante', desc: 'Cero filas, cero espera. Tu cliente escribe y en 10 segundos tiene respuesta.'},
  {icon: <Clock className="w-5 h-5 text-scale-accent" />, title: 'Vende 24/7', desc: 'Atiende madrugadas, fines de semana y feriados sin pedir permiso.'},
  {icon: <Calendar className="w-5 h-5 text-scale-accent" />, title: 'Agenda citas', desc: 'Coordina reuniones, reservas y servicios directo en tu calendario.'},
  {icon: <Target className="w-5 h-5 text-scale-accent" />, title: 'Califica clientes potenciales', desc: 'Pregunta lo correcto y separa al curioso del que de verdad va a comprar.'},
  {icon: <ShoppingCart className="w-5 h-5 text-scale-accent" />, title: 'Cierra ventas', desc: 'Toma el pedido, calcula el total, envía el link de pago y confirma.'},
  {icon: <MessageCircle className="w-5 h-5 text-scale-accent" />, title: 'Atiende en varios canales', desc: 'WhatsApp, Instagram, Facebook y tu web con un solo cerebro.'},
  {icon: <TrendingUp className="w-5 h-5 text-scale-accent" />, title: 'Aprende solo', desc: 'Cada conversación lo hace mejor. Se entrena con tus datos reales.'},
  {icon: <UserCheck className="w-5 h-5 text-scale-accent" />, title: 'Deriva al humano', desc: 'Si el caso es complejo, pasa el chat con todo el contexto a tu equipo.'},
];

const chatbotProcessSteps = [
  {num: '01', badge: 'Semana 1', title: 'Diagnóstico', desc: 'Mapeamos tus consultas reales, horarios pico, las ventas que pierdes fuera de horario y los puntos donde tu equipo se atasca. Sin diagnóstico no hay chatbot que sirva.'},
  {num: '02', badge: 'Semana 1-2', title: 'Entrenamiento', desc: 'Cargamos tus manuales, catálogos, FAQs, casos de uso, precios, políticas y todo el conocimiento que está en la cabeza de tu mejor vendedor. El agente aprende a responder como tu negocio.'},
  {num: '03', badge: 'Semana 2', title: 'Integración', desc: 'Conectamos WhatsApp Business, Instagram, Facebook Messenger y tu sitio web a un solo panel. Todo el tráfico conversacional en un lugar, con métricas claras.'},
  {num: '04', badge: 'Semana 2-3', title: 'Lanzamiento', desc: 'Ponemos el agente a trabajar en producción. Monitoreamos las primeras conversaciones, ajustamos el tono y, cuando rinde, lo dejamos volar solo. Tú ves las ventas entrar.'},
];

const chatbotCases = [
  {loc: 'Restaurante · Caracas, DC', metric: '+180%', title: 'en pedidos por WhatsApp', desc: 'Automatizaron la toma de pedidos con un chatbot IA conectado a su menú. El cliente arma su orden, calcula el total y recibe el link de pago sin que un humano toque el chat. Casi triplicaron los pedidos en pocas semanas.'},
  {loc: 'Clínica · Valencia, Carabobo', metric: '−60%', title: 'en llamadas perdidas', desc: 'Implementaron un chatbot para agendamiento de citas y dudas frecuentes. Liberaron al personal receptivo del martirio de responder lo mismo mil veces y redujeron drásticamente las llamadas perdidas, que antes eran ventas que se iban.'},
  {loc: 'Tienda online · Barquisimeto, Lara', metric: '95%', title: 'en satisfacción del cliente', desc: 'Un agente IA resuelve consultas de stock, tallas, envíos y devoluciones en segundos. La satisfacción del cliente subió a 95%, algo que un equipo humano con turnos rotativos nunca habría logrado sostener.'},
];

const chatbotCapabilities = [
  {cat: 'Atención al cliente', icon: <MessageCircle className="w-[18px] h-[18px] text-scale-accent" />, items: 'FAQs automatizadas · consultas de estado · seguimiento de pedidos · soporte post-venta · reclamos derivados al equipo correcto'},
  {cat: 'Ventas y conversión', icon: <ShoppingCart className="w-[18px] h-[18px] text-scale-accent" />, items: 'Catálogo interactivo · cotizaciones automáticas · cálculo de totales · link de pago · confirmación de pedido · upselling y cross-selling'},
  {cat: 'Agendamiento', icon: <Calendar className="w-[18px] h-[18px] text-scale-accent" />, items: 'Reserva de citas · gestión de calendario · recordatorios automáticos · reprogramación · confirmación por WhatsApp'},
  {cat: 'Generación de leads', icon: <Target className="w-[18px] h-[18px] text-scale-accent" />, items: 'Captura de datos · calificación automática · segmentación · entrega al equipo de ventas · seguimiento de prospectos'},
  {cat: 'Marketing conversacional', icon: <MessageCircle className="w-[18px] h-[18px] text-scale-accent" />, items: 'Campañas masivas por WhatsApp · mensajes personalizados · broadcasts segmentados · re-activación de clientes inactivos'},
  {cat: 'Analítica e inteligencia', icon: <BarChart3 className="w-[18px] h-[18px] text-scale-accent" />, items: 'Métricas en tiempo real · transcripciones de conversaciones · detección de intención · reportes de ventas · alertas de oportunidades'},
  {cat: 'Integraciones', icon: <Globe className="w-[18px] h-[18px] text-scale-accent" />, items: 'WhatsApp Business API · Instagram · Facebook · CRM · Google Calendar · pasarelas de pago · tu sistema de inventario'},
  {cat: 'Personalización de marca', icon: <Star className="w-[18px] h-[18px] text-scale-accent" />, items: 'Tono de voz customizado · avatar y nombre del bot · respuestas alineadas a tu identidad · manejo multilingüe si exportas'},
];

const chatbotStats = [
  {num: '+500%', lbl: 'Generación de leads con flujos automatizados'},
  {num: '−65%', lbl: 'Reducción del costo por contacto'},
  {num: '80%', lbl: 'De consultas repetitivas absorbidas por la IA'},
  {num: '92%', lbl: 'Satisfacción del cliente sostenible'},
];

const chatbotPricing = [
  {
    name: 'Starter', amount: '$97', period: '/mes', desc: 'Para el negocio que está empezando a automatizar su WhatsApp.',
    features: ['Canal principal: WhatsApp', 'Hasta 1.000 conversaciones/mes', 'Entrenamiento: catálogo + FAQs', 'Agente IA generativo', 'Agendamiento básico', '2 integraciones', 'Analítica avanzada', 'Gerente de cuenta'],
    muted: [false, false, false, false, false, false, true, true],
    featured: false,
    btnText: 'Empezar con Starter',
    btnClass: 'btn-ghost' as const,
  },
  {
    name: 'Professional', amount: '$247', period: '/mes', desc: 'Para pymes que venden por WhatsApp e Instagram y necesitan escalar.',
    features: ['WhatsApp + Instagram', 'Hasta 10.000 conversaciones/mes', 'Entrenamiento: catálogo + casos de uso', 'Agente IA generativo', 'Agendamiento avanzado', '5 integraciones', 'Panel de analítica avanzado', 'Chat prioritario'],
    muted: [false, false, false, false, false, false, false, false],
    featured: true,
    btnText: 'Elegir Professional',
    btnClass: 'btn-primary' as const,
  },
  {
    name: 'Empresarial', amount: 'A medida', period: '', desc: 'Para empresas con múltiples canales, CRM y volumen alto de conversaciones.',
    features: ['Todos los canales', 'Conversaciones ilimitadas', 'Datos completos + CRM', 'Agente IA generativo', 'Agendamiento premium + integraciones', 'Integraciones ilimitadas', 'Analítica premium + informes', 'Gerente de cuenta dedicado'],
    muted: [false, false, false, false, false, false, false, false],
    featured: false,
    btnText: 'Hablar con ventas',
    btnClass: 'btn-ghost' as const,
  },
];

const chatbotFaqs = [
  {q: '¿Cómo entrena Scale Systems el chatbot con mi negocio?', a: 'Cargamos tus manuales, catálogos, FAQs, casos de uso, precios y políticas en el agente IA para que aprenda a responder exactamente como lo haría tu mejor vendedor. Mientras más información le des, más preciso será.'},
  {q: '¿En qué canales puede funcionar el chatbot?', a: 'WhatsApp Business API, Instagram, Facebook Messenger y tu sitio web. Un solo agente IA atiende todos los canales con el mismo cerebro, manteniendo la coherencia de la conversación sin importar por dónde escriba el cliente.'},
  {q: '¿Cuánto tiempo toma implementar un chatbot?', a: 'De 2 a 3 semanas en promedio: diagnóstico, entrenamiento, integración y lanzamiento. No es un proyecto de meses ni requiere conocimientos técnicos de tu parte.'},
  {q: '¿El chatbot reemplaza a mi equipo de atención?', a: 'No. Absorbe las consultas repetitivas (hasta 80%) para que tu equipo se enfoque en casos complejos que requieren criterio humano. Cuando no puede resolver algo, deriva la conversación con todo el contexto.'},
  {q: '¿Qué pasa si el chatbot no entiende algo?', a: 'Está diseñado para reconocer sus límites. Si no está seguro de una respuesta, puede derivar al humano, pedir más información o escalar el caso sin perder el hilo de la conversación.'},
];

function ChatPreviewVisual() {
  return (
    <svg viewBox="0 0 340 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Vista previa del chat">
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2c1f" />
          <stop offset="100%" stopColor="#20221a" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="340" height="280" rx="16" fill="url(#bg-grad)" stroke="#383a2c" strokeWidth="1.5" />
      <g fontFamily="Inter, sans-serif">
        <line x1="0" y1="44" x2="340" y2="44" stroke="#383a2c" strokeWidth="1" />
        <circle cx="24" cy="22" r="16" fill="#03fa6e" />
        <text x="24" y="27" textAnchor="middle" fill="#171810" fontSize="11" fontWeight="900">IA</text>
        <text x="50" y="19" fill="#f4f4f0" fontSize="12" fontWeight="700">Asistente · Tu Negocio</text>
        <text x="50" y="33" fill="#03fa6e" fontSize="10">En línea · responde en 10s</text>
        <circle cx="310" cy="22" r="6" fill="#03fa6e" opacity="0.6" />
      </g>
      <g fontFamily="Inter, sans-serif">
        <rect x="190" y="58" width="130" height="36" rx="12" fill="#03fa6e" />
        <text x="255" y="69" textAnchor="middle" dominantBaseline="middle" fill="#171810" fontSize="10" fontWeight="500">Hola, ¿tienen disponible</text>
        <text x="255" y="83" textAnchor="middle" dominantBaseline="middle" fill="#171810" fontSize="10" fontWeight="500">la blusa talla M?</text>

        <rect x="18" y="108" width="208" height="56" rx="12" fill="#20221a" />
        <text x="30" y="124" dominantBaseline="middle" fill="#f4f4f0" fontSize="10">¡Sí! Tenemos la blusa talla M</text>
        <text x="30" y="140" dominantBaseline="middle" fill="#f4f4f0" fontSize="10">en stock. El precio es de $45 y</text>
        <text x="30" y="156" dominantBaseline="middle" fill="#f4f4f0" fontSize="10">el envío a Valencia es de $3.</text>

        <rect x="190" y="178" width="120" height="34" rx="12" fill="#03fa6e" />
        <text x="250" y="195" textAnchor="middle" dominantBaseline="middle" fill="#171810" fontSize="10" fontWeight="500">Sí, ¿aceptan Zelle?</text>

        <rect x="18" y="226" width="110" height="34" rx="12" fill="#20221a" />
        <text x="73" y="243" textAnchor="middle" dominantBaseline="middle" fill="#f4f4f0" fontSize="10">¡Claro! 👍</text>

        <rect x="140" y="226" width="60" height="34" rx="12" fill="#20221a" />
        <circle cx="155" cy="243" r="4" fill="#03fa6e" opacity="0.5" />
        <circle cx="167" cy="243" r="4" fill="#03fa6e" opacity="0.5" />
        <circle cx="179" cy="243" r="4" fill="#03fa6e" opacity="0.5" />
      </g>
    </svg>
  );
}

function OmniChart() {
  return (
    <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Cobertura omnicanal">
      <defs>
        <radialGradient id="center-glow-omni" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#03fa6e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#03fa6e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="140" r="60" fill="url(#center-glow-omni)" />
      <circle cx="200" cy="140" r="36" fill="#03fa6e" />
      <text x="200" y="137" textAnchor="middle" fill="#171810" fontSize="11" fontWeight="900" fontFamily="Inter">AGENTE</text>
      <text x="200" y="151" textAnchor="middle" fill="#171810" fontSize="11" fontWeight="900" fontFamily="Inter">IA</text>

      <line x1="200" y1="140" x2="60" y2="60" stroke="#03fa6e" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="200" y1="140" x2="340" y2="60" stroke="#03fa6e" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="200" y1="140" x2="60" y2="220" stroke="#03fa6e" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="200" y1="140" x2="340" y2="220" stroke="#03fa6e" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" />

      <circle cx="60" cy="60" r="32" fill="#2a2c1f" stroke="#03fa6e" strokeWidth="2" />
      <text x="60" y="56" textAnchor="middle" fill="#03fa6e" fontSize="13" fontWeight="900" fontFamily="Inter">95%</text>
      <text x="60" y="72" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="Inter">WhatsApp</text>

      <circle cx="340" cy="60" r="28" fill="#2a2c1f" stroke="#03fa6e" strokeWidth="2" />
      <text x="340" y="56" textAnchor="middle" fill="#03fa6e" fontSize="12" fontWeight="900" fontFamily="Inter">68%</text>
      <text x="340" y="72" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="Inter">Instagram</text>

      <circle cx="60" cy="220" r="26" fill="#2a2c1f" stroke="#03fa6e" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="60" y="217" textAnchor="middle" fill="#03fa6e" fontSize="11" fontWeight="900" fontFamily="Inter">62%</text>
      <text x="60" y="231" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="Inter">Facebook</text>

      <circle cx="340" cy="220" r="24" fill="#2a2c1f" stroke="#03fa6e" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="340" y="217" textAnchor="middle" fill="#03fa6e" fontSize="11" fontWeight="900" fontFamily="Inter">54%</text>
      <text x="340" y="231" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="Inter">Sitio Web</text>
    </svg>
  );
}

function OpenRateChart() {
  return (
    <svg viewBox="0 0 500 200" className="w-full h-auto" role="img" aria-label="Comparación tasa de apertura WhatsApp vs Email">
      <line x1="60" y1="170" x2="480" y2="170" stroke="#3a3d2c" strokeWidth="1" />
      <line x1="60" y1="30" x2="60" y2="170" stroke="#3a3d2c" strokeWidth="1" />
      <line x1="60" y1="30" x2="480" y2="30" stroke="#2a2c1f" strokeDasharray="3 3" />
      <line x1="60" y1="65" x2="480" y2="65" stroke="#2a2c1f" strokeDasharray="3 3" />
      <line x1="60" y1="100" x2="480" y2="100" stroke="#2a2c1f" strokeDasharray="3 3" />
      <line x1="60" y1="135" x2="480" y2="135" stroke="#2a2c1f" strokeDasharray="3 3" />
      <text x="50" y="34" textAnchor="end" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">100%</text>
      <text x="50" y="69" textAnchor="end" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">75%</text>
      <text x="50" y="104" textAnchor="end" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">50%</text>
      <text x="50" y="139" textAnchor="end" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">25%</text>
      <rect x="120" y="34" width="100" height="136" rx="6" fill="#03fa6e" />
      <text x="170" y="26" textAnchor="middle" fill="#03fa6e" fontSize="20" fontWeight="900" fontFamily="JetBrains Mono">99%</text>
      <text x="170" y="192" textAnchor="middle" fill="#f4f4f0" fontSize="12" fontWeight="700" fontFamily="Inter">WhatsApp</text>
      <rect x="320" y="156" width="100" height="14" rx="6" fill="#5a5d4a" />
      <text x="370" y="148" textAnchor="middle" fill="#a1a1aa" fontSize="20" fontWeight="900" fontFamily="JetBrains Mono">21%</text>
      <text x="370" y="192" textAnchor="middle" fill="#f4f4f0" fontSize="12" fontWeight="700" fontFamily="Inter">Email</text>
    </svg>
  );
}

function LandDiagram() {
  return (
    <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparación entre construir tu negocio en una red social (terreno alquilado) y en tu propio sitio web (terreno propio)" className="w-full h-auto">
      <defs>
        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03fa6e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#03fa6e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="30" y1="230" x2="870" y2="230" stroke="#383a2c" strokeWidth="2" />
      <g>
        <rect x="60" y="150" width="300" height="80" fill="none" stroke="#5a5c48" strokeWidth="1.5" strokeDasharray="6 6" />
        <rect x="150" y="120" width="120" height="60" fill="none" stroke="#5a5c48" strokeWidth="2" />
        <path d="M145 120 L210 90 L275 120" fill="none" stroke="#5a5c48" strokeWidth="2" strokeLinejoin="round" />
        <rect x="195" y="150" width="30" height="30" fill="none" stroke="#5a5c48" strokeWidth="1.5" />
        <g transform="translate(190,50)">
          <rect x="0" y="14" width="40" height="28" rx="4" fill="none" stroke="#5a5c48" strokeWidth="2" />
          <path d="M8 14v-4a12 12 0 0124 0v4" fill="none" stroke="#5a5c48" strokeWidth="2" />
          <circle cx="20" cy="28" r="3" fill="#5a5c48" />
        </g>
        <text x="210" y="255" textAnchor="middle" fill="#9a9c87" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="600">RED SOCIAL</text>
        <text x="210" y="272" textAnchor="middle" fill="#6a6c58" fontFamily="JetBrains Mono, monospace" fontSize="11">terreno alquilado</text>
      </g>
      <line x1="450" y1="70" x2="450" y2="230" stroke="#383a2c" strokeWidth="1" strokeDasharray="4 6" />
      <g>
        <rect x="540" y="230" width="300" height="6" fill="url(#glow)" />
        <rect x="560" y="140" width="260" height="90" fill="none" stroke="#03fa6e" strokeWidth="2" />
        <rect x="640" y="105" width="140" height="65" fill="none" stroke="#03fa6e" strokeWidth="2.5" />
        <path d="M632 105 L710 65 L788 105" fill="none" stroke="#03fa6e" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="695" y="140" width="30" height="30" fill="#03fa6e" opacity="0.9" />
        <rect x="655" y="120" width="18" height="18" fill="none" stroke="#03fa6e" strokeWidth="1.5" />
        <rect x="747" y="120" width="18" height="18" fill="none" stroke="#03fa6e" strokeWidth="1.5" />
        <line x1="710" y1="65" x2="710" y2="35" stroke="#03fa6e" strokeWidth="2" />
        <path d="M710 35 L740 42 L710 49 Z" fill="#03fa6e" />
        <path d="M600 230 L590 250 M650 230 L645 252 M770 230 L775 252 M820 230 L830 250" stroke="#03fa6e" strokeWidth="1.5" opacity="0.5" />
        <text x="690" y="255" textAnchor="middle" fill="#f3f2e8" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700">TU SITIO WEB</text>
        <text x="690" y="272" textAnchor="middle" fill="#03fa6e" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600">terreno propio</text>
      </g>
    </svg>
  );
}

function HeroVisualAutomation() {
  return (
    <svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <g fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="600">
        <rect x="10" y="20" width="80" height="42" rx="8" fill="none" stroke="#03fa6e" strokeWidth="1.6" />
        <text x="50" y="45" textAnchor="middle" fill="#f3f2e8">LEAD</text>
        <rect x="130" y="20" width="80" height="42" rx="8" fill="none" stroke="#03fa6e" strokeWidth="1.6" />
        <text x="170" y="45" textAnchor="middle" fill="#f3f2e8">CRM</text>
        <rect x="250" y="20" width="80" height="42" rx="8" fill="none" stroke="#03fa6e" strokeWidth="1.6" />
        <text x="290" y="38" textAnchor="middle" fill="#f3f2e8">CANALES</text>
        <text x="290" y="51" textAnchor="middle" fill="#03fa6e" fontSize="7.5">WSP · IG · WEB</text>
        <rect x="70" y="130" width="90" height="42" rx="8" fill="none" stroke="#03fa6e" strokeWidth="1.6" />
        <text x="115" y="150" textAnchor="middle" fill="#f3f2e8">FACTURA</text>
        <text x="115" y="162" textAnchor="middle" fill="#03fa6e" fontSize="9">automática</text>
        <rect x="200" y="130" width="90" height="42" rx="8" fill="none" stroke="#03fa6e" strokeWidth="1.6" />
        <text x="245" y="150" textAnchor="middle" fill="#f3f2e8">REPORTE</text>
        <text x="245" y="162" textAnchor="middle" fill="#03fa6e" fontSize="9">tiempo real</text>
        <path d="M90 41 H130" stroke="#03fa6e" strokeWidth="1.6" markerEnd="url(#arrow-auto)" />
        <path d="M210 41 H250" stroke="#03fa6e" strokeWidth="1.6" markerEnd="url(#arrow-auto)" />
        <path d="M170 62 V100 Q170 115 155 118 L120 128" stroke="#03fa6e" strokeWidth="1.6" fill="none" markerEnd="url(#arrow-auto)" />
        <path d="M170 62 V100 Q170 115 190 118 L225 128" stroke="#03fa6e" strokeWidth="1.6" fill="none" markerEnd="url(#arrow-auto)" />
      </g>
      <defs>
        <marker id="arrow-auto" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="#03fa6e" />
        </marker>
      </defs>
      <rect x="10" y="188" width="150" height="24" rx="12" fill="rgba(3,250,110,0.14)" stroke="#03fa6e" strokeWidth="1" />
      <text x="85" y="204" textAnchor="middle" fill="#03fa6e" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">✓ SISTEMA ACTIVO 24/7</text>
    </svg>
  );
}

function FlowDiagram() {
  return (
    <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparación entre un proceso manual desconectado y un proceso automatizado conectado de principio a fin" className="w-full h-auto">
      <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#9a9c87">
        <rect x="50" y="55" width="90" height="42" rx="6" fill="none" stroke="#5a5c48" strokeWidth="1.5" transform="rotate(-4 95 76)" />
        <text x="95" y="80" textAnchor="middle" transform="rotate(-4 95 76)">Excel</text>
        <rect x="180" y="30" width="90" height="42" rx="6" fill="none" stroke="#5a5c48" strokeWidth="1.5" transform="rotate(3 225 51)" />
        <text x="225" y="55" textAnchor="middle" transform="rotate(3 225 51)">WhatsApp</text>
        <rect x="90" y="150" width="90" height="42" rx="6" fill="none" stroke="#5a5c48" strokeWidth="1.5" transform="rotate(2 135 171)" />
        <text x="135" y="175" textAnchor="middle" transform="rotate(2 135 171)">Cuaderno</text>
        <rect x="230" y="160" width="90" height="42" rx="6" fill="none" stroke="#5a5c48" strokeWidth="1.5" transform="rotate(-3 275 181)" />
        <text x="275" y="185" textAnchor="middle" transform="rotate(-3 275 181)">Correo</text>
        <path d="M140 90 L190 60" stroke="#5a5c48" strokeWidth="1.2" strokeDasharray="4 4" />
        <path d="M140 100 L120 155" stroke="#5a5c48" strokeWidth="1.2" strokeDasharray="4 4" />
        <path d="M225 72 L260 165" stroke="#5a5c48" strokeWidth="1.2" strokeDasharray="4 4" />
        <path d="M180 175 L235 178" stroke="#5a5c48" strokeWidth="1.2" strokeDasharray="4 4" />
      </g>
      <text x="185" y="260" textAnchor="middle" fill="#9a9c87" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700">ANTES</text>
      <text x="185" y="277" textAnchor="middle" fill="#6a6c58" fontFamily="JetBrains Mono, monospace" fontSize="11">herramientas desconectadas</text>
      <line x1="450" y1="40" x2="450" y2="230" stroke="#383a2c" strokeWidth="1" strokeDasharray="4 6" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="600">
        <rect x="500" y="110" width="80" height="42" rx="8" fill="none" stroke="#03fa6e" strokeWidth="2" />
        <text x="540" y="135" textAnchor="middle" fill="#f3f2e8">Lead</text>
        <rect x="615" y="110" width="80" height="42" rx="8" fill="none" stroke="#03fa6e" strokeWidth="2" />
        <text x="655" y="135" textAnchor="middle" fill="#f3f2e8">CRM</text>
        <rect x="730" y="110" width="80" height="42" rx="8" fill="none" stroke="#03fa6e" strokeWidth="2" />
        <text x="770" y="135" textAnchor="middle" fill="#f3f2e8">WhatsApp</text>
        <path d="M580 131 H615" stroke="#03fa6e" strokeWidth="2" markerEnd="url(#arrow-flow)" />
        <path d="M695 131 H730" stroke="#03fa6e" strokeWidth="2" markerEnd="url(#arrow-flow)" />
        <path d="M770 152 V180 Q770 190 760 190 L560 190 Q550 190 550 180 V152" stroke="#03fa6e" strokeWidth="2" fill="none" markerEnd="url(#arrow-flow)" />
        <text x="560" y="220" textAnchor="middle" fill="#03fa6e" fontSize="10.5">Factura + Reporte automáticos</text>
      </g>
      <defs>
        <marker id="arrow-flow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="#03fa6e" />
        </marker>
      </defs>
      <text x="685" y="260" textAnchor="middle" fill="#f3f2e8" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700">DESPUÉS</text>
      <text x="685" y="277" textAnchor="middle" fill="#03fa6e" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600">un solo sistema conectado</text>
    </svg>
  );
}

function FAQItem({q, a}: {q: string; a: string}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-scale-border py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center gap-5 text-left font-semibold text-base text-scale-text cursor-pointer"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className={cn('text-scale-accent font-mono text-xl flex-shrink-0 transition-transform duration-200', open && 'rotate-45')}>+</span>
      </button>
      {open && (
        <motion.p
          initial={{opacity: 0, height: 0}}
          animate={{opacity: 1, height: 'auto'}}
          className="text-scale-muted text-base mt-3.5 max-w-[680px]"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}

interface ServiceLandingPageProps {
  id: string;
  title: string;
  subtitle: string;
  desc: string[];
  whatsappText: string;
}

export default function ServiceLandingPage({
  id,
  title,
  subtitle,
  desc,
  whatsappText,
}: ServiceLandingPageProps) {
  const wppLink = `https://wa.me/584121234567?text=${encodeURIComponent(whatsappText)}`;
  const isDisenoWeb = id === 'diseno-web';
  const isAutomatizacion = id === 'automatizacion';
  const isChatbots = id === 'chatbots';
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 250);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -20}}
      transition={{duration: 0.5, ease: 'easeOut'}}
      className="flex flex-col min-h-screen"
    >
      <main className="flex-grow">
        {isDisenoWeb ? (
          <>
            {/* BACK NAV */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 pt-24 sm:pt-28">
              <Link
                href="/#servicios"
                className="inline-flex items-center gap-2 text-scale-muted hover:text-scale-accent transition-colors font-mono text-sm"
              >
                <ArrowLeft size={16} />
                Volver a Servicios
              </Link>
            </div>

            {/* HERO */}
            <section className="pt-6 md:pt-8 pb-20 md:pb-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Diseño & Desarrollo Web
                  </div>
                  <h1 className="text-[clamp(34px,4.6vw,54px)] font-bold leading-[1.15] tracking-tight mb-5">
                    Tu sitio web no es una vitrina. Es tu <span className="text-scale-accent">mejor vendedor</span>, trabajando 24 horas al día.
                  </h1>
                  <p className="text-lg text-scale-muted max-w-[540px] mb-8">
                    Diseñamos y desarrollamos sitios ultrarrápidos, hechos a la medida de tu negocio, para que dejes de depender del algoritmo y empieces a controlar cómo te encuentran, te conocen y te compran.
                  </p>
                  <div className="flex gap-4 flex-wrap mb-7">
                    <a href="#contacto" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)] transition-all duration-150">
                      Solicita tu Diagnóstico Gratuito
                    </a>
                    <a href="#proceso" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-transparent border border-scale-border text-scale-text hover:border-scale-accent hover:text-scale-accent transition-all duration-150">
                      Ver cómo trabajamos
                    </a>
                  </div>
                  <p className="font-mono text-sm text-scale-muted">
                    <span className="text-scale-text font-bold">+25 años</span> diseñando y desarrollando sitios web, ecommerce y plataformas digitales en Venezuela.
                  </p>
                </div>
                <div className="relative bg-scale-card border border-scale-border rounded-[20px] p-6 overflow-hidden" aria-hidden="true">
                  <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'linear-gradient(#2a2c1f 1px, transparent 1px), linear-gradient(90deg, #2a2c1f 1px, transparent 1px)', backgroundSize: '26px 26px', opacity: 0.25}} />
                  <div className="flex gap-[6px] mb-4 relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-scale-border" />
                    <span className="w-2.5 h-2.5 rounded-full bg-scale-border" />
                    <span className="w-2.5 h-2.5 rounded-full bg-scale-border" />
                  </div>
                  <div className="h-2.5 rounded bg-scale-border mb-2.5 w-2/5 relative" />
                  <div className="h-2.5 rounded bg-scale-border mb-2.5 w-4/5 relative" />
                  <div className="h-2.5 rounded bg-scale-border mb-2.5 w-3/5 relative" />
                  <div className="h-[34px] w-[44%] rounded-full bg-scale-accent mt-[18px] relative" />
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-[#1d1f15] border border-scale-border rounded-[10px] h-16" />
                    <div className="bg-[#1d1f15] border border-scale-border rounded-[10px] h-16" />
                  </div>
                </div>
              </div>
            </section>

            {/* STATS BAR */}
            <div className="border-y border-scale-border py-8">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">25+</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Años de experiencia en desarrollo web y ecommerce</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">125%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Creció el comercio electrónico en Venezuela durante 2025 (Cavecom-e)</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">80%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">De los venezolanos se conecta a internet desde su celular</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">24/7</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Tu sitio vende y atiende, incluso cuando tú no estás conectado</div>
                </div>
              </div>
            </div>

            {/* PAIN SECTION */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="max-w-[760px] mb-5">
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    La realidad del mercado
                  </div>
                  <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-tight mb-4">El peligro de construir tu negocio en terreno ajeno</h2>
                  <p className="text-[17.5px] text-scale-muted mb-4">
                    Cada publicación que subes a Instagram, cada catálogo que armas en tu perfil de Facebook, cada seguidor que ganas con esfuerzo: <strong className="text-scale-text">no es tuyo.</strong> Estás construyendo tu negocio sobre terreno alquilado, y el dueño del terreno puede cambiar las reglas cuando quiera.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-[18px_32px] my-10">
                  {painPoints.map((p, i) => (
                    <div key={i} className="flex gap-[14px]">
                      <div className="flex-shrink-0 w-[34px] h-[34px] rounded-[9px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-bold mb-1">{p.title}</h4>
                        <p className="text-base text-scale-muted">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-scale-card border border-scale-border border-l-[3px] border-l-scale-accent rounded-[14px] p-[26px_28px] my-12">
                  <span className="block font-mono text-xs tracking-[0.1em] text-scale-accent uppercase font-bold mb-2.5">La realidad venezolana</span>
                  <p className="text-base">A esto se suma algo que todo empresario en Venezuela conoce de primera mano: la atención al cliente lenta y la falta de sitios web que realmente vendan están entre las quejas más comunes del consumidor local. Mensajes sin responder, catálogos desactualizados en un PDF de WhatsApp, páginas que tardan más de lo que un visitante está dispuesto a esperar. El resultado: negocios con buenos productos que pierden ventas por una experiencia digital que no está a la altura, justo cuando el ecommerce venezolano crece a un ritmo histórico.</p>
                </div>

                <div className="my-14">
                  <LandDiagram />
                  <p className="text-center font-mono text-sm text-scale-muted mt-3.5 tracking-[0.03em]">Lo que construyes sobre terreno alquilado puede desaparecer. Lo que construyes sobre terreno propio, se queda contigo.</p>
                </div>

                <div className="overflow-x-auto border border-scale-border rounded-[14px] mt-2.5">
                  <table className="min-w-[640px] w-full">
                    <caption className="text-left font-mono text-sm text-scale-muted p-[14px_20px_0]">Comparación: presencia en redes sociales vs. sitio web propio</caption>
                    <thead>
                      <tr>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-muted bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Aspecto</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-muted bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Red social (terreno alquilado)</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-accent bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Tu sitio web (terreno propio)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Propiedad de tus datos y clientes', 'La plataforma es dueña', 'Tuya, para siempre'],
                        ['Control del diseño y la marca', 'Limitado a la plantilla de la app', 'Total, a tu medida'],
                        ['Dependencia del algoritmo', 'Alta: decide quién te ve', 'Ninguna: tú decides quién te encuentra'],
                        ['Riesgo de suspensión o bloqueo', 'Real y fuera de tu control', 'No existe'],
                        ['Venta 24/7 sin publicar constantemente', 'Requiere contenido constante', 'Automática, siempre activa'],
                        ['Integración con CRM, pagos y automatizaciones', 'Muy limitada', 'Total'],
                        ['Posicionamiento en Google a largo plazo (SEO)', 'Prácticamente nulo', 'Se construye y compone con el tiempo'],
                        ['Primera impresión ante clientes corporativos', 'Informal', 'Profesional'],
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)]">
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left">{row[0]}</td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left text-scale-muted"><span className="mr-2 text-scale-border">—</span>{row[1]}</td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left font-semibold"><span className="text-scale-accent mr-2 font-bold">✓</span>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section id="solucion" className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  La solución
                </div>
                <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-tight max-w-[720px]">Una web que no es un folleto digital: es un sistema de ventas</h2>
                <p className="text-scale-muted text-[17px] max-w-[620px] mt-4">Como agencia de IA y automatización, no diseñamos páginas aisladas. Construimos el canal digital que conecta con el resto de tu negocio: tu chatbot, tu CRM, tu facturación.</p>

                <div className="grid md:grid-cols-3 gap-[22px] mt-11">
                  {benefits.map((b, i) => (
                    <div key={i} className="bg-scale-card border border-scale-border rounded-[14px] p-[26px] hover:border-[rgba(3,250,110,0.28)] hover:-translate-y-[3px] transition-all duration-200">
                      <div className="w-[42px] h-[42px] rounded-[11px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center mb-4">
                        {b.icon}
                      </div>
                      <h3 className="text-base font-bold mb-2">{b.title}</h3>
                      <p className="text-base text-scale-muted">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SERVICES BREAKDOWN */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Cómo trabajamos contigo
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Tres formas de empezar, según dónde estés hoy</h2>

                <div className="grid md:grid-cols-3 gap-[22px] mt-11">
                  {serviceModes.map((s, i) => (
                    <div key={i} className={cn('border rounded-[14px] p-[30px_26px] flex flex-col', s.featured ? 'border-scale-accent shadow-[inset_0_0_0_1px_#03fa6e] bg-scale-card' : 'border-scale-border bg-[#1d1f15]')}>
                      <span className="font-mono text-xs text-scale-accent uppercase tracking-[0.08em] font-bold mb-3.5">{s.tag}</span>
                      <h3 className="text-[19px] font-bold mb-2.5">{s.title}</h3>
                      <p className="text-base text-scale-muted mb-[18px] flex-grow">{s.desc}</p>
                      <ul>
                        {s.items.map((item, j) => (
                          <li key={j} className="text-sm text-scale-muted pl-[18px] relative mb-2 before:content-['→'] before:absolute before:left-0 before:text-scale-accent">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* EXPERIENCE / STACK */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid md:grid-cols-2 gap-14 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Experiencia
                  </div>
                  <h2 className="text-[clamp(26px,3.2vw,34px)] font-bold">Más de 25 años construyendo lo que tu negocio necesita</h2>
                  <p className="text-scale-muted text-base mt-4">Desde tiendas en línea hasta plataformas de aprendizaje y sitios corporativos, hemos diseñado y desarrollado para prácticamente todo tipo de negocio.</p>
                  <div className="grid grid-cols-2 gap-3.5 mt-6">
                    <div className="border border-scale-border rounded-lg p-[14px_16px] text-base text-scale-muted"><b className="block text-scale-text text-sm mb-[3px]">Ecommerce</b>Tiendas en línea completas, con pagos y logística integrados.</div>
                    <div className="border border-scale-border rounded-lg p-[14px_16px] text-base text-scale-muted"><b className="block text-scale-text text-sm mb-[3px]">Plataformas de aprendizaje</b>Sistemas LMS para cursos y contenido educativo.</div>
                    <div className="border border-scale-border rounded-lg p-[14px_16px] text-base text-scale-muted"><b className="block text-scale-text text-sm mb-[3px]">Webs corporativas</b>Presencia institucional seria, para negocios B2B.</div>
                    <div className="border border-scale-border rounded-lg p-[14px_16px] text-base text-scale-muted"><b className="block text-scale-text text-sm mb-[3px]">Landing pages</b>Páginas de alta conversión para campañas específicas.</div>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-scale-muted uppercase tracking-[0.08em] mb-4">Tecnologías con las que trabajamos</div>
                  <div className="flex flex-wrap gap-2.5">
                    {['WordPress', 'WooCommerce', 'Shopify', 'Wix', 'PHP', 'Next.js', 'Python'].map((tech) => (
                      <span key={tech} className="font-mono text-xs px-4 py-[9px] rounded-full border border-scale-border text-scale-muted">{tech}</span>
                    ))}
                  </div>
                  <p className="text-scale-muted text-base mt-5">Elegimos la tecnología según lo que tu negocio realmente necesita, no según lo que nos resulte más cómodo a nosotros. Un ecommerce mediano no necesita lo mismo que una plataforma a medida con lógica de negocio compleja.</p>
                </div>
              </div>
            </section>

            {/* PROCESS */}
            <section id="proceso" className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Nuestro proceso
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[600px]">Cómo trabajamos, de principio a fin</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[22px] mt-12">
                  {processSteps.map((step, i) => (
                    <div key={i} className="pt-2">
                      <div className="font-mono text-3xl text-scale-accent font-bold mb-3.5">{step.num}</div>
                      <h4 className="text-base font-bold mb-2">{step.title}</h4>
                      <p className="text-base text-scale-muted">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Preguntas frecuentes
                </div>
                <h2 className="text-[clamp(26px,3.2vw,34px)] font-bold">Resolvemos tus dudas antes de que las tengas</h2>

                <div className="mt-10 max-w-[820px]">
                  {faqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            </section>

            {/* FINAL CTA */}
            <section id="contacto" className="pb-20 md:pb-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="text-center bg-scale-card border border-[rgba(3,250,110,0.28)] rounded-[20px] py-[70px] px-[40px] sm:px-10">
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Empecemos
                  </div>
                  <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold mb-4">
                    Deja de alquilar tu presencia digital.<br />Empieza a construir sobre terreno propio.
                  </h2>
                  <p className="text-scale-muted text-base max-w-[560px] mx-auto mb-8">
                    Una conversación cara a cara, sin compromiso. Te decimos qué necesita tu negocio, no lo que es más fácil vendernos a nosotros.
                  </p>
                  <a href={wppLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)] transition-all duration-150">
                    Solicita tu Diagnóstico Gratuito
                  </a>
                  <p className="font-mono text-xs text-scale-muted mt-5">Respuesta en menos de 24 horas · Servicio personalizado · Valencia y Caracas</p>
                </div>
              </div>
            </section>

          </>
        ) : isAutomatizacion ? (
          <>
            {/* BACK NAV */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 pt-24 sm:pt-28">
              <Link
                href="/#servicios"
                className="inline-flex items-center gap-2 text-scale-muted hover:text-scale-accent transition-colors font-mono text-sm"
              >
                <ArrowLeft size={16} />
                Volver a Servicios
              </Link>
            </div>

            {/* HERO */}
            <section className="pt-6 md:pt-8 pb-20 md:pb-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Automatización de Procesos
                  </div>
                  <h1 className="text-[clamp(34px,4.6vw,52px)] font-bold leading-[1.15] tracking-tight mb-5">
                    Deja que tus herramientas trabajen juntas, mientras tu equipo se dedica a <span className="text-scale-accent">cerrar ventas</span>.
                  </h1>
                  <p className="text-lg text-scale-muted max-w-[540px] mb-8">
                    Conectamos tu CRM, WhatsApp, redes sociales, tu web y tu facturación en un solo sistema automático, para que ningún lead se pierda por una tarea que se te olvidó hacer a mano.
                  </p>
                  <div className="flex gap-4 flex-wrap mb-7">
                    <a href="#contacto" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)] transition-all duration-150">
                      Solicita tu Diagnóstico Gratuito
                    </a>
                    <a href="#proceso" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-transparent border border-scale-border text-scale-text hover:border-scale-accent hover:text-scale-accent transition-all duration-150">
                      Ver cómo funciona
                    </a>
                  </div>
                  <p className="font-mono text-sm text-scale-muted">
                    <span className="text-scale-text font-bold">+25 años</span> en tecnología · más de un año diseñando automatizaciones con IA para negocios en Venezuela.
                  </p>
                </div>
                <div className="relative bg-scale-card border border-scale-border rounded-[20px] p-6 overflow-hidden" aria-hidden="true">
                  <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'linear-gradient(#2a2c1f 1px, transparent 1px), linear-gradient(90deg, #2a2c1f 1px, transparent 1px)', backgroundSize: '26px 26px', opacity: 0.25}} />
                  <HeroVisualAutomation />
                </div>
              </div>
            </section>

            {/* STATS BAR */}
            <div className="border-y border-scale-border py-8">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">25+</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Años de experiencia en desarrollo y tecnología</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">92%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">De los venezolanos usa WhatsApp a diario para hablar con empresas, además de redes sociales y web</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">6+</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Horas semanales que los equipos podrían recuperar automatizando tareas repetitivas</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">24/7</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Tu sistema sigue funcionando aunque tu equipo ya se haya ido a casa</div>
                </div>
              </div>
            </div>

            {/* PAIN SECTION */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="max-w-[760px] mb-5">
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    La realidad operativa
                  </div>
                  <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-tight mb-4">El costo oculto de hacerlo todo a mano</h2>
                  <p className="text-[17.5px] text-scale-muted mb-4">
                    Cada tarea manual repetitiva no solo consume tiempo: <strong className="text-scale-text">esconde un costo que no aparece en ningún reporte</strong>, hasta que ya es demasiado tarde. Un lead sin responder en WhatsApp, Instagram o tu web, una factura mal calculada, un proceso que cada empleado hace a su manera: todo eso es dinero que se pierde sin que nadie lo note.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-[18px_32px] my-10">
                  {automationPainPoints.map((p, i) => (
                    <div key={i} className="flex gap-[14px]">
                      <div className="flex-shrink-0 w-[34px] h-[34px] rounded-[9px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-bold mb-1">{p.title}</h4>
                        <p className="text-base text-scale-muted">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-scale-card border border-scale-border border-l-[3px] border-l-scale-accent rounded-[14px] p-[26px_28px] my-12">
                  <span className="block font-mono text-xs tracking-[0.1em] text-scale-accent uppercase font-bold mb-2.5">La realidad venezolana</span>
                  <p className="text-base">En Venezuela, WhatsApp es el canal principal de comunicación comercial, usado a diario por la inmensa mayoría de la población para hablar con empresas, pero casi nunca es el único: la misma empresa suele recibir leads por Instagram, Facebook, su sitio web y hasta por teléfono. Cualquier automatización real tiene que unificar todos esos canales en un solo lugar, no resolver uno y dejar los demás sueltos. A esto se suma la complejidad de facturar en bolívares y dólares con la tasa de cambio del día, y una rotación de personal que hace peligroso que el conocimiento de "cómo se hacen las cosas aquí" viva solo en la cabeza de una persona.</p>
                </div>

                <div className="my-14">
                  <FlowDiagram />
                  <p className="text-center font-mono text-sm text-scale-muted mt-3.5 tracking-[0.03em]">Lo que antes vivía en cinco lugares distintos, ahora es un solo flujo que nadie tiene que vigilar a mano.</p>
                </div>

                <div className="overflow-x-auto border border-scale-border rounded-[14px] mt-2.5">
                  <table className="min-w-[640px] w-full">
                    <caption className="text-left font-mono text-sm text-scale-muted p-[14px_20px_0]">Comparación: proceso manual vs. proceso automatizado</caption>
                    <thead>
                      <tr>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-muted bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Aspecto</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-muted bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Proceso manual</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-accent bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Proceso automatizado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Tiempo de respuesta a un lead', 'Minutos u horas, según disponibilidad', 'Segundos, a cualquier hora'],
                        ['Riesgo de error humano', 'Alto: tipeo, olvido, duplicados', 'Mínimo: las reglas se ejecutan siempre igual'],
                        ['Seguimiento de clientes', 'Depende de la memoria del vendedor', 'Automático, nada se cae entre grietas'],
                        ['Facturación', 'Manual, propensa a errores de cálculo', 'Automática, con tasa de cambio actualizada'],
                        ['Visibilidad del negocio', 'Reportes armados a mano, después del hecho', 'Panel en tiempo real'],
                        ['Escalabilidad', 'Crecer significa contratar más gente', 'Crecer significa ajustar el sistema'],
                        ['Disponibilidad', 'Horario de oficina', '24 horas, 7 días a la semana'],
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)]">
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left">{row[0]}</td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left text-scale-muted"><span className="mr-2 text-scale-border">—</span>{row[1]}</td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left font-semibold"><span className="text-scale-accent mr-2 font-bold">✓</span>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section id="solucion" className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  La solución
                </div>
                <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-tight max-w-[720px]">Un sistema, no herramientas sueltas hablando idiomas distintos</h2>
                <p className="text-scale-muted text-[17px] max-w-[620px] mt-4">No conectamos aplicaciones al azar. Diseñamos el flujo completo, desde que llega un lead hasta que se cobra la factura, para que trabaje solo.</p>

                <div className="grid md:grid-cols-3 gap-[22px] mt-11">
                  {automationBenefits.map((b, i) => (
                    <div key={i} className="bg-scale-card border border-scale-border rounded-[14px] p-[26px] hover:border-[rgba(3,250,110,0.28)] hover:-translate-y-[3px] transition-all duration-200">
                      <div className="w-[42px] h-[42px] rounded-[11px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center mb-4">
                        {b.icon}
                      </div>
                      <h3 className="text-base font-bold mb-2">{b.title}</h3>
                      <p className="text-base text-scale-muted">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* USE CASES */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Así se ve en la práctica
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[680px]">Escenarios reales de lo que resolvemos, según tu tipo de negocio</h2>
                <p className="text-sm text-scale-muted italic mt-2.5 max-w-[640px]">Estos son escenarios ilustrativos que representan los retos más comunes que encontramos en cada industria, no testimonios de clientes específicos.</p>

                <div className="grid md:grid-cols-3 gap-[22px] mt-10">
                  {useCases.map((uc, i) => (
                    <div key={i} className="border border-scale-border rounded-[14px] p-[28px_24px] bg-[#1d1f15] flex flex-col">
                      <span className="font-mono text-xs text-scale-accent uppercase tracking-[0.08em] font-bold mb-3.5">{uc.tag}</span>
                      <h3 className="text-[18px] font-bold mb-3.5">{uc.title}</h3>
                      <div className="mb-3">
                        <b className="block font-mono text-xs text-scale-muted uppercase tracking-[0.04em] mb-1">El reto</b>
                        <p className="text-base text-scale-text">{uc.reto}</p>
                      </div>
                      <div className="mb-3">
                        <b className="block font-mono text-xs text-scale-muted uppercase tracking-[0.04em] mb-1">La automatización</b>
                        <p className="text-base text-scale-text">{uc.solution}</p>
                      </div>
                      <div className="mt-auto">
                        <b className="block font-mono text-xs text-scale-muted uppercase tracking-[0.04em] mb-1">El resultado</b>
                        <p className="text-base text-scale-accent font-semibold">{uc.resultado}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* VENEZUELA ADVANTAGES */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Pensado para Venezuela
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Automatización diseñada para la realidad local, no traducida de otro país</h2>

                <div className="grid md:grid-cols-2 gap-5 mt-10">
                  {veAdvantages.map((va, i) => (
                    <div key={i} className="flex gap-4 bg-scale-card border border-scale-border rounded-[14px] p-[22px]">
                      <div className="flex-shrink-0 w-[38px] h-[38px] rounded-[10px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center">
                        {va.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-bold mb-1.5">{va.title}</h4>
                        <p className="text-base text-scale-muted">{va.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PROCESS */}
            <section id="proceso" className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Nuestro proceso
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[600px]">Cómo automatizamos tu negocio, paso a paso</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[22px] mt-12">
                  {automationProcessSteps.map((step, i) => (
                    <div key={i} className="pt-2">
                      <div className="font-mono text-3xl text-scale-accent font-bold mb-3.5">{step.num}</div>
                      <h4 className="text-base font-bold mb-2">{step.title}</h4>
                      <p className="text-base text-scale-muted">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Preguntas frecuentes
                </div>
                <h2 className="text-[clamp(26px,3.2vw,34px)] font-bold">Resolvemos tus dudas antes de que las tengas</h2>

                <div className="mt-10 max-w-[820px]">
                  {automationFaqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            </section>

            {/* FINAL CTA */}
            <section id="contacto" className="pb-20 md:pb-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="text-center bg-scale-card border border-[rgba(3,250,110,0.28)] rounded-[20px] py-[70px] px-[40px] sm:px-10">
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Empecemos
                  </div>
                  <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold mb-4">
                    Deja de perseguir tareas manuales.<br />Empieza a dirigir un sistema que trabaja solo.
                  </h2>
                  <p className="text-scale-muted text-base max-w-[560px] mx-auto mb-8">
                    Una conversación cara a cara, sin compromiso. Te decimos qué procesos conviene automatizar primero, no lo que es más fácil vendernos a nosotros.
                  </p>
                  <a href={wppLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)] transition-all duration-150">
                    Solicita tu Diagnóstico Gratuito
                  </a>
                  <p className="font-mono text-xs text-scale-muted mt-5">Respuesta en menos de 24 horas · Servicio personalizado · Valencia y Caracas</p>
                </div>
              </div>
            </section>
          </>
        ) : isChatbots ? (
          <>
            {/* BACK NAV */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 pt-24 sm:pt-28">
              <Link
                href="/#servicios"
                className="inline-flex items-center gap-2 text-scale-muted hover:text-scale-accent transition-colors font-mono text-sm"
              >
                <ArrowLeft size={16} />
                Volver a Servicios
              </Link>
            </div>

            {/* HERO */}
            <section className="pt-6 md:pt-8 pb-20 md:pb-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Servicio Premium · AI Chatbots
                  </div>
                  <h1 className="text-[clamp(34px,4.6vw,54px)] font-bold leading-[1.15] tracking-tight mb-5">
                    AI Chatbots: <span className="text-scale-accent">el vendedor que nunca duerme.</span>
                  </h1>
                  <p className="text-lg text-scale-muted max-w-[540px] mb-2">
                    Atención instantánea que cierra ventas por ti, 24/7, en WhatsApp, Instagram y tu sitio web.
                  </p>
                  <div className="text-scale-muted text-[16px] leading-relaxed space-y-4 mb-8 max-w-[540px]">
                    <p>Imagina tener a tu mejor vendedor trabajando sin parar, sin pedir vacaciones, sin pedir aumento y —ojo— sin dejar pasar UNA sola venta. Ese es un chatbot con Inteligencia Artificial entrenado con la información de tu empresa: tus manuales, tu catálogo, tus precios, tus casos de uso más frecuentes y hasta el tono con el que le hablas a tus clientes.</p>
                    <p>Tu chatbot personalizado responde dudas, agenda citas, califica prospectos y cierra ventas las 24 horas en WhatsApp, Instagram y tu sitio web. Mientras tú duermes, tu agente IA está atendiendo al cliente que recién se decidió a comprar a las 11 de la noche.</p>
                  </div>
                  <div className="flex gap-4 flex-wrap mb-7">
                    <a href="#contacto" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)] transition-all duration-150">
                      Quiero mi chatbot IA →
                    </a>
                    <a href="#solucion" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-transparent border border-scale-border text-scale-text hover:border-scale-accent hover:text-scale-accent transition-all duration-150">
                      Ver demo en vivo
                    </a>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-scale-border">
                    <div>
                      <div className="font-mono text-[clamp(20px,2.5vw,28px)] font-bold text-scale-accent">24/7</div>
                      <div className="text-sm text-scale-muted mt-1">Atención sin horarios</div>
                    </div>
                    <div>
                      <div className="font-mono text-[clamp(20px,2.5vw,28px)] font-bold text-scale-accent">99%</div>
                      <div className="text-sm text-scale-muted mt-1">Tasa de apertura WhatsApp</div>
                    </div>
                    <div>
                      <div className="font-mono text-[clamp(20px,2.5vw,28px)] font-bold text-scale-accent">−65%</div>
                      <div className="text-sm text-scale-muted mt-1">Costo operativo de atención</div>
                    </div>
                  </div>
                </div>
                <div className="relative bg-scale-card border border-scale-border rounded-[20px] p-4 overflow-hidden" aria-hidden="true">
                  <ChatPreviewVisual />
                </div>
              </div>
            </section>

            {/* STATS BAR */}
            <div className="border-y border-scale-border py-8">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">+500%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Generación de leads con flujos automatizados</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">−65%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Reducción del costo por contacto</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">80%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">De consultas repetitivas absorbidas por la IA</div>
                </div>
                <div>
                  <div className="font-mono text-[clamp(26px,3vw,36px)] font-bold text-scale-accent">99%</div>
                  <div className="text-sm text-scale-muted mt-1.5 leading-[1.4]">Tasa de apertura de WhatsApp Business</div>
                </div>
              </div>
            </div>

            {/* PAIN POINTS */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="max-w-[760px] mb-5">
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Lo que juega en tu contra
                  </div>
                  <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-tight mb-4">¿Te suena esto?</h2>
                  <p className="text-[17.5px] text-scale-muted mb-4">
                    Antes de la solución, pongamos el dedo en la llaga. Estos son los dolores que viven a diario los negocios venezolanos que dependen de WhatsApp y redes para vender.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-[18px_32px] my-10">
                  {chatbotPainPoints.map((p, i) => (
                    <div key={i} className="flex gap-[14px]">
                      <div className="flex-shrink-0 w-[34px] h-[34px] rounded-[9px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-bold mb-1">{p.title}</h4>
                        <p className="text-base text-scale-muted">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-scale-card border border-scale-border border-l-[3px] border-l-scale-accent rounded-[14px] p-[26px_28px] my-12">
                  <span className="block font-mono text-xs tracking-[0.1em] text-scale-accent uppercase font-bold mb-2.5">El costo real de no responder</span>
                  <p className="text-base">Imagina una tienda que recibe 50 consultas diarias por WhatsApp y demora 4 horas en responder. La probabilidad de calificar un lead cae más de 400% cuando la respuesta tarda más de 10 minutos. Cada hora de demora es una venta que se evapora. El costo de no automatizar no aparece en ninguna factura, pero se cobra cada mes.</p>
                </div>
              </div>
            </section>

            {/* SOLUTION FEATURES */}
            <section id="solucion" className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  La solución
                </div>
                <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-tight max-w-[720px]">Tu nuevo mejor vendedor <span className="text-scale-accent">no come, no duerme, no se enferma</span></h2>
                <p className="text-scale-muted text-[17px] max-w-[620px] mt-4">No hablamos de los bots viejos de "presiona 1 para ventas". Hablamos de un agente conversacional con IA generativa, capaz de entender el lenguaje natural del venezolano (sí, incluyendo "epa pana, qué precio tiene eso"), responder con precisión y mantener una conversación real que avanza la venta.</p>

                <div className="grid md:grid-cols-3 gap-[22px] mt-11">
                  {chatbotFeatures.map((f, i) => (
                    <div key={i} className="bg-scale-card border border-scale-border rounded-[14px] p-[26px] hover:border-[rgba(3,250,110,0.28)] hover:-translate-y-[3px] transition-all duration-200">
                      <div className="w-[42px] h-[42px] rounded-[11px] bg-[rgba(3,250,110,0.14)] border border-[rgba(3,250,110,0.28)] flex items-center justify-center mb-4">
                        {f.icon}
                      </div>
                      <h3 className="text-base font-bold mb-2">{f.title}</h3>
                      <p className="text-base text-scale-muted">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* COMPARISON TABLE */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Antes vs. Después
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Las matemáticas <span className="text-scale-accent">no mienten</span></h2>
                <p className="text-scale-muted text-base mt-2 max-w-[640px]">Esta es la comparación cruda entre atender a mano y atender con un chatbot de IA. Los números están basados en benchmarks de la industria (Route Mobile 2026, Juniper Research, Chatfuel) y casos reales de pymes latinoamericanas.</p>

                <div className="overflow-x-auto border border-scale-border rounded-[14px] mt-8">
                  <table className="min-w-[640px] w-full">
                    <caption className="text-left font-mono text-sm text-scale-muted p-[14px_20px_0]">Comparación: atención manual vs. chatbot IA</caption>
                    <thead>
                      <tr>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-muted bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Indicador</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-muted bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Atención manual (hoy)</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-accent bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Con Chatbot IA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Tiempo de respuesta promedio', '2 a 4 horas', '10 segundos'],
                        ['Disponibilidad', 'Horario laboral (8–10 h)', '24/7, los 365 días'],
                        ['Consultas simultáneas', '1 a la vez por persona', '100+ a la vez'],
                        ['Costo por atención', 'Alto (salarios + rotación)', '−23% a −65% en promedio'],
                        ['Consultas repetitivas', '100% humanas (agotadoras)', '80% absorbidas por la IA'],
                        ['Tasa de apertura (WhatsApp)', 'Depende del horario', '99% de los mensajes'],
                        ['Generación de leads', 'Limitada al horario', '+500% con flujos automatizados'],
                        ['Conocimiento del negocio', 'Se va cuando renuncia el empleado', 'Queda entrenado en el agente'],
                        ['Satisfacción del cliente', 'Variable (55% promedio)', 'Consistente (hasta 92%)'],
                        ['Escalabilidad', 'Contratar más personal', 'Sumar canales sin contratar'],
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)]">
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left">{row[0]}</td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left text-scale-muted"><span className="mr-2 text-red-400">—</span>{row[1]}</td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left font-semibold"><span className="text-scale-accent mr-2 font-bold">✓</span>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* PROCESS + CASES */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  ¿Cómo funciona?
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">De la idea al primer agente vendiendo</h2>
                <p className="text-scale-muted text-base mt-2 max-w-[640px]">Implementar tu chatbot no es un proyecto de meses ni un dolor de cabeza técnico. Nuestro proceso está diseñado para que en <strong className="text-scale-accent">2 a 3 semanas</strong> tengas un agente IA vendiendo por ti.</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[22px] mt-12">
                  {chatbotProcessSteps.map((step, i) => (
                    <div key={i} className="bg-scale-card border border-scale-border rounded-[16px] p-[24px] hover:border-[rgba(3,250,110,0.28)] hover:-translate-y-[3px] transition-all duration-200">
                      <div className="font-mono text-[2rem] text-scale-accent font-bold opacity-25 leading-none mb-3">{step.num}</div>
                      <span className="block font-mono text-xs text-scale-accent font-semibold tracking-[0.05em] mb-2">{step.badge}</span>
                      <h4 className="text-base font-bold mb-2">{step.title}</h4>
                      <p className="text-base text-scale-muted">{step.desc}</p>
                    </div>
                  ))}
                </div>

                {/* SVG Timeline */}
                <div className="bg-scale-card border border-scale-border rounded-[20px] p-6 mt-12">
                  <p className="text-base font-bold mb-1"> · Proceso de implementación: de diagnóstico a lanzamiento en 2–3 semanas</p>
                  <p className="text-sm text-scale-muted mb-4">Cada etapa está diseñada para validar antes de avanzar. No hay sorpresas técnicas.</p>
                  <svg viewBox="0 0 1000 140" className="w-full h-auto" role="img" aria-label="Timeline del proceso de implementación">
                    <defs>
                      <linearGradient id="grad-line" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#03fa6e" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#03fa6e" stopOpacity="1" />
                        <stop offset="100%" stopColor="#03fa6e" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <line x1="80" y1="70" x2="920" y2="70" stroke="url(#grad-line)" strokeWidth="3" strokeLinecap="round" />
                    <g fontFamily="Inter, sans-serif">
                      <circle cx="120" cy="70" r="14" fill="#03fa6e" />
                      <circle cx="120" cy="70" r="22" fill="none" stroke="#03fa6e" strokeOpacity="0.3" strokeWidth="2" />
                      <text x="120" y="75" textAnchor="middle" fill="#171810" fontSize="13" fontWeight="900">1</text>
                      <text x="120" y="112" textAnchor="middle" fill="#f4f4f0" fontSize="14" fontWeight="700">Diagnóstico</text>
                      <text x="120" y="130" textAnchor="middle" fill="#a1a1aa" fontSize="11">Semana 1</text>
                      <circle cx="380" cy="70" r="14" fill="#03fa6e" />
                      <circle cx="380" cy="70" r="22" fill="none" stroke="#03fa6e" strokeOpacity="0.3" strokeWidth="2" />
                      <text x="380" y="75" textAnchor="middle" fill="#171810" fontSize="13" fontWeight="900">2</text>
                      <text x="380" y="112" textAnchor="middle" fill="#f4f4f0" fontSize="14" fontWeight="700">Entrenamiento</text>
                      <text x="380" y="130" textAnchor="middle" fill="#a1a1aa" fontSize="11">Semana 1-2</text>
                      <circle cx="640" cy="70" r="14" fill="#03fa6e" />
                      <circle cx="640" cy="70" r="22" fill="none" stroke="#03fa6e" strokeOpacity="0.3" strokeWidth="2" />
                      <text x="640" y="75" textAnchor="middle" fill="#171810" fontSize="13" fontWeight="900">3</text>
                      <text x="640" y="112" textAnchor="middle" fill="#f4f4f0" fontSize="14" fontWeight="700">Integración</text>
                      <text x="640" y="130" textAnchor="middle" fill="#a1a1aa" fontSize="11">Semana 2</text>
                      <circle cx="880" cy="70" r="14" fill="#03fa6e" />
                      <circle cx="880" cy="70" r="28" fill="none" stroke="#03fa6e" strokeOpacity="0.4" strokeWidth="2" />
                      <text x="880" y="75" textAnchor="middle" fill="#171810" fontSize="13" fontWeight="900">4</text>
                      <text x="880" y="112" textAnchor="middle" fill="#f4f4f0" fontSize="14" fontWeight="700">Lanzamiento</text>
                      <text x="880" y="130" textAnchor="middle" fill="#a1a1aa" fontSize="11">Semana 2-3</text>
                    </g>
                  </svg>
                </div>
              </div>
            </section>

            {/* CASES */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Casos reales
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Ya están pasando — <span className="text-scale-accent">y tú sigues sin automatizar</span></h2>
                <p className="text-scale-muted text-base mt-2 max-w-[640px]">Esto no es teoría. Ya hay pymes latinoamericanas duplicando ventas con IA. Los casos comparten un patrón: empezaron con UN solo proceso, invirtieron menos de 500 USD al mes y vieron resultados en las primeras dos semanas.</p>

                <div className="grid md:grid-cols-3 gap-[22px] mt-10">
                  {chatbotCases.map((c, i) => (
                    <div key={i} className="border border-scale-border rounded-[16px] p-[28px_24px] bg-[#1d1f15] relative overflow-hidden hover:border-[rgba(3,250,110,0.28)] hover:-translate-y-[3px] transition-all duration-200">
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-scale-accent to-transparent" />
                      <span className="block font-mono text-xs text-scale-accent font-semibold uppercase tracking-[0.05em] mb-2">{c.loc}</span>
                      <div className="font-mono text-[2rem] font-bold text-scale-accent leading-none mb-2">{c.metric}</div>
                      <h4 className="text-base font-bold mb-3">{c.title}</h4>
                      <p className="text-base text-scale-muted">{c.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-scale-card border border-scale-border border-l-[3px] border-l-scale-accent rounded-[14px] p-[26px_28px] mt-12">
                  <span className="block font-mono text-xs tracking-[0.1em] text-scale-accent uppercase font-bold mb-2.5">El patrón que se repite</span>
                  <p className="text-base">Empezaron con UN solo proceso. Invirtieron menos de 500 USD/mes. Vieron resultados en las primeras 2 semanas. No esperes a tener todo perfecto: la perfección es la enemiga de la venta.</p>
                </div>
              </div>
            </section>

            {/* OMNICHANNEL */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Omnicanalidad
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Un agente, <span className="text-scale-accent">todos tus canales</span></h2>
                <p className="text-scale-muted text-base mt-2 max-w-[640px]">Tu cliente no diferencia canales: tú sí tienes que hacerlo. Por eso tu chatbot se conecta a WhatsApp, Instagram, Facebook Messenger y tu sitio web con un solo cerebro. La conversación continúa sin importar por dónde escriban.</p>

                <div className="grid lg:grid-cols-2 gap-10 items-center mt-10">
                  <div className="bg-scale-card border border-scale-border rounded-[20px] p-6">
                    <p className="text-sm font-bold mb-1">· Cobertura omnicanal: un solo agente IA, todos los puntos de contacto</p>
                    <p className="text-xs text-scale-muted mb-3">Penetración de cada canal entre los usuarios venezolanos (DataReportal Digital 2025)</p>
                    <OmniChart />
                  </div>
                  <div>
                    {[
                      {pct: '95%', title: 'WhatsApp', desc: 'Es donde el venezolano compra. Tasa de apertura del 99% y la app que más usa al día. Tu agente responde, vende y agenda sin que muevas un dedo.'},
                      {pct: '68%', title: 'Instagram', desc: 'Donde tu cliente te descubre. Los mensajes directos y comentarios se atienden solos, convirtiendo seguidores en clientes.'},
                      {pct: '54%', title: 'Sitio Web', desc: 'Tu vitrina siempre abierta. El chatbot capta al visitante que entra de madrugada y lo convierte en lead antes de que cierre la pestaña.'},
                    ].map((ch, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-scale-card border border-scale-border mb-3 hover:border-[rgba(3,250,110,0.28)] hover:translate-x-[4px] transition-all duration-200">
                        <div className="font-mono text-2xl font-bold text-scale-accent min-w-[70px]">{ch.pct}</div>
                        <div>
                          <h4 className="text-base font-bold mb-1">{ch.title}</h4>
                          <p className="text-sm text-scale-muted">{ch.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CAPABILITIES TABLE */}
            <section className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Menú de capacidades
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Lo que tu chatbot <span className="text-scale-accent">puede hacer</span></h2>
                <p className="text-scale-muted text-base mt-2 max-w-[640px]">Todo lo que incluye el servicio. Pensado para cubrir el ciclo completo: de la primera pregunta del cliente a la venta cerrada y el seguimiento post-venta.</p>

                <div className="overflow-x-auto border border-scale-border rounded-[14px] mt-8">
                  <table className="min-w-[640px] w-full">
                    <thead>
                      <tr>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-accent bg-[#1d1f15] font-semibold p-[15px_20px] text-left w-[30%]">Categoría</th>
                        <th scope="col" className="font-mono text-sm uppercase tracking-[0.06em] text-scale-accent bg-[#1d1f15] font-semibold p-[15px_20px] text-left">Capacidades incluidas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chatbotCapabilities.map((cap, i) => (
                        <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)]">
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left font-bold">
                            <span className="inline-flex items-center gap-2">{cap.icon}{cap.cat}</span>
                          </td>
                          <td className="p-[15px_20px] text-base border-b border-scale-border text-left text-scale-muted">{cap.items}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* THE MATH */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Resultados esperados
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Lo que la IA le devuelve <span className="text-scale-accent">a tu negocio</span></h2>
                <p className="text-scale-muted text-base mt-2 max-w-[640px]">Estos son los números que respaldan la inversión. Sustentados en estudios de Route Mobile (2026), Juniper Research, Chatfuel y Cooby, y reflejan lo que ya están logrando negocios similares en la región.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 mb-10">
                  {chatbotStats.map((s, i) => (
                    <div key={i} className="bg-scale-card border border-scale-border rounded-[16px] p-6 text-center hover:border-[rgba(3,250,110,0.28)] hover:-translate-y-[3px] transition-all duration-200">
                      <div className="font-mono text-[clamp(28px,3.5vw,44px)] font-bold text-scale-accent leading-none mb-2">{s.num}</div>
                      <div className="text-sm text-scale-muted">{s.lbl}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-scale-card border border-scale-border rounded-[20px] p-6">
                    <p className="text-base font-bold mb-1">· Tasa de apertura: WhatsApp Business vs. Email</p>
                    <p className="text-sm text-scale-muted mb-4">Fuente: Telemedia, citado por Chatfuel. Tu cliente no está revisando su correo: está chateando.</p>
                    <OpenRateChart />
                  </div>
                  <div className="bg-scale-card border border-scale-border rounded-[20px] p-6">
                    <p className="text-base font-bold mb-1">· Venezuela 2025: penetración digital</p>
                    <p className="text-sm text-scale-muted mb-4">Fuente: DataReportal Digital 2025. El venezolano promedio está conectado, es joven y vive en su celular.</p>
                    <svg viewBox="0 0 500 200" className="w-full h-auto" role="img" aria-label="Penetración digital Venezuela">
                      <g fontFamily="Inter, sans-serif">
                        <rect x="50" y="50" width="120" height="120" rx="6" fill="#03fa6e" opacity="0.9" />
                        <text x="110" y="42" textAnchor="middle" fill="#03fa6e" fontSize="20" fontWeight="900" fontFamily="JetBrains Mono">22.5M</text>
                        <text x="110" y="185" textAnchor="middle" fill="#f4f4f0" fontSize="12" fontWeight="700">Conexiones móviles</text>
                        <text x="110" y="200" textAnchor="middle" fill="#a1a1aa" fontSize="10">79.1% población</text>
                        <rect x="200" y="72" width="120" height="98" rx="6" fill="#03fa6e" opacity="0.7" />
                        <text x="260" y="64" textAnchor="middle" fill="#03fa6e" fontSize="20" fontWeight="900" fontFamily="JetBrains Mono">17.5M</text>
                        <text x="260" y="185" textAnchor="middle" fill="#f4f4f0" fontSize="12" fontWeight="700">Usuarios de internet</text>
                        <text x="260" y="200" textAnchor="middle" fill="#a1a1aa" fontSize="10">61.6% penetración</text>
                        <rect x="350" y="86" width="120" height="84" rx="6" fill="#03fa6e" opacity="0.55" />
                        <text x="410" y="78" textAnchor="middle" fill="#03fa6e" fontSize="20" fontWeight="900" fontFamily="JetBrains Mono">15.1M</text>
                        <text x="410" y="185" textAnchor="middle" fill="#f4f4f0" fontSize="12" fontWeight="700">Redes sociales</text>
                        <text x="410" y="200" textAnchor="middle" fill="#a1a1aa" fontSize="10">53.1% población</text>
                      </g>
                    </svg>
                  </div>
                </div>
                <div className="bg-scale-card border border-scale-border border-l-[3px] border-l-scale-accent rounded-[14px] p-[26px_28px] mt-8">
                  <span className="block font-mono text-xs tracking-[0.1em] text-scale-accent uppercase font-bold mb-2.5">El mercado que se está moviendo</span>
                  <p className="text-base">El mercado global de chatbots se proyecta en <strong>11.775 millones de dólares para 2026</strong> y se estima que alcance <strong>41.244 millones en 2033</strong> (Route Mobile). Los chatbots ahorrarán <strong>8.000 millones de dólares anuales</strong> en costos de servicio al cliente a nivel global (Juniper Research). La pregunta es qué parte de ese ahorro va a quedar en tu negocio y qué parte se la va a llevar la competencia.</p>
                </div>
              </div>
            </section>

            {/* PRICING */}
            <section id="planes" className="py-20 md:py-24 bg-[#1d1f15]">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Planes
                </div>
                <h2 className="text-[clamp(26px,3.2vw,36px)] font-bold max-w-[640px]">Planes flexibles para <span className="text-scale-accent">cada negocio</span></h2>
                <p className="text-scale-muted text-base mt-2 max-w-[640px]">Desde el emprendimiento que quiere probar la IA hasta la empresa que necesita atención masiva en múltiples canales. Todos los planes incluyen entrenamiento del agente con tus datos, integración y soporte. Sin contratos largos.</p>

                <div className="grid md:grid-cols-3 gap-[22px] mt-11">
                  {chatbotPricing.map((plan, i) => (
                    <div key={i} className={cn('border rounded-[20px] p-[30px_26px] flex flex-col relative', plan.featured ? 'border-scale-accent shadow-[0_0_40px_-10px_rgba(3,250,110,0.3)] scale-[1.02] bg-scale-card' : 'border-scale-border bg-[#1d1f15]')}>
                      {plan.featured && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-scale-accent text-[#0c1008] text-xs font-bold px-4 py-1 rounded-full tracking-[0.05em]">Más popular</span>
                      )}
                      <div className="font-mono text-xs text-scale-accent font-bold uppercase tracking-[0.05em] mb-2">{plan.name}</div>
                      <div className="font-mono text-[clamp(28px,3.5vw,44px)] font-bold mb-1">{plan.amount}<small className="text-base text-scale-muted font-normal">{plan.period}</small></div>
                      <p className="text-sm text-scale-muted mb-4 pb-4 border-b border-scale-border">{plan.desc}</p>
                      <ul className="list-none p-0 m-0 flex-grow space-y-2.5 mb-5">
                        {plan.features.map((feat, j) => (
                          <li key={j} className={cn('flex items-start gap-2 text-sm', plan.muted[j] ? 'text-scale-muted' : 'text-scale-text')}>
                            {plan.muted[j] ? (
                              <svg className="w-[18px] h-[18px] flex-shrink-0 mt-[2px]" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{stroke: '#a1a1aa'}}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            ) : (
                              <svg className="w-[18px] h-[18px] flex-shrink-0 mt-[2px]" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{stroke: '#03fa6e'}}><polyline points="20 6 9 17 4 12" /></svg>
                            )}
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                      <a href={`https://wa.me/584121234567?text=${encodeURIComponent('¡Hola! Me interesa el plan ' + plan.name + ' de Chatbot IA.')}`} target="_blank" rel="noopener noreferrer" className={cn('inline-flex items-center justify-center gap-2.5 px-7 py-[13px] rounded-full font-semibold text-sm w-full transition-all duration-150', plan.featured ? 'bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)]' : 'bg-transparent border border-scale-border text-scale-text hover:border-scale-accent hover:text-scale-accent')}>
                        {plan.btnText}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                  Preguntas frecuentes
                </div>
                <h2 className="text-[clamp(26px,3.2vw,34px)] font-bold">Resolvemos tus dudas antes de que las tengas</h2>

                <div className="mt-10 max-w-[820px]">
                  {chatbotFaqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            </section>

            {/* FINAL CTA */}
            <section id="contacto" className="pb-20 md:pb-24">
              <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                <div className="text-center bg-scale-card border border-[rgba(3,250,110,0.28)] rounded-[20px] py-[70px] px-[40px] sm:px-10">
                  <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.14em] uppercase text-scale-accent font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-scale-accent shadow-[0_0_10px_#03fa6e]" />
                    Es hora de entrar en acción
                  </div>
                  <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold mb-4">
                    ¿Cuánto dinero estás dejando de ganar <span className="text-scale-accent">cada mes</span> por no responder a tiempo?
                  </h2>
                  <p className="text-scale-muted text-base max-w-[560px] mx-auto mb-8">
                    Agenda tu diagnóstico gratuito de 30 minutos. Te mostramos en vivo cuánto estás perdiendo por no responder a tiempo y cómo se vería tu negocio con un agente IA vendiendo 24/7.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <a href={wppLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-scale-accent text-[#0c1008] hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-8px_rgba(3,250,110,0.28)] transition-all duration-150">
                      Agendar diagnóstico gratuito →
                    </a>
                    <a href={`mailto:ventas@scalesystems.dev`} className="inline-flex items-center gap-2.5 px-7 py-[15px] rounded-full font-semibold text-sm bg-transparent border border-scale-border text-scale-text hover:border-scale-accent hover:text-scale-accent transition-all duration-150">
                      Hablar con un experto
                    </a>
                  </div>
                  <p className="font-mono text-xs text-scale-muted mt-5 italic">Sin compromiso. Sin tecnicismos. Sin perder más ventas. En 15 días puedes tener tu agente IA cerrando ventas por ti. La pregunta no es si puedes permitirte implementarlo, es si puedes permitirte seguir sin hacerlo.</p>
                </div>

                <div className="bg-scale-card border border-scale-border rounded-[14px] p-[26px_28px] mt-8 text-center" style={{borderTop: '4px solid #03fa6e'}}>
                  <span className="block font-mono text-xs tracking-[0.1em] text-scale-accent uppercase font-bold mb-2.5">Reflección final</span>
                  <p className="text-base max-w-[660px] mx-auto">El que profesionalice su WhatsApp con un agente de IA hoy, va a tener una ventaja que en 12 meses va a ser imposible de alcanzar. <strong>Tu competencia todavía no lo hizo. ¿Hasta cuándo vas a esperar tú?</strong></p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* ORIGINAL LAYOUT FOR OTHER SERVICES */}
            <div className="pt-32 pb-24 md:pt-40 md:pb-32 px-5 sm:px-6 md:px-12 max-w-7xl mx-auto w-full relative">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-scale-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />

              <Link
                href="/#servicios"
                className="inline-flex items-center gap-2 text-scale-muted hover:text-scale-accent transition-colors mb-12"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Volver a Servicios</span>
              </Link>

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-scale-accent/30 bg-scale-accent/10 text-scale-accent text-xs sm:text-sm font-medium tracking-wide mb-6">
                    <span>Servicio Premium</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                    {title}
                  </h1>

                  <p className="text-xl sm:text-2xl font-semibold text-scale-accent mb-8">
                    {subtitle}
                  </p>

                  <div className="space-y-6 text-scale-muted text-lg leading-relaxed mb-12">
                    {desc.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="relative group perspective-1000">
                  <div className="relative bg-scale-card border border-scale-border rounded-3xl p-8 shadow-2xl overflow-hidden transform transition-all duration-700 hover:rotate-y-12">
                    <GlowingEffect
                      spread={80}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                      borderWidth={2}
                    />

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-scale-accent/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(3,250,110,0.5)]">
                        <MessageCircle size={36} className="text-scale-accent" />
                      </div>

                      <h3 className="text-2xl font-bold mb-4 text-white">
                        ¿Te interesa este servicio?
                      </h3>
                      <p className="text-scale-muted mb-8 max-w-sm">
                        Habla directamente con nuestro equipo por WhatsApp y recibe
                        una consulta personalizada para tu negocio.
                      </p>

                      <a
                        href={wppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] group-hover:scale-105"
                      >
                        <MessageCircle size={24} />
                        Contactar por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CHATBOT */}
        <AnimatePresence>
          {isScrolled && !isChatOpen && (
            <motion.div
              className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end"
              initial={{opacity: 0, scale: 0.5, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.5, y: 20}}
              transition={{type: 'spring', bounce: 0.25, duration: 0.5}}
            >
              <div
                onClick={() => setIsChatOpen(true)}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-scale-accent rounded-xl sm:rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(3,250,110,0.3)] flex items-center justify-center hover:scale-105 transition-transform"
              >
                <RobotIcon mousePos={{x: 0, y: 0}} className="w-7 h-7 sm:w-10 sm:h-10" isDark={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isChatOpen && (
            <Suspense fallback={null}>
              <ChatWindow onClose={() => setIsChatOpen(false)} />
            </Suspense>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
