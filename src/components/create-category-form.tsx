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
import { PlusIcon, Loader2, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from '@/components/ui/use-toast'
import { createCategory } from '@/api'
import { useState } from 'react'
import { CATEGORY_DEFAULT_VALUES } from '@/lib/constants'
import { Switch } from './ui/switch'

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
  description: z
    .string({
      required_error: 'Por favor, ingresa un nombre.',
    })
    .min(8, {
      message: 'La descripción debe tener al menos 8 caracteres.',
    })
    .max(48, {
      message: 'El nombre debe tener como máximo 48 caracteres.',
    }),
  img: z
    .string({
      required_error: 'Por favor, ingresa una imagen.',
    })
    .url({
      message: 'Por favor, ingresa una URL válida.',
    }),
  available: z.boolean().default(false).optional(),
})

export function CreateCategoryForm() {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: CATEGORY_DEFAULT_VALUES,
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('goood')
    setLoading(true)
    form.reset(CATEGORY_DEFAULT_VALUES)
    await createCategory({ data })

    toast({
      title: (
        <div className='flex w-full items-center gap-2'>
          La categoría se agregó exitosamente
          <Check />
        </div>
      ),
      description: 'Puedes ver la nueva categoría en tu inventario',
    })
    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default'>
          <PlusIcon className='mr-2 h-5 w-5' />
          Añadir categoría
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Agregar categoría</DialogTitle>
          <DialogDescription>
            Crea una nueva categoría para registrarla en tu inventario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-3'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la categoría</FormLabel>
                  <FormControl>
                    <Input placeholder='Energizantes' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción de la categoría</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Bebidas energizantes y refrescos para adultos'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='img'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portada de la categoría</FormLabel>
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

            <FormField
              control={form.control}
              name='available'
              render={({ field }) => (
                <FormItem className='mt-1 flex items-center gap-4 space-y-0'>
                  <FormLabel>Disponible</FormLabel>
                  <FormControl className='space-y-0'>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className='mt-5 gap-2'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Cancelar
                </Button>
              </DialogClose>
              <Button disabled={loading} type='submit'>
                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Crear categoría
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
