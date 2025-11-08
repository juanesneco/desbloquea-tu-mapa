// Added by AI Monorepo Setup

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Desbloquea Tu Mapa - App',
  description: 'AI-powered image analysis for your personal transformation journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="bg-white border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-semibold text-primary hover:text-accent transition-colors">
                Desbloquea Tu Mapa
              </Link>
              <div className="flex gap-6">
                <Link href="/upload" className="text-primary-light hover:text-accent transition-colors font-medium">
                  Subir Imagen
                </Link>
                <Link href="/gallery" className="text-primary-light hover:text-accent transition-colors font-medium">
                  Galería
                </Link>
                <a 
                  href="../website/index.html" 
                  className="text-primary-light hover:text-accent transition-colors font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Filosofía
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-white border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-primary-light text-sm">
              © 2024 Desbloquea Tu Mapa. Creado con presencia por Juanes Necoechea.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

