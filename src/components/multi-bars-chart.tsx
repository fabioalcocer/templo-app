'use client'

import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from 'recharts'

import { ChevronDown, TrendingUp } from 'lucide-react'

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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from './ui/button'
import { useState, useEffect } from 'react'

type ChartData = {
	month: string
	calistenia: number
	'power-plate': number
	custom: number
	'calistenia-mujeres': number
	'calistenia-personalizada': number
}

const chartDatax: ChartData[] = [
	{
		month: 'January',
		calistenia: 120,
		'power-plate': 95,
		custom: 140,
		'calistenia-mujeres': 85,
		'calistenia-personalizada': 110,
	},
	{
		month: 'February',
		calistenia: 130,
		'power-plate': 115,
		custom: 150,
		'calistenia-mujeres': 90,
		'calistenia-personalizada': 125,
	},
	{
		month: 'March',
		calistenia: 110,
		'power-plate': 85,
		custom: 135,
		'calistenia-mujeres': 100,
		'calistenia-personalizada': 140,
	},
	{
		month: 'April',
		calistenia: 100,
		'power-plate': 80,
		custom: 120,
		'calistenia-mujeres': 95,
		'calistenia-personalizada': 130,
	},
	{
		month: 'May',
		calistenia: 115,
		'power-plate': 105,
		custom: 145,
		'calistenia-mujeres': 105,
		'calistenia-personalizada': 120,
	},
	{
		month: 'June',
		calistenia: 125,
		'power-plate': 100,
		custom: 130,
		'calistenia-mujeres': 110,
		'calistenia-personalizada': 135,
	},
]

const disciplines = [
	'calistenia',
	'power-plate',
	'custom',
	'calistenia-mujeres',
	'calistenia-personalizada',
] as const

const chartConfig = {
	calistenia: {
		label: 'Calistenia',
		color: 'hsl(var(--chart-1))',
	},
	'power-plate': {
		label: 'Power Plate',
		color: '#e11d48',
	},
	custom: {
		label: 'Custom',
		color: '#2563eb',
	},
	'calistenia-mujeres': {
		label: 'Calistenia Mujeres',
		color: 'hsl(var(--chart-2))',
	},
	'calistenia-personalizada': {
		label: 'Calistenia Personalizada',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig

export const description =
	'A multiple bar chart showing various fitness activities'

export function MultiBarsChart() {
	const [chartData, setChartData] = useState<ChartData[]>(chartDatax)
	const [visibleDisciplines, setVisibleDisciplines] = useState<
		Record<string, boolean>
	>(
		Object.fromEntries(
			disciplines.slice(0, 3).map((discipline) => [discipline, true]),
		),
	)

	const countVisibleDisciplines = Object.values(visibleDisciplines).filter(
		(key) => key,
	).length

	const toggleDiscipline = (discipline: string) => {
		setVisibleDisciplines((prev) => ({
			...prev,
			[discipline]: !prev[discipline],
		}))
	}

	const filteredChartData = chartDatax.map((dataPoint) => {
		const filteredPoint: Partial<ChartData> = { month: dataPoint.month }

		for (const discipline of disciplines) {
			if (visibleDisciplines[discipline] && discipline in dataPoint) {
				filteredPoint[discipline] = dataPoint[discipline]
			}
		}

		return filteredPoint
	})

	useEffect(() => {
		setChartData(filteredChartData as unknown as ChartData[])
	}, [visibleDisciplines])

	return (
		<Card>
			<CardHeader>
				<CardTitle>Fitness Activities Chart</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Disciplinas a mostrar <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{disciplines.map((discipline) => (
							<DropdownMenuCheckboxItem
								key={discipline}
								className="capitalize"
								checked={visibleDisciplines[discipline]}
								onCheckedChange={() => toggleDiscipline(discipline)}
							>
								{discipline.replace(/-/g, ' ')}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => `${value}`}
						/>
						<ChartTooltip
							cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
							content={<ChartTooltipContent indicator="line" />}
						/>
						{Object.keys(chartConfig)
							.slice(0, countVisibleDisciplines)
							.map((key, index) => (
								<Bar
									key={key}
									dataKey={key}
									fill={`var(--color-${key})`}
									radius={[4, 4, 0, 0]}
								/>
							))}
						<ChartLegend content={<ChartLegendContent />} />
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					<TrendingUp className="h-4 w-4" />
					La tendencia sube un 6,2% este mes
				</div>
				<div className="leading-none text-muted-foreground">
					Mostrando el total de usuarios divido por disciplina, en los últimos 6
					meses
				</div>
			</CardFooter>
		</Card>
	)
}
