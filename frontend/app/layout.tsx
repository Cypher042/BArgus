import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
// import { Toaster } from '@/components/ui/toaster';
import Header from '@/app/Header';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WebHarvest - Modern Web Scraper',
  description: 'A powerful, intuitive web scraping tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>

            <main className="min-h-screen ">{children}</main>
            <footer className="bg-muted opacity-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-200">
          <p>Made with 💗  </p>
          </div>
          </footer>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}