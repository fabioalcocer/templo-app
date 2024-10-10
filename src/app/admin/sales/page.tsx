'use client'
import { SalesTable } from '@/components/sales-table'
import { DollarSign } from 'lucide-react'

export default function SalesPage() {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold">
				<DollarSign width={36} height={36} />
				Registro de ventas
			</h2>
			<SalesTable />
		</div>
	)
}
