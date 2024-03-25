import { GhostIcon } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='-mt-[80px] grid min-h-screen w-full place-content-center text-center'>
      <GhostIcon className='mx-auto mb-5 h-32 w-32 animate-pulse' />
      <h4 className='text-7xl font-bold'>404</h4>
      <p className='text-3xl font-medium text-muted-foreground'>
        Recurso no encontrado
      </p>
      <Link href='/' className='mt-4 text-xl text-primary'>
        Volver al inicio
      </Link>
    </div>
  )
}
