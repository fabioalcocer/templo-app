'use client'
import Link from 'next/link'
import { Button } from './ui/button'
import { DollarSign, TagIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

function AdminSidebar() {
  const ROUTES = [
    {
      label: 'Productos',
      path: '/admin/products',
      icon: <DollarSign className='mr-3 h-5 w-5' />,
    },
    {
      label: 'Registro de ventas',
      path: '/admin/sales',
      icon: <TagIcon className='mr-3 h-5 w-5' />,
    },
  ]

  const path = usePathname()

  return (
    <div className='sticky bottom-0 top-0 flex h-full w-full max-w-[250px] flex-col'>
      <h3 className='mb-3 font-mono text-xl font-semibold'>Menú de opciones</h3>
      {ROUTES.map((route) => (
        <Link key={route.path} href={route.path} className='w-full'>
          <Button
            variant='outline'
            className={cn(
              'w-full justify-start rounded-none py-6 text-base font-semibold',
              path === route.path ? 'bg-secondary' : 'bg-background',
            )}
          >
            {route.icon}
            {route.label}
          </Button>
        </Link>
      ))}
    </div>
  )
}

export default AdminSidebar
