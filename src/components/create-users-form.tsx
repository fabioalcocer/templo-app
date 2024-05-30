'use client'
import { Form } from '@/components/ui/form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { USER_DEFAULT_VALUES, DISCIPLINES } from '@/lib/constants'
import { createItem, getProductById } from '@/api'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { calculateDiscount, getObjBySlug } from '@/lib/utils'
import { addDays } from 'date-fns'
import BasicUserForm from './basic-user-form'
import CustomUserForm from './custom-user-form'
import { useRouter } from 'next/navigation'
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
  ci: z
    .string({
      required_error: 'Por favor, ingresa el CI.',
    })
    .min(6, {
      message: 'Debe contener al menos 6 caracteres.',
    })
    .max(9, {
      message: 'Debe contener como máximo 9 caracteres.',
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
  paymentType: z.string({
    required_error: 'Por favor, selecciona un método de pago.',
  }),
  finalDate: z.date().optional(),
  sessions: z
    .number()
    .min(0, {
      message: 'Ingresa unnúmero mayor o igual a 0',
    })
    .optional(),
  injuries: z.string().optional(),
  diseases: z.string().optional(),
  operations: z.string().optional(),
  allergies: z.string().optional(),
  impediments: z.string().optional(),
  age: z
    .number({
      required_error: 'Por favor, ingresa la edad',
    })
    .min(1, {
      message: 'Debe ser un número mayor a 0',
    }),
  weight: z
    .number({
      required_error: 'Por favor, ingresa la edad',
    })
    .min(1, {
      message: 'Debe ser un número mayor a 0',
    }),
  height: z
    .number({
      required_error: 'Por favor, ingresa la edad',
    })
    .min(1, {
      message: 'Debe ser un número mayor a 0',
    }),
})

function CreateUsersForm({ params }: { params: { type: string } }) {
  const USER_TYPE = params.type
  const [loading, setLoading] = useState(false)
  const [showBasicForm, setShowBasicForm] = useState(true)
  const [discountType, setDiscountType] = useState<DiscountType>(
    DiscountType.Percent,
  )

  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: USER_DEFAULT_VALUES,
  })

  const watchStartDate = form.watch('dateEntry')
  const watchPriceValues = form.watch(['unitPrice', 'discount'])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const userData = {
      ...data,
      active: true,
      discountType,
    }

    await createItem({ data: userData, collectionName: 'users' })

    form.reset(USER_DEFAULT_VALUES)
    setLoading(false)
    router.push('/admin/users')
  }

  const disciplineOptions = Object.keys(DISCIPLINES).map((key) => ({
    value: DISCIPLINES[key]?.slug,
    label: DISCIPLINES[key].name,
  }))

  const currentDisciplineOption = disciplineOptions.find(
    (option) => option.value === USER_TYPE,
  )

  const onError = (errors: any) => {
    console.log(errors)
    setShowBasicForm(true)
  }

  useEffect(() => {
    if (watchStartDate && USER_TYPE === 'calistenia') {
      form.setValue('finalDate', addDays(watchStartDate, 30))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchStartDate])

  useEffect(() => {
    const totalPrice = calculateDiscount(
      watchPriceValues[0],
      watchPriceValues[1],
      discountType,
    )
    form.setValue('finalPrice', totalPrice)
  }, [watchPriceValues, discountType, form])

  useEffect(() => {
    form.setValue('discipline', currentDisciplineOption?.value as string)
  }, [form, currentDisciplineOption])

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
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className='flex flex-col gap-4'
          >
            {showBasicForm ? (
              <BasicUserForm
                form={form}
                disciplineOptions={disciplineOptions}
                currentDisciplineOption={currentDisciplineOption}
                USER_TYPE={USER_TYPE}
                setShowBasicForm={setShowBasicForm}
                setDiscountType={setDiscountType}
                discountType={discountType}
              />
            ) : (
              <CustomUserForm
                form={form}
                loading={loading}
                setShowBasicForm={setShowBasicForm}
              />
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateUsersForm
