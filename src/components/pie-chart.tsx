'use client'

import { AlertCircle, HelpCircleIcon, TrendingUp } from 'lucide-react'
import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { getAllUsers } from '@/services'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { getDynamicMonths, parsedTimestampDate } from '@/lib/utils'

const chartConfig = {
	calistenia: {
		label: 'Calistenia',
		color: ' hsl(var(--primary))',
	},
	'power-plate': {
		label: 'Power Plate',
		color: '#e11d48',
	},
	custom: {
		label: 'Personalizado',
		color: '#2563eb',
	},
	other: {
		label: 'Otras',
		color: 'hsl(var(--chart-4))',
	},
} satisfies ChartConfig

type ChartData = {
	discipline: string
	users: number
	fill: string
}

export function PieChartComponent() {
	const [chartData, setChartData] = React.useState<ChartData[]>([])
	const [monthToFilter, setMonthToFilter] = React.useState('180d')
	const monthOptions = getDynamicMonths(8)

	function getDisciplineChartData(users: User[]) {
		const disciplineCounts: Record<string, { count: number }[]> = {}

		const isWithinLast6Months = (dateString: string) => {
			const [month, day, year] = dateString.split('/').map(Number)
			const date = new Date(year, month - 1, day)
			const sixMonthsAgo = new Date()
			sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
			return date >= sixMonthsAgo
		}

		// Filter users based on monthToFilter
		const filteredUsers = users.filter((user) => {
			const userDateString = parsedTimestampDate(user.dateEntry as Date)

			if (monthToFilter === '180d') {
				return isWithinLast6Months(userDateString)
			}
			const [userMonth, _, userYear] = userDateString.split('/').map(Number)
			const [filterYear, filterMonth] = monthToFilter.split('-').map(Number)
			return userYear === filterYear && userMonth === filterMonth
		})

		for (const user of filteredUsers) {
			const discipline = user.discipline || 'other'
			if (!disciplineCounts[discipline]) {
				disciplineCounts[discipline] = []
			}
			disciplineCounts[discipline].push({
				count: 1,
			})
		}

		const colors = {
			calistenia: 'var(--color-calistenia)',
			'power-plate': 'var(--color-power-plate)',
			custom: 'var(--color-custom)',
			other: 'var(--color-other)',
		}

		const chartData = Object.entries(disciplineCounts).map(
			([discipline, entries]) => ({
				discipline,
				users: entries.length,
				fill: colors[discipline as keyof typeof colors] || colors.other,
			}),
		)

		return chartData
	}

	const totalVisitors = React.useMemo(() => {
		return chartData?.reduce((acc, curr) => acc + curr.users, 0)
	}, [chartData])

	const fetchData = async () => {
		const users = await getAllUsers()
		const chartData = getDisciplineChartData(users)
		setChartData(chartData)
	}

	React.useEffect(() => {
		fetchData()
	}, [monthToFilter])

	return (
		<Card className="flex flex-col h-full" id="onborda-step6">
			<CardHeader className="items-center pb-0">
				<CardTitle>Usuarios - Disciplinas</CardTitle>
				<CardDescription>Enero - Agosto 2024</CardDescription>
			</CardHeader>

			<Select value={monthToFilter} onValueChange={setMonthToFilter}>
				<SelectTrigger
					className="w-[160px] rounded-lg mt-5 ml-2"
					aria-label="Selecciona un mes"
				>
					<SelectValue placeholder="Últimos 6 meses" defaultValue="180d" />
				</SelectTrigger>
				<SelectContent className="rounded-xl">
					<SelectItem value="180d" className="rounded-lg">
						Últimos 6 meses
					</SelectItem>
					{monthOptions.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
							className="rounded-lg"
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					{chartData.length > 0 ? (
						<PieChart>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Pie
								data={chartData}
								dataKey="users"
								nameKey="discipline"
								innerRadius={60}
								strokeWidth={5}
							>
								<Label
									content={({ viewBox }) => {
										if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
											return (
												<text
													x={viewBox.cx}
													y={viewBox.cy}
													textAnchor="middle"
													dominantBaseline="middle"
												>
													<tspan
														x={viewBox.cx}
														y={viewBox.cy}
														className="fill-foreground text-3xl font-bold"
													>
														{totalVisitors.toLocaleString()}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy || 0) + 24}
														className="fill-muted-foreground"
													>
														Usuarios
													</tspan>
												</text>
											)
										}
									}}
								/>
							</Pie>
						</PieChart>
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
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 font-medium leading-none">
					La tendencia sube un 2,2% este mes <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Total de usuarios en los últimos 6 meses
				</div>
			</CardFooter>
		</Card>
	)
}
