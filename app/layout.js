import { IBM_Plex_Mono, VT323 } from 'next/font/google';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-display',
});

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
});

export const metadata = {
  title: 'Bytelabs Emulator',
  description: 'Retro emulator portal powered by Emulator.js and Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${vt323.variable}`}>{children}</body>
    </html>
  );
}
