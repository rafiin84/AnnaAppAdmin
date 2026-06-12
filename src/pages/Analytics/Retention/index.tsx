import { motion } from 'framer-motion'
import { RefreshCw, Clock, Users, Calendar } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import AreaChart from '@/components/charts/AreaChart'
import { monthlyGrowth, communities } from '@/data/mockData'
import { cn } from '@/lib/utils'

// ─── Cohort Heatmap Data ──────────────────────────────────────────────────────
const cohortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Each row = cohort month, each col = retention at M1..M6
const cohortRetentionData: Array<{ month: string; values: (number | null)[] }> = [
  { month: 'Jan 24', values: [88, 76, 64, 55, 48, 42] },
  { month: 'Feb 24', values: [85, 73, 61, 52, 45, 40] },
  { month: 'Mar 24', values: [87, 75, 63, 54, 47, null] },
  { month: 'Apr 24', values: [83, 71, 60, 51, null, null] },
  { month: 'May 24', values: [86, 74, 62, null, null, null] },
  { month: 'Jun 24', values: [84, 72, null, null, null, null] },
  { month: 'Jul 24', values: [82, null, null, null, null, null] },
  { month: 'Aug 24', values: [89, 77, 65, 56, 49, null] },
  { month: 'Sep 24', values: [80, 68, 57, 48, null, null] },
  { month: 'Oct 24', values: [85, 73, 61, null, null, null] },
  { month: 'Nov 24', values: [83, 71, null, null, null, null] },
  { month: 'Dec 24', values: [87, null, null, null, null, null] },
]

function retentionCellColor(val: number | null): string {
  if (val === null) return 'bg-gray-50 text-gray-300'
  if (val >= 85) return 'bg-blue-900 text-white'
  if (val >= 75) return 'bg-blue-700 text-white'
  if (val >= 65) return 'bg-blue-500 text-white'
  if (val >= 55) return 'bg-blue-300 text-blue-900'
  if (val >= 45) return 'bg-blue-200 text-blue-800'
  return 'bg-blue-100 text-blue-700'
}

// ─── Active supporters over time (same as monthlyGrowth.supporters) ───────────
const activeOverTime = monthlyGrowth.map(m => ({
  ...m,
  activeSupporters: Math.floor(m.supporters * 0.82),
}))

// ─── Community retention sparklines ──────────────────────────────────────────
const topCommunities = communities
  .filter(c => c.active)
  .slice(0, 8)
  .map(c => ({
    name: c.name,
    type: c.type,
    members: c.members,
    attendance: c.attendance, // 6 numbers
  }))

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => {
        const pct = max > 0 ? (v / max) * 100 : 0
        return (
          <div
            key={i}
            className="w-3 rounded-sm bg-blue-400 transition-all"
            style={{ height: `${Math.max(pct, 8)}%` }}
          />
        )
      })}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
}

export default function RetentionAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Retention Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Cohort retention, activity trends & community engagement</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: '30-Day Retention', value: '78%', sub: '+2% vs last quarter', icon: <RefreshCw size={18} />, color: 'emerald' as const, trend: 2 },
          { title: '60-Day Retention', value: '64%', sub: '+1.5% vs last quarter', icon: <Clock size={18} />, color: 'blue' as const, trend: 1.5 },
          { title: '90-Day Retention', value: '52%', sub: 'Industry avg: 45%', icon: <Calendar size={18} />, color: 'violet' as const, trend: -0.8 },
          { title: 'Avg Tenure', value: '14 mo', sub: 'Per active supporter', icon: <Users size={18} />, color: 'amber' as const },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Cohort Heatmap */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Cohort Retention Heatmap — 2024</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded bg-blue-100 inline-block" />
              <span>Low</span>
              <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
              <span>Mid</span>
              <span className="w-3 h-3 rounded bg-blue-900 inline-block" />
              <span>High</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-3 text-gray-400 font-semibold uppercase tracking-wide w-20">Cohort</th>
                  {['M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map(m => (
                    <th key={m} className="py-2 px-2 text-center text-gray-400 font-semibold uppercase tracking-wide">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortRetentionData.map(row => (
                  <tr key={row.month} className="border-t border-gray-50">
                    <td className="py-2 px-3 font-semibold text-gray-700 whitespace-nowrap">{row.month}</td>
                    {row.values.map((val, ci) => (
                      <td key={ci} className="py-1.5 px-2 text-center">
                        <span className={cn('inline-block w-12 py-1 rounded-md text-xs font-semibold', retentionCellColor(val))}>
                          {val !== null ? `${val}%` : '—'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Active Supporters Over Time */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Active Supporters Over Time</h2>
          <AreaChart
            data={activeOverTime as unknown as Record<string, unknown>[]}
            xKey="month"
            series={[
              { key: 'activeSupporters', label: 'Active Supporters', color: '#2563eb' },
              { key: 'supporters', label: 'Total Supporters', color: '#94a3b8' },
            ]}
            height={240}
          />
        </Card>
      </motion.div>

      {/* Community Retention Sparklines */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Community Attendance Trends</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topCommunities.map(c => (
              <div key={c.name} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 leading-tight line-clamp-2">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.type}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 ml-2 whitespace-nowrap">{c.members} mbr</span>
                </div>
                <Sparkline data={c.attendance} />
                <p className="text-xs text-gray-400 mt-1.5">Last 6 meetings</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
