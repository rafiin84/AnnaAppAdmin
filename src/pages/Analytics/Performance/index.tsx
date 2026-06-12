import { motion } from 'framer-motion'
import { Trophy, Star, MapPin, Layers } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import { districts, getAllConstituencies } from '@/data/tamilnadu'
import { leaderboard } from '@/data/mockData'
import { formatNumber } from '@/lib/utils'

// ─── Derived ──────────────────────────────────────────────────────────────────
const allConstituencies = getAllConstituencies()

const top20Leaders = leaderboard.slice(0, 20)
const top10LeadersBar = leaderboard.slice(0, 10).map(l => ({
  name: l.name.split(' ')[0],
  sevaiPoints: l.sevaiPoints,
}))

const sortedDistrictsBySupp = [...districts].sort((a, b) => b.supporters - a.supporters).slice(0, 10)
const sortedConBySupp = [...allConstituencies].sort((a, b) => b.supporters - a.supporters).slice(0, 10)
const topDistrict = sortedDistrictsBySupp[0]
const topConst = sortedConBySupp[0]

// Mission completion rate mock trend
const missionCompletionTrend = [
  { month: 'Jan', rate: 72 },
  { month: 'Feb', rate: 75 },
  { month: 'Mar', rate: 71 },
  { month: 'Apr', rate: 78 },
  { month: 'May', rate: 80 },
  { month: 'Jun', rate: 77 },
  { month: 'Jul', rate: 83 },
  { month: 'Aug', rate: 81 },
  { month: 'Sep', rate: 85 },
  { month: 'Oct', rate: 88 },
  { month: 'Nov', rate: 86 },
  { month: 'Dec', rate: 91 },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type LeaderRow = (typeof leaderboard)[0] & Record<string, unknown>

function LevelBadge({ level }: { level: string }) {
  const map: Record<string, 'violet' | 'amber' | 'emerald' | 'blue' | 'gray'> = {
    Diamond: 'violet',
    Platinum: 'blue',
    Gold: 'amber',
    Silver: 'emerald',
    Bronze: 'gray',
  }
  return <Badge variant={map[level] ?? 'gray'}>{level}</Badge>
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, 'blue' | 'violet' | 'emerald'> = {
    'Constituency Leader': 'violet',
    'Cluster Leader': 'blue',
    'Squad Leader': 'emerald',
  }
  return <Badge variant={map[role] ?? 'gray'}>{role}</Badge>
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
}

const maxDistSupp = sortedDistrictsBySupp[0]?.supporters ?? 1
const maxConSupp = sortedConBySupp[0]?.supporters ?? 1

export default function PerformanceAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Leader rankings, district performance & mission completion</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          {
            title: 'Top Leader',
            value: leaderboard[0].name,
            sub: `${formatNumber(leaderboard[0].sevaiPoints)} Sevai pts`,
            icon: <Trophy size={18} />,
            color: 'amber' as const,
          },
          {
            title: 'Highest Sevai Points',
            value: formatNumber(leaderboard[0].sevaiPoints),
            sub: leaderboard[0].district,
            icon: <Star size={18} />,
            color: 'violet' as const,
          },
          {
            title: 'Top District',
            value: topDistrict.name,
            sub: `${formatNumber(topDistrict.supporters)} supporters`,
            icon: <MapPin size={18} />,
            color: 'blue' as const,
          },
          {
            title: 'Top Constituency',
            value: topConst.name,
            sub: `${formatNumber(topConst.supporters)} supporters`,
            icon: <Layers size={18} />,
            color: 'emerald' as const,
          },
        ]).map((kpi, i) => (
          <motion.div key={kpi.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Top Leaders Table */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top 20 Leaders</h2>
          <Table<LeaderRow>
            data={top20Leaders as LeaderRow[]}
            keyField="id"
            columns={[
              { key: 'rank', header: '#', render: r => <span className="font-bold text-gray-400 text-xs w-5 inline-block">{r.rank}</span> },
              {
                key: 'name', header: 'Name', render: r => (
                  <div className="flex items-center gap-2.5">
                    <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full" />
                    <span className="font-semibold text-gray-800">{r.name}</span>
                  </div>
                ),
              },
              { key: 'role', header: 'Role', render: r => <RoleBadge role={r.role} /> },
              { key: 'district', header: 'District', render: r => <span className="text-gray-600">{r.district}</span> },
              { key: 'constituency', header: 'Constituency', render: r => <span className="text-gray-600">{r.constituency}</span> },
              { key: 'sevaiPoints', header: 'Sevai Pts', render: r => <span className="font-semibold text-blue-700">{formatNumber(r.sevaiPoints)}</span> },
              { key: 'supporters', header: 'Supporters', render: r => formatNumber(r.supporters) },
              { key: 'missions', header: 'Missions', render: r => r.missions.toString() },
              { key: 'peopleHelped', header: 'Helped', render: r => formatNumber(r.peopleHelped) },
              { key: 'level', header: 'Level', render: r => <LevelBadge level={r.level} /> },
            ]}
          />
        </Card>
      </motion.div>

      {/* Top Leaders Bar + Mission Completion Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Top 10 Leaders by Sevai Points</h2>
            <BarChart
              data={top10LeadersBar as unknown as Record<string, unknown>[]}
              xKey="name"
              yKey="sevaiPoints"
              color="#6366f1"
              height={280}
              horizontal
            />
          </Card>
        </motion.div>

        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Mission Completion Rate Trend</h2>
            <LineChart
              data={missionCompletionTrend as unknown as Record<string, unknown>[]}
              xKey="month"
              series={[{ key: 'rate', label: 'Completion Rate (%)', color: '#10b981' }]}
              height={280}
            />
          </Card>
        </motion.div>
      </div>

      {/* Top Districts & Constituencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Districts</h2>
            <div className="space-y-3">
              {sortedDistrictsBySupp.map((d, i) => {
                const pct = Math.round((d.supporters / maxDistSupp) * 100)
                return (
                  <div key={d.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                        <span className="font-medium text-gray-800">{d.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{formatNumber(d.supporters)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Constituencies</h2>
            <div className="space-y-3">
              {sortedConBySupp.map((c, i) => {
                const pct = Math.round((c.supporters / maxConSupp) * 100)
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                        <span className="font-medium text-gray-800">{c.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{formatNumber(c.supporters)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
