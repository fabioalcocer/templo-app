'use client'
import { Button } from '@/components/ui/button'
import { BoxIcon, HopIcon, TagIcon } from 'lucide-react'

import { getAllProducts } from '@/api'
import { CategoriesTable } from '@/components/categories-table'
import ProductsTableInventory from '@/components/products-table-inventory'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense, useEffect, useState } from 'react'
import Loading from './loading'

export default function InventaryPage() {
	const [activeTab, setActiveTab] = useState('categories')
	const [products, setProducts] = useState<Product[]>([])

	const fetchProducts = async () => {
		const products = await getAllProducts()
		return setProducts(products)
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	return (
		<Suspense fallback={<Loading />}>
			<div className="flex h-full flex-col gap-4">
				<h2 className="mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold">
					<BoxIcon width={36} height={36} />
					Inventario
				</h2>

				<main className="flex h-full flex-1 flex-col gap-4">
					<Tabs
						defaultValue="categories"
						className="w-[400px]"
						id="onborda-step4"
					>
						<TabsList className="grid h-auto w-full grid-cols-2">
							<TabsTrigger
								onClick={() => setActiveTab('categories')}
								value="categories"
								className="py-2"
							>
								<TagIcon className="mr-2 h-5 w-5" />
								Categorías
							</TabsTrigger>
							<TabsTrigger
								onClick={() => setActiveTab('products')}
								value="products"
								className="py-2"
							>
								<HopIcon className="mr-2 h-5 w-5" />
								Productos
							</TabsTrigger>
						</TabsList>
					</Tabs>

					{/* <h1 className='dashboard text-3xl font-bold'>Ir al Dashboard</h1> */}

					{activeTab === 'categories' && <CategoriesTable />}
					{activeTab === 'products' && (
						<ProductsTableInventory products={products} />
					)}
				</main>
			</div>
		</Suspense>
	)
}
