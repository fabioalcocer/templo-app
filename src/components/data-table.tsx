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
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAllProducts } from '@/api'
import {
  calculateTotalFromPurchases,
  getCategoryNameById,
  parsedPriceFromNumber,
} from '@/lib/utils'
import { DataTablePagination } from './table-pagination'
import { RegisterPurchaseProductForm } from './add-product-form'

export const columns: ColumnDef<Product>[] = [
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
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant='ghost'
  //         className='p-0'
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Id
  //         <ArrowUpDown className='ml-2 h-4 w-4' />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div className='capitalize'>{row.getValue('id')}</div>,
  // },
  {
    accessorKey: 'img',
    header: () => {
      return (
        <div className='ml-4'>
          <ImageIcon />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className=''>
        <img
          className='h-14 w-14 rounded-md'
          src={row.getValue('img')}
          onError={(e: any) =>
            (e.currentTarget.src =
              'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png')
          }
          alt='imagen del producto'
        />
      </div>
    ),
  },
  {
    accessorKey: 'name',
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
    cell: ({ row }) => <div className=''>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'categoryId',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Categoría
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className=''>{getCategoryNameById(row.getValue('categoryId'))}</div>
    ),
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
    cell: ({ row }) => <div className=''>{row.getValue('stock')}</div>,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          asChild
          variant='ghost'
          className='ml-auto w-full justify-end p-0 text-right'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <div className='text-right'>
            Precio
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </div>
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'))
      const formatted = parsedPriceFromNumber(amount)
      return <div className='text-right font-medium'>{formatted}</div>
    },
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
      const formatted = parsedPriceFromNumber(amount || 0)
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
            <DropdownMenuItem>Editar producto</DropdownMenuItem>
            <DropdownMenuItem>Aumentar stock</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataProductsTable() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: products,
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

  const fetchProducts = async () => {
    const products = await getAllProducts()
    return setProducts(products)
  }

  React.useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder='Buscar producto...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <div className='flex items-center gap-4'>
          <RegisterPurchaseProductForm />
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
                {calculateTotalFromPurchases(products)}
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
