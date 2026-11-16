import './globals.css';
import CustomCursor from '../components/CustomCursor';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000'
};

export const metadata = {
  metadataBase: new URL('https://tarunrawat.dev'),
  title: 'Tarun Rawat — Full-Stack Web Developer & Digital Designer',
  description:
    'Full-stack web developer and digital designer building custom web applications, digital platforms, and interactive interfaces with clean architecture and distinctive visual systems.',
  keywords: [
    'Tarun Rawat',
    'Full-Stack Developer',
    'Digital Designer',
    'Next.js',
    'React',
    'Frontend Architecture',
    'Web Engineering',
    'Creative Developer',
    'Portfolio'
  ],
  authors: [{ name: 'Tarun Rawat', url: 'https://github.com/tarun077-R' }],
  creator: 'Tarun Rawat',
  openGraph: {
    title: 'Tarun Rawat — Full-Stack Web Developer & Digital Designer',
    description:
      'Custom web applications, digital platforms, and interactive interfaces. Independent engineering. Clean architecture. Distinctive execution.',
    url: 'https://tarunrawat.dev',
    siteName: 'Tarun Rawat Portfolio',
    images: [
      {
        url: '/images/hero-portrait.webp',
        width: 2048,
        height: 1152,
        alt: 'Tarun Rawat — Full-Stack Web Developer & Digital Designer'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarun Rawat — Full-Stack Web Developer & Digital Designer',
    description:
      'Custom web applications, digital platforms, and interactive interfaces with clean architecture.',
    images: ['/images/hero-portrait.webp']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/images/hero-portrait.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body>
        {/* Accessible Skip Link */}
        <a href="#work" className="skip-link">
          Skip to selected work
        </a>

        {/* Global 20px fine-pointer circular custom cursor */}
        <CustomCursor />

        {/* Page Content */}
        {children}

        {/* Zero-overhead Service Worker registration for offline & image caching */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
