'use client'
import Logo from '@/assets/logo-black.png'
import LogoWhite from '@/assets/logo-white.png'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserCog2Icon, UserIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

import {
	OrganizationSwitcher,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
	useAuth,
	useOrganization,
	useUser,
} from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Skeleton } from './ui/skeleton'

function Header() {
	const { isSignedIn, user } = useUser()
	const { theme } = useTheme()

	const authObj = useAuth()
	const organization = useOrganization()

	const [isDarkTheme, setIsDarkTheme] = useState(false)
	const { resolvedTheme } = useTheme()

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

				<SignedOut>
					<SignInButton>
						<Button variant="outline" size="icon">
							<UserIcon className="h-5 w-5" />
						</Button>
					</SignInButton>
				</SignedOut>

				<div className="space-x-5">
					<SignedIn>
						<OrganizationSwitcher
							appearance={{
								baseTheme: theme === 'dark' ? dark : undefined,
								variables: {
									colorPrimary: '#fff',
								},
								elements: {
									avatarBox: 'w-8 h-8 rounded-full',
									organizationPreview:
										'text-slate-900 dark:text-muted-foreground',
									organizationSwitcherTriggerIcon:
										'text-slate-900 dark:text-muted-foreground',
								},
							}}
						>
							<OrganizationSwitcher.OrganizationProfilePage
								label="Custom Page"
								url="custom"
								labelIcon={<UserCog2Icon className="w-4 h-4" />}
							>
								<CustomPage />
							</OrganizationSwitcher.OrganizationProfilePage>
						</OrganizationSwitcher>
					</SignedIn>
					<SignedIn>
						<UserButton
							appearance={{
								elements: {
									avatarBox: 'w-10 h-10',
								},
								baseTheme: theme === 'dark' ? dark : undefined,
							}}
						/>
					</SignedIn>
				</div>

				<div className="flex items-center gap-3">
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger className="rounded-full">
							{isSignedIn ? (
								<Avatar>
									<AvatarImage src={user?.imageUrl} alt="@templo_admin" />
									<AvatarFallback>AF</AvatarFallback>
								</Avatar>
							) : (
								<Skeleton className="h-10 w-10 rounded-full" />
							)}
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/">Punto de venta</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/admin/dashboards">Dashboard</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-red-500">
								Cerrar sesión
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}

export default Header

const CustomPage = () => {
	return (
		<div className="space-y-2">
			<h1 className="text-base font-bold">Custom Organization Page</h1>
			<p className="text-xs">This is the custom organization profile page</p>
		</div>
	)
}
