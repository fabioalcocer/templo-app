import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  CalendarIcon,
  Check,
  ChevronDownIcon,
  Loader2,
  LucideDollarSign,
  PercentIcon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from '@/components/ui/use-toast'
import { getUserById, updateInventoryItem } from '@/api'
import { useEffect, useState } from 'react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { DISCIPLINES } from '@/lib/constants'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { calculateDiscount, cn, validateDiscountValue } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Calendar } from './ui/calendar'
import { Timestamp } from 'firebase/firestore'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { DiscountType } from '@/types/discounts.types'

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Por favor, ingresa un nombre.',
    })
    .min(3, {
      message: 'Debe contener al menos 3 caracteres.',
    })
    .max(30, {
      message: 'Debe contener como máximo 30 caracteres.',
    }),
  lastName: z
    .string({
      required_error: 'Por favor, ingresa los apellidos.',
    })
    .min(3, {
      message: 'Debe contener al menos 3 caracteres.',
    })
    .max(30, {
      message: 'Debe contener como máximo 30 caracteres.',
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
      message: 'Ingresa un número mayor a 0',
    }),
  discount: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Ingresa un número mayor a 0',
    }),
  finalPrice: z
    .number({
      required_error: 'Por favor, ingresa un monto.',
    })
    .min(1, {
      message: 'Ingresa un número mayor a 0',
    }),
  finalDate: z.date().optional(),
  discountType: z.string().optional(),
  sessions: z
    .number()
    .min(0, {
      message: 'Ingresa unnúmero mayor o igual a 0',
    })
    .optional(),
})

function ManageUsers({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [discountType, setDiscountType] = useState<DiscountType>(
    DiscountType.Percent,
  )

  const disciplineOptions = Object.keys(DISCIPLINES).map((key) => ({
    value: DISCIPLINES[key]?.slug,
    label: DISCIPLINES[key].name,
  }))

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const fieldsToComplete = form.watch(['discipline', 'discountType'])
  const watchPriceValues = form.watch(['unitPrice', 'discount'])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const userData = {
      ...data,
      finalDate: data.finalDate ? data.finalDate : null,
      discountType: fieldsToComplete[1] ? fieldsToComplete[1] : 'percent',
    }

    await updateInventoryItem({ id: userId, ...userData }, 'users')

    toast({
      title: (
        <div className='flex w-full items-center gap-2'>
          El usuario se actualizó exitosamente
          <Check />
        </div>
      ),
    })
    setLoading(false)
  }

  useEffect(() => {
    if (!userId) return
    const fetchCategory = async () => {
      try {
        const user = await getUserById(userId)
        const parsedDate = (user?.dateEntry as unknown as Timestamp)?.toDate()
        const finalDate = user?.finalDate
          ? (user?.finalDate as unknown as Timestamp)?.toDate()
          : undefined

        form.reset({
          ...user,
          dateEntry: parsedDate,
          finalDate: finalDate,
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchCategory()
  }, [form, userId])

  useEffect(() => {
    const totalPrice = calculateDiscount(
      watchPriceValues[0],
      watchPriceValues[1],
      discountType || '',
    )

    form.setValue('finalPrice', totalPrice)
  }, [watchPriceValues, form, fieldsToComplete, discountType])

  return (
    <Sheet>
      <SheetTrigger className='relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-secondary focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
        Gestionar usuario
      </SheetTrigger>
      <SheetContent className='xl:max-w-lg'>
        <SheetHeader>
          <SheetTitle className='text-xl'>Gestionar usuario</SheetTitle>
          <SheetDescription>
            Gestiona las sesiones y fechas de entrada del usuario.
          </SheetDescription>
        </SheetHeader>
        <div className='mt-5'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-3'
            >
              <p className='mb-2 text-base font-medium'>Datos personales</p>
              <div className='flex flex-col gap-4 xl:flex-row'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='flex flex-1 flex-col'>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder='José Tomás' {...field} disabled />
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
                        <Input placeholder='Díaz Vega' {...field} disabled />
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
                        <Input placeholder='70787673' {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className='mt-2 text-base font-medium'>
                Planes e inicio de mes
              </p>
              <FormField
                control={form.control}
                name='discipline'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled
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
                    <FormItem className='flex-1 flex-col'>
                      <FormLabel>Fecha de ingreso</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled
                              variant={'outline'}
                              className={cn(
                                'w-full min-w-max pl-3 text-left font-normal',
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

                {(fieldsToComplete[0] as unknown as string) === 'calistenia' ? (
                  <FormField
                    control={form.control}
                    name='finalDate'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Fecha final</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full min-w-max pl-3 text-left font-normal',
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name='sessions'
                    render={({ field }) => (
                      <FormItem className=' min-w-[98px] flex-1'>
                        <FormLabel>Sesiones</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='0'
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
                          onChange={(event) => {
                            const value =
                              parseFloat(event.target.value) < 0
                                ? 0
                                : parseFloat(event.target.value)
                            field.onChange(value)
                          }}
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
                      <div className='relative flex flex-col'>
                        <FormControl>
                          <Input
                            placeholder='Bs 50'
                            {...field}
                            type='number'
                            onChange={(event) => {
                              const value = validateDiscountValue(
                                parseFloat(event.target.value),
                                discountType || '',
                              )

                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <Collapsible className=''>
                          <CollapsibleTrigger className='absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1'>
                            <ChevronDownIcon className='h-4 w-4 transition-transform duration-300 group-open:rotate-180' />
                            <span className='text-sm font-medium'>
                              {discountType === DiscountType?.Percent
                                ? '%'
                                : '$'}
                            </span>
                          </CollapsibleTrigger>
                          <CollapsibleContent className='absolute right-0 top-full mt-1 w-max overflow-hidden rounded-md shadow-md'>
                            <div className='flex w-max flex-col rounded-lg bg-background'>
                              <CollapsibleTrigger>
                                <div
                                  className='flex min-w-min cursor-pointer items-center px-4 py-2 text-sm transition-colors hover:bg-secondary dark:hover:bg-muted'
                                  onClick={() =>
                                    setDiscountType(DiscountType?.Percent)
                                  }
                                >
                                  <PercentIcon className='mr-2 h-4 w-4' />
                                  <span>Porcentaje</span>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleTrigger>
                                <div
                                  className='flex min-w-min cursor-pointer items-center px-4 py-2 text-sm transition-colors hover:bg-secondary dark:hover:bg-muted'
                                  onClick={() =>
                                    setDiscountType(DiscountType?.Amount)
                                  }
                                >
                                  <LucideDollarSign className='mr-2 h-4 w-4' />
                                  <span>Cantidad</span>
                                </div>
                              </CollapsibleTrigger>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>

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
                          disabled
                          placeholder='Bs 450'
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

              <SheetFooter className='mt-5 gap-2'>
                <SheetClose asChild>
                  <Button type='button' variant='secondary'>
                    Cancelar
                  </Button>
                </SheetClose>
                <Button disabled={loading} type='submit'>
                  {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  Guardar cambios
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ManageUsers
