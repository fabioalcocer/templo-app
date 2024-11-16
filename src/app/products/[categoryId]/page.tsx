import ProductsList from '@/components/products-list'
import { getProductsByCategoryId } from '@/services'
import { getProducts } from '@/utils/supabase/queries'
import { Suspense } from 'react'
import Loading from './loading'

export const revalidate = 3600

type Props = {
	params: {
		categoryId: string
	}
}

async function ProductsCategoryPage({ params: { categoryId } }: Props) {
	const productsSupabase = await getProducts()
	console.log(productsSupabase)
	const products = await getProductsByCategoryId(categoryId)

	// const productsWithSupabaseData = [...products, ...productsSupabase]

	return (
		<Suspense fallback={<Loading />}>
			<ProductsList products={products} />
		</Suspense>
	)
}

export default ProductsCategoryPage
