import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown,
  Users,
  MapPin,
  Star,
  TrendingUp,
  Award,
  ChevronUp,
  BarChart2,
  Zap,
  ArrowUpDown,
} from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { leaderboard, type LeaderEntry } from '@/data/mockData'
import { districts } from '@/data/tamilnadu'
import { cn } from '@/lib/utils'

type Tab = 'all' | 'squad' | 'cluster'
type SortKey = 'sevaiPoints' | 'supporters' | 'missions'

const levelConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  Diamond: { label: 'Diamond', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Platinum: { label: 'Platinum', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  Gold: { label: 'Gold', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Silver: { label: 'Silver', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  Bronze: { label: 'Bronze', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
}

const rankColors = ['bg-amber-400', 'bg-gray-300', 'bg-amber-600', 'bg-gray-100', 'bg-gray-100']

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
        <Crown className="w-3.5 h-3.5 text-white" />
      </div>
    )
  if (rank <= 3)
    return (
      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm', rank === 2 ? 'bg-gray-400' : 'bg-amber-700')}>
        {rank}
      </div>
    )
  return (
    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
      {rank}
    </div>
  )
}

function LevelBadge({ level }: { level: string }) {
  const cfg = levelConfig[level] ?? levelConfig.Bronze
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border', cfg.bg, cfg.text, cfg.border)}>
      {level}
    </span>
  )
}

export default function LeadersPage() {
  const [tab, setTab] = useState<Tab>('all')
  const [sortKey, setSortKey] = useState<SortKey>('sevaiPoints')
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = useMemo(() => {
    let data = [...leaderboard]
    if (tab === 'squad') data = data.filter(l => l.role === 'Squad Leader')
    if (tab === 'cluster') data = data.filter(l => l.role === 'Cluster Leader')
    data.sort((a, b) => sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey])
    return data
  }, [tab, sortKey, sortAsc])

  const kpi = useMemo(() => {
    const topDistrict = districts.reduce((best, d) =>
      d.leaders > best.leaders ? d : best, districts[0])
    const avgSevai = Math.round(leaderboard.reduce((s, l) => s + l.sevaiPoints, 0) / leaderboard.length)
    const topPerformer = leaderboard[0]
    return { total: leaderboard.length, topDistrict: topDistrict.name, avgSevai, topPerformer: topPerformer.name }
  }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(false) }
  }

  const columns = [
    {
      key: 'rank',
      header: 'Rank',
      render: (row: LeaderEntry) => <RankBadge rank={row.rank} />,
    },
    {
      key: 'name',
      header: 'Leader',
      render: (row: LeaderEntry) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {getInitials(row.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
            <p className="text-xs text-gray-400">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'district',
      header: 'Location',
      render: (row: LeaderEntry) => (
        <div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {row.district}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-5">{row.constituency}</p>
        </div>
      ),
    },
    {
      key: 'sevaiPoints',
      header: 'Sevai Points',
      render: (row: LeaderEntry) => (
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-bold text-gray-900 text-sm">{row.sevaiPoints.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'supporters',
      header: 'Supporters',
      render: (row: LeaderEntry) => (
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-violet-500" />
          <span className="font-semibold text-gray-900 text-sm">{row.supporters.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'missions',
      header: 'Missions',
      render: (row: LeaderEntry) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm">
          {row.missions}
        </span>
      ),
    },
    {
      key: 'peopleHelped',
      header: 'People Helped',
      render: (row: LeaderEntry) => (
        <span className="font-semibold text-emerald-700 text-sm">{row.peopleHelped.toLocaleString()}</span>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      render: (row: LeaderEntry) => <LevelBadge level={row.level} />,
    },
    {
      key: 'badge',
      header: 'Badge',
      render: (row: LeaderEntry) => (
        <Badge variant="blue" className="text-xs">{row.badge}</Badge>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Leaderboard and directory of all movement leaders</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Sort by:</span>
          <Button
            variant={sortKey === 'sevaiPoints' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleSort('sevaiPoints')}
            icon={<Star className="w-3.5 h-3.5" />}
          >
            Sevai Points
          </Button>
          <Button
            variant={sortKey === 'supporters' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleSort('supporters')}
            icon={<Users className="w-3.5 h-3.5" />}
          >
            Supporters
          </Button>
          <Button
            variant={sortKey === 'missions' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleSort('missions')}
            icon={<Zap className="w-3.5 h-3.5" />}
          >
            Missions
          </Button>
          <button
            onClick={() => setSortAsc(a => !a)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title={sortAsc ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <KPICard
            title="Total Leaders"
            value={kpi.total}
            sub="Across all roles"
            icon={<Crown className="w-5 h-5" />}
            color="blue"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Top District"
            value={kpi.topDistrict}
            sub="By leader count"
            icon={<MapPin className="w-5 h-5" />}
            color="violet"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Avg Sevai Points"
            value={kpi.avgSevai.toLocaleString()}
            sub="Per leader"
            icon={<BarChart2 className="w-5 h-5" />}
            color="emerald"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Top Performer"
            value={kpi.topPerformer.split(' ')[0]}
            sub={kpi.topPerformer}
            icon={<Award className="w-5 h-5" />}
            color="amber"
          />
        </motion.div>
      </motion.div>

      {/* Tabs + Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.18 }}
      >
        <Card>
          {/* Tabs */}
          <div className="px-5 pt-4 pb-0 flex items-center gap-1 border-b border-gray-100">
            {(
              [
                { key: 'all', label: 'All Leaders', count: leaderboard.length },
                { key: 'squad', label: 'Squad Leaders', count: leaderboard.filter(l => l.role === 'Squad Leader').length },
                { key: 'cluster', label: 'Cluster Leaders', count: leaderboard.filter(l => l.role === 'Cluster Leader').length },
              ] as { key: Tab; label: string; count: number }[]
            ).map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); }}
                className={cn(
                  'px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 -mb-px border-b-2',
                  tab === t.key
                    ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                {t.label}
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-bold', tab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500')}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab}-${sortKey}-${sortAsc}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Table
                columns={columns as any}
                data={filtered as any}
                keyField="id"
              />
            </motion.div>
          </AnimatePresence>

          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            {filtered.length} leaders shown · sorted by {sortKey === 'sevaiPoints' ? 'Sevai Points' : sortKey === 'supporters' ? 'Supporters' : 'Missions'} ({sortAsc ? 'ascending' : 'descending'})
          </div>
        </Card>
      </motion.div>

      {/* Level Legend */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.26 }}
      >
        <Card className="p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Level Tiers</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(levelConfig).map(([level, cfg]) => (
              <div key={level} className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border', cfg.bg, cfg.border)}>
                <ChevronUp className={cn('w-3.5 h-3.5', cfg.text)} />
                <span className={cn('text-xs font-bold', cfg.text)}>{level}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Levels are assigned based on cumulative Sevai Points and mission contributions.</p>
        </Card>
      </motion.div>
    </div>
  )
}
