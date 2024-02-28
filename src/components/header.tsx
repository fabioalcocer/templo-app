import { UserIcon } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import Link from 'next/link'

function Header() {
  return (
    <header className='sticky top-0 flex w-full p-5 shadow-md bg-background'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-5'>
        <Link href='/'>
          <h1 className='text-2xl font-semibold uppercase'>Templo</h1>
        </Link>
        <div className='flex items-center gap-3'>
          <ModeToggle />
          <Button variant='outline' size='icon'>
            <Link href='/admin'>
              <UserIcon className='h-5 w-5' />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
