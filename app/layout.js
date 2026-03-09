import { Space_Grotesk, VT323 } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
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
      <body className={`${spaceGrotesk.variable} ${vt323.variable}`}>{children}</body>
    </html>
  );
}
