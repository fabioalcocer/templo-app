'use client'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

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
    <div className='flex flex-col gap-4'>
      <h2 className='mb-8 text-center text-3xl font-semibold'>
        Admin Dashboard
      </h2>
      <p>Bienvenido: {session?.data?.user?.email}</p>
      <Button className='w-40' onClick={() => signOut()}>Sign out</Button>
    </div>
  )
}

AdminPage.requireAuth = true
