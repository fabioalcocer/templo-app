'use client'
import {
	Activity,
	ArrowUpRight,
	CreditCard,
	DollarSign,
	Download,
	HandCoinsIcon,
	MehIcon,
	Users,
} from 'lucide-react'
import Link from 'next/link'

import { getAllPayments, getAllPurchases, getSales, getUserById } from '@/api'
import { DatePickerWithRange } from '@/components/date-range-picker'
import PaymentCards from '@/components/payments-card'
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
import { toast } from '@/components/ui/use-toast'
import {
	calculateTotalFromPayments,
	calculateTotalFromPurchases,
	calculateTotalFromSales,
	parsedPriceFromNumber,
} from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import MotionNumber from 'motion-number'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
function DashboardsPage() {
	const [payments, setPayments] = useState<Payment[]>([])
	const [purchases, setPurchases] = useState<Purchase[]>([])
	const [sales, setSales] = useState<Sale[]>([])

	const [totalRevenues, setTotalRevenues] = useState<number>(0)

	const calculateTotalRevenues = (
		sales: Sale[],
		purchases: Purchase[],
		payments: Payment[],
	) => {
		const salesTotal = calculateTotalFromSales(sales) as string
		const purchasesTotal = calculateTotalFromPurchases(purchases) as string
		const paymentsTotal = calculateTotalFromPayments(payments) as string

		const integerPaymentsValue = Number.parseInt(
			paymentsTotal.replace(/\D/g, ''),
			10,
		)
		const integerSalesValue = Number.parseInt(salesTotal.replace(/\D/g, ''), 10)
		const integerPurchasesValue = Number.parseInt(
			purchasesTotal.replace(/\D/g, ''),
			10,
		)

		const totalRevenues = integerSalesValue + integerPaymentsValue
		const totalRenevues = (totalRevenues - integerPurchasesValue) / 100
		setTotalRevenues(totalRenevues)

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

		calculateTotalRevenues(sales, purchases, payments)

		setSales(sales)
		setPurchases(purchases)
		setPayments(payments?.sort((a, b) => b.createdAt - a.createdAt))
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
		<div className="flex min-h-[calc(100vh_-_80px)] w-full flex-col">
			<main className="flex flex-1 flex-col gap-4 md:gap-8">
				<header className="flex flex-wrap items-center justify-between gap-4 lg:gap-0">
					<h1 className="dashboard text-3xl font-bold">Dashboard</h1>
					<div className="flex flex-wrap items-center gap-4">
						{/* <DatePickerWithRange /> */}
						<Button
							onClick={() =>
								toast({
									title: (
										<div className="flex w-full items-center gap-2">
											Esta función aún no está disponible
											<MehIcon />
										</div>
									),
								})
							}
						>
							<Download className="mr-2 h-4 w-4" /> Exportar
						</Button>
					</div>
				</header>
				<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
					<Card id="onborda-step1">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total de Ingresos
							</CardTitle>
							<DollarSign className="h-5 w-5 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								Bs.{' '}
								<MotionNumber
									value={totalRevenues}
									format={{ notation: 'standard' }}
									locales="es-BO"
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								-20.1% desde el último mes
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Ventas</CardTitle>
							<HandCoinsIcon className="h-5 w-5 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								Bs.{' '}
								<MotionNumber
									value={calculateTotalFromSales(sales, true)}
									format={{ notation: 'standard' }}
									locales="es-BO"
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								+19% desde el último mes
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Compras</CardTitle>
							<CreditCard className="h-5 w-5 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								- Bs.{' '}
								<MotionNumber
									value={calculateTotalFromPurchases(purchases, true)}
									format={{ notation: 'standard' }}
									locales="es-BO"
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								+180.1% desde el último mes
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Inscripciones
							</CardTitle>
							<Users className="h-5 w-5 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								Bs.{' '}
								<MotionNumber
									value={calculateTotalFromPayments(payments, true)}
									format={{ notation: 'standard' }}
									locales="es-BO"
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								+10% desde el ultimo mes
							</p>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
					<Card className="xl:col-span-2" id="onborda-step2">
						<CardHeader className="flex flex-row items-center">
							<div className="grid gap-2">
								<CardTitle>Ventas recientes</CardTitle>
								<CardDescription>
									Ventas recientes de tu punto de venta.
								</CardDescription>
							</div>
							<Button asChild size="sm" className="ml-auto gap-1">
								<Link href="/admin/sales">
									Ver más
									<ArrowUpRight className="h-4 w-4" />
								</Link>
							</Button>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Producto</TableHead>
										<TableHead>Monto</TableHead>
										<TableHead className="hidden text-right md:table-cell">
											Fecha
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{dashboardSalesData.map((sale) => (
										<TableRow className="w-full" key={sale.id}>
											<TableCell>
												<div className="font-medium">
													{sale.name}{' '}
													<span className="inline text-sm text-muted-foreground">
														{`(x${sale.quantity})`}
													</span>
												</div>
											</TableCell>
											<TableCell className="table-cell">
												{parsedPriceFromNumber(sale.total)}
											</TableCell>
											<TableCell className="hidden text-right md:table-cell">
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
					<Card className="w-full" id="onborda-step3">
						<CardHeader>
							<CardTitle className="flex items-center justify-between gap-2">
								Inscripciones
								<Button asChild size="sm" className="ml-auto gap-1">
									<Link href="/admin/payments">
										Ver más
										<ArrowUpRight className="h-4 w-4" />
									</Link>
								</Button>
							</CardTitle>
						</CardHeader>
						{payments?.slice(0, 6).map((payment) => (
							<PaymentCards payment={payment} key={payment.id} />
						))}
					</Card>
				</div>
			</main>
		</div>
	)
}

export default DashboardsPage
