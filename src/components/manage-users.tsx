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
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from '@/components/ui/use-toast'
import { getUserById } from '@/api'
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
})

function ManageUsers({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const disciplineOptions = Object.keys(DISCIPLINES).map((key) => ({
    value: DISCIPLINES[key]?.slug,
    label: DISCIPLINES[key].name,
  }))

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    setLoading(false)
  }

  useEffect(() => {
    if (!userId) return
    const fetchCategory = async () => {
      try {
        const user = await getUserById(userId)
        form.reset(user as User)
      } catch (err) {
        console.error(err)
      }
    }

    fetchCategory()
  }, [form, userId])

  return (
    <Sheet>
      <SheetTrigger className='relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-secondary focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
        Gestionar usuario
      </SheetTrigger>
      <SheetContent className='xl:max-w-lg'>
        <SheetHeader>
          <SheetTitle className='text-xl'>Gestionar usuario</SheetTitle>
          <SheetDescription>
            Crea una nueva categoría para registrarla en tu inventario.
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

              <p className='my-2 text-base font-medium'>
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
