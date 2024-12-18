import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

import { DISCIPLINES } from '@/lib/constants'
import { BoltIcon, DumbbellIcon, PlusCircle, WeightIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

function CreateUserDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="sm"
					className="h-10 min-w-[3rem] sm:w-auto gap-2 rounded-md py-[18px]"
				>
					<PlusCircle className="h-4 w-4" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Registrar usuario
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>¿A qué disciplina pertenecerá el usuario?</DialogTitle>
				</DialogHeader>
				<div className="mb-3 mt-6 flex flex-wrap items-center justify-center gap-6">
					<Link href={`/admin/users/form/${DISCIPLINES.CALISTENIA.slug}`}>
						<div className="group flex w-32 cursor-pointer flex-col items-center gap-4 rounded-md border border-secondary p-4 px-3 transition-colors duration-300 hover:bg-primary/90">
							<h4 className="text-sm group-hover:text-black">
								{DISCIPLINES.CALISTENIA.name}
							</h4>
							<DumbbellIcon className="h-10 w-10 font-semibold text-primary transition-colors duration-300 group-hover:text-black" />
						</div>
					</Link>
					<Link href={`/admin/users/form/${DISCIPLINES.POWER_PLATE.slug}`}>
						<div className="group flex w-32 cursor-pointer flex-col items-center gap-4 rounded-md border border-secondary p-4 px-3 transition-colors duration-300 hover:bg-[#e11d48]/80 hover:text-white">
							<h4 className="text-sm">{DISCIPLINES.POWER_PLATE.name}</h4>
							<WeightIcon className="h-10 w-10 font-semibold text-[#e11d48]  transition-colors duration-300 group-hover:text-[#fff]" />
						</div>
					</Link>
					<Link href={`/admin/users/form/${DISCIPLINES.CUSTOM.slug}`}>
						<div className="group flex w-32 cursor-pointer flex-col items-center gap-4 rounded-md border border-secondary p-4 px-3 transition-colors duration-300 hover:bg-[#2563eb]/80 hover:text-white">
							<h4 className="text-sm">{DISCIPLINES.CUSTOM.name}</h4>
							<BoltIcon className="h-10 w-10 font-semibold text-[#2563eb] transition-colors duration-300 group-hover:text-[#fff]" />
						</div>
					</Link>
				</div>

				<DialogFooter className="sm:justify-center">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Cancelar
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default CreateUserDialog
