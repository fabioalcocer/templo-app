import { CommandDialogMenu } from '@/components/command-menu'
import CustomCard from '@/components/custom-card'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { steps } from '@/lib/steps'
import { cn } from '@/lib/utils'
import { stackServerApp } from '@/stack'
import { OpenPanelComponent } from '@openpanel/nextjs'
import * as seline from '@seline-analytics/web'
import { StackProvider, StackTheme } from '@stackframe/stack'
import type { Metadata } from 'next'

import { ViewTransitions } from 'next-view-transitions'
import Script from 'next/script'
import { Onborda, OnbordaProvider } from 'onborda'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
	title: 'Templo App',
	description: 'Templo Gym App by Fabio Alcocer',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	seline.init({
		token: 'b67035b36c8b0e5',
		apiHost: '/_sln',
	})

	const theme = {
		radius: '0.6rem',
		light: {
			primary: '#facc14',
		},
		dark: {
			primary: '#facc14',
		},
	}

	return (
		<ViewTransitions>
			<html lang="es">
				<Script src="/sln.js" data-api-host="/_sln" async />
				<body
					suppressHydrationWarning
					className={cn(
						'min-h-screen bg-background font-sans antialiased',
						GeistSans.variable,
						GeistMono.variable,
					)}
				>
					<StackProvider app={stackServerApp} lang="es-ES">
						<StackTheme theme={theme}>
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

							<OpenPanelComponent
								clientId="870c92d4-d23b-49c2-a77d-3aeffd830e98"
								trackScreenViews={true}
								trackAttributes={true}
								trackOutgoingLinks={true}
								profileId="admin"
							/>
						</StackTheme>
					</StackProvider>
				</body>
			</html>
		</ViewTransitions>
	)
}
