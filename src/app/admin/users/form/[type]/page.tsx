'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronLeft, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { DEFAULT_VALUES, DISCIPLINES } from '@/lib/constants'
import { getCategories, getProductById, createProduct } from '@/api'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'

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

function UsersForm({ params }: { params: { type: string } }) {
  const USER_TYPE = params.type

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

    await createProduct({ data })

    toast({
      title: (
        <div className='flex w-full items-center gap-2'>
          La compra se registró exitosamente
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
    if (!USER_TYPE) return
    const fetchProduct = async () => {
      try {
        const product = await getProductById(USER_TYPE)
        form.reset(product as never)
      } catch (err) {
        console.error(err)
      }
    }

    fetchProduct()
  }, [form, USER_TYPE])

  useEffect(() => {
    fetchCategoriesOptions()
  }, [])

  const getNameBySlug = (slug: string): string => {
    for (let key in DISCIPLINES) {
      if (DISCIPLINES[key].slug === slug) {
        return DISCIPLINES[key].name
      }
    }
    return 'Slug no encontrado'
  }

  return (
    <div>
      <div className='mx-auto mr-10 flex w-full max-w-4xl items-center gap-6'>
        <Link href='/admin/users'>
          <Button variant='outline' size='icon' className='h-9 w-9'>
            <ChevronLeft className='h-4 w-4' />
          </Button>
        </Link>
        <h3 className='text-2xl font-semibold'>{getNameBySlug(USER_TYPE)}</h3>
      </div>
      <div className='mx-auto mt-5 max-w-2xl'>
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
                        onChange={(event) =>
                          field.onChange(parseFloat(event.target.value))
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
                          field.onChange(parseFloat(event.target.value))
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

            <div className='my-4 flex justify-end gap-2'>
              <Button type='button' variant='secondary'>
                Cancelar
              </Button>

              <Button disabled={loading} type='submit'>
                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Crear usuario
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default UsersForm
