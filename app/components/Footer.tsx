export default function Footer() {
  const links = [
    { label: 'Contacto', href: 'mailto:hola@desbloqueatumapa.com' },
    { label: 'Newsletter', href: 'https://juanesneco.github.io/desbloquea-tu-mapa/secciones/inicia.html' },
    { label: 'Sitio', href: '/website/index.html' },
  ];

  return (
    <footer className="border-t border-white/60 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Desbloquea Tu Mapa</p>
          <p className="text-sm text-primary-light">© {new Date().getFullYear()} Juanes Necoechea · Vida como diseño consciente.</p>
        </div>
        <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary-light">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
