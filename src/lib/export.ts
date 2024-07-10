import { type Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Timestamp } from 'firebase/firestore'

export function exportTableToCSV<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | 'select' | 'actions')[]

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean
  } = {},
): void {
  const { filename = 'table', excludeColumns = [], onlySelected = false } = opts

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as never))

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header)

          if (Object.keys((cellValue as never) || {})?.includes('seconds')) {
            return parsedTimestampFromDate(cellValue as Date)
          }

          // Handle dates with a custom format
          if (header === 'createdAt' && typeof cellValue === 'number') {
            const fixDateValue = format(cellValue as number, 'PPP', {
              locale: es,
            })

            return fixDateValue
          }

          // Handle values that might contain commas or newlines
          return typeof cellValue === 'string'
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue
        })
        .join(','),
    ),
  ].join('\n')

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function parsedTimestampFromDate(date: Date) {
  const parsedDate = (date as unknown as Timestamp)?.toDate()

  return format(parsedDate, 'PPP', {
    locale: es,
  })
}
