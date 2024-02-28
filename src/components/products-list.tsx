/* eslint-disable @next/next/no-img-element */
import { getProducts } from '@/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DrawerConfirm from './drawer-confirm'

async function ProductsList() {
  const products = await getProducts()
  const productSortByHighPrice = products?.sort((a, b) => a.price - b.price)

  return (
    <div className='w-full'>
      <div>
        <h2 className='text-3xl font-semibold'>Productos Disponibles</h2>
        <p className=''>Elige el producto que deseas adquirir.</p>
      </div>
      <section className='my-10 flex flex-wrap items-center gap-10'>
        {productSortByHighPrice?.map((product) => (
          <ProductCard product={product} key={product?.id} />
        ))}
      </section>
    </div>
  )
}

export default ProductsList

export function ProductCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(product?.price)

  return (
    <Card className='max-w-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{product?.name}</CardTitle>
          <CardTitle>{formattedPrice}</CardTitle>
        </div>
        <CardDescription>{`Quedan ${product?.stock} unidades disponibles.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          width={300}
          height={300}
          src={product?.img}
          alt=''
          className='rounded-md'
        />
      </CardContent>
      <CardFooter>
        <DrawerConfirm product={product} />
      </CardFooter>
    </Card>
  )
}
