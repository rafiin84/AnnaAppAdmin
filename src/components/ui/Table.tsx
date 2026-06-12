import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  onRowClick?: (row: T) => void
  className?: string
}

export function Table<T extends Record<string, unknown>>({ columns, data, keyField, onRowClick, className }: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map(col => (
              <th key={col.key} className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr
              key={String(row[keyField])}
              onClick={() => onRowClick?.(row)}
              className={cn('border-b border-gray-50 hover:bg-gray-50 transition-colors', onRowClick && 'cursor-pointer')}
            >
              {columns.map(col => (
                <td key={col.key} className={cn('py-3.5 px-4 text-gray-700', col.className)}>
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
