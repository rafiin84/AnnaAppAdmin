import { useState, useMemo, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Users, TrendingUp, Star, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { districts, getAllConstituencies, Constituency, Cluster } from '@/data/tamilnadu'
import { formatNumber, cn } from '@/lib/utils'

const PAGE_SIZE = 20

function growthVariant(g: number): 'emerald' | 'blue' | 'gray' {
  if (g > 15) return 'emerald'
  if (g > 5) return 'blue'
  return 'gray'
}

// ─── Expanded cluster mini-table ──────────────────────────────────────────────

interface ClusterExpansionProps {
  clusters: Cluster[]
  constituencyName: string
}

function ClusterExpansion({ clusters, constituencyName }: ClusterExpansionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="mx-4 mb-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{constituencyName} — Clusters</h3>
            <p className="text-xs text-gray-500 mt-0.5">{clusters.length} clusters</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Cluster</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Leader</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Squads</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Supporters</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Missions</th>
                </tr>
              </thead>
              <tbody>
                {clusters.map(cluster => (
                  <tr key={cluster.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-xs">{cluster.name}</p>
                        <p className="text-xs text-gray-400">{cluster.locality}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">{cluster.leader}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        {cluster.squads.length}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-blue-700">{formatNumber(cluster.supporters)}</td>
                    <td className="py-3 px-4 text-xs text-gray-600">{cluster.missions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ConstituenciesPage() {
  const [search, setSearch] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const allConstituencies = useMemo(() => getAllConstituencies(), [])

  const totalActive = useMemo(
    () => allConstituencies.filter(c => c.supporters > 5000).length,
    [allConstituencies]
  )
  const avgSupporters = useMemo(
    () => Math.round(allConstituencies.reduce((s, c) => s + c.supporters, 0) / allConstituencies.length),
    [allConstituencies]
  )
  const avgGrowth = useMemo(
    () => parseFloat((allConstituencies.reduce((s, c) => s + c.growthPercentage, 0) / allConstituencies.length).toFixed(1)),
    [allConstituencies]
  )

  const districtOptions = useMemo(() => [
    { label: 'All Districts', value: 'all' },
    ...districts.map(d => ({ label: d.name, value: d.id })),
  ], [])

  // Sort by supporters desc and add rank
  const ranked = useMemo(
    () =>
      [...allConstituencies]
        .sort((a, b) => b.supporters - a.supporters)
        .map((c, i) => ({ ...c, rank: i + 1 })),
    [allConstituencies]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ranked.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(q)
      const matchDistrict = districtFilter === 'all' || c.districtId === districtFilter
      return matchSearch && matchDistrict
    })
  }, [ranked, search, districtFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page when filters change
  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }
  const handleDistrict = (val: string) => {
    setDistrictFilter(val)
    setPage(1)
  }

  // Lookup district name helper
  const districtName = (id: string) =>
    districts.find(d => d.id === id)?.name ?? id

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Constituencies</h1>
        <p className="text-sm text-gray-500 mt-0.5">All 234 Tamil Nadu assembly constituencies</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Constituencies"
          value={allConstituencies.length}
          sub="Across 38 districts"
          icon={<Building2 className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Active"
          value={totalActive}
          sub="Supporters > 5,000"
          icon={<Star className="w-5 h-5" />}
          color="emerald"
        />
        <KPICard
          title="Avg Supporters"
          value={formatNumber(avgSupporters)}
          sub="Per constituency"
          icon={<Users className="w-5 h-5" />}
          color="violet"
        />
        <KPICard
          title="Avg Growth"
          value={`${avgGrowth}%`}
          sub="Across all"
          icon={<TrendingUp className="w-5 h-5" />}
          color="amber"
          trend={avgGrowth}
        />
      </div>

      {/* Main table card */}
      <Card className="overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] max-w-sm">
            <Input
              placeholder="Search constituencies…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={districtFilter}
            onChange={handleDistrict}
            options={districtOptions}
            className="min-w-[160px]"
          />
          <p className="text-xs text-gray-400 ml-auto">
            {filtered.length} constituencies
          </p>
        </div>

        {/* Table with expansion */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide w-12">#</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Constituency</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">District</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Supporters</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Leaders</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Missions</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">People Helped</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sevai Points</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Growth</th>
                <th className="w-10 py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {paged.map(row => (
                <Fragment key={row.id}>
                  <tr
                    onClick={() => setExpandedId(prev => (prev === row.id ? null : row.id))}
                    className={cn(
                      'border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer',
                      expandedId === row.id && 'bg-blue-50/30'
                    )}
                  >
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                        row.rank === 1 ? 'bg-amber-100 text-amber-700'
                          : row.rank <= 5 ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      )}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-900">{row.name}</p>
                      <p className="text-xs text-gray-400">{row.clusters.length} clusters</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="blue">{districtName(row.districtId)}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-700">{formatNumber(row.supporters)}</td>
                    <td className="py-3.5 px-4 text-gray-700">{row.leaders}</td>
                    <td className="py-3.5 px-4 text-gray-700">{row.missionsCompleted}</td>
                    <td className="py-3.5 px-4 text-gray-700">{formatNumber(row.peopleHelped)}</td>
                    <td className="py-3.5 px-4 font-medium text-violet-700">{formatNumber(row.sevaiPoints)}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={growthVariant(row.growthPercentage)}>
                        +{row.growthPercentage}%
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
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
                    </td>
                  </tr>
                  <tr key={`${row.id}-exp`} className="border-0">
                    <td colSpan={10} className="p-0 border-0">
                      <AnimatePresence>
                        {expandedId === row.id && (
                          <ClusterExpansion
                            clusters={row.clusters}
                            constituencyName={row.name}
                          />
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {paged.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No constituencies match the current filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                icon={<ChevronLeft className="w-3.5 h-3.5" />}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-semibold transition-colors',
                      p === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    {p}
                  </button>
                )
              })}
              {totalPages > 7 && <span className="text-gray-400 text-xs px-1">…</span>}
              <Button
                variant="ghost"
                size="sm"
                icon={<ChevronRight className="w-3.5 h-3.5" />}
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
