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
import { ArrowUpDown, Download, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { CALISTENIA_PLANS } from '@/lib/constants'
import { exportTableToCSV } from '@/lib/export'
import { cn, getObjBySlug, showToastForCopyText } from '@/lib/utils'
import { User } from '@/types/users.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'
import CreateUserDialog from './create-user-dialog'
import { AlertDialogConfirm } from './dialog-confirm'
import ManageUsers from './manage-users'
import { DataTablePagination } from './table-pagination'
import { Badge } from './ui/badge'

export const columns: ColumnDef<User>[] = [
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
	// {
	//   accessorKey: 'id',
	//   header: ({ column }) => {
	//     return (
	//       <Button
	//         variant='ghost'
	//         className='hidden p-0 md:flex'
	//         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
	//       >
	//         Id
	//         <ArrowUpDown className='ml-2 h-4 w-4' />
	//       </Button>
	//     )
	//   },
	//   cell: ({ row }) => (
	//     <div className='hidden capitalize md:flex'>{row.getValue('id')}</div>
	//   ),
	// },
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nombre
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <div className="">{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'lastName',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Apellidos
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <div className="">{row.getValue('lastName')}</div>,
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
			const discipline = (row.getValue('discipline') as string) ?? ''

			const planValue = row?.original?.plan
			const parsedPlanName = CALISTENIA_PLANS.find(
				(plan) => planValue === plan.value,
			)
			const planName = parsedPlanName?.label

			return (
				<div className="">
					{getObjBySlug(discipline)?.name}
					{discipline === 'gym' && <span> - {planName || planValue}</span>}
				</div>
			)
		},
	},
	{
		accessorKey: 'dateEntry',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Fecha de ingreso
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const date = row.getValue('dateEntry') as Date
			const parsedDate = (date as unknown as Timestamp)?.toDate()

			return (
				<div>
					{date
						? format(parsedDate, 'PPP', {
								locale: es,
							})
						: 'Sin fecha'}
				</div>
			)
		},
	},
	{
		accessorKey: 'finalDate',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Fecha de expiración
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const date = row.getValue('finalDate') as Date
			const parsedDate = (date as unknown as Timestamp)?.toDate()

			return (
				<div className={cn(date ? '' : 'text-muted-foreground')}>
					{date
						? format(parsedDate, 'PPP', {
								locale: es,
							})
						: 'No aplica'}
				</div>
			)
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
		accessorKey: 'active',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Estado
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const isActive = row.getValue('active') as number

			return (
				<div>
					{isActive ? (
						<Badge>Activo</Badge>
					) : (
						<Badge variant="destructive">Inactivo</Badge>
					)}
				</div>
			)
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const user = row.original

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

						<DropdownMenuItem asChild>
							<ManageUsers userId={user.id} />
						</DropdownMenuItem>
						<DropdownMenuSeparator />

						<DropdownMenuItem asChild>
							<Link href={`/admin/users/form/edit/${user.id}`}>
								Editar usuario
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => showToastForCopyText(user.id)}>
							Copiar ID
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<AlertDialogConfirm
								itemId={user.id}
								itemName="usuario"
								collectionName="users"
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export function UsersTable({ users }: { users: User[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const table = useReactTable({
		data: users,
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

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between gap-3 pb-4 pt-2">
				<Input
					placeholder="Buscar usuario..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
					className="w-full max-w-sm"
				/>

				<div className="flex items-center gap-2 sm:gap-4">
					<Button
						variant="outline"
						onClick={() =>
							exportTableToCSV(table, {
								filename: 'users',
								excludeColumns: ['select', 'actions'],
							})
						}
					>
						<Download className="sm:mr-2 h-4 w-4" />{' '}
						<span className="hidden sm:inline">Exportar</span>
					</Button>
					<CreateUserDialog />
				</div>
			</div>
			<div className="max-w-[92vw] rounded-md border">
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
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<DataTablePagination table={table} />
			</div>
		</div>
	)
}
