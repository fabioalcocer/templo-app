'use client'
import { getAllProducts, getSales } from '@/api'
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
import {
  calculateTotalFromPurchases,
  calculateTotalFromSales,
  getCategoryNameById,
  parsedPriceFromNumber,
} from '@/lib/utils'
import { useEffect, useState } from 'react'

export function RevenueTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])

  const calculateTotalRevenues = () => {
    const salesTotal = calculateTotalFromSales(sales)
    const purchasesTotal = calculateTotalFromPurchases(products)
    const integerSalesValue = parseInt(salesTotal.replace(/\D/g, ''), 10)
    const integerPurchasesValue = parseInt(
      purchasesTotal.replace(/\D/g, ''),
      10,
    )

    const totalRenevues = (integerSalesValue - integerPurchasesValue) / 100
    return parsedPriceFromNumber(totalRenevues)
  }

  const fetchSales = async () => {
    const sales = await getSales()
    return setSales(sales)
  }

  const fetchProducts = async () => {
    const products = await getAllProducts()
    return setProducts(products)
  }

  useEffect(() => {
    fetchSales()
    fetchProducts()
  }, [])

  return (
    <div className=''>
      <Table>
        <TableCaption>A list of your revenues.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Ventas</TableHead>
            <TableHead>Gastos</TableHead>
            <TableHead>Ingresos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* <TableRow>
            <TableCell className='font-semibold'>
              {calculateTotalFromSales(sales)}
            </TableCell>
            <TableCell className='font-semibold'>
              {calculateTotalFromPurchases(products)}
            </TableCell>
            <TableCell className='font-semibold'>
              {calculateTotalRevenues()}
            </TableCell>
          </TableRow> */}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className='font-semibold'>
              {calculateTotalFromSales(sales)}
            </TableCell>
            <TableCell className='font-semibold'>
              {calculateTotalFromPurchases(products)}
            </TableCell>
            <TableCell className='font-semibold'>
              {calculateTotalRevenues()}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
