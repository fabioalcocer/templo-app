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
import { zodResolver } from '@hookform/resolvers/zod'
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

import { toast } from '@/components/ui/use-toast'
import { createItem, getUserById, updateInventoryItem } from '@/services'
import { useEffect, useState } from 'react'

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { DISCIPLINES } from '@/lib/constants'
import { calculateDiscount, cn, validateDiscountValue } from '@/lib/utils'
import { DiscountType } from '@/types/discounts.types'
import { format, isAfter } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Timestamp } from 'firebase/firestore'
import ManageUserSessions from './manage-user-sessions'
import { Calendar } from './ui/calendar'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

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
	const [userExistingData, setUserExistingData] = useState<User | null>()
	const [isReinscription, setIsReinscription] = useState(false)
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
	const watchDiscipline = form.watch('discipline')
	const watchPriceValues = form.watch(['unitPrice', 'discount'])

	const checkIsFinalDateIsAfterNow = (data: z.infer<typeof FormSchema>) => {
		const today = new Date()
		const finalDate = data?.finalDate as Date
		return data?.finalDate && isAfter(finalDate, today)
	}

	const createPayment = async (userData: Payment) => {
		const paymentData = {
			userId: userId,
			unitPrice: userData?.unitPrice,
			discount: userData?.discount,
			discountType: userData?.discountType,
			finalPrice: userData?.finalPrice,
			paymentType: userData?.paymentType,
			plan: userData?.plan,
			discipline: userData?.discipline,
			sessions: userData?.sessions,
			email: userData?.email,
		}

		await createItem({ data: paymentData, collectionName: 'payments' })
	}

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setLoading(true)
		const sessions = data.sessions ? data.sessions : 0

		const isActive =
			data?.discipline === 'gym'
				? checkIsFinalDateIsAfterNow(data)
				: sessions > 0

		const userData = {
			...data,
			finalDate: data.finalDate ? data.finalDate : null,
			discountType: discountType ? discountType : 'percent',
			active: isActive,
		}

		await updateInventoryItem({ id: userId, ...userData }, 'users')
		await createPayment({
			...userData,
			userId: userId,
			email: userExistingData?.email || '',
			paymentType: userExistingData?.paymentType || '',
			plan: userExistingData?.plan || '',
		} as unknown as Payment)

		toast({
			title: (
				<div className="flex w-full items-center gap-2">
					El usuario se actualizó exitosamente
					<Check />
				</div>
			),
		})
		setLoading(false)
	}

	useEffect(() => {
		if (!userId) return
		const fetchUserById = async () => {
			try {
				const user = await getUserById(userId)
				setDiscountType(user?.discountType as DiscountType)
				setUserExistingData(user)

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
		const totalPrice = calculateDiscount(
			watchPriceValues[0],
			watchPriceValues[1],
			discountType || '',
		)

		form.setValue('finalPrice', totalPrice)
	}, [watchPriceValues, form, watchDiscipline, discountType])

	return (
		<Sheet>
			<SheetTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-primary outline-none transition-colors hover:bg-secondary focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
				Gestionar usuario
			</SheetTrigger>

			<SheetContent className="xl:max-w-lg">
				{isReinscription ? (
					<>
						<SheetHeader>
							<SheetTitle className="text-xl">Gestionar usuario</SheetTitle>
							<SheetDescription>
								Gestiona las sesiones y fechas de entrada del usuario.
							</SheetDescription>
						</SheetHeader>
						<div className="mt-5">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="flex flex-col gap-3"
								>
									<p className="mb-2 text-base font-medium">Datos personales</p>
									<div className="flex flex-col gap-4 xl:flex-row">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem className="flex flex-1 flex-col">
													<FormLabel>Nombre</FormLabel>
													<FormControl>
														<Input
															placeholder="José Tomás"
															{...field}
															disabled
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<FormItem className="flex flex-1 flex-col">
													<FormLabel>Apellidos</FormLabel>
													<FormControl>
														<Input
															placeholder="Díaz Vega"
															{...field}
															disabled
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem className="flex flex-1 flex-col">
													<FormLabel>Teléfono</FormLabel>
													<FormControl>
														<Input placeholder="70787673" {...field} disabled />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<p className="mt-2 text-base font-medium">
										Planes e inicio de mes
									</p>
									<FormField
										control={form.control}
										name="discipline"
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
															<SelectValue placeholder="Selecciona una disciplina" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{disciplineOptions?.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="my-1 flex flex-wrap items-center justify-between gap-4">
										<FormField
											control={form.control}
											name="dateEntry"
											render={({ field }) => (
												<FormItem className="flex-1 flex-col">
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
																	<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto p-0"
															align="start"
														>
															<Calendar
																mode="single"
																selected={field.value}
																onSelect={field.onChange}
																disabled={(date) =>
																	date > new Date() ||
																	date < new Date('1900-01-01')
																}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>

										{(watchDiscipline as unknown as string) === 'gym' ? (
											<FormField
												control={form.control}
												name="finalDate"
												render={({ field }) => (
													<FormItem className="flex-1">
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
																		<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent
																className="w-auto p-0"
																align="start"
															>
																<Calendar
																	mode="single"
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
												name="sessions"
												render={({ field }) => (
													<FormItem className=" min-w-[98px] flex-1">
														<FormLabel>Sesiones</FormLabel>
														<FormControl>
															<Input
																placeholder="0"
																{...field}
																type="number"
																onChange={(event) =>
																	field.onChange(
																		Number.parseInt(event.target.value),
																	)
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
									</div>

									<div className="flex flex-wrap items-center gap-5">
										<FormField
											control={form.control}
											name="unitPrice"
											render={({ field }) => (
												<FormItem className="min-w-[98px] flex-1">
													<FormLabel>Precio unitario</FormLabel>
													<FormControl>
														<Input
															placeholder="Bs 250"
															{...field}
															type="number"
															onChange={(event) => {
																const value =
																	Number.parseFloat(event.target.value) < 0
																		? 0
																		: Number.parseFloat(event.target.value)
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
											name="discount"
											render={({ field }) => (
												<FormItem className="min-w-[98px] flex-1">
													<FormLabel>Descuento</FormLabel>
													<div className="relative flex flex-col">
														<FormControl>
															<Input
																placeholder="Bs 50"
																{...field}
																type="number"
																onChange={(event) => {
																	const value = validateDiscountValue(
																		Number.parseFloat(event.target.value),
																		discountType || '',
																	)

																	field.onChange(value)
																}}
															/>
														</FormControl>
														<Collapsible className="">
															<CollapsibleTrigger className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1">
																<ChevronDownIcon className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
																<span className="text-sm font-medium">
																	{discountType === DiscountType?.Percent
																		? '%'
																		: '$'}
																</span>
															</CollapsibleTrigger>
															<CollapsibleContent className="absolute right-0 top-full mt-1 w-max overflow-hidden rounded-md shadow-md">
																<div className="flex w-max flex-col rounded-lg bg-background">
																	<CollapsibleTrigger>
																		<div
																			className="flex min-w-min cursor-pointer items-center px-4 py-2 text-sm transition-colors hover:bg-secondary dark:hover:bg-muted"
																			onClick={() =>
																				setDiscountType(DiscountType?.Percent)
																			}
																		>
																			<PercentIcon className="mr-2 h-4 w-4" />
																			<span>Porcentaje</span>
																		</div>
																	</CollapsibleTrigger>
																	<CollapsibleTrigger>
																		<div
																			className="flex min-w-min cursor-pointer items-center px-4 py-2 text-sm transition-colors hover:bg-secondary dark:hover:bg-muted"
																			onClick={() =>
																				setDiscountType(DiscountType?.Amount)
																			}
																		>
																			<LucideDollarSign className="mr-2 h-4 w-4" />
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
											name="finalPrice"
											render={({ field }) => (
												<FormItem className="min-w-[98px] flex-1">
													<FormLabel>Precio final</FormLabel>
													<FormControl>
														<Input
															disabled
															placeholder="Bs 450"
															{...field}
															type="number"
															onChange={(event) =>
																field.onChange(
																	Number.parseFloat(event.target.value),
																)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<SheetFooter className="mt-5 gap-2">
										<Button
											type="button"
											variant="secondary"
											onClick={() => setIsReinscription(false)}
										>
											Volver
										</Button>

										<Button disabled={loading} type="submit">
											{loading && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Guardar cambios
										</Button>
									</SheetFooter>
								</form>
							</Form>
						</div>
					</>
				) : (
					<ManageUserSessions
						userId={userId}
						setIsReinscription={setIsReinscription}
					/>
				)}
			</SheetContent>
		</Sheet>
	)
}

export default ManageUsers
