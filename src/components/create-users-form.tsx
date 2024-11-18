'use client'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { DISCIPLINES, USER_DEFAULT_VALUES } from '@/lib/constants'
import { calculateDiscount, getObjBySlug } from '@/lib/utils'
import {
	createItem,
	getProductById,
	getUserById,
	updateInventoryItem,
} from '@/services'
import { DiscountType } from '@/types/discounts.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { Check, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import BasicUserForm from './basic-user-form'
import CustomUserForm from './custom-user-form'

type Props = {
	params: any
}

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
	plan: z.string({
		required_error: 'Por favor, ingresa un plan.',
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
		.number()
		.min(0, {
			message: 'Ingresa un número mayor o igual a 0',
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
			message: 'Ingresa un número mayor o igual a 0',
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
	physicalCondition: z.string().optional(),
})

function CreateUsersForm({ params }: Props) {
	const USER_TYPE = params?.type
	const userId = params?.id

	const [userData, setUserData] = useState<User | null>(null)
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

	const createUserAndPayment = async (userData: User) => {
		const userId = await createItem({ data: userData, collectionName: 'users' })

		const paymentData = {
			userId: userId,
			unitPrice: userData?.unitPrice,
			discount: userData?.discount,
			discountType: userData?.discountType,
			finalPrice: userData?.finalPrice,
			paymentType: userData?.paymentType,
			plan: userData?.plan,
			discipline: userData?.discipline,
		}

		await createItem({ data: paymentData, collectionName: 'payments' })
	}

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setLoading(true)
		const userData = {
			...data,
			active: true,
			finalDate: data.finalDate ? data.finalDate : null,
			discountType,
		}

		for (const key of Object.keys(userData)) {
			if (userData[key as never] === undefined) delete userData[key as never]
		}

		userId
			? await updateInventoryItem({ id: userId, ...userData }, 'users')
			: await createUserAndPayment(userData as User)

		form.reset(USER_DEFAULT_VALUES)
		setLoading(false)
		toast({
			title: (
				<div className="flex w-full items-center gap-2">
					{userId
						? 'El usuario se actualizó exitosamente'
						: 'El usuario se creó exitosamente'}
					<Check />
				</div>
			),
		})

		router.push('/admin/users')
	}

	const disciplineOptions = Object.keys(DISCIPLINES).map((key) => ({
		value: DISCIPLINES[key]?.slug,
		label: DISCIPLINES[key].name,
	}))

	const currentDisciplineOption = disciplineOptions.find(
		(option) => option.value === (USER_TYPE || userData?.discipline),
	)

	const onError = (errors: z.infer<typeof FormSchema>) => {
		console.log(errors)
		setShowBasicForm(true)
	}

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

		if (
			!userId &&
			watchStartDate &&
			currentDisciplineOption?.value === 'calistenia'
		) {
			form.setValue('finalDate', addDays(watchStartDate, 30))
		}

		if (userId) {
			const finalDate = userData?.finalDate
				? (userData?.finalDate as unknown as Timestamp)?.toDate()
				: undefined

			form.setValue('finalDate', finalDate)
		}
	}, [form, watchStartDate, currentDisciplineOption])

	useEffect(() => {
		if (!userId) return
		const fetchUserById = async () => {
			try {
				const user = await getUserById(userId)
				setUserData(user as User)

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

		fetchUserById()
	}, [form, userId])

	useEffect(() => {
		setDiscountType(userData?.discountType as DiscountType)
	}, [userData])

	return (
		<div>
			<div className="mx-auto mr-32 flex w-full max-w-3xl items-center gap-6">
				<Link href="/admin/users">
					<Button variant="outline" size="icon" className="h-9 w-9">
						<ChevronLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h3 className="text-2xl font-semibold">
					{USER_TYPE === 'calistenia'
						? 'Planes mensuales'
						: getObjBySlug(USER_TYPE)?.name}
				</h3>
			</div>
			<div className="mx-auto mt-5 max-w-xl">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, onError as never)}
						className="flex flex-col gap-4"
					>
						{showBasicForm ? (
							<BasicUserForm
								form={form}
								disciplineOptions={disciplineOptions}
								currentDisciplineOption={currentDisciplineOption}
								setShowBasicForm={setShowBasicForm}
								setDiscountType={setDiscountType}
								discountType={discountType}
								userId={userId}
							/>
						) : (
							<CustomUserForm
								form={form}
								loading={loading}
								setShowBasicForm={setShowBasicForm}
								userId={userId}
							/>
						)}
					</form>
				</Form>
			</div>
		</div>
	)
}

export default CreateUsersForm
