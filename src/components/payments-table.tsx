/* eslint-disable @next/next/no-img-element */
'use client'

import * as React from 'react'
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
  MehIcon,
  MoreHorizontal,
} from 'lucide-react'

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
import { getAllPayments } from '@/api'
import {
  calculateTotalFromPayments,
  getObjBySlug,
  parsedPriceFromNumber,
} from '@/lib/utils'
import { DataTablePagination } from './table-pagination'
import { DatePickerWithRange } from './date-range-picker'
import { es } from 'date-fns/locale/es'
import { toast } from './ui/use-toast'
import { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { DAY_IN_MILLISECONDS } from '@/lib/constants'

const parsePaymentType = (paymentType: string) => {
  type Payments = keyof typeof paymentTypes
  const paymentTypes = {
    qr: 'QR',
    cash: 'Efectivo',
    card: 'Tarjeta de débito',
  } as const

  return paymentTypes[paymentType as Payments] ?? ''
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
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div className=''>{row.getValue('userId')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return (
        <div>
          {date
            ? format(date, 'PPP', {
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
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Disciplina
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className=''>{getObjBySlug(row.getValue('discipline'))?.name}</div>
      )
    },
  },
  {
    accessorKey: 'plan',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stock
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue('plan')}</div>,
  },
  {
    accessorKey: 'paymentType',
    header: ({ column }) => {
      return (
        <Button
          asChild
          variant='ghost'
          className='ml-auto w-full justify-start p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <div className='text-left'>
            Método de pago
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </div>
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className='font-medium'>
          {parsePaymentType(row.getValue('paymentType'))}
        </div>
      )
    },
  },
  {
    accessorKey: 'finalPrice',
    header: ({ column }) => {
      return (
        <Button
          asChild
          variant='ghost'
          className='ml-auto w-full justify-end p-0 text-right'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <div className='text-right'>
            Total
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </div>
        </Button>
      )
    },
    cell: ({ row }) => {
      const finalPrice = parseFloat(row.getValue('finalPrice'))
      const formatted = parsedPriceFromNumber(finalPrice)
      return <div className='text-right font-medium'>{formatted}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
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
    <div className='w-full'>
      <div className='flex flex-wrap items-center justify-between gap-5 py-4 md:gap-0'>
        <DatePickerWithRange numberOfMonths={1} setDate={setDate} date={date} />
        <div className='flex items-center gap-4'>
          <Button
            onClick={() =>
              toast({
                title: (
                  <div className='flex w-full items-center gap-2'>
                    Esta función aún no está disponible
                    <MehIcon />
                  </div>
                ),
              })
            }
          >
            <Download className='mr-2 h-4 w-4' /> Descargar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columnas <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
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
      <div className='w-full max-w-[92vw] rounded-md border'>
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
                  className='h-24 text-center'
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className='bg-inherit'>
            <TableRow>
              <TableCell colSpan={5}></TableCell>
              <TableCell className='text-right font-semibold'>Total</TableCell>
              <TableCell className='text-right font-semibold'>
                {calculateTotalFromPayments(payments)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
