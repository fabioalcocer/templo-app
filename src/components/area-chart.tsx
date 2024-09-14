'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { getAllPayments, getAllPurchases, getSales } from '@/api'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { convertStringToDate } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

type NumberKey = keyof typeof filtersDateObj

interface ChartData {
	date: string
	expenses: number
	revenues: number
}

// DAY_MS is the number of milliseconds in a day
const DAY_MS = 86400000

const filtersDateObj = {
	'180d': 180,
	'90d': 90,
	'30d': 30,
	'7d': 7,
}

const chartConfig = {
	revenues: {
		label: 'Ingresos',
		color: 'hsl(var(--chart-1))',
	},
	expenses: {
		label: 'Gastos',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig

const parsedDate = (date: number) => {
	const parseDate = new Date(date)
	return parseDate.toISOString()
}

export function AreaChartComponent() {
	const [chartData, setChartData] = React.useState<ChartData[]>([])
	const [timeRange, setTimeRange] = React.useState('90d')

	const filteredData = chartData?.filter((item) => {
		const date = new Date(item.date)
		const now = new Date()
		let daysToSubtract = 90

		if (timeRange !== '90d') {
			daysToSubtract = filtersDateObj[timeRange as NumberKey]
		}

		now.setDate(now.getDate() - daysToSubtract)
		return date >= now
	})

	const parsedData = async ({
		sales,
		purchases,
		payments,
	}: {
		sales: Sale[]
		purchases: Purchase[]
		payments: Payment[]
	}) => {
		const startDate = Math.min(
			...sales.map((sale) => new Date(sale.createdAt).getTime()),
			...purchases.map((purchase) => new Date(purchase.createdAt).getTime()),
			...payments.map((payment) => new Date(payment.createdAt).getTime()),
		)
		const endDate = Math.max(
			...sales.map((sale) => new Date(sale.createdAt).getTime()),
			...purchases.map((purchase) => new Date(purchase.createdAt).getTime()),
			...payments.map((payment) => new Date(payment.createdAt).getTime()),
		)

		const dates = []
		for (let date = startDate; date <= endDate; date += DAY_MS) {
			dates.push(new Date(date + DAY_MS))
		}

		const result = dates.map((date) => {
			const offset = date.getTimezoneOffset()
			const adjustedDate = new Date(date.getTime() + offset * 60 * 1000)
			const dateString = adjustedDate.toISOString().split('T')[0]

			const revenues = sales
				.filter((sale) => parsedDate(sale.createdAt).startsWith(dateString))
				.reduce((acc, sale) => acc + sale.total, 0)

			const paymentsRevenues = payments
				.filter((payment) =>
					parsedDate(payment.createdAt).startsWith(dateString),
				)
				.reduce((acc, payment) => acc + payment.finalPrice, 0)

			const totalRevenues = revenues + paymentsRevenues

			const expenses = purchases
				.filter((purchase) =>
					parsedDate(purchase.createdAt).startsWith(dateString),
				)
				.reduce((acc, purchase) => acc + purchase.cost * purchase?.stock, 0)

			return {
				date: dateString,
				revenues: totalRevenues,
				expenses,
			}
		})

		setChartData(result)
	}

	const fetchData = async () => {
		const sales = await getSales()
		const purchases = await getAllPurchases()
		const payments = await getAllPayments()

		await parsedData({ sales, purchases, payments })
	}

	React.useEffect(() => {
		fetchData()
	}, [])

	return (
		<Card>
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>Ingresos y Gastos</CardTitle>
					<CardDescription>
						Mostrando el total de ingresos y gastos en los últimos{' '}
						{filtersDateObj[timeRange as NumberKey]} días
					</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger
						className="w-[160px] rounded-lg sm:ml-auto"
						aria-label="Select a value"
					>
						<SelectValue placeholder="Last 3 months" />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem value="180d" className="rounded-lg">
							Últimos 6 meses
						</SelectItem>
						<SelectItem value="90d" className="rounded-lg">
							Últimos 3 meses
						</SelectItem>
						<SelectItem value="30d" className="rounded-lg">
							Últimos 30 días
						</SelectItem>
						<SelectItem value="7d" className="rounded-lg">
							Últimos 7 días
						</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					{filteredData?.length > 0 ? (
						<AreaChart data={filteredData}>
							<defs>
								<linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor="var(--color-expenses)"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="var(--color-expenses)"
										stopOpacity={0.1}
									/>
								</linearGradient>
								<linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor="var(--color-revenues)"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="var(--color-revenues)"
										stopOpacity={0.1}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) => {
									const date = convertStringToDate(value)
									return date.toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
									})
								}}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										labelFormatter={(value) => {
											const date = convertStringToDate(value)
											return date.toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
											})
										}}
										indicator="line"
									/>
								}
							/>
							<Area
								dataKey="revenues"
								type="natural"
								fill="url(#fillMobile)"
								stroke="var(--color-revenues)"
								stackId="a"
							/>
							<Area
								dataKey="expenses"
								type="natural"
								fill="url(#fillDesktop)"
								stroke="var(--color-expenses)"
								stackId="a"
							/>
							<ChartLegend content={<ChartLegendContent />} />
						</AreaChart>
					) : (
						<div className="grid place-items-center h-full m-auto">
							<div className="flex items-center justify-center gap-3 text-center text-3xl font-semibold">
								<AlertCircle className="h-12 w-12 text-muted-foreground" />
								<p className="text-muted-foreground">
									No hay datos disponibles
								</p>
							</div>
						</div>
					)}
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
