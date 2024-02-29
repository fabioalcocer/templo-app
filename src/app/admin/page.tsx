'use client'
import { TableDemo } from '@/components/demo-table'
import { UserCogIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'

export default function AdminPage() {
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
    <Suspense fallback={<Loading />}>
      <div className='flex flex-col gap-4'>
        <h2 className='mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold'>
          <UserCogIcon width={36} height={36} />
          Admin Dashboard
        </h2>

        <TableDemo />
      </div>
    </Suspense>
  )
}

AdminPage.requireAuth = true
