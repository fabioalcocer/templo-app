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
  getCategories,
  getProductById,
  createProduct,
  updateInventoryItem,
} from '@/api'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { DEFAULT_VALUES } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { validateHeaderName } from 'http'

interface Props {
  isEditing?: boolean
  productId?: string
}

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

export function AddProductForm({ isEditing, productId }: Props) {
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

    isEditing
      ? await updateInventoryItem({ ...data, id: productId }, 'products')
      : await createProduct({ data })

    toast({
      title: (
        <div className='flex w-full items-center gap-2'>
          {isEditing
            ? 'El producto se editó exitosamente'
            : 'La compra se registró exitosamente'}
          <Check />
        </div>
      ),
      description: 'Puedes ver los datos en tu inventario',
    })

    form.reset(DEFAULT_VALUES)
    setLoading(false)
  }

  const fetchCategoriesOptions = async () => {
    const products = await getCategories()
    const options = products?.map((option) => ({
      value: option.id,
      label: option.name,
    }))
    return setCategoriesOptions(options)
  }

  useEffect(() => {
    if (!productId) return
    const fetchProduct = async () => {
      try {
        const product = await getProductById(productId)
        form.reset(product as never)
      } catch (err) {
        console.error(err)
      }
    }

    fetchProduct()
  }, [form, productId])

  useEffect(() => {
    fetchCategoriesOptions()
  }, [])

  return (
    <Sheet>
      {isEditing ? (
        <SheetTrigger className='relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-secondary focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
          Editar producto
        </SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button variant='default'>
            <PlusIcon className='mr-2 h-5 w-5' />
            Agregar producto
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className='sm:max-w-[425px]' side='right'>
        <SheetHeader>
          <SheetTitle className='text-xl'>
            {isEditing ? 'Editar' : 'Agregar'} producto
          </SheetTitle>
          <SheetDescription>
            Registra un nuevo producto para almacenarlo en tu inventario.
          </SheetDescription>
        </SheetHeader>
        <div className='mt-5'>
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
                  name='stock'
                  render={({ field }) => (
                    <FormItem className='mt-2'>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='8'
                          {...field}
                          type='number'
                          defaultValue='0'
                          disabled={isEditing}
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
                          defaultValue='0'
                          disabled={isEditing}
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
                          placeholder='Bs 53'
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

              <SheetFooter className='mt-5'>
                <SheetClose asChild>
                  <Button type='button' variant='secondary'>
                    Cancelar
                  </Button>
                </SheetClose>
                <Button disabled={loading} type='submit'>
                  {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  {isEditing ? 'Editar' : 'Registrar'} producto
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
