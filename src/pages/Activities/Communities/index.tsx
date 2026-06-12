import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users, MapPin, Calendar, User, Search,
  Activity, ChevronLeft, ChevronRight,
} from 'lucide-react'
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import BarChart from '@/components/charts/BarChart'
import { communities } from '@/data/mockData'
import { districts } from '@/data/tamilnadu'
import { cn, formatDate, formatNumber } from '@/lib/utils'

// ─── Community type colour map ────────────────────────────────────────────────
type CommunityType = typeof communities[number]['type']

const typeConfig: Record<CommunityType, { variant: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'gray'; color: string }> = {
  'Yoga Group':       { variant: 'violet',  color: '#8b5cf6' },
  'Walking Club':     { variant: 'emerald', color: '#10b981' },
  'Cycling Club':     { variant: 'blue',    color: '#3b82f6' },
  'Sports Group':     { variant: 'rose',    color: '#f43f5e' },
  'Book Club':        { variant: 'amber',   color: '#f59e0b' },
  'Chai Meet':        { variant: 'amber',   color: '#d97706' },
  'Meditation Group': { variant: 'violet',  color: '#7c3aed' },
  'Nature Club':      { variant: 'emerald', color: '#059669' },
}

const PAGE_SIZE = 12

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const communityTypeOptions = [
  { label: 'All Types', value: '' },
  ...Array.from(new Set(communities.map(c => c.type))).map(t => ({ label: t, value: t })),
]
const districtOptions = [
  { label: 'All Districts', value: '' },
  ...districts.map(d => ({ label: d.name, value: d.name })),
]

// ─── Sparkline using tiny inline bars ────────────────────────────────────────
function AttendanceSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-7">
      {data.map((v, i) => {
        const heightPct = Math.max(12, Math.round((v / max) * 100))
        const isLast    = i === data.length - 1
        return (
          <div
            key={i}
            className={cn('w-3 rounded-sm transition-all', isLast ? 'bg-blue-500' : 'bg-blue-200')}
            style={{ height: `${heightPct}%` }}
            title={String(v)}
          />
        )
      })}
    </div>
  )
}

// Custom recharts tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900">{payload[0]?.value} communities</p>
    </div>
  )
}

export default function Communities() {
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [page,         setPage]         = useState(1)

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const totalCommunities  = communities.length
  const activeCommunities = communities.filter(c => c.active).length
  const totalMembers      = communities.reduce((acc, c) => acc + c.members, 0)
  const avgMeetings       = (communities.reduce((acc, c) => acc + c.meetingsPerMonth, 0) / communities.length).toFixed(1)

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return communities.filter(c => {
      const q = search.toLowerCase()
      if (q && !c.name.toLowerCase().includes(q) && !c.constituency.toLowerCase().includes(q)) return false
      if (typeFilter     && c.type     !== typeFilter)     return false
      if (districtFilter && c.district !== districtFilter) return false
      return true
    })
  }, [search, typeFilter, districtFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Chart data ───────────────────────────────────────────────────────────────
  const byType = useMemo(() => {
    const counts: Record<string, number> = {}
    communities.forEach(c => { counts[c.type] = (counts[c.type] ?? 0) + 1 })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type: type.split(' ')[0], count, fullType: type }))
  }, [])

  const reset = () => { setSearch(''); setTypeFilter(''); setDistrictFilter(''); setPage(1) }

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <motion.div
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {[
          { title: 'Total Communities',  value: totalCommunities,  icon: <Users size={18} />,    color: 'blue'    as const, sub: 'All groups' },
          { title: 'Active Communities', value: activeCommunities, icon: <Activity size={18} />, color: 'emerald' as const, sub: 'Currently running' },
          { title: 'Total Members',      value: formatNumber(totalMembers), icon: <Users size={18} />,   color: 'violet' as const, sub: 'Across all groups' },
          { title: 'Avg Meetings/Month', value: avgMeetings,       icon: <Calendar size={18} />, color: 'amber'   as const, sub: 'Average frequency' },
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
              placeholder="Search communities…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <Select value={typeFilter}     onChange={v => { setTypeFilter(v);     setPage(1) }} options={communityTypeOptions} className="min-w-[160px]" />
          <Select value={districtFilter} onChange={v => { setDistrictFilter(v); setPage(1) }} options={districtOptions}      className="min-w-[160px]" />
          {(search || typeFilter || districtFilter) && (
            <Button variant="ghost" size="sm" onClick={reset}>Clear</Button>
          )}
          <span className="ml-auto text-xs text-gray-400 font-medium">{filtered.length} results</span>
        </div>
      </Card>

      {/* Community Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {paginated.map(community => {
          const cfg = typeConfig[community.type]
          return (
            <motion.div key={community.id} variants={fadeUp}>
              <Card hover className="p-5 flex flex-col gap-3 h-full">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 leading-snug">{community.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{community.id}</p>
                  </div>
                  <StatusBadge status={community.active ? 'active' : 'inactive'} />
                </div>

                {/* Type badge */}
                <Badge variant={cfg.variant} className="self-start text-[11px]">
                  {community.type}
                </Badge>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-gray-400" />
                    <span className="truncate">{community.district}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={11} className="text-blue-400" />
                    <span className="font-semibold text-gray-700">{community.members} members</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-gray-400" />
                    <span>{community.meetingsPerMonth}×/month</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={11} className="text-gray-400" />
                    <span className="truncate">{community.leader}</span>
                  </span>
                </div>

                {/* Last meeting */}
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Calendar size={10} />
                  Last meeting: <span className="text-gray-600 font-medium ml-0.5">{formatDate(community.lastMeetingDate)}</span>
                </div>

                {/* Attendance sparkline */}
                <div className="border-t border-gray-50 pt-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-1.5">Attendance trend (6 sessions)</p>
                      <AttendanceSparkline data={community.attendance} />
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-400">Latest</p>
                      <p className="text-lg font-bold text-gray-900">
                        {community.attendance[community.attendance.length - 1]}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost" size="sm"
            icon={<ChevronLeft size={14} />}
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Prev
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i
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
          </div>
          <Button
            variant="ghost" size="sm"
            icon={<ChevronRight size={14} />}
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Communities by Type Chart */}
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-base">Communities by Type</h3>
          <p className="text-xs text-gray-400 mt-0.5">Distribution across all community types</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ReBarChart data={byType} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {byType.map((entry, i) => {
                const colors = ['#8b5cf6','#10b981','#3b82f6','#f43f5e','#f59e0b','#d97706','#7c3aed','#059669']
                return <Cell key={i} fill={colors[i % colors.length]} />
              })}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
