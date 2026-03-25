import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cronache — News & Meteo',
  description: 'Le ultime notizie e il meteo della tua città in un unico posto.',
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📰</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark">
      <body className={`${playfair.variable} ${outfit.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
