/* eslint-disable @next/next/no-img-element */
import { getCategories } from '@/api'
import { StoreIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'

async function Categories() {
  const categories = await getCategories()
  return (
    <main className='flex flex-col gap-12 py-4'>
      <div className='flex items-center justify-center gap-3 text-center md:gap-6'>
        <StoreIcon className='h-10 w-10 md:h-11 md:w-11' />
        <h2 className='text-center font-mono text-xl font-bold uppercase md:text-4xl'>
          Categorías
        </h2>
      </div>

      <section className='flex flex-wrap items-center justify-center gap-10'>
        {categories?.map((category) => (
          <Link
            href={`/products/${category.id}`}
            key={category.id}
            className='flex w-max max-w-xs md:max-w-sm'
          >
            <Card className='h-auto w-full transition-all duration-200 hover:scale-105 hover:shadow-md'>
              <CardHeader>
                <div className='mb-1 flex items-center justify-between'>
                  <CardTitle className=''>
                    {`${category?.name} (${category?.productsLength} productos)`}
                  </CardTitle>
                </div>
                <CardDescription>{category?.description}</CardDescription>
              </CardHeader>
              <CardContent className='mt-auto self-end'>
                <img
                  src={category?.img}
                  alt=''
                  className='mx-auto mt-auto w-full max-w-xs self-end rounded-md'
                />
              </CardContent>
              {/* <CardFooter>
                <Button className='w-full'>Comprar productos</Button>
              </CardFooter> */}
            </Card>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default Categories
