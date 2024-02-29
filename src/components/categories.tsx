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
    <main className='flex flex-col gap-16 py-4'>
      <div className='flex items-center justify-center gap-6 text-center'>
        <StoreIcon width={50} height={50} />
        <h2 className='text-center text-3xl font-semibold '>
          Categorías disponibles
        </h2>
      </div>

      <section>
        {categories?.map((category) => (
          <Link
            href={`/products/${category.id}`}
            key={category.id}
            className='flex w-max'
          >
            <Card className='max-w-sm transition-shadow duration-200 hover:shadow-md'>
              <CardHeader>
                <div className='mb-1 flex items-center justify-between'>
                  <CardTitle className=''>
                    {`${category?.name} (${category?.productsLength} productos)`}
                  </CardTitle>
                </div>
                <CardDescription>{category?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={category?.img}
                  alt=''
                  className='mx-auto w-full max-w-xs rounded-md'
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
