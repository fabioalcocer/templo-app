'use client'
import { revalidateInventory } from '@/app/actions'
import QR from '@/assets/qr.jpg'
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { registerProductSale, updateInventoryItem } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { DrawerClose, DrawerFooter } from './ui/drawer'

const FormSchema = z.object({
	paymentType: z.string({
		required_error: 'Por favor, selecciona un método de pago.',
	}),
})

function RegisterProductForm({ product }: { product: Product }) {
	const [loading, setLoading] = useState(false)
	const [quantity, setQuantity] = useState(1)

	const total = product?.price * quantity

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setLoading(true)

		const productData = {
			productId: product?.id,
			name: product?.name,
			categoryId: product?.categoryId,
			quantity,
			total,
			createdAt: Date.now(),
			...data,
		}

		const productWithTotalSales = {
			totalSales: product?.totalSales
				? product?.totalSales + quantity
				: quantity,
		}

		await registerProductSale({ productData })
		await updateInventoryItem(
			{ ...productWithTotalSales, id: product?.id },
			'products',
		)

		toast({
			title: (
				<div className="flex w-full items-center gap-2">
					La venta se registró exitosamente
					<Check />
				</div>
			),
		})
		setLoading(false)
		revalidateInventory()
	}

	function onClick(adjustment: number) {
		setQuantity(quantity + adjustment)
	}

	return (
		<div className="w-full p-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Dialog>
						<FormField
							control={form.control}
							name="paymentType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Método de pago:</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value)
											if (value === 'qr') {
												document.getElementById('qr-dialog-trigger')?.click()
											}
										}}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecciona un método de pago" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="qr">QR</SelectItem>
											<SelectItem value="cash">Efectivo</SelectItem>
											<SelectItem value="card">Tarjeta de débito</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogTrigger asChild>
							<Button id="qr-dialog-trigger" className="hidden">
								Open QR Dialog
							</Button>
						</DialogTrigger>
						<DialogContent className="pt-5 grid place-items-center max-w-max gap-5">
							<DialogHeader className="flex flex-col items-center">
								<DialogTitle className="text-center max-w-[80%] leading-5">
									Escanea el código QR para realizar el pago
								</DialogTitle>
							</DialogHeader>
							<Image src={QR} width={200} height={200} alt="qr" />
							<DialogFooter>
								<DialogClose asChild>
									<Button
										onClick={() =>
											toast({
												title: (
													<div className="flex w-full items-center gap-2">
														Se ha confirmado el pago por QR
														<Check />
													</div>
												),
											})
										}
									>
										Confirmar pago
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					<div className="p-4 pb-0">
						<div className="flex items-center justify-center space-x-2">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 shrink-0 rounded-full"
								type="button"
								onClick={() => onClick(-1)}
								disabled={quantity <= 1}
							>
								<Minus className="h-4 w-4" />
								<span className="sr-only">Decrease</span>
							</Button>
							<div className="flex-1 text-center">
								<div className="text-7xl font-bold tracking-tighter">
									{quantity}
								</div>
								<div className="mt-1 text-[0.90rem] uppercase text-muted-foreground">
									{product?.name}
								</div>
							</div>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 shrink-0 rounded-full"
								type="button"
								onClick={() => onClick(1)}
								disabled={quantity >= product.stock}
							>
								<Plus className="h-4 w-4" />
								<span className="sr-only">Increase</span>
							</Button>
						</div>
					</div>

					<DrawerFooter>
						<Button disabled={loading} type="submit">
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Registrar
						</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancelar</Button>
						</DrawerClose>
					</DrawerFooter>
				</form>
			</Form>
		</div>
	)
}

export default RegisterProductForm
