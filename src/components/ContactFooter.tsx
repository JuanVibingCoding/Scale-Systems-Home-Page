'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';

const CATALOG_OPTIONS = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'web-dev', label: 'Desarrollo Web' },
  { value: 'automation', label: 'Automatización de Procesos' },
  { value: 'ai-agents', label: 'Agentes de IA' },
  { value: 'consulting', label: 'Consultoría en IA' },
  { value: 'analytics', label: 'Analítica e Insights' },
] as const;

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateField(name: string, value: string): string | undefined {
  switch (name) {
    case 'name':
      return value.trim().length < 2 ? 'El nombre debe tener al menos 2 caracteres' : undefined;
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Correo electrónico inválido';
    case 'message':
      return value.trim().length < 10 ? 'El mensaje debe tener al menos 10 caracteres' : undefined;
    default:
      return undefined;
  }
}

function getUtmParams() {
  if (typeof window === 'undefined') {
    return { utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '' };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    utm_term: params.get('utm_term') ?? '',
    utm_content: params.get('utm_content') ?? '',
  };
}

function getPageSource() {
  if (typeof window === 'undefined') return '';
  const referrer = document.referrer || '';
  const path = window.location.pathname;
  if (referrer && !referrer.includes(window.location.hostname)) {
    return `referral: ${new URL(referrer).hostname}`;
  }
  return path !== '/' ? path : '';
}

export default function ContactFooter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [utm, setUtm] = useState({ utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '' });
  const [pageSource, setPageSource] = useState('');

  useEffect(() => {
    setUtm(getUtmParams());
    setPageSource(getPageSource());
  }, []);

  function handleBlur(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name: fieldName, value } = e.target;
    const error = validateField(fieldName, value);
    setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
  }

  function validateAll(): boolean {
    const errors: FieldErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      message: validateField('message', message),
    };
    const clean = Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== undefined));
    setFieldErrors(clean);
    return Object.keys(clean).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    if (!validateAll()) return;

    setFormState('loading');

    const body = {
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || undefined,
      phone: phone.trim() || undefined,
      service: service || undefined,
      message: message.trim(),
      _hp: '',
      ...utm,
      source: pageSource || undefined,
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Error al enviar la solicitud.');
        setFormState('error');
        return;
      }

      setFormState('success');
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setService('');
      setMessage('');
    } catch {
      setServerError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      setFormState('error');
    }
  }

  function inputClass(field: keyof FieldErrors) {
    const hasError = fieldErrors[field];
    return `w-full bg-scale-bg border ${hasError ? 'border-red-500' : 'border-scale-border'} rounded-xl px-4 py-3 text-scale-text placeholder-scale-muted focus:outline-none focus:border-scale-accent focus:ring-1 focus:ring-scale-accent transition-all`;
  }

  return (
    <footer id="contacto" className="bg-scale-bg py-16 sm:py-32 relative border-t border-scale-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 sm:mb-8">
            ¿Listo para <span className="text-scale-accent">escalar?</span>
          </h2>
          <p className="text-base sm:text-xl text-scale-muted mb-8 sm:mb-12 max-w-lg leading-relaxed">
            Deja de perder tiempo en tareas manuales y empieza a construir una empresa que funcione sin ti. Agenda una llamada de diagnóstico gratuita.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4 text-scale-muted hover:text-scale-accent transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border border-scale-border flex items-center justify-center bg-scale-card">
                <Mail size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-base sm:text-lg font-medium break-all">hola@scalesystems.com.ve</span>
            </div>
            <div className="flex items-center gap-4 text-scale-muted hover:text-scale-accent transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border border-scale-border flex items-center justify-center bg-scale-card">
                <Phone size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-base sm:text-lg font-medium">+58 412 123 4567</span>
            </div>
            <div className="flex items-center gap-4 text-scale-muted">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border border-scale-border flex items-center justify-center bg-scale-card">
                <MapPin size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-base sm:text-lg font-medium">Caracas, Venezuela</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl border border-scale-border shadow-2xl p-[1.5px] md:p-[2px]">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} className="z-0" />
          <div className="relative z-10 bg-scale-card rounded-[calc(1.5rem-2px)] p-6 sm:p-10 overflow-hidden h-full pointer-events-auto">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-scale-accent rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Solicitar Presupuesto</h3>

            <form aria-label="Formulario de solicitud de presupuesto" className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-scale-muted">Nombre Completo <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleBlur}
                    className={inputClass('name')}
                    placeholder="Ej. Carlos Pérez"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'error-name' : undefined}
                    aria-required="true"
                    required
                  />
                  {fieldErrors.name && <p id="error-name" className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-scale-muted">Empresa</label>
                  <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-scale-bg border border-scale-border rounded-xl px-4 py-3 text-scale-text placeholder-scale-muted focus:outline-none focus:border-scale-accent focus:ring-1 focus:ring-scale-accent transition-all"
                    placeholder="Tu empresa C.A."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-scale-muted">Correo Electrónico <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur}
                    className={inputClass('email')}
                    placeholder="carlos@empresa.com"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'error-email' : undefined}
                    aria-required="true"
                    required
                  />
                  {fieldErrors.email && <p id="error-email" className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-scale-muted">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-scale-bg border border-scale-border rounded-xl px-4 py-3 text-scale-text placeholder-scale-muted focus:outline-none focus:border-scale-accent focus:ring-1 focus:ring-scale-accent transition-all"
                    placeholder="+58 412 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium text-scale-muted">¿Qué necesitas?</label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-scale-bg border border-scale-border rounded-xl px-4 py-3 text-scale-text focus:outline-none focus:border-scale-accent focus:ring-1 focus:ring-scale-accent transition-all appearance-none"
                >
                  {CATALOG_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-scale-muted">Mensaje <span className="text-red-400">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={handleBlur}
                  rows={4}
                  className={inputClass('message')}
                  placeholder="Cuéntanos sobre tu proyecto o lo que necesitas..."
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? 'error-message' : undefined}
                  aria-required="true"
                  required
                />
                {fieldErrors.message && <p id="error-message" className="text-red-400 text-xs mt-1">{fieldErrors.message}</p>}
              </div>

              <div aria-hidden="true" className="absolute opacity-0 pointer-events-none -z-50" tabIndex={-1}>
                <input type="text" name="_hp" value="" onChange={() => {}} autoComplete="off" />
              </div>

              <button
                type="submit"
                disabled={formState === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-scale-accent hover:bg-scale-accent-hover disabled:bg-scale-accent/50 disabled:cursor-not-allowed text-scale-bg font-bold px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg transition-all duration-300 shadow-[0_0_20px_rgba(3,250,110,0.3)] hover:shadow-[0_0_30px_rgba(3,250,110,0.5)] mt-4"
              >
                {formState === 'loading' ? (
                  <><Loader2 size={20} className="animate-spin" /> Enviando...</>
                ) : (
                  <><ArrowRight size={20} /> Enviar Solicitud</>
                )}
              </button>

              <div aria-live="polite" className="mt-4">
                {formState === 'success' && (
                  <div className="flex items-center gap-2 text-scale-accent text-sm sm:text-base" role="status">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>¡Solicitud enviada con éxito! Te contactaremos pronto.</span>
                  </div>
                )}
                {formState === 'error' && serverError && (
                  <div className="flex items-start gap-2 text-red-400 text-sm sm:text-base" role="alert">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 mt-16 sm:mt-32 pt-8 border-t border-scale-border flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex justify-center md:justify-start">
          <img src="/logos/ScaleSystemsLogo250.png" alt="Scale Systems - Agencia de Automatización e IA en Venezuela" className="h-7 md:h-9 w-auto" />
        </div>
        <p className="text-sm text-scale-muted">
          © {new Date().getFullYear()} Scale Systems. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
