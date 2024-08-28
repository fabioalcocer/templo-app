'use client'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { ShoppingCartIcon } from 'lucide-react'
import RegisterProductForm from './register-product-form'

function DrawerConfirm({ product }: { product: Product }) {
	return (
		<div className="w-full">
			<Drawer>
				<DrawerTrigger asChild className="flex w-full">
					<Button>
						<ShoppingCartIcon className="mr-2 h-4 w-4" /> Agregar
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle>Registra tu compra</DrawerTitle>
							<DrawerDescription>
								Selecciona la cantidad y el método de pago.
							</DrawerDescription>
						</DrawerHeader>

						<RegisterProductForm product={product} />
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	)
}

export default DrawerConfirm
