import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Label } from '@/components/ui/label'
import { Divide, PlusIcon } from 'lucide-react'
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
import { getCategories } from '@/api'
import { useEffect, useState } from 'react'

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
  categoryId: z.string({
    required_error: 'Por favor, selecciona un categoría.',
  }),
})

export function CreateProductForm() {
  const [categoriesOptions, setCategoriesOptions] = useState<OptionCategory[]>(
    [],
  )
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
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
          Agregar producto
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Crear producto</DialogTitle>
          <DialogDescription>
            Crea un nuevo producto para almacenarlo en tu inventario.
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
                  {/* <FormDescription>
                Selecciona un método de pago.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='mt-5'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type='submit'>Crear producto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
