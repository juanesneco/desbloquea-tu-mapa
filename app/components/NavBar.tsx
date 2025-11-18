'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/upload', label: 'Subir' },
  { href: '/gallery', label: 'Galería' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          <div className="h-10 w-10 rounded-full border border-primary flex items-center justify-center">
            <span className="text-xs font-bold">DTM</span>
          </div>
          Desbloquea Tu Mapa
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.3em] text-primary-light md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${isActive(link.href) ? 'text-primary' : 'hover:text-primary'}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/website/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            Filosofía
          </a>
          <Link href="/upload" className="btn-primary px-5 py-2 text-xs">
            Inicia
          </Link>
        </nav>
        <button
          className="rounded-full border border-border p-2 text-primary md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {isOpen && (
        <div className="border-t border-white/40 bg-white/90 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-colors ${isActive(link.href) ? 'text-primary' : 'text-primary-light'}`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/website/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light"
            >
              Filosofía
            </a>
            <Link
              href="/upload"
              className="btn-primary w-full justify-center text-xs"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Análisis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
