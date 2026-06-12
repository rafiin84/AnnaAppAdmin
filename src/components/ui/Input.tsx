import { cn } from '@/lib/utils'
import { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
}

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={cn(
          'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white',
          icon && 'pl-9',
          className
        )}
        {...props}
      />
    </div>
  )
}

interface SelectProps {
  value: string
  onChange: (val: string) => void
  options: { label: string; value: string }[]
  className?: string
}

export function Select({ value, onChange, options, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={cn(
        'border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white transition-all',
        className
      )}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
