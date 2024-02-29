'use client'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Minus, Plus, ShoppingCartIcon } from 'lucide-react'
import { useState } from 'react'
import RegisterProductForm from './register-product-form'

function DrawerConfirm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)

  const total = product?.price * quantity

  function onClick(adjustment: number) {
    setQuantity(quantity + adjustment)
  }

  return (
    <div className='w-full'>
      <Drawer>
        <DrawerTrigger asChild className='flex w-full'>
          <Button>
            <ShoppingCartIcon className='mr-2 h-4 w-4' /> Agregar
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='mx-auto w-full max-w-sm'>
            <DrawerHeader>
              <DrawerTitle>Registra tu compra</DrawerTitle>
              <DrawerDescription>
                Selecciona la cantidad y el método de pago.
              </DrawerDescription>
            </DrawerHeader>
            <div className='p-4 pb-0'>
              <div className='flex items-center justify-center space-x-2'>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 shrink-0 rounded-full'
                  onClick={() => onClick(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className='h-4 w-4' />
                  <span className='sr-only'>Decrease</span>
                </Button>
                <div className='flex-1 text-center'>
                  <div className='text-7xl font-bold tracking-tighter'>
                    {quantity}
                  </div>
                  <div className='text-[0.90rem] mt-1 uppercase text-muted-foreground'>
                    {product?.name}
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 shrink-0 rounded-full'
                  onClick={() => onClick(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className='h-4 w-4' />
                  <span className='sr-only'>Increase</span>
                </Button>
              </div>
            </div>

            <RegisterProductForm
              quantity={quantity}
              productId={product.id}
              name={product.name}
              total={total}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default DrawerConfirm
