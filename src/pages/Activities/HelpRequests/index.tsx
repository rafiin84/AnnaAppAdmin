import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle, CheckCircle2, Clock, Flame, ShieldAlert,
  Search, ChevronLeft, ChevronRight, TrendingUp,
} from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import { helpRequests, HelpRequest } from '@/data/mockData'
import { districts } from '@/data/tamilnadu'
import { cn, formatNumber, formatDate } from '@/lib/utils'

// ─── Urgency config ───────────────────────────────────────────────────────────
type Urgency = 'critical' | 'high' | 'medium' | 'low'
const urgencyConfig: Record<Urgency, { dot: string; label: string; bg: string; text: string }> = {
  critical: { dot: 'bg-red-500',   label: 'Critical', bg: 'bg-red-50',   text: 'text-red-600' },
  high:     { dot: 'bg-amber-500', label: 'High',     bg: 'bg-amber-50', text: 'text-amber-600' },
  medium:   { dot: 'bg-blue-500',  label: 'Medium',   bg: 'bg-blue-50',  text: 'text-blue-600' },
  low:      { dot: 'bg-gray-400',  label: 'Low',      bg: 'bg-gray-100', text: 'text-gray-500' },
}

const PAGE_SIZE = 15

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const typeOptions = [
  { label: 'All Types', value: '' },
  ...Array.from(new Set(helpRequests.map(h => h.type))).map(t => ({ label: t, value: t })),
]
const urgencyOptions = [
  { label: 'All Urgencies', value: '' },
  { label: 'Critical', value: 'critical' },
  { label: 'High',     value: 'high' },
  { label: 'Medium',   value: 'medium' },
  { label: 'Low',      value: 'low' },
]
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Open',      value: 'open' },
  { label: 'Assigned',  value: 'assigned' },
  { label: 'Resolved',  value: 'resolved' },
  { label: 'Escalated', value: 'escalated' },
  { label: 'Closed',    value: 'closed' },
]
const districtOptions = [
  { label: 'All Districts', value: '' },
  ...districts.map(d => ({ label: d.name, value: d.name })),
]

function SlaBar({ hoursElapsed, slaHours }: { hoursElapsed: number; slaHours: number }) {
  const pct    = Math.min(120, Math.round((hoursElapsed / slaHours) * 100))
  const capped = Math.min(100, pct)
  const color  = pct >= 100 ? 'bg-red-500' : pct >= 50 ? 'bg-amber-400' : 'bg-emerald-500'
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-0.5">
        <span className={cn('text-[10px] font-semibold', pct >= 100 ? 'text-red-600' : pct >= 50 ? 'text-amber-600' : 'text-emerald-600')}>
          {pct >= 100 ? 'BREACHED' : `${pct}%`}
        </span>
        <span className="text-[10px] text-gray-400">{hoursElapsed}h / {slaHours}h</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${capped}%` }} />
      </div>
    </div>
  )
}

export default function HelpRequests() {
  const [search,         setSearch]         = useState('')
  const [typeFilter,     setTypeFilter]     = useState('')
  const [urgencyFilter,  setUrgencyFilter]  = useState('')
  const [statusFilter,   setStatusFilter]   = useState('')
  const [page,           setPage]           = useState(1)

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const openCount      = helpRequests.filter(h => h.status === 'open').length
  const assignedCount  = helpRequests.filter(h => h.status === 'assigned').length
  const resolvedCount  = helpRequests.filter(h => h.status === 'resolved').length
  const escalatedCount = helpRequests.filter(h => h.status === 'escalated').length
  const slaBreached    = helpRequests.filter(h => h.hoursElapsed > h.slaHours).length

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return helpRequests.filter(h => {
      const q = search.toLowerCase()
      if (q && !h.title.toLowerCase().includes(q) && !h.requesterName.toLowerCase().includes(q)) return false
      if (typeFilter    && h.type    !== typeFilter)    return false
      if (urgencyFilter && h.urgency !== urgencyFilter) return false
      if (statusFilter  && h.status  !== statusFilter)  return false
      return true
    })
  }, [search, typeFilter, urgencyFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const reset = () => { setSearch(''); setTypeFilter(''); setUrgencyFilter(''); setStatusFilter(''); setPage(1) }

  // ── Table columns ────────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (row: HelpRequest) => (
        <span className="font-mono text-xs text-gray-500">{row.id}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row: HelpRequest) => (
        <Badge variant="blue" className="whitespace-nowrap text-[11px]">{row.type}</Badge>
      ),
    },
    {
      key: 'requesterName',
      header: 'Requester',
      render: (row: HelpRequest) => (
        <div>
          <p className="text-sm font-semibold text-gray-800">{row.requesterName}</p>
          <p className="text-[11px] text-gray-400">{row.district}</p>
        </div>
      ),
    },
    {
      key: 'urgency',
      header: 'Urgency',
      render: (row: HelpRequest) => {
        const cfg = urgencyConfig[row.urgency as Urgency]
        return (
          <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold', cfg.bg, cfg.text)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
            {cfg.label}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: HelpRequest) => <StatusBadge status={row.status} />,
    },
    {
      key: 'sla',
      header: 'SLA',
      className: 'w-40',
      render: (row: HelpRequest) => (
        <SlaBar hoursElapsed={row.hoursElapsed} slaHours={row.slaHours} />
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (row: HelpRequest) => row.assignedTo
        ? <span className="text-sm text-gray-700">{row.assignedTo}</span>
        : <span className="text-xs text-gray-400 italic">Unassigned</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: HelpRequest) => (
        <span className="text-xs text-gray-500">{formatDate(row.createdAt)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <motion.div
        className="grid grid-cols-2 xl:grid-cols-5 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {[
          { title: 'Open',         value: openCount,      icon: <AlertCircle size={18} />,  color: 'amber'  as const, sub: 'Awaiting action' },
          { title: 'Assigned',     value: assignedCount,  icon: <TrendingUp size={18} />,   color: 'blue'   as const, sub: 'Being handled' },
          { title: 'Resolved',     value: resolvedCount,  icon: <CheckCircle2 size={18} />, color: 'emerald'as const, sub: 'Successfully closed' },
          { title: 'Escalated',    value: escalatedCount, icon: <Flame size={18} />,        color: 'rose'   as const, sub: 'Needs escalation' },
          { title: 'SLA Breached', value: slaBreached,    icon: <ShieldAlert size={18} />,  color: 'rose'   as const, sub: 'Past deadline' },
        ].map(kpi => (
          <motion.div key={kpi.title} variants={fadeUp}>
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon={<Search size={14} />}
              placeholder="Search by title or requester…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <Select value={typeFilter}    onChange={v => { setTypeFilter(v);    setPage(1) }} options={typeOptions}    className="min-w-[180px]" />
          <Select value={urgencyFilter} onChange={v => { setUrgencyFilter(v); setPage(1) }} options={urgencyOptions} className="min-w-[140px]" />
          <Select value={statusFilter}  onChange={v => { setStatusFilter(v);  setPage(1) }} options={statusOptions}  className="min-w-[140px]" />
          {(search || typeFilter || urgencyFilter || statusFilter) && (
            <Button variant="ghost" size="sm" onClick={reset}>Clear</Button>
          )}
          <span className="ml-auto text-xs text-gray-400 font-medium">{filtered.length} results</span>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-base">Help Requests</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Page {page} of {totalPages} · Showing {paginated.length} of {filtered.length} requests
          </p>
        </div>
        <Table
          columns={columns as any}
          data={paginated as unknown as Record<string, unknown>[]}
          keyField="id"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
            <span className="text-xs text-gray-400">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost" size="sm"
                icon={<ChevronLeft size={14} />}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm font-semibold transition-all',
                      p === page ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    {p}
                  </button>
                )
              })}
              <Button
                variant="ghost" size="sm"
                icon={<ChevronRight size={14} />}
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
