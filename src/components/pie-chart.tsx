'use client'

import { TrendingUp } from 'lucide-react'
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

import { getAllUsers } from '@/api'
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'

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

	function getDisciplineChartData(users: User[]) {
		const disciplineCounts: Record<string, number> = {}

		for (const user of users) {
			const discipline = user.discipline || 'other'
			disciplineCounts[discipline] = (disciplineCounts[discipline] || 0) + 1
		}

		const colors = {
			calistenia: 'var(--color-calistenia)',
			'power-plate': 'var(--color-power-plate)',
			custom: 'var(--color-custom)',
			other: 'var(--color-other)',
		}

		const chartData = Object.entries(disciplineCounts).map(
			([discipline, count]) => ({
				discipline,
				users: count,
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
	}, [])

	return (
		<Card className="flex flex-col h-full" id="onborda-step6">
			<CardHeader className="items-center pb-0">
				<CardTitle>Usuarios - Disciplinas</CardTitle>
				<CardDescription>Enero - Agosto 2024</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
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
