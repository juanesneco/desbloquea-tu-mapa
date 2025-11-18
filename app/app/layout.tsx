// Added by AI Monorepo Setup

import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const space = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

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
      <body className={`${space.className} bg-gradient-to-br from-white via-background to-[#E6E9EF]`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#E8F5C8] blur-[160px]" />
            <div className="absolute top-1/3 right-0 h-64 w-64 rounded-full bg-[#C7D2FE] blur-[140px]" />
            <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#FFD6E8] blur-[170px]" />
          </div>
          <div className="relative flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
