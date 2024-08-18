'use client'

import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

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

const chartData = [
	{ month: 'Marzo', revenues: 100 },
	{ month: 'Abril', revenues: 793 },
	{ month: 'Mayo', revenues: 568 },
	{ month: 'Junio', revenues: 215 },
	{ month: 'Julio', revenues: 1074 },
	{ month: 'Agosto', revenues: 1297 },
]

const chartConfig = {
	revenues: {
		label: 'Ingresos',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig

export function LineChartComponent() {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>Ingresos mensuales</CardTitle>
				<CardDescription>Marzo - Agosto 2024</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={chartData}
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
							dataKey="revenues"
							type="natural"
							stroke="var(--color-revenues)"
							strokeWidth={2}
							dot={{
								fill: 'var(--color-revenues)',
							}}
							activeDot={{
								r: 6,
							}}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					La tendencia sube un 89% este mes <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-5 text-muted-foreground">
					Mostrando los ingresos mensuales para los últimos 6 meses
				</div>
			</CardFooter>
		</Card>
	)
}
