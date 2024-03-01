'use client'
import { TableDemo } from '@/components/demo-table'
import { DollarSign } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function SalesPage() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  if (!session) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold'>
        <DollarSign width={36} height={36} />
        Registro de ventas
      </h2>
      <TableDemo />
    </div>
  )
}

SalesPage.requireAuth = true
