'use client'

import { BoxIcon, DollarSign, UserCogIcon, Users2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Home, LineChart, Menu, UserIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

function AdminSidebar({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const ROUTES = [
    {
      label: 'Dashboards',
      path: '/admin/dashboards',
      icon: <Home className='h-5 w-5' />,
    },
    {
      label: 'Inventario',
      path: '/admin/inventory',
      icon: <BoxIcon className='h-5 w-5' />,
    },
    {
      label: 'Registro de ventas',
      path: '/admin/sales',
      icon: <DollarSign className='h-5 w-5' />,
    },
    {
      label: 'Registro de compras',
      path: '/admin/purchases',
      icon: <UserCogIcon className='h-5 w-5' />,
    },
    {
      label: 'Analíticas',
      path: '/admin/analytics',
      icon: <LineChart className='h-5 w-5' />,
    },
    {
      label: 'Usuarios',
      path: '/admin/users',
      icon: <Users2 className='h-5 w-5' />,
    },
  ]

  const path = usePathname()

  return (
    <div className='grid min-h-[calc(100vh_-_80px)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <div className='hidden border-r bg-muted/40 md:block'>
        <div className='flex h-full max-h-screen flex-col gap-2'>
          <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
            <div className='flex items-center gap-2 text-lg font-semibold'>
              <div className='flex items-center gap-3 text-base'>
                <UserIcon className='h-6 w-6' />
                <p>Panel de Control</p>
              </div>
              <span className='sr-only'>Templo Gym</span>
            </div>
          </div>
          <div className='flex-1'>
            <nav className='grid items-start px-2 text-base font-medium lg:px-4'>
              {ROUTES.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300 dark:hover:text-primary',
                    path === route.path
                      ? 'bg-primary text-foreground dark:bg-secondary dark:text-primary'
                      : 'text-foreground hover:bg-secondary hover:text-foreground dark:hover:bg-transparent',
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className='flex flex-col'>
        <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden lg:h-[60px] lg:px-6'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='shrink-0 md:hidden'
              >
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='flex flex-col'>
              <nav className='grid gap-2 text-lg font-medium'>
                <div className='flex items-center gap-2 pb-4 pt-8 text-lg font-semibold'>
                  <div className='flex items-center gap-3'>
                    <UserIcon className='h-6 w-6' />
                    <p>Panel de Control</p>
                  </div>
                  <span className='sr-only'>Templo Gym</span>
                </div>
                {ROUTES.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className='mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground'
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className='flex h-full flex-1 flex-col overflow-y-hidden p-4 lg:gap-6 lg:p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminSidebar
