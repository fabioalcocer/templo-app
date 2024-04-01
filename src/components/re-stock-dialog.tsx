import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader2, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from '@/components/ui/use-toast'
import {
  getProductById,
  registerProductPurchase,
  updateInventoryItem,
} from '@/api'
import { useEffect, useState } from 'react'
import { DEFAULT_VALUES } from '@/lib/constants'

type Props = {
  productId: string
}

const FormSchema = z.object({
  cost: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Por favor, ingresa un monto mayor a 0.',
    }),
  stock: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Por favor, ingresa un monto mayor a 0.',
    }),
})

export function ReStockDialog({ productId }: Props) {
  const [loading, setLoading] = useState(false)
  const [existingProduct, setExistingProduct] = useState<Product | null>()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const productWithNewStock = {
      ...existingProduct,
      stock: (existingProduct?.stock || 0) + data.stock,
      cost: data.cost,
    }

    await updateInventoryItem(
      { ...productWithNewStock, id: productId },
      'products',
    )
    await registerProductPurchase({
      data: {
        ...existingProduct,
        stock: data.stock,
      },
      productId,
      reStock: true,
    })

    toast({
      title: (
        <div className='flex w-full items-center gap-2'>
          El nuevo stock registró exitosamente
          <Check />
        </div>
      ),
      description: 'Puedes visualizarlo en tu registro de compras',
    })

    form.reset(DEFAULT_VALUES)
    setLoading(false)
  }

  useEffect(() => {
    if (!productId) return
    const fetchProduct = async () => {
      try {
        const product = await getProductById(productId)
        setExistingProduct(product)
      } catch (err) {
        console.error(err)
      }
    }

    fetchProduct()
  }, [productId])

  return (
    <>
      <DialogHeader>
        <DialogTitle className='text-xl'>Aumentar stock</DialogTitle>
        <DialogDescription>
          Aumenta el stock de un producto existente y almacena la compra en tus
          registros.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=''>
          <div className='flex items-center gap-3'>
            <FormField
              control={form.control}
              name='stock'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='8'
                      {...field}
                      type='number'
                      onChange={(event) =>
                        field.onChange(parseInt(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='cost'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>Costo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Bs 50'
                      {...field}
                      type='number'
                      onChange={(event) =>
                        field.onChange(parseFloat(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className='mt-5'>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Cancelar
              </Button>
            </DialogClose>
            <Button disabled={loading} type='submit'>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Actualizar stock
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
