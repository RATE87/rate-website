import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/layout/Footer'
import { Nav } from '@/components/layout/Nav'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://rate-website.vercel.app'),
  title: {
    default: 'RATE | Rough Around The Edges',
    template: '%s | RATE',
  },
  description: 'A neurodiversity impact platform spanning shop, toolkit and community.',
  openGraph: {
    title: 'RATE | Rough Around The Edges',
    description: 'Building the ecosystem neurodivergent people should have had all along.',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="pb-10">
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
