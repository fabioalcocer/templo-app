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
      injuries?: string | undefined
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
      injuries?: string | undefined
    }
  >
  loading: boolean
  setShowBasicForm: Dispatch<SetStateAction<boolean>>
}

function CustomUserForm({ form, loading, setShowBasicForm }: Props) {
  return (
    <div>
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
    </div>
  )
}

export default CustomUserForm
