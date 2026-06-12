import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Variant = 'blue' | 'emerald' | 'amber' | 'red' | 'gray' | 'violet' | 'rose'

const variants: Record<Variant, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
}

interface BadgeProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border', variants[variant], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    active: 'emerald', completed: 'blue', pending: 'amber', open: 'amber',
    resolved: 'emerald', escalated: 'red', closed: 'gray', cancelled: 'gray',
    assigned: 'blue', breached: 'red', upcoming: 'violet', ongoing: 'blue',
    inactive: 'gray', approved: 'emerald', rejected: 'red',
  }
  return <Badge variant={map[status.toLowerCase()] ?? 'gray'}>{status}</Badge>
}
