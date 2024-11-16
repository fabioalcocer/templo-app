export const dynamic = 'force-dynamic'

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
import { Check, Loader2, PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import { CATEGORY_DEFAULT_VALUES } from '@/lib/constants'
import { createItem, getCategoryById, updateInventoryItem } from '@/services'
import { useEffect, useState } from 'react'
import { Switch } from './ui/switch'

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
import { revalidatePath } from 'next/cache'
import { Textarea } from './ui/textarea'

interface Props {
	isEditing?: boolean
	categoryId?: string
}

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
		.max(75, {
			message: 'El nombre debe tener como máximo 75 caracteres.',
		}),
	img: z
		.string({
			required_error: 'Por favor, ingresa una imagen.',
		})
		.url({
			message: 'Por favor, ingresa una URL válida.',
		}),
	available: z.boolean().default(false).optional(),
	productsLength: z.number().optional(),
})

export function CreateCategoryForm({ categoryId, isEditing }: Props) {
	const [loading, setLoading] = useState(false)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: CATEGORY_DEFAULT_VALUES,
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setLoading(true)
		isEditing
			? await updateInventoryItem({ ...data, id: categoryId }, 'categories')
			: await createItem({ data, collectionName: 'categories' })

		toast({
			title: (
				<div className="flex w-full items-center gap-2">
					La categoría se agregó exitosamente
					<Check />
				</div>
			),
			description: 'Puedes ver la nueva categoría en tu inventario',
		})

		form.reset(CATEGORY_DEFAULT_VALUES)
		setLoading(false)
	}

	useEffect(() => {
		if (!categoryId) return
		const fetchCategory = async () => {
			try {
				const category = await getCategoryById(categoryId)
				form.reset(category as Category)
			} catch (err) {
				console.error(err)
			}
		}

		fetchCategory()
	}, [form, categoryId])

	return (
		<Sheet>
			{isEditing ? (
				<SheetTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-secondary focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
					Editar categoría
				</SheetTrigger>
			) : (
				<SheetTrigger asChild>
					<Button variant="default" id="onborda-step5">
						<PlusIcon className="mr-2 h-5 w-5" />
						Agregar categoría
					</Button>
				</SheetTrigger>
			)}
			<SheetContent className="">
				<SheetHeader>
					<SheetTitle className="text-xl">
						{isEditing ? 'Editar' : 'Agregar'} categoría
					</SheetTitle>
					<SheetDescription>
						Crea una nueva categoría para registrarla en tu inventario.
					</SheetDescription>
				</SheetHeader>
				<div className="mt-5">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-3"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre de la categoría</FormLabel>
										<FormControl>
											<Input placeholder="Ej: Bebidas" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Descripción de la categoría</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Ej: Bebidas energizantes y refrescos para adultos"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="img"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Portada de la categoría</FormLabel>
										<FormControl>
											<Input
												placeholder="Ej: https://templo.bo/14959-01.jpg"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="available"
								render={({ field }) => (
									<FormItem className="mt-1 flex items-center gap-4 space-y-0">
										<FormLabel>Disponible</FormLabel>
										<FormControl className="space-y-0">
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="productsLength"
								render={({ field }) => (
									<FormItem className="mt-2">
										<FormLabel>Cantidad de productos</FormLabel>
										<FormControl>
											<Input
												placeholder="4"
												{...field}
												type="number"
												defaultValue="0"
												onChange={(event) => {
													const value = Number.parseInt(event.target.value)
													field.onChange(value <= 0 ? 0 : value)
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<SheetFooter className="mt-5 gap-2">
								<SheetClose asChild>
									<Button type="button" variant="secondary">
										Cancelar
									</Button>
								</SheetClose>
								<Button disabled={loading} type="submit">
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									{isEditing ? 'Editar' : 'Agregar'} categoría
								</Button>
							</SheetFooter>
						</form>
					</Form>
				</div>
			</SheetContent>
		</Sheet>
	)
}
