interface LeadNotificationProps {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
  source?: string;
}

const styles = {
  container: {
    backgroundColor: '#171810',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    padding: '40px 24px',
    color: '#e4e4e7',
  },
  card: {
    maxWidth: '560px',
    margin: '0 auto',
    backgroundColor: '#1f2017',
    borderRadius: '16px',
    border: '1px solid #2a2c1f',
    overflow: 'hidden',
  },
  header: {
    padding: '32px 32px 0',
    borderBottom: '1px solid #2a2c1f',
    marginBottom: '24px',
  },
  logo: {
    width: '40px',
    height: '40px',
    marginBottom: '16px',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#03fa6e',
    color: '#171810',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '999px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '12px 0 4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#a1a1aa',
    margin: '0 0 24px',
  },
  section: {
    padding: '0 32px',
    marginBottom: '24px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#63635d',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '4px',
  },
  value: {
    fontSize: '15px',
    color: '#e4e4e7',
    margin: '0 0 16px',
    lineHeight: '1.5',
  },
  divider: {
    height: '1px',
    backgroundColor: '#2a2c1f',
    border: 'none',
    margin: '0 32px 24px',
  },
  messageBox: {
    backgroundColor: '#171810',
    borderRadius: '12px',
    padding: '16px 20px',
    borderLeft: '4px solid #03fa6e',
    marginBottom: '16px',
  },
  messageText: {
    fontSize: '14px',
    color: '#a1a1aa',
    lineHeight: '1.6',
    margin: 0,
    whiteSpace: 'pre-wrap' as const,
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
  },
  metaItem: {
    backgroundColor: '#171810',
    borderRadius: '8px',
    padding: '12px',
  },
  footer: {
    padding: '24px 32px 32px',
    borderTop: '1px solid #2a2c1f',
    fontSize: '12px',
    color: '#63635d',
    textAlign: 'center' as const,
    lineHeight: '1.6',
  },
  link: {
    color: '#03fa6e',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
};

const serviceLabels: Record<string, string> = {
  'web-dev': 'Desarrollo Web',
  automation: 'Automatización de Procesos',
  'ai-agents': 'Agentes de IA',
  consulting: 'Consultoría en IA',
  analytics: 'Analítica e Insights',
};

export default function LeadNotification({
  name,
  email,
  company,
  phone,
  service,
  message,
  source,
}: LeadNotificationProps) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img
            src="https://resend.com/static/placeholder-logo.png"
            alt="Scale Systems"
            style={styles.logo}
          />
          <div style={styles.badge}>Nuevo Lead</div>
          <h1 style={styles.title}>Nueva solicitud de presupuesto</h1>
          <p style={styles.subtitle}>
            {name} ha enviado una solicitud a través de scalesystems.dev
          </p>
        </div>

        <div style={styles.section}>
          <p style={styles.label}>Nombre Completo</p>
          <p style={styles.value}>{name}</p>

          <p style={styles.label}>Correo Electrónico</p>
          <p style={styles.value}>{email}</p>

          <div style={styles.metaGrid}>
            <div style={styles.metaItem}>
              <p style={{...styles.label, marginBottom: 4}}>Empresa</p>
              <p style={{...styles.value, margin: 0, fontSize: 14}}>
                {company || '—'}
              </p>
            </div>
            <div style={styles.metaItem}>
              <p style={{...styles.label, marginBottom: 4}}>Teléfono</p>
              <p style={{...styles.value, margin: 0, fontSize: 14}}>
                {phone || '—'}
              </p>
            </div>
          </div>

          <p style={styles.label}>Servicio de Interés</p>
          <p style={styles.value}>
            {service ? (serviceLabels[service] || service) : 'No especificado'}
          </p>
        </div>

        <hr style={styles.divider} />

        <div style={styles.section}>
          <p style={styles.label}>Mensaje</p>
          <div style={styles.messageBox}>
            <p style={styles.messageText}>{message}</p>
          </div>
        </div>

        {source && (
          <>
            <hr style={styles.divider} />
            <div style={styles.section}>
              <p style={styles.label}>Fuente</p>
              <p style={{...styles.value, fontSize: 13, color: '#63635d'}}>
                {source}
              </p>
            </div>
          </>
        )}

        <div style={styles.footer}>
          <p style={{margin: '0 0 8px'}}>
            Scale Systems — Automatización e IA para empresas en Venezuela
          </p>
          <a href="https://scalesystems.dev" style={styles.link}>
            scalesystems.dev
          </a>
        </div>
      </div>
    </div>
  );
}
