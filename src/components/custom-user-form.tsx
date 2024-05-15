import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
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
  loading: boolean
  setShowBasicForm: Dispatch<SetStateAction<boolean>>
}

function CustomUserForm({ form, loading, setShowBasicForm }: Props) {
  return (
    <>
      <FormField
        control={form.control}
        name='injuries'
        render={({ field }) => (
          <FormItem className='flex flex-1 flex-col'>
            <FormLabel>Lesiones</FormLabel>
            <FormControl>
              <Input placeholder='Lesiones..' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='diseases'
        render={({ field }) => (
          <FormItem className='flex flex-1 flex-col'>
            <FormLabel>Enfermedades</FormLabel>
            <FormControl>
              <Input placeholder='Enfermedades..' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='operations'
        render={({ field }) => (
          <FormItem className='flex flex-1 flex-col'>
            <FormLabel>Operaciones</FormLabel>
            <FormControl>
              <Input placeholder='Operaciones..' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='allergies'
        render={({ field }) => (
          <FormItem className='flex flex-1 flex-col'>
            <FormLabel>Alergias</FormLabel>
            <FormControl>
              <Input placeholder='Alergias..' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='impediments'
        render={({ field }) => (
          <FormItem className='flex flex-1 flex-col'>
            <FormLabel>Impedimentos</FormLabel>
            <FormControl>
              <Input placeholder='Impedimentos..' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='flex flex-wrap items-center gap-5'>
        <FormField
          control={form.control}
          name='age'
          render={({ field }) => (
            <FormItem className='min-w-[98px] flex-1'>
              <FormLabel>Edad</FormLabel>
              <FormControl>
                <Input
                  placeholder='24'
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
          name='weight'
          render={({ field }) => (
            <FormItem className='min-w-[98px] flex-1'>
              <FormLabel>Peso</FormLabel>
              <FormControl>
                <Input
                  placeholder='75 kg'
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
          name='height'
          render={({ field }) => (
            <FormItem className='min-w-[98px] flex-1'>
              <FormLabel>Altura</FormLabel>
              <FormControl>
                <Input
                  placeholder='1.80 m'
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

      <div className='my-4 flex justify-end gap-2'>
        <Button
          type='button'
          variant='secondary'
          onClick={() => setShowBasicForm(true)}
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Regresar
        </Button>

        <Button type='submit'>
          {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Crear usuario
        </Button>
      </div>
    </>
  )
}

export default CustomUserForm
