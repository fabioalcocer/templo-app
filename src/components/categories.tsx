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
    <main className='flex flex-col gap-10 p-8'>
      <div className='flex items-center justify-center gap-3 text-center md:gap-6'>
        <StoreIcon className='h-10 w-10 md:h-11 md:w-11' />
        <h2 className='text-center text-xl font-bold md:text-4xl'>
          Punto de venta
        </h2>
      </div>

      <section className='flex w-full flex-wrap justify-center gap-8'>
        {categories?.map((category) => (
          <Link
            href={`/products/${category.id}`}
            key={category.id}
            className='flex w-max max-w-xs md:max-w-[360px]'
          >
            <Card className='flex h-full w-full flex-col transition-all duration-200 hover:scale-105 hover:shadow-md'>
              <CardHeader className='p-5'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex'>
                    {category?.name}{' '}
                    <span className='ml-2 text-base text-primary'>{`(${category?.productsLength} productos)`}</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='my-auto max-h-[350px] p-0'>
                <img
                  src={category?.img}
                  alt=''
                  className='mx-auto mt-auto h-full w-full self-end rounded-none object-cover'
                />
              </CardContent>
              <CardFooter className='py-3'>
                <CardDescription>{category?.description}</CardDescription>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default Categories
