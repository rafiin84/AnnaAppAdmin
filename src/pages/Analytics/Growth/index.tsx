import { motion } from 'framer-motion'
import {
  Users, TrendingUp, UserPlus, Target,
  BarChart2,
} from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import AreaChart from '@/components/charts/AreaChart'
import BarChart from '@/components/charts/BarChart'
import { districts } from '@/data/tamilnadu'
import { monthlyGrowth } from '@/data/mockData'
import { formatNumber } from '@/lib/utils'

// ─── Cohort Data ──────────────────────────────────────────────────────────────
interface CohortRow {
  cohort: string
  newMembers: number
  ret30: number
  ret60: number
  ret90: number
}

const cohortData: CohortRow[] = [
  { cohort: 'Q1 2024', newMembers: 18420, ret30: 84, ret60: 71, ret90: 58 },
  { cohort: 'Q2 2024', newMembers: 22810, ret30: 81, ret60: 68, ret90: 54 },
  { cohort: 'Q3 2024', newMembers: 29340, ret30: 79, ret60: 65, ret90: 51 },
  { cohort: 'Q4 2024', newMembers: 35200, ret30: 77, ret60: 63, ret90: 49 },
]

// ─── District Growth Data ─────────────────────────────────────────────────────
const topDistrictsByGrowth = [...districts]
  .sort((a, b) => b.growth - a.growth)
  .slice(0, 10)
  .map(d => ({ name: d.name, growth: d.growth }))

// ─── Monthly new supporters bar data ─────────────────────────────────────────
const newSupportersData = monthlyGrowth.map((m, i) => ({
  month: m.month,
  new: i === 0 ? m.supporters : m.supporters - monthlyGrowth[i - 1].supporters + 200,
}))

function RetentionBadge({ value }: { value: number }) {
  const color =
    value >= 75 ? 'bg-emerald-100 text-emerald-700' :
    value >= 60 ? 'bg-blue-100 text-blue-700' :
    value >= 45 ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-600'
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {value}%
    </span>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
}

export default function GrowthAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-gray-900">Growth Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Supporter acquisition & movement growth trends</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Supporters', value: formatNumber(847293), sub: 'Across all 38 districts', icon: <Users size={18} />, color: 'blue' as const, trend: 18.4 },
          { title: 'MoM Growth', value: '18.4%', sub: 'vs 14.2% last month', icon: <TrendingUp size={18} />, color: 'emerald' as const, trend: 4.2 },
          { title: 'New This Month', value: formatNumber(14320), sub: 'December 2024', icon: <UserPlus size={18} />, color: 'violet' as const, trend: 12.1 },
          { title: 'Projected Year-End', value: '1.2M', sub: 'At current growth rate', icon: <Target size={18} />, color: 'amber' as const },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Supporter Growth Area Chart */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Supporter Growth — 12 Months</h2>
          <AreaChart
            data={monthlyGrowth as unknown as Record<string, unknown>[]}
            xKey="month"
            series={[
              { key: 'supporters', label: 'Total Supporters', color: '#2563eb' },
            ]}
            height={260}
          />
        </Card>
      </motion.div>

      {/* People Helped Growth */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">People Helped — Growth Trend</h2>
          <AreaChart
            data={monthlyGrowth as unknown as Record<string, unknown>[]}
            xKey="month"
            series={[
              { key: 'peopleHelped', label: 'People Helped', color: '#10b981' },
            ]}
            height={220}
          />
        </Card>
      </motion.div>

      {/* Monthly New Supporters Bar */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-blue-500" />
            <h2 className="text-sm font-semibold text-gray-700">Monthly New Supporters</h2>
          </div>
          <BarChart
            data={newSupportersData as unknown as Record<string, unknown>[]}
            xKey="month"
            yKey="new"
            color="#6366f1"
            height={220}
          />
        </Card>
      </motion.div>

      {/* Growth by District */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Growth by District — Top 10</h2>
          <BarChart
            data={topDistrictsByGrowth as unknown as Record<string, unknown>[]}
            xKey="name"
            yKey="growth"
            color="#2563eb"
            height={280}
            horizontal
          />
        </Card>
      </motion.div>

      {/* Cohort Retention Table */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Quarterly Cohort Retention</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Cohort', 'New Members', '30-Day Retention', '60-Day Retention', '90-Day Retention'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortData.map(row => (
                  <tr key={row.cohort} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{row.cohort}</td>
                    <td className="py-3.5 px-4 text-gray-700">{formatNumber(row.newMembers)}</td>
                    <td className="py-3.5 px-4"><RetentionBadge value={row.ret30} /></td>
                    <td className="py-3.5 px-4"><RetentionBadge value={row.ret60} /></td>
                    <td className="py-3.5 px-4"><RetentionBadge value={row.ret90} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
