'use client'
import { PurchasesTable } from '@/components/purchases-data-table'
import { UserCogIcon } from 'lucide-react'
import { Suspense } from 'react'
import Loading from './loading'

export default function ProductsPage() {
	return (
		<Suspense fallback={<Loading />}>
			<div className="flex flex-col gap-4">
				<h2 className="md:mb-5 flex items-center justify-center gap-3 text-center text-2xl font-semibold md:text-3xl">
					<UserCogIcon width={36} height={36} />
					Registro de compras
				</h2>

				<PurchasesTable />
			</div>
		</Suspense>
	)
}
