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
  ImageIcon,
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
import { getAllPurchases } from '@/api'
import { calculateTotalFromPurchases, parsedPriceFromNumber } from '@/lib/utils'
import { DataTablePagination } from './table-pagination'
import { AddProductForm } from './add-product-form'
import { AlertDialogConfirm } from './dialog-confirm'
import { DatePickerWithRange } from './date-range-picker'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Timestamp } from 'firebase/firestore'
import { Badge } from './ui/badge'

export const columns: ColumnDef<Purchase>[] = [
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
    accessorKey: 'productName',
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
    cell: ({ row }) => <div className=''>{row.getValue('productName')}</div>,
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
    accessorKey: 'reStock',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Re-stock
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const reStock = row.getValue('reStock')
      return (
        <div>
          {reStock ? (
            <Badge>Re-stock</Badge>
          ) : (
            <Badge variant='outline'>No</Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'stock',
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
    cell: ({ row }) => <div>{row.getValue('stock')}</div>,
  },
  {
    accessorKey: 'cost',
    header: ({ column }) => {
      return (
        <Button
          asChild
          variant='ghost'
          className='ml-auto w-full justify-end p-0 text-right'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <div className='text-right'>
            Costo
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </div>
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('cost'))
      const formatted = parsedPriceFromNumber(amount)
      return <div className='text-right font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: 'total',
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
      const stock = parseFloat(row.getValue('stock'))
      const amount = parseFloat(row.getValue('cost'))
      const formatted = parsedPriceFromNumber(stock * amount)
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
            <DropdownMenuItem>Aumentar stock</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AddProductForm productId={product.id} isEditing={true} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AlertDialogConfirm itemId={product.id} itemName='producto' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function PurchasesTable() {
  const [purchases, setPurchases] = React.useState<Purchase[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: purchases,
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
      const purchases = await getAllPurchases()
      return setPurchases(purchases)
    }

    fetchPurchases()
  }, [])

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between py-4'>
        <DatePickerWithRange numberOfMonths={1} />
        <div className='flex items-center gap-4'>
          <AddProductForm />
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
      <div className='rounded-md border'>
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
                {calculateTotalFromPurchases(purchases)}
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
