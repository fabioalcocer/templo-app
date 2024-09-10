'use client'

import { TrendingUp } from 'lucide-react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from 'recharts'

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

export const description =
	'A multiple bar chart showing various fitness activities'

const chartData = [
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

export function MultiBarsChart() {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Fitness Activities Chart</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<ResponsiveContainer width="100%" height={400}>
						<BarChart accessibilityLayer data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="month"
								tickLine={false}
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
							{Object.keys(chartConfig).map((key, index) => (
								<Bar
									key={key}
									dataKey={key}
									fill={`var(--color-${key})`}
									radius={[4, 4, 0, 0]}
								/>
							))}
							<ChartLegend content={<ChartLegendContent />} />
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					<TrendingUp className="h-4 w-4" />
					Trending up by 5.2% this month
				</div>
				<div className="leading-none text-muted-foreground">
					Showing total participants for various fitness activities over the
					last 6 months
				</div>
			</CardFooter>
		</Card>
	)
}
