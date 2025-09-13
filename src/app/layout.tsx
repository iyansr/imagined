import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/sonner';

const ibmPlexMono = IBM_Plex_Mono({
  weight: '500',
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Imagined',
  description:
    'Find and share the best prompts for AI image generation. Browse thousands of creative prompts from the community and create stunning visuals',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${ibmPlexMono.variable} antialiased`}>
        <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
          <Header />
          {modal}
          <div className="pt-14">{children}</div>
          <footer />
        </div>
      </body>
      <Toaster position="top-center" />
    </html>
  );
}
