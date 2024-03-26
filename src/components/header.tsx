'use client'
import LogoWhite from '@/assets/logo-white.png'
import Logo from '@/assets/logo-black.png'
import { UserIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'

function Header() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const { resolvedTheme } = useTheme()
  const session = useSession()
  const isLogin = session.status === 'authenticated'

  useEffect(() => {
    setIsDarkTheme(resolvedTheme === 'dark')
  }, [resolvedTheme])

  return (
    <header className='sticky top-0 flex w-full bg-background px-0 py-3 shadow-md md:p-5 z-50'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-3 md:px-5'>
        <Link href='/' className='flex items-center gap-3'>
          <Image
            src={isDarkTheme ? LogoWhite : Logo}
            width={150}
            alt='Templo logo blanco'
            className='mr-3'
          />
          {/* <h1 className='font-mono text-2xl font-semibold uppercase'>Templo</h1> */}
        </Link>

        <div className='flex items-center gap-3'>
          <ModeToggle />
          {isLogin ? (
            <>
              <Link href='/admin/dashboards'>
                <Avatar>
                  <AvatarImage
                    src='https://avatars.githubusercontent.com/u/88163765?v=4'
                    alt='@templo_admin'
                  />
                  <AvatarFallback>AF</AvatarFallback>
                </Avatar>
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
