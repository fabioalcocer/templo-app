import { getProductsByCategoryId } from '@/api'
import ProductsList from '@/components/products-list'
type Props = {
  params: {
    categoryId: string
  }
}

async function ProductsCategoryPage({ params: { categoryId } }: Props) {
  const products = await getProductsByCategoryId(categoryId)
  return <ProductsList products={products} />
}

export default ProductsCategoryPage
