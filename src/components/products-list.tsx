/* eslint-disable @next/next/no-img-element */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DrawerConfirm from './drawer-confirm'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

function ProductsList({ products }: { products: Product[] }) {
  const productSortByHighPrice = products?.sort((a, b) => a.price - b.price)

  return (
    <div className='w-full'>
      <div className='flex items-center gap-5 md:gap-6'>
        <Link href='/'>
          <ArrowLeftIcon className='h-8 w-8 md:h-10 md:w-10' />
        </Link>
        <div>
          <h2 className='text-xl font-semibold md:text-3xl'>
            Productos Disponibles
          </h2>
          <p className='text-sm md:text-base'>
            Elige el producto que deseas adquirir.
          </p>
        </div>
      </div>
      <section className='my-7 flex flex-wrap items-center justify-center gap-10 md:my-10 md:justify-start'>
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
          <CardTitle className='text-emerald-600'>{formattedPrice}</CardTitle>
        </div>
        <CardDescription>{`Quedan ${product?.stock} unidades disponibles.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <img width={280} src={product?.img} alt='' className='rounded-md' />
      </CardContent>
      <CardFooter className='flex w-full'>
        <DrawerConfirm product={product} />
      </CardFooter>
    </Card>
  )
}
