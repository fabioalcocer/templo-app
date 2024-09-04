'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function ModeToggle() {
	const { setTheme, theme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => setTheme('light')}
					className="flex items-center gap-2"
				>
					<Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
					Claro
					<span className={cn('w-[7px] h-[7px] ml-1 rounded-full bg-primary', theme === 'light' ? 'opacity-100' : 'opacity-0')} />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme('dark')}
					className="flex items-center gap-2"
				>
					<Moon className="h-[1rem] w-[1rem]" />
					Oscuro
					<span className={cn('w-[7px] h-[7px] ml-1 rounded-full bg-primary', theme === 'dark' ? 'opacity-100' : 'opacity-0')} />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme('system')}
					className="flex items-center gap-2"
				>
					<Monitor className="h-[1rem] w-[1rem]" />
					Sistema
					<span className={cn('w-[7px] h-[7px] ml-1 rounded-full bg-primary', theme === 'system' ? 'opacity-100' : 'opacity-0')} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
