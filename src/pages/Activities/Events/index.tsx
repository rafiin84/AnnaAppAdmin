import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays, Users, CheckCircle2, Clock,
  MapPin, Calendar, Search, Mic, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import BarChart from '@/components/charts/BarChart'
import { events } from '@/data/mockData'
import { districts } from '@/data/tamilnadu'
import { cn, formatNumber, formatDate } from '@/lib/utils'

// ─── Event type colour map ────────────────────────────────────────────────────
type EventType = typeof events[number]['type']

const typeConfig: Record<EventType, { variant: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'gray' }> = {
  'Rally':            { variant: 'rose' },
  'Town Hall':        { variant: 'blue' },
  'Workshop':         { variant: 'violet' },
  'Training':         { variant: 'emerald' },
  'Cultural Program': { variant: 'amber' },
  'Sports Day':       { variant: 'emerald' },
  'Health Camp':      { variant: 'rose' },
  'Felicitation':     { variant: 'amber' },
}

// ─── Avatar initials chip ─────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-blue-600', 'bg-violet-600', 'bg-emerald-600',
  'bg-rose-600',  'bg-amber-600',  'bg-blue-500',
]

function SpeakerAvatar({ name, index }: { name: string; index: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div
      className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ring-2 ring-white -ml-1.5 first:ml-0',
        AVATAR_COLORS[index % AVATAR_COLORS.length]
      )}
      title={name}
    >
      {initials}
    </div>
  )
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

const eventTypeOptions = [
  { label: 'All Types', value: '' },
  ...Array.from(new Set(events.map(e => e.type))).map(t => ({ label: t, value: t })),
]
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Upcoming',  value: 'upcoming' },
  { label: 'Ongoing',   value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]
const districtOptions = [
  { label: 'All Districts', value: '' },
  ...districts.map(d => ({ label: d.name, value: d.name })),
]

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Events() {
  const [search,         setSearch]         = useState('')
  const [typeFilter,     setTypeFilter]     = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [statusFilter,   setStatusFilter]   = useState('')
  const [page,           setPage]           = useState(1)

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const totalEvents    = events.length
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length
  const completedEvents = events.filter(e => e.status === 'completed').length
  const totalAttended  = events.reduce((acc, e) => acc + e.attended, 0)

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return events.filter(e => {
      const q = search.toLowerCase()
      if (q && !e.title.toLowerCase().includes(q) && !e.venue.toLowerCase().includes(q)) return false
      if (typeFilter     && e.type     !== typeFilter)     return false
      if (districtFilter && e.district !== districtFilter) return false
      if (statusFilter   && e.status   !== statusFilter)   return false
      return true
    })
  }, [search, typeFilter, districtFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Events by month chart ────────────────────────────────────────────────────
  const byMonth = useMemo(() => {
    const counts: Record<number, number> = {}
    events.forEach(e => {
      const m = new Date(e.date).getMonth()
      counts[m] = (counts[m] ?? 0) + 1
    })
    return MONTH_NAMES.map((month, i) => ({ month, events: counts[i] ?? 0 }))
  }, [])

  const reset = () => { setSearch(''); setTypeFilter(''); setDistrictFilter(''); setStatusFilter(''); setPage(1) }

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <motion.div
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {[
          { title: 'Total Events',    value: totalEvents,               icon: <CalendarDays size={18} />, color: 'blue'    as const, sub: 'All time' },
          { title: 'Upcoming',        value: upcomingEvents,            icon: <Clock size={18} />,        color: 'violet'  as const, sub: 'Scheduled ahead' },
          { title: 'Completed',       value: completedEvents,           icon: <CheckCircle2 size={18} />, color: 'emerald' as const, sub: 'Successfully held' },
          { title: 'Total Attended',  value: formatNumber(totalAttended), icon: <Users size={18} />,      color: 'amber'   as const, sub: 'Total footfall' },
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
              placeholder="Search events or venues…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <Select value={typeFilter}     onChange={v => { setTypeFilter(v);     setPage(1) }} options={eventTypeOptions} className="min-w-[160px]" />
          <Select value={districtFilter} onChange={v => { setDistrictFilter(v); setPage(1) }} options={districtOptions}  className="min-w-[160px]" />
          <Select value={statusFilter}   onChange={v => { setStatusFilter(v);   setPage(1) }} options={statusOptions}    className="min-w-[140px]" />
          {(search || typeFilter || districtFilter || statusFilter) && (
            <Button variant="ghost" size="sm" onClick={reset}>Clear</Button>
          )}
          <span className="ml-auto text-xs text-gray-400 font-medium">{filtered.length} results</span>
        </div>
      </Card>

      {/* Event Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={stagger} initial="hidden" animate="show"
      >
        {paginated.map(event => {
          const cfg        = typeConfig[event.type]
          const rsvpPct    = Math.min(100, Math.round((event.rsvp / event.capacity) * 100))
          const barColor   = rsvpPct >= 90 ? 'bg-rose-500' : rsvpPct >= 70 ? 'bg-amber-500' : 'bg-blue-500'

          return (
            <motion.div key={event.id} variants={fadeUp}>
              <Card hover className="p-5 flex flex-col gap-3 h-full">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 leading-snug">{event.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{event.id}</p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>

                {/* Type badge */}
                <Badge variant={cfg.variant} className="self-start text-[11px]">
                  {event.type}
                </Badge>

                {/* Meta info */}
                <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-gray-400" />
                    <span className="truncate font-medium text-gray-700">{event.venue}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-blue-400" />
                    <span>{event.district}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-gray-400" />
                    <span>{formatDate(event.date)}</span>
                  </span>
                </div>

                {/* RSVP capacity bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-gray-500 font-medium">RSVP / Capacity</span>
                    <span className="text-[11px] text-gray-700 font-semibold">
                      {formatNumber(event.rsvp)} / {formatNumber(event.capacity)}
                      <span className="text-gray-400 font-normal ml-1">({rsvpPct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${rsvpPct}%` }} />
                  </div>
                </div>

                {/* Attended (if completed) */}
                {event.status === 'completed' && event.attended > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 rounded-lg px-3 py-1.5">
                    <Users size={11} />
                    {formatNumber(event.attended)} attended
                  </div>
                )}

                {/* Speakers */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-auto">
                  <div className="flex items-center gap-1">
                    <Mic size={11} className="text-gray-400" />
                    <span className="text-[11px] text-gray-400 mr-1">Speakers</span>
                    <div className="flex items-center">
                      {event.speakers.map((name, i) => (
                        <SpeakerAvatar key={i} name={name} index={i} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 truncate max-w-[120px] text-right">
                    {event.speakers.slice(0, 2).join(', ')}
                    {event.speakers.length > 2 && ` +${event.speakers.length - 2}`}
                  </span>
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

      {/* Events by Month Chart */}
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-base">Events by Month — 2024</h3>
          <p className="text-xs text-gray-400 mt-0.5">Number of events scheduled per calendar month</p>
        </div>
        <BarChart data={byMonth} xKey="month" yKey="events" color="#2563eb" height={220} />
      </Card>
    </div>
  )
}
