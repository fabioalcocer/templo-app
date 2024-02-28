'use client'
import { registerSaleProduct } from '@/api'
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
import { Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { DrawerClose, DrawerFooter } from './ui/drawer'

const FormSchema = z.object({
  paymentType: z.string({
    required_error: 'Por favor, selecciona un método de pago.',
  }),
})

function RegisterProductForm({
  quantity,
  productId,
  name,
  total,
}: {
  quantity: number
  productId: string
  name: string
  total: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const productData = {
      productId,
      name,
      quantity,
      total,
      ...data,
    }

    await registerSaleProduct({ productData })
    setLoading(false)

    toast({
      title: (
        <div className='flex w-full items-center gap-2'>
          La venta se registró exitosamente
          <Check />
        </div>
      ),
      description: 'Puedes ver el registro en tu inventario',
      action: (
        <ToastAction
          onClick={() => router.push('/admin')}
          altText='Go to admin dashboard'
        >
          Ver
        </ToastAction>
      ),
    })
  }

  return (
    <div className='w-full p-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                {/* <FormDescription>
                Selecciona un método de pago.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
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
