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
import { Button } from '@/components/ui/button'

function ProductsList({ products }: { products: Product[] }) {
  const productSortByHighPrice = products?.sort((a, b) => a.price - b.price)

  return (
    <div className='mx-auto w-full max-w-7xl px-5 py-8'>
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
      <section className='mx-auto my-7 flex w-full flex-wrap items-center justify-center gap-10 md:my-12'>
        {productSortByHighPrice?.length > 0 ? (
          <>
            {productSortByHighPrice?.map((product) => (
              <ProductCard product={product} key={product?.id} />
            ))}
          </>
        ) : (
          <div className='mt-12 flex w-full flex-col items-center justify-center gap-5 md:flex-row'>
            <MehIcon className='h-10 w-10' />
            <p className='text-center font-mono text-2xl font-semibold'>
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
        <div className='flex flex-col justify-center gap-1'>
          <CardTitle>{product?.name}</CardTitle>
          <CardTitle className='text-xl text-primary'>
            {formattedPrice}
          </CardTitle>
        </div>
        <CardDescription>{`Quedan ${product?.stock} unidades disponibles.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          width={280}
          src={product?.img}
          alt=''
          className='mx-auto rounded-md'
        />
      </CardContent>

      {product?.stock > 0 ? (
        <CardFooter className='flex w-full'>
          <DrawerConfirm product={product} />
        </CardFooter>
      ) : (
        <CardFooter className='flex w-full'>
          <Button className='w-full pointer-events-none' variant='secondary'>
            <MehIcon className='mr-2 h-4 w-4' />
            No quedan unidades
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
