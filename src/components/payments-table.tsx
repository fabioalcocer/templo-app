/* eslint-disable @next/next/no-img-element */
'use client'

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import {
	ArrowUpDown,
	ChevronDown,
	Download,
	MoreHorizontal,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	CALISTENIA_PLANS,
	DAY_IN_MILLISECONDS,
	PAYMENT_STATUS,
} from '@/lib/constants'
import { exportTableToCSV } from '@/lib/export'
import {
	calculateTotalFromPayments,
	cn,
	getObjBySlug,
	parsedPriceFromNumber,
	showToastForCopyText,
} from '@/lib/utils'
import { getAllPayments } from '@/services'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from './date-range-picker'
import { DataTablePagination } from './table-pagination'
import { Input } from './ui/input'

const parsePaymentType = (paymentType: string) => {
	type Payments = keyof typeof paymentTypes
	const paymentTypes = {
		qr: 'QR',
		cash: 'Efectivo',
		card: 'Tarjeta de débito',
	} as const

	return paymentTypes[paymentType as Payments] ?? ''
}

const parsePaymentStatus = (status: string): string => {
	const findObj = PAYMENT_STATUS.find((obj) => obj.value === status)
	return findObj?.label ?? ''
}

export const columns: ColumnDef<Payment>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value: any) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value: any) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'email',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Correo electrónico
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			return (
				<div className="max-w-[160px] truncate">{row.getValue('email')}</div>
			)
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Fecha
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as Date
			return (
				<div>
					{date
						? format(date, 'PP', {
								locale: es,
							})
						: 'Sin fecha'}
				</div>
			)
		},
	},
	{
		accessorKey: 'discipline',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Disciplina
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			return (
				<div className="">{getObjBySlug(row.getValue('discipline'))?.name}</div>
			)
		},
	},
	{
		accessorKey: 'plan',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Plan
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const planValue = row.getValue('plan') as string
			const parsedPlanName = CALISTENIA_PLANS.find(
				(plan) => planValue === plan.value,
			)
			const planName = parsedPlanName?.label

			return <div>{planName || planValue}</div>
		},
	},
	{
		accessorKey: 'sessions',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Sesiones
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const discipline = row.getValue('discipline')

			return (
				<div
					className={cn(discipline !== 'gym' ? '' : 'text-muted-foreground')}
				>
					{discipline !== 'gym' ? row.getValue('sessions') : 'No aplica'}
				</div>
			)
		},
	},
	{
		accessorKey: 'paymentType',
		header: ({ column }) => {
			return (
				<Button
					asChild
					variant="ghost"
					className="ml-auto w-full justify-start p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					<div className="text-left">
						Método
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</div>
				</Button>
			)
		},
		cell: ({ row }) => {
			return (
				<div className="font-medium">
					{parsePaymentType(row.getValue('paymentType'))}
				</div>
			)
		},
	},
	{
		accessorKey: 'paymentStatus',
		header: ({ column }) => {
			return (
				<Button
					asChild
					variant="ghost"
					className="ml-auto w-full justify-start p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					<div className="text-left">
						Estado
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</div>
				</Button>
			)
		},
		cell: ({ row }) => {
			const status = row.getValue('paymentStatus') as string
			return <div className="font-medium">{parsePaymentStatus(status)}</div>
		},
	},
	{
		accessorKey: 'finalPrice',
		header: ({ column }) => {
			return (
				<Button
					asChild
					variant="ghost"
					className="ml-auto w-full justify-end p-0 text-right"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					<div className="text-right">
						Total
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</div>
				</Button>
			)
		},
		cell: ({ row }) => {
			const finalPrice = Number.parseFloat(row.getValue('finalPrice'))
			const formatted = parsedPriceFromNumber(finalPrice)
			return <div className="text-right font-medium">{formatted}</div>
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Acciones</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => showToastForCopyText(payment.id)}>
							Copiar ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export function PaymentsTable() {
	const [payments, setPayments] = React.useState<Payment[]>([])
	const [initialPayments, setInitialPayments] = React.useState<Payment[]>([])
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const [date, setDate] = React.useState<DateRange | undefined>({
		from: new Date(2024, 0, 1),
		to: addDays(new Date(), 1),
	})

	const table = useReactTable({
		data: payments,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	React.useEffect(() => {
		const fetchPurchases = async () => {
			const payments = await getAllPayments()
			setPayments(payments)
			setInitialPayments(payments)
			return
		}

		fetchPurchases()
	}, [])

	React.useEffect(() => {
		setPayments(initialPayments)

		const filteredPurchases = initialPayments.filter(
			(purchase) =>
				purchase.createdAt >= (date?.from || new Date(2024, 0, 1)).getTime() &&
				purchase.createdAt <=
					(date?.to || addDays(new Date(), 1)).getTime() + DAY_IN_MILLISECONDS,
		)

		setPayments(filteredPurchases)
	}, [date, initialPayments])

	return (
		<div className="w-full">
			<div className="flex flex-wrap items-center justify-between gap-5 py-4 md:gap-0">
				<DatePickerWithRange numberOfMonths={1} setDate={setDate} date={date} />

				<Input
					placeholder="Buscar inscripción por correo..."
					value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('email')?.setFilterValue(event.target.value)
					}
					className="w-full max-w-sm"
				/>

				<div className="flex items-center gap-4">
					<Button
						onClick={() =>
							exportTableToCSV(table, {
								filename: 'payments',
								excludeColumns: ['select', 'actions'],
							})
						}
						id="onborda-step7"
					>
						<Download className="mr-2 h-4 w-4" /> Exportar
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columnas <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="w-full max-w-[92vw] rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No hay resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
					<TableFooter className="bg-inherit">
						<TableRow>
							<TableCell colSpan={5}></TableCell>
							<TableCell className="text-right font-semibold">Total</TableCell>
							<TableCell className="text-right font-semibold">
								{calculateTotalFromPayments(payments)}
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<DataTablePagination table={table} />
			</div>
		</div>
	)
}
