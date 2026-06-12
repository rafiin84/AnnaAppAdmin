import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Target, Leaf, Heart, Megaphone, Users, FileText, Droplets, Vote,
  MapPin, Calendar, User, Star, ChevronLeft, ChevronRight, BarChart2,
} from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import BarChart from '@/components/charts/BarChart'
import { missions, MissionType } from '@/data/mockData'
import { districts } from '@/data/tamilnadu'
import { cn, formatNumber, formatDate } from '@/lib/utils'

// ─── Mission type config ──────────────────────────────────────────────────────
const missionTypeConfig: Record<MissionType, { icon: React.ElementType; color: string; bg: string; variant: 'blue' | 'emerald' | 'violet' | 'rose' | 'amber' | 'gray' }> = {
  'Clean-up Drive':       { icon: Target,    color: 'text-blue-600',   bg: 'bg-blue-50',   variant: 'blue' },
  'Tree Plantation':      { icon: Leaf,      color: 'text-emerald-600',bg: 'bg-emerald-50',variant: 'emerald' },
  'Medical Camp':         { icon: Heart,     color: 'text-rose-600',   bg: 'bg-rose-50',   variant: 'rose' },
  'Awareness Campaign':   { icon: Megaphone, color: 'text-violet-600', bg: 'bg-violet-50', variant: 'violet' },
  'Community Service':    { icon: Users,     color: 'text-blue-500',   bg: 'bg-blue-50',   variant: 'blue' },
  'Documentation Drive':  { icon: FileText,  color: 'text-gray-600',   bg: 'bg-gray-100',  variant: 'gray' },
  'Blood Donation Camp':  { icon: Droplets,  color: 'text-rose-500',   bg: 'bg-rose-50',   variant: 'rose' },
  'Voter Awareness':      { icon: Vote,      color: 'text-amber-600',  bg: 'bg-amber-50',  variant: 'amber' },
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

const missionTypeOptions = [
  { label: 'All Types', value: '' },
  ...Array.from(new Set(missions.map(m => m.type))).map(t => ({ label: t, value: t })),
]
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active',    value: 'active' },
  { label: 'Upcoming',  value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]
const districtOptions = [
  { label: 'All Districts', value: '' },
  ...districts.map(d => ({ label: d.name, value: d.name })),
]

export default function Missions() {
  const [search,   setSearch]   = useState('')
  const [typeFilter,   setTypeFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [page, setPage] = useState(1)

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const totalMissions   = missions.length
  const activeMissions  = missions.filter(m => m.status === 'active').length
  const completedMissions = missions.filter(m => m.status === 'completed').length
  const totalPeopleHelped = missions.reduce((acc, m) => acc + m.peopleHelped, 0)

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return missions.filter(m => {
      const q = search.toLowerCase()
      if (q && !m.title.toLowerCase().includes(q) && !m.constituency.toLowerCase().includes(q)) return false
      if (typeFilter   && m.type     !== typeFilter)   return false
      if (statusFilter && m.status   !== statusFilter) return false
      if (districtFilter && m.district !== districtFilter) return false
      return true
    })
  }, [search, typeFilter, statusFilter, districtFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Chart data ───────────────────────────────────────────────────────────────
  const byType = useMemo(() => {
    const counts: Record<string, number> = {}
    missions.forEach(m => { counts[m.type] = (counts[m.type] ?? 0) + 1 })
    return Object.entries(counts).map(([type, count]) => ({ type: type.split(' ')[0], count }))
  }, [])

  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const handleType   = (v: string) => { setTypeFilter(v); setPage(1) }
  const handleStatus = (v: string) => { setStatusFilter(v); setPage(1) }
  const handleDist   = (v: string) => { setDistrictFilter(v); setPage(1) }

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <motion.div
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {[
          { title: 'Total Missions',  value: totalMissions,              icon: <Target size={18} />,  color: 'blue'    as const, sub: 'All time' },
          { title: 'Active',          value: activeMissions,             icon: <BarChart2 size={18} />, color: 'violet' as const, sub: 'In progress' },
          { title: 'Completed',       value: completedMissions,          icon: <Star size={18} />,    color: 'emerald' as const, sub: 'Successfully done' },
          { title: 'People Helped',   value: formatNumber(totalPeopleHelped), icon: <Heart size={18} />, color: 'rose' as const, sub: 'Through missions' },
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
              icon={<Target size={14} />}
              placeholder="Search missions…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter}     onChange={handleType}   options={missionTypeOptions} className="min-w-[160px]" />
          <Select value={statusFilter}   onChange={handleStatus} options={statusOptions}      className="min-w-[140px]" />
          <Select value={districtFilter} onChange={handleDist}   options={districtOptions}    className="min-w-[160px]" />
          {(search || typeFilter || statusFilter || districtFilter) && (
            <Button
              variant="ghost" size="sm"
              onClick={() => { setSearch(''); setTypeFilter(''); setStatusFilter(''); setDistrictFilter(''); setPage(1) }}
            >
              Clear
            </Button>
          )}
          <span className="ml-auto text-xs text-gray-400 font-medium">{filtered.length} results</span>
        </div>
      </Card>

      {/* Mission Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {paginated.map(mission => {
          const cfg      = missionTypeConfig[mission.type]
          const IconComp = cfg.icon
          const fillPct  = Math.min(100, Math.round((mission.enrolled / mission.capacity) * 100))
          const barColor = fillPct >= 90 ? 'bg-rose-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-blue-500'

          return (
            <motion.div key={mission.id} variants={fadeUp}>
              <Card hover className="p-5 flex flex-col gap-3 h-full">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg)}>
                      <IconComp size={18} className={cfg.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 leading-snug truncate">{mission.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{mission.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={mission.status} />
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-gray-400" />
                    <span className="truncate">{mission.district}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-blue-400" />
                    <span className="truncate">{mission.constituency}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-gray-400" />
                    <span>{formatDate(mission.date)}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={11} className="text-gray-400" />
                    <span className="truncate">{mission.leader}</span>
                  </span>
                </div>

                {/* Capacity bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-gray-500 font-medium">Capacity</span>
                    <span className="text-[11px] text-gray-700 font-semibold">
                      {mission.enrolled} / {mission.capacity}
                      <span className="text-gray-400 font-normal ml-1">({fillPct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${fillPct}%` }} />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-auto">
                  <Badge variant={cfg.variant} className="text-[11px]">
                    <IconComp size={10} />
                    {mission.type}
                  </Badge>
                  <div className="flex items-center gap-3">
                    {mission.status === 'completed' && mission.peopleHelped > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <Heart size={10} />
                        {formatNumber(mission.peopleHelped)} helped
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                      <Star size={10} />
                      {formatNumber(mission.sevaiPoints)} pts
                    </span>
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

      {/* Mission Impact Chart */}
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-base">Mission Impact by Type</h3>
          <p className="text-xs text-gray-400 mt-0.5">Number of missions across all types</p>
        </div>
        <BarChart data={byType} xKey="type" yKey="count" color="#2563eb" height={220} />
      </Card>
    </div>
  )
}
