'use client'
import { Button } from '@/components/ui/button'
import { BoxIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense, useState } from 'react'
import Loading from './loading'
import { CategoriesTable } from '@/components/categories-table'

export default function InventaryPage() {
  const [activeTab, setActiveTab] = useState('products')

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  if (!session) {
    return null
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className='flex h-full flex-col gap-4'>
        <h2 className='mb-5 flex items-center justify-center gap-3 text-center text-3xl font-semibold'>
          <BoxIcon width={36} height={36} />
          Inventario
        </h2>
        <main className='flex h-full flex-1 flex-col gap-4 lg:gap-6'>
          <Tabs defaultValue='products' className='w-[400px]'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger
                onClick={() => setActiveTab('categories')}
                value='categories'
              >
                Categorías
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setActiveTab('products')}
                value='products'
              >
                Productos
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === 'categories' && <CategoriesTable />}
          {activeTab === 'products' && (
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>
                  You have no products {activeTab}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  You can start selling as soon as you add a product.
                </p>
                <Button className='mt-4'>Add Product</Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </Suspense>
  )
}

InventaryPage.requireAuth = true
