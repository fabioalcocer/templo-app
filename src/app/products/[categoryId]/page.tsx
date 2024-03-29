import { getProductsByCategoryId } from '@/api'
import ProductsList from '@/components/products-list'
import { Suspense } from 'react'
import Loading from './loading'

export const revalidate = 3600

type Props = {
  params: {
    categoryId: string
  }
}

async function ProductsCategoryPage({ params: { categoryId } }: Props) {
  const products = await getProductsByCategoryId(categoryId)
  return (
    <Suspense fallback={<Loading />}>
      <ProductsList products={products} />
    </Suspense>
  )
}

export default ProductsCategoryPage
