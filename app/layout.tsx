import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { UserProvider } from '@/contexts/UserContext';
// Removed ServiceWorkerRegister - no longer needed
import GlobalToaster from '@/components/common/GlobalToaster';
import UnregisterServiceWorker from '@/components/common/UnregisterServiceWorker';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://carbon-footprint.com'),
  title: 'EcoTracker - Carbon Footprint Tracker',
  description: 'Track, analyze, and reduce your carbon footprint with our intelligent environmental monitoring platform.',
  keywords: ['carbon footprint', 'sustainability', 'environment', 'eco-friendly', 'climate change'],
  authors: [{ name: 'EcoTracker Team' }],
  openGraph: {
    title: 'EcoTracker - Carbon Footprint Tracker',
    description: 'Track, analyze, and reduce your carbon footprint with our intelligent environmental monitoring platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoTracker - Carbon Footprint Tracker',
    description: 'Track, analyze, and reduce your carbon footprint with our intelligent environmental monitoring platform.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/assets/bg.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Temporarily disable PWA manifest to avoid 404 icons while we finalize assets */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EcoTracker" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <UnregisterServiceWorker />
              <div id="app-root" className="min-h-screen">
                {children}
              </div>
              <GlobalToaster />
            </ThemeProvider>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
