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
import { CalendarIcon, ChevronLeft, Loader2, MoveRightIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { USER_DEFAULT_VALUES, DISCIPLINES } from '@/lib/constants'
import { createItem, getProductById } from '@/api'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, getObjBySlug } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale/es'

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Por favor, ingresa un nombre.',
    })
    .min(3, {
      message: 'El nombre debe tener al menos 3 caracteres.',
    })
    .max(30, {
      message: 'El nombre debe tener como máximo 30 caracteres.',
    }),
  lastName: z
    .string({
      required_error: 'Por favor, ingresa los apellidos.',
    })
    .min(3, {
      message: 'El nombre debe tener al menos 3 caracteres.',
    })
    .max(30, {
      message: 'El nombre debe tener como máximo 30 caracteres.',
    }),
  ci: z
    .string({
      required_error: 'Por favor, ingresa los apellidos.',
    })
    .min(6, {
      message: 'El nombre debe tener al menos 6 caracteres.',
    })
    .max(9, {
      message: 'El nombre debe tener como máximo 9 caracteres.',
    }),
  email: z
    .string({
      required_error: 'Por favor, ingresa un correo electrónico.',
    })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: 'Por favor, ingresa un correo electrónico válido.',
    }),
  phone: z
    .string({
      required_error: 'Por favor, ingresa un número de teléfono.',
    })
    .min(7, {
      message: 'El nombre debe tener al menos 7 dígitos.',
    })
    .max(11, {
      message: 'El nombre debe tener como máximo 11 dígitos.',
    })
    .regex(/^[0-9]/, {
      message: 'El número de teléfono debe ser numérico.',
    }),
  discipline: z.string({
    required_error: 'Por favor, selecciona una disciplina.',
  }),
  dateEntry: z.date({
    required_error: 'Por favor, ingresa una fecha.',
  }),
  unitPrice: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Ingresa un monto mayor a 0.',
    }),
  discount: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Ingresa un monto mayor a 0.',
    }),
  finalPrice: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Ingresa un monto mayor a 0.',
    }),
  paymentType: z.string({
    required_error: 'Por favor, selecciona un método de pago.',
  }),
  finalDate: z.date().optional(),
})

function CreateUsersForm({ params }: { params: { type: string } }) {
  const USER_TYPE = params.type
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: USER_DEFAULT_VALUES,
  })

  const watchStartDate = form.watch('dateEntry')

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    await createItem({ data, collectionName: 'users' })

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    form.reset(USER_DEFAULT_VALUES)
    setLoading(false)
  }

  const disciplineOptions = Object.keys(DISCIPLINES).map((key) => ({
    value: key,
    label: DISCIPLINES[key].name,
  }))

  const currentDisciplineOption = disciplineOptions.find(
    (option) => option.label === getObjBySlug(USER_TYPE)?.name,
  )

  useEffect(() => {
    if (watchStartDate && USER_TYPE === 'calistenia') {
      form.setValue('finalDate', addDays(watchStartDate, 30))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchStartDate])

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
    form.setValue('discipline', getObjBySlug(USER_TYPE)?.slug as string)
  })

  return (
    <div>
      <div className='mx-auto mr-32 flex w-full max-w-3xl items-center gap-6'>
        <Link href='/admin/users'>
          <Button variant='outline' size='icon' className='h-9 w-9'>
            <ChevronLeft className='h-4 w-4' />
          </Button>
        </Link>
        <h3 className='text-2xl font-semibold'>
          {getObjBySlug(USER_TYPE)?.name}
        </h3>
      </div>
      <div className='mx-auto mt-5 max-w-xl'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <div className='flex items-center gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex flex-1 flex-col'>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='José Tomás' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='flex flex-1 flex-col'>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input placeholder='Díaz Vega' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex items-center gap-4'>
              <FormField
                control={form.control}
                name='ci'
                render={({ field }) => (
                  <FormItem className='flex flex-1 flex-col'>
                    <FormLabel>Carnet de identidad</FormLabel>
                    <FormControl>
                      <Input placeholder='6354678' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='flex flex-1 flex-col'>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder='70787673' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex flex-1 flex-col'>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder='jose.tomas@gmail.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='discipline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disciplina:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || currentDisciplineOption?.value}
                    disabled={Boolean(currentDisciplineOption?.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecciona una disciplina' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {disciplineOptions?.map((option) => (
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

            <div className='my-1 flex flex-wrap items-center justify-between gap-4'>
              <FormField
                control={form.control}
                name='dateEntry'
                render={({ field }) => (
                  <FormItem className='flex flex-1 flex-col'>
                    <FormLabel>Fecha de ingreso</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-fullpl-3 min-w-max text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', {
                                locale: es,
                              })
                            ) : (
                              <span>Elige una fecha</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {USER_TYPE === 'calistenia' && (
                <FormField
                  control={form.control}
                  name='finalDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-1 flex-col'>
                      <FormLabel>Fecha final</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled
                              variant={'outline'}
                              className={cn(
                                'w-fullpl-3 min-w-max text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', {
                                  locale: es,
                                })
                              ) : (
                                <span>Elige una fecha</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className='flex flex-wrap items-center gap-5'>
              <FormField
                control={form.control}
                name='unitPrice'
                render={({ field }) => (
                  <FormItem className='min-w-[98px] flex-1'>
                    <FormLabel>Precio unitario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bs 250'
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
                name='discount'
                render={({ field }) => (
                  <FormItem className='min-w-[98px] flex-1'>
                    <FormLabel>Descuento</FormLabel>
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
                name='finalPrice'
                render={({ field }) => (
                  <FormItem className='min-w-[98px] flex-1'>
                    <FormLabel>Precio final</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bs 450'
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

            <div className='my-4 flex justify-end gap-2'>
              <Button variant='outline'>
                Continuar
                <MoveRightIcon className='ml-2 h-5 w-5' />
              </Button>
            </div>

            {/* <div className='my-4 flex justify-end gap-2'>
              <Button type='button' variant='secondary'>
                Cancelar
              </Button>

              <Button type='submit'>
                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Crear usuario
              </Button>
            </div> */}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateUsersForm
