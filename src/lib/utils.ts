import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatDate(d: string | Date): string {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatRelativeTime(d: string | Date): string {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getGrowthColor(pct: number): string {
  if (pct >= 15) return 'text-emerald-600'
  if (pct >= 5) return 'text-blue-600'
  if (pct >= 0) return 'text-gray-500'
  return 'text-red-500'
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
    closed: 'bg-gray-100 text-gray-600',
    escalated: 'bg-red-100 text-red-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    open: 'bg-amber-100 text-amber-700',
    breached: 'bg-red-100 text-red-700',
  }
  return map[status.toLowerCase()] ?? 'bg-gray-100 text-gray-600'
}
