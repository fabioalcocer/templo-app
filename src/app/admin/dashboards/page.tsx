'use client'
import Link from 'next/link'
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Download,
  MehIcon,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  calculateTotalFromPurchases,
  calculateTotalFromSales,
  parsedPriceFromNumber,
} from '@/lib/utils'
import { getAllPayments, getAllPurchases, getSales, getUserById } from '@/api'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { DatePickerWithRange } from '@/components/date-range-picker'
import { toast } from '@/components/ui/use-toast'

function DashboardsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [sales, setSales] = useState<Sale[]>([])

  const calculateTotalRevenues = () => {
    const salesTotal = calculateTotalFromSales(sales)
    const purchasesTotal = calculateTotalFromPurchases(purchases)
    const integerSalesValue = parseInt(salesTotal.replace(/\D/g, ''), 10)
    const integerPurchasesValue = parseInt(
      purchasesTotal.replace(/\D/g, ''),
      10,
    )

    const totalRenevues = (integerSalesValue - integerPurchasesValue) / 100
    return parsedPriceFromNumber(totalRenevues)
  }

  const dashboardSalesData = sales
    ?.filter((sale) => sale.createdAt)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)

  const fetchData = async () => {
    const sales = await getSales()
    const purchases = await getAllPurchases()
    const payments = await getAllPayments()

    setSales(sales)
    setPurchases(purchases)
    setPayments(payments)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
    <div className='flex min-h-[calc(100vh_-_80px)] w-full flex-col'>
      <main className='flex flex-1 flex-col gap-4 md:gap-8'>
        <header className='flex flex-wrap items-center justify-between gap-4 lg:gap-0'>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <div className='flex flex-wrap items-center gap-4'>
            <DatePickerWithRange />
            <Button
              onClick={() =>
                toast({
                  title: (
                    <div className='flex w-full items-center gap-2'>
                      Esta función aún no está disponible
                      <MehIcon />
                    </div>
                  ),
                })
              }
            >
              <Download className='mr-2 h-4 w-4' /> Download
            </Button>
          </div>
        </header>
        <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total de Ingresos
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {calculateTotalRevenues()}
              </div>
              <p className='text-xs text-muted-foreground'>
                -20.1% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Ventas</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {calculateTotalFromSales(sales)}
              </div>
              <p className='text-xs text-muted-foreground'>
                +19% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Compras</CardTitle>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                - {calculateTotalFromPurchases(purchases)}
              </div>
              <p className='text-xs text-muted-foreground'>
                +180.1% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Active Now</CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+573</div>
              <p className='text-xs text-muted-foreground'>
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
          <Card className='xl:col-span-2'>
            <CardHeader className='flex flex-row items-center'>
              <div className='grid gap-2'>
                <CardTitle>Ventas recientes</CardTitle>
                <CardDescription>
                  Ventas recientes de tu punto de venta.
                </CardDescription>
              </div>
              <Button asChild size='sm' className='ml-auto gap-1'>
                <Link href='/admin/sales'>
                  Ver detalles
                  <ArrowUpRight className='h-4 w-4' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead className='hidden text-right md:table-cell'>
                      Fecha
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardSalesData.map((sale) => (
                    <TableRow className='w-full' key={sale.id}>
                      <TableCell>
                        <div className='font-medium'>
                          {sale.name}{' '}
                          <span className='inline text-sm text-muted-foreground'>
                            {`(x${sale.quantity})`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='table-cell'>
                        {parsedPriceFromNumber(sale.total)}
                      </TableCell>
                      <TableCell className='hidden text-right md:table-cell'>
                        {sale?.createdAt
                          ? format(sale?.createdAt, 'P', {
                              locale: es,
                            })
                          : 'Sin fecha'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Inscripciones recientes</CardTitle>
            </CardHeader>
            {payments
              ?.slice(0, 5)
              .map((payment) => (
                <PaymentCards payment={payment} key={payment.id} />
              ))}
          </Card>
        </div>
      </main>
    </div>
  )
}

export default DashboardsPage

export function PaymentCards({ payment }: { payment: Payment }) {
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    if (payment?.userId) {
      getUserById(payment?.userId).then((userData) => {
        setUserData(userData)
      })
    }
  }, [payment?.userId])

  return (
    <CardContent className='grid gap-8 overflow-hidden'>
      <div className='flex items-center gap-4'>
        <Avatar className='hidden h-9 w-9 md:flex'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className='grid gap-1'>
          <p className='text-sm font-medium leading-none'>{userData?.name}</p>
          <p className='text-xs text-muted-foreground'>{userData?.email}</p>
        </div>
        <div className='ml-auto font-medium text-sm'>
          +{parsedPriceFromNumber(payment?.finalPrice)}
        </div>
      </div>
    </CardContent>
  )
}
