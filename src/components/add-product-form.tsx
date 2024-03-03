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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Divide, PlusIcon, Loader2, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { toast } from '@/components/ui/use-toast'
import { getCategories, registerProductPurchase } from '@/api'
import { useEffect, useState } from 'react'
import { DEFAULT_VALUES } from '@/lib/constants'

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Por favor, ingresa un nombre.',
    })
    .min(3, {
      message: 'El nombre debe tener al menos 3 caracteres.',
    })
    .max(40, {
      message: 'El nombre debe tener como máximo 40 caracteres.',
    }),
  cost: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Por favor, ingresa un monto mayor a 0.',
    }),
  price: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Por favor, ingresa un monto mayor a 0.',
    }),
  categoryId: z.string({
    required_error: 'Por favor, selecciona un categoría.',
  }),
  stock: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Por favor, ingresa un monto mayor a 0.',
    }),
  img: z
    .string({
      required_error: 'Por favor, ingresa una imagen.',
    })
    .url({
      message: 'Por favor, ingresa una URL válida.',
    }),
})

export function CreateProductForm() {
  const [loading, setLoading] = useState(false)
  const [categoriesOptions, setCategoriesOptions] = useState<OptionCategory[]>(
    [],
  )
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    form.reset(DEFAULT_VALUES)
    await registerProductPurchase({ data })

    toast({
      title: (
        <div className='flex w-full items-center gap-2'>
          La compra se registró exitosamente
          <Check />
        </div>
      ),
      description: 'Puedes ver el registro de la compra en tu inventario',
    })
    setLoading(false)
  }

  const fetchProducts = async () => {
    const categories = await getCategories()
    const options = categories?.map((option) => ({
      value: option.id,
      label: option.name,
    }))
    return setCategoriesOptions(options)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusIcon className='mr-2 h-5 w-5' />
          Registrar compra
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Registrar producto</DialogTitle>
          <DialogDescription>
            Registra un nuevo producto para almacenarlo en tu inventario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=''>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder='Agua Vital 500ml' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-3'>
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
                        defaultValue='0'
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
                name='stock'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bs 50'
                        {...field}
                        type='number'
                        defaultValue='0'
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
                name='price'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel>Precio unitario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bs 50'
                        {...field}
                        type='number'
                        defaultValue='0'
                        onChange={(event) =>
                          field.onChange(parseInt(event.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>Categoría:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecciona una categoría' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-2'>
              <FormField
                control={form.control}
                name='img'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen del producto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://fsa.bo/productos/14959-01.jpg'
                        {...field}
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
                Registrar compra
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
