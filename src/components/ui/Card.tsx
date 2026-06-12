import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 8px 20px -4px rgba(0,0,0,0.10)' } : undefined}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-card',
        hover && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

interface KPICardProps {
  title: string
  value: string | number
  sub?: string
  icon: ReactNode
  trend?: number
  color?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose'
  className?: string
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-600' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', badge: 'bg-violet-600' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', badge: 'bg-amber-600' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', badge: 'bg-rose-600' },
}

export function KPICard({ title, value, sub, icon, trend, color = 'blue', className }: KPICardProps) {
  const c = colorMap[color]
  return (
    <Card hover className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1.5">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
          {trend !== undefined && (
            <div className={cn('inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full', trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', c.bg)}>
          <span className={c.icon}>{icon}</span>
        </div>
      </div>
    </Card>
  )
}
