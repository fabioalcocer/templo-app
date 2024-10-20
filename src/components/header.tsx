'use client'
import Logo from '@/assets/logo-black.png'
import LogoWhite from '@/assets/logo-white.png'

import { UserButton } from '@stackframe/stack'
import { LayoutDashboard, StoreIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ModeToggle } from './mode-toggle'

function Header() {
	const [isDarkTheme, setIsDarkTheme] = useState(false)
	const { resolvedTheme } = useTheme()
	const router = useRouter()

	useEffect(() => {
		setIsDarkTheme(resolvedTheme === 'dark')
	}, [resolvedTheme])

	return (
		<header className="sticky top-0 z-50 flex w-full bg-background px-0 py-3 shadow-sm rounded-lg md:p-5 md:py-4">
			<div className="mx-auto flex w-full max-w-[1450px] items-center justify-between px-3">
				<Link href="/" className="flex items-center gap-3">
					<Image
						src={isDarkTheme ? LogoWhite : Logo}
						width={150}
						alt="Templo logo blanco"
						className="mr-3"
					/>
					{/* <h1 className='font-mono text-2xl font-semibold uppercase'>Templo</h1> */}
				</Link>

				<div className="flex items-center gap-3">
					<ModeToggle />

					<div className="grid place-content-center rounded-full w-10 h-10">
						<UserButton
							extraItems={[
								{
									text: 'Punto de venta',
									icon: <StoreIcon className="h-4 w-4" />,
									onClick: () => router.push('/'),
								},
								{
									text: 'Dashboard',
									icon: <LayoutDashboard className="h-4 w-4" />,
									onClick: () => router.push('/admin/dashboards'),
								},
							]}
						/>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
