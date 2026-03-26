import '../styles/globals.css';

export const metadata = {
  title: 'NewsDash — Dashboard Notizie',
  description: 'Integrazione notizie e meteo in un\'unica dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
