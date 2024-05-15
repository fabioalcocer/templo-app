'use client'
import {
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, CalendarIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, getObjBySlug } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  form: UseFormReturn<
    {
      name: string
      lastName: string
      ci: string
      email: string
      phone: string
      discipline: string
      dateEntry: Date
      unitPrice: number
      discount: number
      finalPrice: number
      paymentType: string
      finalDate?: Date | undefined
      sessions?: number | undefined
      injuries?: string | undefined
      diseases?: string | undefined
      operations?: string | undefined
      allergies?: string | undefined
      impediments?: string | undefined
      age: number
      weight: number
      height: number
    },
    any,
    {
      name: string
      lastName: string
      ci: string
      email: string
      phone: string
      discipline: string
      dateEntry: Date
      unitPrice: number
      discount: number
      finalPrice: number
      paymentType: string
      finalDate?: Date | undefined
      sessions?: number | undefined
      injuries?: string | undefined
      diseases?: string | undefined
      operations?: string | undefined
      allergies?: string | undefined
      impediments?: string | undefined
      age: number
      weight: number
      height: number
    }
  >

  disciplineOptions: {
    value: string
    label: string
  }[]
  currentDisciplineOption:
    | {
        value: string
        label: string
      }
    | undefined
  USER_TYPE: string
  setShowBasicForm: Dispatch<SetStateAction<boolean>>
}

function BasicUserForm({
  form,
  currentDisciplineOption,
  disciplineOptions,
  USER_TYPE,
  setShowBasicForm,
}: Props) {
  return (
    <>
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
              value={currentDisciplineOption?.value}
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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

      {USER_TYPE !== 'calistenia' && (
        <FormField
          control={form.control}
          name='sessions'
          render={({ field }) => (
            <FormItem className='min-w-[98px] flex-1'>
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

      <div className='my-4 flex justify-end gap-2'>
        <Button
          variant='outline'
          type='button'
          onClick={() => setShowBasicForm(false)}
        >
          Continuar
          <ArrowRight className='ml-2 h-5 w-5' />
        </Button>
      </div>
    </>
  )
}

export default BasicUserForm
