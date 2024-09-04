/* eslint-disable @next/next/no-img-element */
import { getCategories, getProductsByCategoryId } from '@/api'
import { StoreIcon } from 'lucide-react'
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
			<div className="flex items-center justify-center gap-3 text-center text-primary md:gap-5">
				<StoreIcon className="h-9 w-9 md:h-10 md:w-10" />
				<h2 className="text-center text-xl font-bold md:text-3xl">
					Punto de venta
				</h2>
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
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-50 transition-opacity duration-300 ease-in-out group-hover:opacity-0" />
							<CardContent className="absolute inset-0 p-4 flex flex-col justify-end transition-opacity duration-300 ease-in-out group-hover:opacity-0">
								<CardTitle className="text-xl font-semibold text-white mb-2">
									{category.name} <span className='text-base ml-2 text-primary'>({category?.productsLength} productos)</span>
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
