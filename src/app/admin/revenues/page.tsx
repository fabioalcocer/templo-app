'use client'
import { RevenueTable } from '@/components/revenue-table'
import { BadgeDollarSign } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function RevenuesPage() {
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
        <BadgeDollarSign width={36} height={36} />
        Resumen de ingresos
      </h2>
      <RevenueTable />
    </div>
  )
}

RevenuesPage.requireAuth = true
