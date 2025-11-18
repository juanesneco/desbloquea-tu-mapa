// Added by AI Monorepo Setup

import Link from 'next/link';
import { ArrowUpRight, Image as ImageIcon, Sparkles, Upload, LineChart } from 'lucide-react';

const phases = [
  {
    title: 'Inconsciencia',
    subtitle: 'Dormido',
    description: 'Piloto automático, narrativas heredadas, búsqueda externa.',
    code: 'Fase 1',
  },
  {
    title: 'Consciencia',
    subtitle: 'Despertar',
    description: 'Observación, intención, integración cuerpo-mente.',
    code: 'Fase 2',
  },
  {
    title: 'Creación',
    subtitle: 'Maestría',
    description: 'Acción presente, poder interno y servicio consciente.',
    code: 'Fase 3',
  },
];

const mapas = [
  { name: 'Mental', detail: 'Código, creencias, narrativas.' },
  { name: 'Físico', detail: 'Cuerpo, energía, presencia.' },
  { name: 'Familiar', detail: 'Raíces, vínculos, lealtades.' },
  { name: 'Financiero', detail: 'Valor, propósito materializado.' },
  { name: 'Emocional', detail: 'Sentir, nombrar, integrar.' },
];

const steps = [
  { icon: Upload, title: 'Captura', copy: 'Selecciona un símbolo que represente tu momento.' },
  { icon: Sparkles, title: 'Interpreta', copy: 'La IA traduce el lenguaje simbólico a fases y mapas.' },
  { icon: ImageIcon, title: 'Integra', copy: 'Tu galería muestra la progresión y patrones.' },
  { icon: LineChart, title: 'Evoluciona', copy: 'Detecta tu siguiente movimiento consciente.' },
];

export default function HomePage() {
  return (
    <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20">
      <section className="glass-panel relative overflow-hidden p-10">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#F0FDF4] via-transparent to-transparent opacity-70" />
        <div className="relative max-w-xl space-y-8">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-primary-light">Filosofía aplicada</p>
          <h1 className="text-4xl font-semibold leading-tight text-primary md:text-6xl">
            Interpretación simbólica con precisión Nike, presencia Apple.
          </h1>
          <p className="text-lg text-primary-light">
            Desbloquea Tu Mapa convierte imágenes personales en inteligencia emocional accionable. IA visionaria,
            filosofía ancestral y diseño minimalista trabajan juntos para mostrarte el siguiente movimiento.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/upload" className="btn-primary">
              Subir Imagen
              <ArrowUpRight size={16} />
            </Link>
            <Link href="/gallery" className="btn-secondary">
              Ver Galería
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">Las 3 fases</p>
          <div className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.title} className="flex flex-col gap-2 rounded-2xl bg-white/70 p-4">
                <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.4em] text-primary-light">
                  <span>{phase.code}</span>
                  <span>{phase.subtitle}</span>
                </div>
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-semibold">{phase.title}</h3>
                </div>
                <p className="text-sm text-primary-light">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">Los 5 mapas</p>
            <h2 className="text-3xl font-semibold">Territorios conscientes a explorar</h2>
          </div>
          <div className="space-y-4">
            {mapas.map((mapa) => (
              <div key={mapa.name} className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary-light">{mapa.name}</p>
                  <p className="text-sm text-primary-light">{mapa.detail}</p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Mapa</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel grid gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <div key={step.title} className="flex gap-4 rounded-2xl border border-white/50 bg-white/80 p-6">
            <div className="rounded-full border border-primary/20 p-3 text-primary">
              <step.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">{step.title}</p>
              <p className="text-sm text-primary-light">{step.copy}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="card text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-primary-light">Filosofía completa</p>
        <h2 className="mt-4 text-3xl font-semibold">Profundiza en la ruta DTM</h2>
        <p className="mt-4 text-sm text-primary-light">
          Conecta este módulo con el sitio completo, lee la filosofía y alinea tus símbolos con la narrativa macro.
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href="/website/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Explorar filosofía
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
