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
import { useEffect, useState } from 'react'

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

  const parsedPriceFromNumber = (price: number) => {
    const formattedPrice = new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price)

    return formattedPrice
  }

  const calculateTotalFromSales = (sales: Sale[]) => {
    const total = sales.reduce((total, sale) => {
      return total + sale?.total
    }, 0)

    return parsedPriceFromNumber(total)
  }

  useEffect(() => {
    fetchSales()
  }, [])

  return (
    <Table>
      <TableCaption>A list of your recent sales.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>ID</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className='text-right'>Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales?.map((sale) => (
          <TableRow key={sale?.id}>
            <TableCell className='font-medium'>{sale?.id}</TableCell>
            <TableCell>{sale?.name}</TableCell>
            <TableCell>{parsePaymentType(sale?.paymentType)}</TableCell>
            <TableCell className='text-right'>
              {parsedPriceFromNumber(sale?.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className='font-semibold'>Total</TableCell>
          <TableCell className='text-right font-semibold'>
            {calculateTotalFromSales(sales)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
