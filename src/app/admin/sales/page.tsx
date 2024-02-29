import { TableDemo } from '@/components/demo-table'
import { DollarSign } from 'lucide-react'
import React from 'react'

function SalesPage() {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold'>
        <DollarSign width={36} height={36} />
        Registrod de ventas
      </h2>
      <TableDemo />
    </div>
  )
}

export default SalesPage
