import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Zap, Filter } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { approvals, ApprovalItem } from '@/data/mockData'
import { districts } from '@/data/tamilnadu'
import { formatRelativeTime, formatNumber } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────
type ApprovalStatus = 'pending' | 'approved' | 'rejected'

interface MutableApproval extends ApprovalItem {
  currentStatus: ApprovalStatus
}

// ─── Badge helpers ────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: ApprovalItem['type'] }) {
  const map: Record<ApprovalItem['type'], { label: string; cls: string }> = {
    supporter: { label: 'Supporter', cls: 'bg-blue-50 text-blue-700 border-blue-100' },
    leader: { label: 'Leader', cls: 'bg-violet-50 text-violet-700 border-violet-100' },
    mission_proof: { label: 'Mission Proof', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    community: { label: 'Community', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  }
  const { label, cls } = map[type]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: ApprovalItem['priority'] }) {
  return priority === 'high'
    ? <Badge variant="red">High</Badge>
    : <Badge variant="gray">Normal</Badge>
}

const districtOptions = [
  { label: 'All Districts', value: 'all' },
  ...districts.map(d => ({ label: d.name, value: d.name })),
]

const typeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Supporter', value: 'supporter' },
  { label: 'Leader', value: 'leader' },
  { label: 'Mission Proof', value: 'mission_proof' },
  { label: 'Community', value: 'community' },
]

const priorityOptions = [
  { label: 'All Priority', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Normal', value: 'normal' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
}

export default function ApprovalsPage() {
  const [items, setItems] = useState<MutableApproval[]>(() =>
    approvals.map(a => ({ ...a, currentStatus: a.status }))
  )
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [districtFilter, setDistrictFilter] = useState('all')

  const pendingCount = items.filter(a => a.currentStatus === 'pending').length

  const filtered = useMemo(() => {
    return items.filter(a => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false
      if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false
      if (districtFilter !== 'all' && a.district !== districtFilter) return false
      return true
    })
  }, [items, typeFilter, priorityFilter, districtFilter])

  function handleApprove(id: string) {
    setItems(prev => prev.map(a => a.id === id ? { ...a, currentStatus: 'approved' } : a))
  }

  function handleReject(id: string) {
    setItems(prev => prev.map(a => a.id === id ? { ...a, currentStatus: 'rejected' } : a))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review and act on pending approval requests</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Pending', value: formatNumber(pendingCount), sub: 'Awaiting action', icon: <Clock size={18} />, color: 'amber' as const },
          { title: 'Approved Today', value: '12', sub: 'Dec 12, 2024', icon: <CheckCircle size={18} />, color: 'emerald' as const },
          { title: 'Rejected Today', value: '3', sub: 'Dec 12, 2024', icon: <XCircle size={18} />, color: 'rose' as const },
          { title: 'Avg Processing', value: '4.2h', sub: 'Last 7 days avg', icon: <Zap size={18} />, color: 'blue' as const },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-600">Filters:</span>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeOptions}
              className="min-w-[150px]"
            />
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={priorityOptions}
              className="min-w-[140px]"
            />
            <Select
              value={districtFilter}
              onChange={setDistrictFilter}
              options={districtOptions}
              className="min-w-[160px]"
            />
            <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Approval Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['ID', 'Type', 'Name', 'Requested By', 'District', 'Submitted', 'Priority', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-500">{item.id}</td>
                    <td className="py-3.5 px-4"><TypeBadge type={item.type} /></td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800 whitespace-nowrap">{item.name}</td>
                    <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">{item.requestedBy}</td>
                    <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">{item.district}</td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">{formatRelativeTime(item.submittedAt)}</td>
                    <td className="py-3.5 px-4"><PriorityBadge priority={item.priority} /></td>
                    <td className="py-3.5 px-4"><StatusBadge status={item.currentStatus} /></td>
                    <td className="py-3.5 px-4">
                      {item.currentStatus === 'pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle size={12} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <XCircle size={12} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          {item.currentStatus === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No approvals match the current filters.</div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
