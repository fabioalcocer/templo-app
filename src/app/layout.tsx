import './globals.css'
import { CommandDialogMenu } from '@/components/command-menu'
import CustomCard from '@/components/custom-card'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { fontSans } from '@/lib/fonts'
import { steps } from '@/lib/steps'
import { cn } from '@/lib/utils'
import { OpenPanelComponent } from '@openpanel/nextjs'
import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import Script from 'next/script'
import { Onborda, OnbordaProvider } from 'onborda'
import SessionProvider from './SessionProvider'

export const metadata: Metadata = {
	title: 'Templo App',
	description: 'Templo Gym App by Fabio Alcocer',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ViewTransitions>
			<html lang="es">
				<Script src="https://cdn.seline.so/seline.js" async />
				<body
					suppressHydrationWarning
					className={cn(
						'min-h-screen bg-background font-sans antialiased',
						fontSans.variable,
					)}
				>
					<SessionProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<OnbordaProvider>
								<Onborda
									steps={steps}
									cardComponent={CustomCard}
									shadowOpacity="0.8"
									// shadowRgb="55,48,163"
								>
									<main className="flex min-h-screen flex-col items-center">
										<Header />
										<div className="container flex w-full flex-col px-0">
											{children}
										</div>
										<div className="mx-auto mt-auto w-full text-center">
											<CommandDialogMenu />
										</div>
									</main>
								</Onborda>
							</OnbordaProvider>
						</ThemeProvider>
						<Toaster />
					</SessionProvider>

					<OpenPanelComponent
						clientId="870c92d4-d23b-49c2-a77d-3aeffd830e98"
						trackScreenViews={true}
						trackAttributes={true}
						trackOutgoingLinks={true}
						profileId="admin"
					/>
				</body>
			</html>
		</ViewTransitions>
	)
}
