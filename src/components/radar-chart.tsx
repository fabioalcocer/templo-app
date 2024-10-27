'use client'

import { getAllUsers } from '@/services'
import { TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'

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

const chartConfig = {
	active: {
		label: 'Activos',
		color: 'hsl(var(--chart-1))',
	},
	inactive: {
		label: 'Inactivos',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig

type ChartData = {
	month: string
	active: number
	inactive: number
}

export function MultipleRadarChart() {
	const [chartData, setChartData] = useState<ChartData[]>([])

	const fetchData = async () => {
		const users = await getAllUsers()
		const activeUsers = users.filter((user) => user.active)
		const inactiveUsers = users.filter((user) => !user.active)

		const generateRadarChartData = () => {
			const months = ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago']

			return months.map((month, i) => {
				const active = activeUsers.length + i
				const inactive = inactiveUsers.length

				return {
					month,
					active,
					inactive,
				}
			})
		}

		const chartDataLoaded = generateRadarChartData()
		setChartData(chartDataLoaded)
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="items-center pb-4">
				<CardTitle>Usuarios - Actividad</CardTitle>
				<CardDescription>
					Actividad de los usuarios (últimos 6 meses)
				</CardDescription>
			</CardHeader>
			<CardContent className="pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<RadarChart data={chartData}>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<PolarAngleAxis dataKey="month" />
						<PolarGrid />
						<Radar
							dataKey="active"
							fill="var(--color-active)"
							fillOpacity={0.6}
						/>
						<Radar dataKey="inactive" fill="var(--color-inactive)" />
					</RadarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm mt-auto">
				<div className="flex items-center gap-2 font-medium leading-none">
					La tendencia sube un 45% este mes <TrendingUp className="h-4 w-4" />
				</div>
				<div className="flex items-center gap-2 leading-none text-muted-foreground">
					Marzo - Agosto 2024
				</div>
			</CardFooter>
		</Card>
	)
}
