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
import { ArrowLeftIcon, MehIcon } from 'lucide-react'
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
      <section className='my-7 flex flex-wrap items-center justify-center gap-10 md:my-12 md:justify-start'>
        {productSortByHighPrice?.length > 0 ? (
          <>
            {productSortByHighPrice?.map((product) => (
              <ProductCard product={product} key={product?.id} />
            ))}
          </>
        ) : (
          <div className='flex w-full md:flex-row flex-col items-center justify-center gap-5 mt-12'>
            <MehIcon className='h-10 w-10' />
            <p className='font-mono text-2xl font-semibold text-center'>
              No hay productos disponibles
            </p>
          </div>
        )}
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
        <div className='flex justify-center flex-col gap-1'>
          <CardTitle>{product?.name}</CardTitle>
          <CardTitle className='text-emerald-500 text-xl'>{formattedPrice}</CardTitle>
        </div>
        <CardDescription>{`Quedan ${product?.stock} unidades disponibles.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <img width={280} src={product?.img} alt='' className='rounded-md mx-auto' />
      </CardContent>
      <CardFooter className='flex w-full'>
        <DrawerConfirm product={product} />
      </CardFooter>
    </Card>
  )
}
