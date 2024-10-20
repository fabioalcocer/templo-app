import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Authentication',
	description: 'Authentication forms built using the components.',
}

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="es">
			<body
				suppressHydrationWarning
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable,
				)}
			>
				<div className="min-h-screen flex flex-col items-center justify-center">
					<main className="h-full">{children}</main>
				</div>
			</body>
		</html>
	)
}
