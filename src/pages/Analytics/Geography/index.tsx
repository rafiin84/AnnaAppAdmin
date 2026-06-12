import { motion } from 'framer-motion'
import { MapPin, Users, TrendingUp, Award } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import BarChart from '@/components/charts/BarChart'
import { districts, getAllConstituencies } from '@/data/tamilnadu'
import { formatNumber } from '@/lib/utils'

// ─── Derived data ─────────────────────────────────────────────────────────────
const allConstituencies = getAllConstituencies()

const sortedDistricts = [...districts].sort((a, b) => b.supporters - a.supporters)

const top20Constituencies = [...allConstituencies]
  .sort((a, b) => b.supporters - a.supporters)
  .slice(0, 20)
  .map((c, i) => ({ ...c, rank: i + 1 }))

const top10DistrictsBar = sortedDistricts.slice(0, 10).map(d => ({
  name: d.name,
  supporters: d.supporters,
}))

// Approximate region grouping
const regionGroups: Record<string, string[]> = {
  'North TN': ['Chennai', 'Tiruvallur', 'Kancheepuram', 'Chengalpattu', 'Vellore', 'Ranipet', 'Tirupathur'],
  'South TN': ['Tirunelveli', 'Thoothukudi', 'Kanyakumari', 'Virudhunagar', 'Ramanathapuram', 'Tenkasi'],
  'Central TN': ['Tiruchirappalli', 'Thanjavur', 'Tiruvarur', 'Nagapattinam', 'Mayiladuthurai', 'Pudukottai', 'Sivaganga'],
  'West TN': ['Coimbatore', 'Tiruppur', 'Erode', 'Salem', 'Namakkal', 'Nilgiris', 'Theni'],
}

const regionData = Object.entries(regionGroups).map(([region, distNames]) => {
  const total = districts
    .filter(d => distNames.includes(d.name))
    .reduce((s, d) => s + d.supporters, 0)
  return { region, supporters: total }
})

// KPI derived values
const districtCount = districts.length
const activeConstituencies = allConstituencies.length
const distGrowing = districts.filter(d => d.growth > 10).length
const bestDistrict = sortedDistricts[0]

// District table row type
interface DistrictRow extends Record<string, unknown> {
  rank: number
  id: string
  name: string
  supporters: number
  leaders: number
  missions: number
  peopleHelped: number
  growth: number
}

const districtTableData: DistrictRow[] = sortedDistricts.map((d, i) => ({
  rank: i + 1,
  id: d.id,
  name: d.name,
  supporters: d.supporters,
  leaders: d.leaders,
  missions: d.missions,
  peopleHelped: d.peopleHelped,
  growth: d.growth,
}))

interface ConRow extends Record<string, unknown> {
  rank: number
  id: string
  name: string
  supporters: number
  leaders: number
  missionsCompleted: number
  peopleHelped: number
  growthPercentage: number
}

const conTableData: ConRow[] = top20Constituencies.map(c => ({
  rank: c.rank,
  id: c.id,
  name: c.name,
  supporters: c.supporters,
  leaders: c.leaders,
  missionsCompleted: c.missionsCompleted,
  peopleHelped: c.peopleHelped,
  growthPercentage: c.growthPercentage,
}))

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
}

function GrowthBadge({ value }: { value: number }) {
  const variant = value >= 15 ? 'emerald' : value >= 8 ? 'blue' : value >= 4 ? 'amber' : 'gray'
  return <Badge variant={variant}>{value.toFixed(1)}%</Badge>
}

export default function GeographyAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Geography Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">District & constituency-level distribution and performance</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { title: 'Active Districts', value: districtCount, sub: 'All Tamil Nadu', icon: <MapPin size={18} />, color: 'blue' as const },
          { title: 'Active Constituencies', value: activeConstituencies, sub: 'Across 38 districts', icon: <Users size={18} />, color: 'emerald' as const },
          { title: 'Districts Growing >10%', value: distGrowing, sub: 'High-growth districts', icon: <TrendingUp size={18} />, color: 'violet' as const },
          { title: 'Best Performing', value: bestDistrict.name, sub: `${formatNumber(bestDistrict.supporters)} supporters`, icon: <Award size={18} />, color: 'amber' as const },
        ] as const).map((kpi, i) => (
          <motion.div key={kpi.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Top 10 Districts by Supporters</h2>
            <BarChart
              data={top10DistrictsBar as unknown as Record<string, unknown>[]}
              xKey="name"
              yKey="supporters"
              color="#2563eb"
              height={280}
              horizontal
            />
          </Card>
        </motion.div>

        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Geographic Distribution by Region</h2>
            <BarChart
              data={regionData as unknown as Record<string, unknown>[]}
              xKey="region"
              yKey="supporters"
              color="#10b981"
              height={280}
            />
          </Card>
        </motion.div>
      </div>

      {/* District Rankings Table */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">District Rankings</h2>
          <Table<DistrictRow>
            data={districtTableData}
            keyField="id"
            columns={[
              { key: 'rank', header: '#', render: r => <span className="font-bold text-gray-400 text-xs">{r.rank}</span> },
              { key: 'name', header: 'District', render: r => <span className="font-semibold text-gray-800">{r.name}</span> },
              { key: 'supporters', header: 'Supporters', render: r => formatNumber(r.supporters) },
              { key: 'leaders', header: 'Leaders', render: r => formatNumber(r.leaders) },
              { key: 'missions', header: 'Missions', render: r => r.missions.toString() },
              { key: 'peopleHelped', header: 'People Helped', render: r => formatNumber(r.peopleHelped) },
              { key: 'growth', header: 'Growth', render: r => <GrowthBadge value={r.growth} /> },
            ]}
          />
        </Card>
      </motion.div>

      {/* Top Constituencies Table */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top 20 Constituencies by Supporters</h2>
          <Table<ConRow>
            data={conTableData}
            keyField="id"
            columns={[
              { key: 'rank', header: '#', render: r => <span className="font-bold text-gray-400 text-xs">{r.rank}</span> },
              { key: 'name', header: 'Constituency', render: r => <span className="font-semibold text-gray-800">{r.name}</span> },
              { key: 'supporters', header: 'Supporters', render: r => formatNumber(r.supporters) },
              { key: 'leaders', header: 'Leaders', render: r => r.leaders.toString() },
              { key: 'missionsCompleted', header: 'Missions', render: r => r.missionsCompleted.toString() },
              { key: 'peopleHelped', header: 'People Helped', render: r => formatNumber(r.peopleHelped) },
              { key: 'growthPercentage', header: 'Growth', render: r => <GrowthBadge value={r.growthPercentage} /> },
            ]}
          />
        </Card>
      </motion.div>
    </div>
  )
}
