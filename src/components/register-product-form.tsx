'use client'
import { registerProductSale } from '@/api'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { DrawerClose, DrawerFooter } from './ui/drawer'
import Image from 'next/image'
import QR from '@/assets/qr.jpg'

const FormSchema = z.object({
  paymentType: z.string({
    required_error: 'Por favor, selecciona un método de pago.',
  }),
})

function RegisterProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const total = product?.price * quantity

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const productData = {
      productId: product?.id,
      name: product?.name,
      categoryId: product?.categoryId,
      quantity,
      total,
      createdAt: Date.now(),
      ...data,
    }

    await registerProductSale({ productData })
    setLoading(false)

    toast({
      title: (
        <div className='flex w-full items-center gap-2'>
          La venta se registró exitosamente
          <Check />
        </div>
      )
    })
  }

  function onClick(adjustment: number) {
    setQuantity(quantity + adjustment)
  }

  return (
    <div className='w-full p-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {form.watch('paymentType') === 'qr' && (
            <div className='mx-auto flex justify-center'>
              <Image src={QR} width={200} height={200} alt='qr' />
            </div>
          )}
          <FormField
            control={form.control}
            name='paymentType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de pago:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona un método de pago' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='qr'>QR</SelectItem>
                    <SelectItem value='cash'>Efectivo</SelectItem>
                    <SelectItem value='card'>Tarjeta de débito</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='p-4 pb-0'>
            <div className='flex items-center justify-center space-x-2'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 shrink-0 rounded-full'
                type='button'
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
                <div className='mt-1 text-[0.90rem] uppercase text-muted-foreground'>
                  {product?.name}
                </div>
              </div>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 shrink-0 rounded-full'
                type='button'
                onClick={() => onClick(1)}
                disabled={quantity >= product.stock}
              >
                <Plus className='h-4 w-4' />
                <span className='sr-only'>Increase</span>
              </Button>
            </div>
          </div>

          <DrawerFooter>
            <Button disabled={loading} type='submit'>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Registrar
            </Button>
            <DrawerClose asChild>
              <Button variant='outline'>Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </Form>
    </div>
  )
}

export default RegisterProductForm
