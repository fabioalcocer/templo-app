'use client'
// import { BarsChartComponent } from '@/components/bar-chart'
import { AreaChartComponent } from '@/components/area-chart'
import { LineChartComponent } from '@/components/line-chart'
import { MultiBarsChart } from '@/components/multi-bars-chart'
import { PieChartComponent } from '@/components/pie-chart'
import { MultipleRadarChart } from '@/components/radar-chart'
import { LineChart } from 'lucide-react'

export default function SalesPage() {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold">
				<LineChart width={36} height={36} />
				Analíticas
			</h2>

			<AreaChartComponent />
			<section className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="w-full max-w-none">
					<PieChartComponent />
				</div>

				<div className="w-full max-w-none">
					<LineChartComponent />
				</div>
				<div className="w-full max-w-none">
					<MultipleRadarChart />
				</div>
			</section>
			<div className="">
				<MultiBarsChart />
			</div>
		</div>
	)
}
