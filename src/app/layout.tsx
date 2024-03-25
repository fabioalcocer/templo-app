import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import Header from '@/components/header'
import SessionProvider from './SessionProvider'

export const metadata: Metadata = {
  title: 'Templo App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es'>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <main className='flex min-h-screen flex-col items-center'>
              <Header />
              <div className='flex w-full container flex-col px-0'>
                {children}
              </div>
            </main>
          </ThemeProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
