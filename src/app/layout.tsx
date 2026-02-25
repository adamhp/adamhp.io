import type { Metadata } from 'next';
import { IBM_Plex_Mono, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';

const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'adamhp.io',
  description: 'Personal website of adamhp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${schibstedGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <main className='font-sans h-full p-4 pb-32 flex flex-col justify-center'>
          <div className='mx-auto max-w-3xl h-full flex flex-col m-4'>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
