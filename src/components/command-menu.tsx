'use client'

import {
  BoxIcon,
  Calculator,
  Calendar,
  DollarSign,
  Home,
  LineChart,
  Smile,
  UserCogIcon,
  Users2,
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function CommandDialogMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const ROUTES = [
    {
      label: 'Dashboards',
      path: '/admin/dashboards',
      icon: <Home className='mr-2 h-4 w-4' />,
    },
    {
      label: 'Inventario',
      path: '/admin/inventory',
      icon: <BoxIcon className='mr-2 h-4 w-4' />,
    },
    {
      label: 'Registro de ventas',
      path: '/admin/sales',
      icon: <DollarSign className='mr-2 h-4 w-4' />,
    },
    {
      label: 'Registro de compras',
      path: '/admin/purchases',
      icon: <UserCogIcon className='mr-2 h-4 w-4' />,
    },
    {
      label: 'Analíticas',
      path: '/admin/analytics',
      icon: <LineChart className='mr-2 h-4 w-4' />,
    },
    {
      label: 'Usuarios',
      path: '/admin/users',
      icon: <Users2 className='mr-2 h-4 w-4' />,
    },
  ]

  return (
    <>
      <p className='hidden py-2 text-sm text-muted-foreground md:inline'>
        Presiona{' '}
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          <span className='text-xs'>⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Escribe un comando o búsqueda...' />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup heading='Sugerencias'>
            {ROUTES.map((route) => (
              <Link key={route.path} href={route.path}>
                <CommandItem key={route.label}>
                  {route.icon}
                  <span className='text-muted-foreground'>{route.label}</span>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
