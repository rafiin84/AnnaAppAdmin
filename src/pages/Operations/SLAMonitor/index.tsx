import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock, CheckCircle, TrendingUp, RefreshCw, Siren } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { helpRequests, HelpRequest } from '@/data/mockData'
import { formatRelativeTime } from '@/lib/utils'

// ─── Derived bucketing ────────────────────────────────────────────────────────
const openRequests = helpRequests.filter(
  h => h.status === 'open' || h.status === 'assigned' || h.status === 'escalated'
)
const escalatedRequests = openRequests.filter(h => h.status === 'escalated')
const safeRequests = openRequests.filter(h => (h.hoursElapsed / h.slaHours) < 0.75)
const atRiskRequests = openRequests.filter(h => {
  const p = h.hoursElapsed / h.slaHours
  return p >= 0.75 && p < 1
})
const breachedRequests = openRequests.filter(h => h.hoursElapsed >= h.slaHours)

// Sort: breached first → by urgency → by SLA %
const urgOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

const sortedForTable = [...openRequests].sort((a, b) => {
  const pctA = a.hoursElapsed / a.slaHours
  const pctB = b.hoursElapsed / b.slaHours
  if (pctB !== pctA) return pctB - pctA
  return (urgOrder[a.urgency] ?? 3) - (urgOrder[b.urgency] ?? 3)
})

// ─── Sub-components ───────────────────────────────────────────────────────────
const urgencyColors: Record<string, string> = {
  critical: 'text-red-600 bg-red-50',
  high: 'text-amber-600 bg-amber-50',
  medium: 'text-blue-600 bg-blue-50',
  low: 'text-gray-500 bg-gray-100',
}

function SLAProgressBar({ elapsed, sla }: { elapsed: number; sla: number }) {
  const pct = Math.min((elapsed / sla) * 100, 100)
  const color = pct >= 100 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-400' : 'bg-emerald-500'
  return (
    <div className="w-28">
      <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
        <span>{elapsed}h / {sla}h</span>
        <span className={pct >= 100 ? 'text-red-500 font-bold' : ''}>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function RequestCard({ req, col }: { req: HelpRequest; col: 'safe' | 'risk' | 'breached' }) {
  const borderColor =
    col === 'safe' ? 'border-emerald-200' :
    col === 'risk' ? 'border-amber-300' :
    'border-red-300'
  const headerBg =
    col === 'safe' ? 'bg-emerald-50' :
    col === 'risk' ? 'bg-amber-50' :
    'bg-red-50'

  return (
    <div className={`border ${borderColor} rounded-xl overflow-hidden`}>
      <div className={`${headerBg} px-3 py-2 flex items-center justify-between`}>
        <span className="text-xs font-bold text-gray-700 font-mono">{req.id}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyColors[req.urgency]}`}>
          {req.urgency}
        </span>
      </div>
      <div className="p-3 bg-white">
        <p className="text-sm font-semibold text-gray-800 truncate">{req.type}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{req.requesterName}</p>
        <p className="text-xs text-gray-400">{req.district}</p>
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
            <span>SLA Limit: {req.slaHours}h</span>
            <span>Elapsed: {req.hoursElapsed}h</span>
          </div>
          <SLAProgressBar elapsed={req.hoursElapsed} sla={req.slaHours} />
        </div>
        {col === 'breached' && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-semibold">
            <AlertTriangle size={11} />
            Breached by {req.hoursElapsed - req.slaHours}h
          </div>
        )}
      </div>
    </div>
  )
}

// Table column type compatibility
interface HelpRow extends HelpRequest, Record<string, unknown> {}

const tableColumns = [
  {
    key: 'id', header: 'ID',
    render: (r: HelpRow) => <span className="font-mono text-xs font-semibold text-gray-600">{r.id}</span>,
  },
  {
    key: 'type', header: 'Type',
    render: (r: HelpRow) => <span className="text-sm text-gray-800">{r.type}</span>,
  },
  {
    key: 'requesterName', header: 'Requester',
    render: (r: HelpRow) => <span className="text-sm text-gray-600">{r.requesterName}</span>,
  },
  {
    key: 'district', header: 'District',
    render: (r: HelpRow) => <span className="text-xs text-gray-500">{r.district}</span>,
  },
  {
    key: 'urgency', header: 'Urgency',
    render: (r: HelpRow) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyColors[r.urgency]}`}>
        {r.urgency}
      </span>
    ),
  },
  {
    key: 'status', header: 'Status',
    render: (r: HelpRow) => <StatusBadge status={r.status} />,
  },
  {
    key: 'slaProgress', header: 'SLA Progress',
    render: (r: HelpRow) => <SLAProgressBar elapsed={r.hoursElapsed} sla={r.slaHours} />,
  },
  {
    key: 'createdAt', header: 'Created',
    render: (r: HelpRow) => <span className="text-xs text-gray-400">{formatRelativeTime(r.createdAt)}</span>,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
}

export default function SLAMonitor() {
  const [refreshedAt] = useState(() => new Date())

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SLA Monitor</h1>
            <p className="text-sm text-gray-500 mt-0.5">Real-time help request SLA tracking</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl">
            <RefreshCw size={12} className="text-gray-400" />
            <span>
              Last updated: {refreshedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-gray-300 hidden sm:inline">· Updates every 5 minutes</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Open Requests', value: openRequests.length, sub: 'Open + Assigned + Escalated', icon: <Clock size={18} />, color: 'blue' as const },
          { title: 'Escalated', value: escalatedRequests.length, sub: 'Requires senior attention', icon: <Siren size={18} />, color: 'rose' as const },
          { title: 'SLA Breached', value: breachedRequests.length, sub: 'Elapsed > SLA hours', icon: <AlertTriangle size={18} />, color: 'amber' as const },
          { title: 'Within SLA', value: safeRequests.length, sub: '<75% of SLA limit used', icon: <CheckCircle size={18} />, color: 'emerald' as const },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Status Board — 3 columns */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {[
            {
              label: 'Within SLA',
              icon: CheckCircle,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200',
              requests: safeRequests,
              col: 'safe' as const,
            },
            {
              label: 'At Risk',
              icon: Clock,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              border: 'border-amber-200',
              requests: atRiskRequests,
              col: 'risk' as const,
            },
            {
              label: 'Breached',
              icon: AlertTriangle,
              color: 'text-red-600',
              bg: 'bg-red-50',
              border: 'border-red-200',
              requests: breachedRequests,
              col: 'breached' as const,
            },
          ].map(col => (
            <Card key={col.label} className="p-4">
              <div className={`flex items-center gap-2 mb-3 p-2.5 rounded-xl ${col.bg} border ${col.border}`}>
                <col.icon size={15} className={col.color} />
                <span className={`text-sm font-bold ${col.color}`}>{col.label}</span>
                <span className={`ml-auto text-sm font-bold ${col.color}`}>{col.requests.length}</span>
              </div>
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto">
                {col.requests.slice(0, 8).map(r => (
                  <RequestCard key={r.id} req={r} col={col.col} />
                ))}
                {col.requests.length > 8 && (
                  <p className="text-center text-xs text-gray-400 py-1">
                    +{col.requests.length - 8} more
                  </p>
                )}
                {col.requests.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">All clear</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Full Table */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">
              All Open Requests — Sorted by Urgency &amp; SLA Status
            </h2>
            <Badge variant="blue">{openRequests.length} total</Badge>
          </div>
          <Table<HelpRow>
            columns={tableColumns}
            data={sortedForTable as HelpRow[]}
            keyField="id"
          />
        </Card>
      </motion.div>
    </div>
  )
}
