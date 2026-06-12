import { useState, useMemo, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users, Target, Heart, TrendingUp, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import { districts, District, Constituency } from '@/data/tamilnadu'
import { formatNumber, cn } from '@/lib/utils'

// ─── helpers ─────────────────────────────────────────────────────────────────

function growthVariant(g: number): 'emerald' | 'blue' | 'gray' {
  if (g > 15) return 'emerald'
  if (g > 5) return 'blue'
  return 'gray'
}

// ─── Expanded district detail panel ──────────────────────────────────────────

interface DistrictDetailProps {
  district: District
}

function DistrictDetail({ district }: DistrictDetailProps) {
  const sorted = [...district.constituencies].sort((a, b) => b.supporters - a.supporters)

  const constituencyColumns = [
    {
      key: 'name',
      header: 'Constituency',
      render: (row: Constituency) => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      key: 'supporters',
      header: 'Supporters',
      render: (row: Constituency) => (
        <span className="font-semibold text-blue-700">{formatNumber(row.supporters)}</span>
      ),
    },
    {
      key: 'missionsCompleted',
      header: 'Missions',
      render: (row: Constituency) => (
        <span className="text-gray-700">{row.missionsCompleted}</span>
      ),
    },
    {
      key: 'growthPercentage',
      header: 'Growth',
      render: (row: Constituency) => (
        <Badge variant={growthVariant(row.growthPercentage)}>
          +{row.growthPercentage}%
        </Badge>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="mx-4 mb-4 bg-blue-50/60 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{district.name} — Constituencies</h3>
            <p className="text-xs text-gray-500 mt-0.5">{district.constituencies.length} constituencies • Sorted by supporters</p>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span><span className="font-semibold text-gray-800">{formatNumber(district.supporters)}</span> total supporters</span>
            <span><span className="font-semibold text-gray-800">{formatNumber(district.peopleHelped)}</span> people helped</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
          <Table<Constituency & Record<string, unknown>>
            columns={constituencyColumns as any}
            data={sorted as any[]}
            keyField="id"
          />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface DistrictRow extends District {
  rank: number
}

export default function DistrictsPage() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const totalSupporters = districts.reduce((s, d) => s + d.supporters, 0)
  const totalMissions = districts.reduce((s, d) => s + d.missions, 0)
  const totalPeopleHelped = districts.reduce((s, d) => s + d.peopleHelped, 0)

  const sortedDistricts = useMemo(
    () => [...districts].sort((a, b) => b.supporters - a.supporters),
    []
  )

  const maxSupporters = sortedDistricts[0]?.supporters ?? 1

  const rankedDistricts: DistrictRow[] = useMemo(
    () => sortedDistricts.map((d, i) => ({ ...d, rank: i + 1 })),
    [sortedDistricts]
  )

  const filtered = useMemo(
    () =>
      rankedDistricts.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
      ),
    [rankedDistricts, search]
  )

  const columns = [
    {
      key: 'rank',
      header: '#',
      render: (row: DistrictRow) => (
        <span className={cn(
          'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
          row.rank === 1
            ? 'bg-amber-100 text-amber-700'
            : row.rank <= 3
            ? 'bg-blue-50 text-blue-700'
            : 'bg-gray-100 text-gray-500'
        )}>
          {row.rank}
        </span>
      ),
      className: 'w-12',
    },
    {
      key: 'name',
      header: 'District',
      render: (row: DistrictRow) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {row.id.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
            <p className="text-xs text-gray-400">{row.constituencies.length} constituencies</p>
          </div>
        </div>
      ),
    },
    {
      key: 'constituencies',
      header: 'Constituencies',
      render: (row: DistrictRow) => (
        <span className="font-medium text-gray-700">{row.constituencies.length}</span>
      ),
    },
    {
      key: 'supporters',
      header: 'Supporters',
      render: (row: DistrictRow) => (
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-blue-700 text-sm">{formatNumber(row.supporters)}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
              style={{ width: `${(row.supporters / maxSupporters) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'leaders',
      header: 'Leaders',
      render: (row: DistrictRow) => (
        <span className="font-medium text-gray-700">{formatNumber(row.leaders)}</span>
      ),
    },
    {
      key: 'missions',
      header: 'Missions',
      render: (row: DistrictRow) => (
        <span className="font-medium text-gray-700">{formatNumber(row.missions)}</span>
      ),
    },
    {
      key: 'peopleHelped',
      header: 'People Helped',
      render: (row: DistrictRow) => (
        <span className="font-medium text-gray-700">{formatNumber(row.peopleHelped)}</span>
      ),
    },
    {
      key: 'growth',
      header: 'Growth',
      render: (row: DistrictRow) => (
        <Badge variant={growthVariant(row.growth)}>
          <TrendingUp className="w-3 h-3" />
          +{row.growth}%
        </Badge>
      ),
    },
    {
      key: 'expand',
      header: '',
      render: (row: DistrictRow) => (
        <button
          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
          onClick={e => {
            e.stopPropagation()
            setExpandedId(prev => (prev === row.id ? null : row.id))
          }}
        >
          {expandedId === row.id ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      ),
      className: 'w-12 text-right',
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Districts</h1>
          <p className="text-sm text-gray-500 mt-0.5">All 38 Tamil Nadu districts and their performance</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Districts"
          value={districts.length}
          sub="Tamil Nadu"
          icon={<MapPin className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Total Supporters"
          value={formatNumber(totalSupporters)}
          sub="Across all districts"
          icon={<Users className="w-5 h-5" />}
          color="emerald"
        />
        <KPICard
          title="Total Missions"
          value={formatNumber(totalMissions)}
          sub="Completed missions"
          icon={<Target className="w-5 h-5" />}
          color="violet"
        />
        <KPICard
          title="People Helped"
          value={formatNumber(totalPeopleHelped)}
          sub="Lives impacted"
          icon={<Heart className="w-5 h-5" />}
          color="rose"
        />
      </div>

      {/* Table card */}
      <Card className="overflow-hidden">
        {/* Search bar */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-4">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search districts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <p className="text-xs text-gray-400 ml-auto">
            {filtered.length} of {districts.length} districts
          </p>
        </div>

        {/* Table with inline expansion */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {columns.map(col => (
                  <th
                    key={col.key}
                    className={cn(
                      'text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide',
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <Fragment key={row.id}>
                  <tr
                    onClick={() => setExpandedId(prev => (prev === row.id ? null : row.id))}
                    className={cn(
                      'border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer',
                      expandedId === row.id && 'bg-blue-50/30'
                    )}
                  >
                    {columns.map(col => (
                      <td
                        key={col.key}
                        className={cn('py-3.5 px-4 text-gray-700', col.className)}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-0">
                    <td colSpan={columns.length} className="p-0 border-0">
                      <AnimatePresence>
                        {expandedId === row.id && (
                          <DistrictDetail district={row} />
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No districts match "{search}"</p>
          </div>
        )}
      </Card>
    </div>
  )
}
