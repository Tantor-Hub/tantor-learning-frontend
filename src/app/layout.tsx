import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/components/provider'
import Header from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TanTor Learning | Formations en ligne certifiantes partout en France',
  description:
    'Accédez à des formations professionnelles de qualité avec TanTor Learning. Formations en ligne ou en présentiel, bibliothèque numérique, suivi personnalisé et certification officielle. Une plateforme complète pour apprendre, progresser et réussir.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <ReduxProvider>{children}</ReduxProvider>
        <Footer />
      </body>
    </html>
  )
}
