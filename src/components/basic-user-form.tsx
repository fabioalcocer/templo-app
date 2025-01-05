'use client'
import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	ArrowRight,
	CalendarIcon,
	ChevronDownIcon,
	LucideDollarSign,
	PercentIcon,
} from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	CALISTENIA_PLANS,
	PAYMENT_STATUS,
	PAYMENT_TYPES,
} from '@/lib/constants'
import { cn, validateDiscountValue } from '@/lib/utils'
import { DiscountType } from '@/types/discounts.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Dispatch, SetStateAction } from 'react'
import { FormDataType } from './create-users-form'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible'

type Props = {
	form: UseFormReturn<FormDataType>
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
	setShowBasicForm: Dispatch<SetStateAction<boolean>>
	setDiscountType: Dispatch<SetStateAction<DiscountType>>
	discountType: DiscountType
	userId: string
}

function BasicUserForm({
	form,
	currentDisciplineOption,
	disciplineOptions,
	setShowBasicForm,
	discountType,
	setDiscountType,
}: Props) {
	return (
		<>
			<div className="flex items-center gap-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="flex flex-1 flex-col">
							<FormLabel>Nombre</FormLabel>
							<FormControl>
								<Input placeholder="José Tomás" {...field} />
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
								<Input placeholder="Díaz Vega" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="flex items-center gap-4">
				<FormField
					control={form.control}
					name="ci"
					render={({ field }) => (
						<FormItem className="flex flex-1 flex-col">
							<FormLabel>Carnet de identidad</FormLabel>
							<FormControl>
								<Input placeholder="6354678" {...field} />
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
								<Input placeholder="70787673" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="email"
				render={({ field }) => (
					<FormItem className="flex flex-1 flex-col">
						<FormLabel>Correo electrónico</FormLabel>
						<FormControl>
							<Input placeholder="jose.tomas@gmail.com" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="my-1 flex flex-wrap items-center justify-between gap-4">
				{currentDisciplineOption?.value === 'gym' && (
					<FormField
						control={form.control}
						name="plan"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Plan</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Elije un plan mensual" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{CALISTENIA_PLANS?.map((option) => (
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
				)}

				<FormField
					control={form.control}
					name="discipline"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Disciplina</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={currentDisciplineOption?.value}
								disabled={Boolean(currentDisciplineOption?.value)}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona una disciplina" />
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
			</div>

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
											variant={'outline'}
											className={cn(
												'w-full min-w-max pl-3 text-left font-normal flex items-center justify-between gap-2',
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
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
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
				<FormField
					control={form.control}
					name="finalDate"
					render={({ field }) => (
						<FormItem className="flex-1 flex-col">
							<FormLabel>Fecha final</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={'outline'}
											className={cn(
												'w-full min-w-max pl-3 text-left font-normal flex items-center justify-between gap-2',
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
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date < new Date() || date < new Date('1900-01-01')
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				{currentDisciplineOption?.value !== 'gym' && (
					<FormField
						control={form.control}
						name="sessions"
						render={({ field }) => (
							<FormItem className="min-w-[98px] flex-1">
								<FormLabel>Sesiones</FormLabel>
								<FormControl>
									<Input
										placeholder="0"
										{...field}
										type="number"
										onChange={(event) =>
											field.onChange(Number.parseInt(event.target.value))
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
												discountType,
											)

											field.onChange(value)
										}}
									/>
								</FormControl>
								<Collapsible className="">
									<CollapsibleTrigger className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1">
										<ChevronDownIcon className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
										<span className="text-sm font-medium">
											{discountType === DiscountType?.Percent ? '%' : '$'}
										</span>
									</CollapsibleTrigger>
									<CollapsibleContent className="absolute right-0 top-full mt-1 w-max overflow-hidden rounded-md shadow-md">
										<div className="flex w-max flex-col rounded-lg bg-background">
											<CollapsibleTrigger>
												<div
													className="flex min-w-min cursor-pointer items-center px-4 py-2 text-sm transition-colors hover:bg-secondary dark:hover:bg-muted"
													onClick={() => setDiscountType(DiscountType?.Percent)}
												>
													<PercentIcon className="mr-2 h-4 w-4" />
													<span>Porcentaje</span>
												</div>
											</CollapsibleTrigger>
											<CollapsibleTrigger>
												<div
													className="flex min-w-min cursor-pointer items-center px-4 py-2 text-sm transition-colors hover:bg-secondary dark:hover:bg-muted"
													onClick={() => setDiscountType(DiscountType?.Amount)}
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
										field.onChange(Number.parseFloat(event.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="flex items-center justify-between gap-4 w-full">
				<FormField
					control={form.control}
					name="paymentType"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Método de pago:</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								value={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona un método de pago" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{PAYMENT_TYPES.map((option) => (
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

				<FormField
					control={form.control}
					name="paymentStatus"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Estado de pago:</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								value={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona el estado del pago" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{PAYMENT_STATUS.map((option) => (
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
			</div>

			<div className="my-4 flex justify-end gap-2">
				<Button
					variant="outline"
					type="button"
					onClick={() => setShowBasicForm(false)}
				>
					Continuar
					<ArrowRight className="ml-2 h-5 w-5" />
				</Button>
			</div>
		</>
	)
}

export default BasicUserForm
