'use client'

import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { getAllUsers } from '@/api'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { monthOrder } from '@/lib/constants'
import { parsedMonthFromTimestamp } from '@/lib/utils'
import { Suspense, useEffect, useState } from 'react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

type ChartData = {
	month: string
	count: number
}

const chartConfig = {
	count: {
		label: 'Usuarios',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig

const exampleData = [
	{ month: 'Enero', count: 186 },
	{ month: 'Febrero', count: 305 },
	{ month: 'Marzo', count: 237 },
	{ month: 'Abril', count: 73 },
	{ month: 'Mayo', count: 209 },
	{ month: 'Junio', count: 214 },
]

export function LineChartComponent() {
	const [chartData, setChartData] = useState<ChartData[]>([])
	const [timeRange, setTimeRange] = useState('6')

	const fetchData = async () => {
		const users = await getAllUsers()
		const activeUsers = users.filter((user) => user.active)

		const parsedUsers = activeUsers.map((user) => {
			const parsedDate = parsedMonthFromTimestamp(user.dateEntry as Date)
			return {
				month: parsedDate,
				...user,
			}
		})

		const generateRadarChartData = () => {
			const monthlyActiveUsers: Record<string, number> = {}

			for (const user of parsedUsers) {
				if (user.active) {
					if (monthlyActiveUsers[user.month]) {
						monthlyActiveUsers[user.month]++
					} else {
						monthlyActiveUsers[user.month] = 1
					}
				}
			}

			const chartData = Object.entries(monthlyActiveUsers).map(
				([month, count]) => ({
					month,
					count,
				}),
			)

			return chartData.sort(
				(a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
			)
		}

		const chartDataLoaded = generateRadarChartData()
		setChartData(chartDataLoaded)
	}

	useEffect(() => {
		fetchData()
	}, [])

	const filterChartData = (data: ChartData[], range: string) => {
		const monthsToShow = Number.parseInt(range)
		const sortedData = [...data].sort(
			(a, b) => monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month),
		)
		return sortedData.slice(0, monthsToShow).reverse()
	}

	const filteredChartData = filterChartData(chartData, timeRange)

	const getDateRange = (data: ChartData[]) => {
		if (data.length === 0) return 'Sin datos disponibles'
		const firstMonth = data[0].month
		const lastMonth = data[data.length - 1].month
		const currentYear = new Date().getFullYear()
		return `${firstMonth} - ${lastMonth} ${currentYear}`
	}

	return (
		<Card className="h-full flex flex-col">
			<CardHeader>
				<CardTitle>Usuarios - Activos</CardTitle>
				<CardDescription className="text-center">
					{getDateRange(filteredChartData)}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-8">
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger
						className="w-[160px] rounded-lg"
						aria-label="Select a value"
					>
						<SelectValue placeholder="Last 3 months" />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem value={'12'} className="rounded-lg">
							Últimos 12 meses
						</SelectItem>
						<SelectItem value={'6'} className="rounded-lg">
							Últimos 6 meses
						</SelectItem>
						<SelectItem value={'3'} className="rounded-lg">
							Últimos 3 meses
						</SelectItem>
					</SelectContent>
				</Select>

				<Suspense>
					<ChartContainer config={chartConfig} className="w-full">
						<LineChart
							accessibilityLayer
							data={
								filteredChartData?.length <= 0 ? exampleData : filteredChartData
							}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Line
								dataKey="count"
								type="natural"
								stroke="var(--color-count)"
								strokeWidth={2}
								dot={{
									fill: 'var(--color-count)',
								}}
								activeDot={{
									r: 6,
								}}
							/>
						</LineChart>
					</ChartContainer>
				</Suspense>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
				<div className="flex items-center gap-2 font-medium leading-none">
					La tendencia sube un 15% este mes <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Total de usuarios en los últimos {timeRange} meses
				</div>
			</CardFooter>
		</Card>
	)
}
