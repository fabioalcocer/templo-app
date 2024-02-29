import Link from 'next/link'
import { Button } from './ui/button'
import { DollarSign, TagIcon } from 'lucide-react'

function AdminSidebar() {
  return (
    <div className='sticky bottom-0 top-0 flex h-full w-full max-w-[200px] flex-col'>
      <h3 className='font-mono font-semibold text-lg mb-3'>Menú de opciones</h3>
      <Link href='/admin/products' className='w-full'>
        <Button
          variant='outline'
          className='w-full justify-start rounded-none py-6'
        >
          <TagIcon className='mr-3 h-5 w-5' />
          Productos
        </Button>
      </Link>
      <Link href='/admin/sales'>
        <Button
          variant='outline'
          className='w-full justify-start rounded-none py-6'
        >
          <DollarSign className='mr-3 h-5 w-5' />
          Registro de ventas
        </Button>
      </Link>
    </div>
  )
}

export default AdminSidebar
