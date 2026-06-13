import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, HeartHandshake, Target, AlertCircle, MapPin, TrendingUp, Star, Activity, CheckCircle, Clock, Zap, Crown } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import AreaChart from '@/components/charts/AreaChart'
import BarChart from '@/components/charts/BarChart'
import TNMap from '@/components/maps/TNMap'
import { kpiSummary, monthlyGrowth, recentActivity, leaderboard } from '@/data/mockData'
import { districts, District } from '@/data/tamilnadu'
import { formatNumber, formatRelativeTime } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

const activityIcons: Record<string, { icon: React.ElementType; color: string }> = {
  supporter_joined: { icon: Users, color: 'text-blue-500' },
  mission_completed: { icon: Target, color: 'text-emerald-500' },
  help_resolved: { icon: HeartHandshake, color: 'text-violet-500' },
  leader_promoted: { icon: Star, color: 'text-amber-500' },
  community_formed: { icon: Users, color: 'text-blue-400' },
  event_completed: { icon: CheckCircle, color: 'text-emerald-400' },
}

const topDistricts = [...districts].sort((a, b) => b.supporters - a.supporters).slice(0, 5)
const topByGrowth = [...districts].sort((a, b) => b.growth - a.growth).slice(0, 5)
const topConstituencies = districts
  .flatMap(d => d.constituencies)
  .sort((a, b) => b.supporters - a.supporters)
  .slice(0, 5)

const helpData = monthlyGrowth.map(m => ({ month: m.month, Raised: m.helpRaisedTotal, Resolved: m.helpResolvedTotal }))

export default function Dashboard() {
  const [colorBy, setColorBy] = useState<'supporters' | 'missions' | 'peopleHelped'>('supporters')
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {[
          { title: 'Total Supporters', value: formatNumber(kpiSummary.totalSupporters), icon: <Users size={18} />, color: 'blue' as const, trend: 18.4, sub: 'Across Tamil Nadu' },
          { title: 'People Helped', value: formatNumber(kpiSummary.peopleHelped), icon: <HeartHandshake size={18} />, color: 'emerald' as const, trend: 24.1, sub: 'This year' },
          { title: 'Active Missions', value: kpiSummary.activeMissions, icon: <Target size={18} />, color: 'violet' as const, trend: 12.3, sub: 'Ongoing' },
          { title: 'Help Requests Open', value: kpiSummary.helpRequestsOpen, icon: <AlertCircle size={18} />, color: 'amber' as const, trend: -8.2, sub: 'Need attention' },
          { title: 'Constituencies Active', value: kpiSummary.constituenciesActive, icon: <MapPin size={18} />, color: 'blue' as const, sub: `of 234 total` },
          { title: 'Growth %', value: `${kpiSummary.growthPercent}%`, icon: <TrendingUp size={18} />, color: 'emerald' as const, trend: 3.2, sub: 'Month over month' },
        ].map((kpi) => (
          <motion.div
            key={kpi.title}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* Map + Right Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-4">
        {/* Map — 6 cols */}
        <Card className="xl:col-span-6 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900 text-base">Tamil Nadu — District Heat Map</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedDistrict ? `Viewing: ${selectedDistrict.name} — click another district` : 'Click a district to explore'}
              </p>
            </div>
            <div className="flex gap-1.5">
              {(['supporters','missions','peopleHelped'] as const).map(k => (
                <button
                  key={k}
                  onClick={() => setColorBy(k)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${colorBy === k ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {k === 'supporters' ? 'Supporters' : k === 'missions' ? 'Missions' : 'Helped'}
                </button>
              ))}
            </div>
          </div>
          <TNMap
            colorBy={colorBy}
            onDistrictClick={(d) => {
              setSelectedDistrict(d)
              navigate('/organization/districts')
            }}
            height={660}
          />
        </Card>

        {/* Right panels — 4 cols */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Top Districts */}
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Top 5 Districts</h3>
            <div className="space-y-2">
              {topDistricts.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800 truncate">{d.name}</span>
                      <span className="text-xs font-bold text-gray-900">{formatNumber(d.supporters)}</span>
                    </div>
                    <div className="mt-0.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${(d.supporters / topDistricts[0].supporters) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Constituencies */}
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Top Constituencies</h3>
            <div className="space-y-2">
              {topConstituencies.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${i === 0 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-800 truncate">{c.name}</span>
                      <span className="text-xs font-bold text-gray-700">{formatNumber(c.supporters)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{districts.find(d => d.id === c.districtId)?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Leaders */}
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
              <Crown size={14} className="text-amber-500" /> Top Leaders
            </h3>
            <div className="space-y-2.5">
              {leaderboard.slice(0, 4).map((l) => (
                <div key={l.id} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {l.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-800 truncate">{l.name}</span>
                      <Badge variant="blue" className="text-[10px] px-1.5">{formatNumber(l.sevaiPoints)} pts</Badge>
                    </div>
                    <span className="text-[10px] text-gray-400">{l.constituency}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Activity Feed + Attention Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-4">
        <Card className="xl:col-span-4 p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Activity size={15} className="text-blue-500" /> Latest Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((a) => {
              const cfg = activityIcons[a.type]
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <cfg.icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-tight">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.subtitle} · {a.time}</p>
                  </div>
                  {a.meta && <Badge variant="emerald" className="flex-shrink-0 text-[10px]">{a.meta}</Badge>}
                </motion.div>
              )
            })}
          </div>
        </Card>

        {/* Attention panel */}
        <Card className="xl:col-span-3 p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-500" /> Needs Attention
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={13} className="text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Pending Approvals</span>
                <Badge variant="amber">24</Badge>
              </div>
              <p className="text-xs text-amber-600">14 supporter, 8 leader, 2 mission proofs</p>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={13} className="text-red-600" />
                <span className="text-xs font-semibold text-red-700">SLA Breached</span>
                <Badge variant="red">7</Badge>
              </div>
              <p className="text-xs text-red-500">Blood donation requests overdue</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={13} className="text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Verification Pending</span>
                <Badge variant="blue">18</Badge>
              </div>
              <p className="text-xs text-blue-500">Mission proofs awaiting review</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={13} className="text-gray-600" />
                <span className="text-xs font-semibold text-gray-700">Low Growth Alert</span>
              </div>
              <p className="text-xs text-gray-500">Ariyalur, Perambalur below 5% growth</p>
            </div>
          </div>
        </Card>

        {/* Fast growth */}
        <Card className="xl:col-span-3 p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-emerald-500" /> Fastest Growing
          </h3>
          <div className="space-y-2.5">
            {topByGrowth.map((d, i) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800 truncate">{d.name}</span>
                    <span className="text-xs font-bold text-emerald-600">+{d.growth}%</span>
                  </div>
                  <div className="mt-0.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(d.growth / topByGrowth[0].growth) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Supporter Growth — 2024</h3>
          <AreaChart
            data={monthlyGrowth}
            xKey="month"
            series={[{ key: 'supporters', label: 'New Supporters', color: '#2563eb' }]}
            height={200}
          />
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">People Helped Per Month</h3>
          <AreaChart
            data={monthlyGrowth}
            xKey="month"
            series={[{ key: 'peopleHelped', label: 'People Helped', color: '#10b981' }]}
            height={200}
          />
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Help Requests — Raised vs Resolved</h3>
          <AreaChart
            data={helpData}
            xKey="month"
            series={[
              { key: 'Raised', label: 'Raised', color: '#f59e0b' },
              { key: 'Resolved', label: 'Resolved', color: '#10b981' },
            ]}
            height={200}
          />
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Top 10 Districts by Supporters</h3>
          <BarChart
            data={[...districts].sort((a, b) => b.supporters - a.supporters).slice(0, 10).map(d => ({ name: d.name.slice(0, 10), supporters: d.supporters }))}
            xKey="name"
            yKey="supporters"
            height={200}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Missions Completed Per Month</h3>
          <BarChart
            data={monthlyGrowth}
            xKey="month"
            yKey="missions"
            color="#8b5cf6"
            height={200}
          />
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Top Constituencies by Growth</h3>
          <BarChart
            data={districts.flatMap(d => d.constituencies).sort((a, b) => b.growthPercentage - a.growthPercentage).slice(0, 10).map(c => ({ name: c.name.slice(0, 12), growth: c.growthPercentage }))}
            xKey="name"
            yKey="growth"
            color="#10b981"
            height={200}
          />
        </Card>
      </div>
    </div>
  )
}
