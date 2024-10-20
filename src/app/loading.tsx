import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
	return (
		<div className="w-full space-y-4 p-4">
			<Skeleton className="h-12 w-full max-w-2xl" />

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{[...Array(12)].map((_, index) => (
					<div key={index} className="space-y-2">
						<Skeleton className="h-48 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
					</div>
				))}
			</div>
		</div>
	)
}
