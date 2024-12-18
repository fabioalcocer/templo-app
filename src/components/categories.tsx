/* eslint-disable @next/next/no-img-element */
import { getCategories, getProductsByCategoryId } from '@/services'
import { StoreIcon, ZapIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card'

async function Categories() {
	const categories = await getCategories()

	return (
		<main className="flex flex-col gap-10 py-6 px-8 w-full max-w-7xl mx-auto">
			<div className="flex flex-col items-center justify-center text-center text-card-foreground gap-2">
				<div className="flex items-center gap-2">
					<h2 className="text-center text-xl font-bold md:text-3xl">
						Punto de venta
					</h2>
					<ZapIcon className="h-8 w-8 text-primary" />
				</div>
				<p className="dark:text-zinc-200 text-card-foreground">
					Selecciona una categoría para ver los productos disponibles
				</p>
			</div>

			<section className="flex w-full flex-wrap justify-center gap-8">
				{categories?.map((category) => (
					<Link
						href={`/products/${category.id}`}
						key={category.id}
						className="flex max-w-xs md:max-w-[310px] w-full"
					>
						<Card className="relative overflow-hidden h-[320px] transition-all duration-300 ease-in-out w-full group">
							<div className="relative w-full h-full">
								<Image
									src={category.img}
									alt={category.name}
									fill
									className="transition-all duration-300 ease-in-out group-hover:scale-110 absolute object-cover"
								/>
							</div>
							<div className="absolute inset-0 bg-gradient-to-t dark:from-black/90 from-black/80 to-transparent opacity-50 transition-opacity duration-300 ease-in-out group-hover:opacity-0" />
							<CardContent className="absolute inset-0 p-4 flex flex-col justify-end transition-opacity duration-300 ease-in-out group-hover:opacity-0">
								<CardTitle className="text-xl font-semibold text-white mb-2 gap-x-2 flex items-center flex-wrap">
									{category.name}{' '}
									<span className="text-base text-primary pt-[2px]">
										({category?.productsLength} productos)
									</span>
								</CardTitle>
								<CardDescription className="text-sm text-gray-100 dark:text-gray-200">
									{category.description}
								</CardDescription>
							</CardContent>
						</Card>
					</Link>
				))}
			</section>
		</main>
	)
}

export default Categories
