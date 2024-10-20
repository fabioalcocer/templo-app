import LogoWhite from '@/assets/logo-white.png'
import Image from 'next/image'
import Link from 'next/link'

import { Skeleton } from '@/components/ui/skeleton'
import { SignIn } from '@stackframe/stack'
import { Suspense } from 'react'

export default function SignInPage() {
	return (
		<div className="container relative min-h-screen flex-col items-center justify-center grid md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<Suspense fallback={<Skeleton />}>
					<div className="absolute inset-0 bg-primary">
						<Image
							fill
							src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="Gym Background"
							className="w-full h-full object-cover"
							priority // Use priority to preload the image
						/>
					</div>
				</Suspense>
				<div className="relative z-20 flex items-center text-lg font-medium">
					<Image
						src={LogoWhite}
						width={150}
						alt="Templo logo blanco"
						className="mr-3"
					/>
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;El ayer es historia, el mañana es un misterio, pero el hoy,
							es un regalo, por eso se llama presente.&rdquo;
						</p>
						<footer className="text-sm">Maestro Oogway</footer>
					</blockquote>
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<SignIn
						// firstTab="password"
						automaticRedirect
						extraInfo={
							<p className="px-8 text-center text-sm text-muted-foreground">
								Al hacer clic en continuar, aceptas nuestros{' '}
								<Link
									href="/terms"
									className="underline underline-offset-4 hover:text-primary"
								>
									Términos de Servicio
								</Link>{' '}
								y{' '}
								<Link
									href="/privacy"
									className="underline underline-offset-4 hover:text-primary"
								>
									Política de Privacidad
								</Link>
								.
							</p>
						}
					/>
				</div>
			</div>
		</div>
	)
}
