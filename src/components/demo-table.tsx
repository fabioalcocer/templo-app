'use client'
import { getSales } from '@/api'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { calculateTotalFromSales, getCategoryNameById, parsedPriceFromNumber } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

export function TableDemo() {
  const [sales, setSales] = useState<Sale[]>([])

  const fetchSales = async () => {
    const sales = await getSales()
    return setSales(sales)
  }

  const parsePaymentType = (paymentType: string) => {
    type Payments = keyof typeof paymentTypes
    const paymentTypes = {
      qr: 'QR',
      cash: 'Efectivo',
      card: 'Tarjeta de débito',
    } as const

    return paymentTypes[paymentType as Payments] ?? ''
  }

  useEffect(() => {
    fetchSales()
  }, [])

  return (
    <div className=''>
      <Table>
        <TableCaption>Lista de tus ventas recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead className='w-[100px]'>ID</TableHead> */}
            <TableHead>Fecha de venta</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className='text-right'>Precio U.</TableHead>
            <TableHead className='text-right'>Cantidad</TableHead>
            <TableHead className='text-right'>Monto Total</TableHead>
            <TableHead>Método</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales?.map((sale) => (
            <TableRow key={sale?.id}>
              {/* <TableCell className='font-medium'>{`${sale?.id.slice(0, 7)}...`}</TableCell> */}
              <TableCell>
                {sale?.createdAt
                  ? format(sale?.createdAt, 'PPP')
                  : 'March 27th, 2024'}
              </TableCell>
              <TableCell>{sale?.name}</TableCell>
              <TableCell className='text-right'>
                {parsedPriceFromNumber(sale?.total / sale?.quantity)}
              </TableCell>
              <TableCell className='text-right'>{sale?.quantity}</TableCell>
              <TableCell className='text-right'>
                {parsedPriceFromNumber(sale?.total)}
              </TableCell>
              <TableCell>{parsePaymentType(sale?.paymentType)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className='font-semibold'></TableCell>
            <TableCell className='text-right font-semibold'>
              {calculateTotalFromSales(sales)}
            </TableCell>
            <TableCell className='font-semibold'>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
