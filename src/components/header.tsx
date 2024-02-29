'use client'
import { DnaIcon, UserCog2Icon, UserCogIcon, UserIcon } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

function Header() {
  const session = useSession()
  const isLogin = session.status === 'authenticated'

  return (
    <header className='sticky top-0 flex w-full bg-background md:p-5 py-3 px-0 shadow-md'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-5'>
        <Link href='/' className='flex items-center gap-3'>
          <DnaIcon className='h-8 w-8' />
          <h1 className='text-2xl font-semibold font-mono uppercase'>Templo</h1>
        </Link>

        <div className='flex items-center gap-3'>
          <ModeToggle />
          {isLogin ? (
            <>
              <Link href='/admin'>
                <Button variant='outline' size='icon'>
                  <UserCog2Icon className='h-5 w-5' />
                </Button>
              </Link>
              <div className='ml-auto flex w-max flex-col items-end justify-center'>
                {/* <p className='font-medium'>{session?.data?.user?.email}</p> */}
                <Button
                  className='w-20'
                  variant='secondary'
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <Link href='/login'>
              <Button variant='outline' size='icon'>
                <UserIcon className='h-5 w-5' />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
