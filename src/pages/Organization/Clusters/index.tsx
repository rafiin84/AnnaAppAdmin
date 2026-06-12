import { useState, useMemo, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Network, Users, Layers, Award, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Input'
import {
  districts,
  getAllClusters,
  getAllSquads,
  getAllConstituencies,
  Cluster,
  Squad,
  Constituency,
} from '@/data/tamilnadu'
import { formatNumber, cn } from '@/lib/utils'

// ─── Build enriched cluster list ─────────────────────────────────────────────

interface EnrichedCluster extends Cluster {
  constituencyId: string
  constituencyName: string
  districtName: string
}

function buildEnrichedClusters(): EnrichedCluster[] {
  const result: EnrichedCluster[] = []
  for (const district of districts) {
    for (const constituency of district.constituencies) {
      for (const cluster of constituency.clusters) {
        result.push({
          ...cluster,
          constituencyId: constituency.id,
          constituencyName: constituency.name,
          districtName: district.name,
        })
      }
    }
  }
  return result
}

// ─── Squad card grid inside expansion ────────────────────────────────────────

interface SquadGridProps {
  squads: Squad[]
  clusterName: string
}

function SquadGrid({ squads, clusterName }: SquadGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="mx-4 mb-4 bg-violet-50/60 border border-violet-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{clusterName} — Squads</h3>
            <p className="text-xs text-gray-500 mt-0.5">{squads.length} squads in this cluster</p>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>
              <span className="font-semibold text-gray-800">
                {squads.reduce((s, sq) => s + sq.members, 0)}
              </span>{' '}
              total members
            </span>
            <span>
              <span className="font-semibold text-gray-800">
                {squads.reduce((s, sq) => s + sq.missions, 0)}
              </span>{' '}
              total missions
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {squads.map(squad => (
            <div
              key={squad.id}
              className="bg-white rounded-xl border border-violet-100 p-3 hover:border-violet-300 hover:shadow-sm transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold mb-2">
                {squad.name.replace('Squad ', '')}
              </div>
              <p className="text-xs font-semibold text-gray-900 truncate">{squad.name}</p>
              <p className="text-xs text-gray-400 truncate mb-2">{squad.leader}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  <span className="font-bold text-violet-700">{squad.members}</span> members
                </span>
                <span className="text-xs text-gray-500">
                  <span className="font-bold text-emerald-600">{squad.missions}</span> missions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ClustersPage() {
  const [search, setSearch] = useState('')
  const [constituencyFilter, setConstituencyFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const enrichedClusters = useMemo(() => buildEnrichedClusters(), [])
  const allSquads = useMemo(() => getAllSquads(), [])
  const allConstituencies = useMemo(() => getAllConstituencies(), [])

  // KPI stats
  const totalClusters = enrichedClusters.length
  const totalSquads = allSquads.length
  const avgMembers = Math.round(
    allSquads.reduce((s, sq) => s + sq.members, 0) / (allSquads.length || 1)
  )
  const topCluster = useMemo(
    () => [...enrichedClusters].sort((a, b) => b.supporters - a.supporters)[0],
    [enrichedClusters]
  )

  const constituencyOptions = useMemo(() => [
    { label: 'All Constituencies', value: 'all' },
    ...allConstituencies.map(c => ({ label: c.name, value: c.id })),
  ], [allConstituencies])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return enrichedClusters.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q) ||
        c.leader.toLowerCase().includes(q) ||
        c.constituencyName.toLowerCase().includes(q)
      const matchConst = constituencyFilter === 'all' || c.constituencyId === constituencyFilter
      return matchSearch && matchConst
    })
  }, [enrichedClusters, search, constituencyFilter])

  const maxSupporters = enrichedClusters.reduce((m, c) => Math.max(m, c.supporters), 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clusters</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ground-level clusters across all constituencies</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Clusters"
          value={formatNumber(totalClusters)}
          sub="Across Tamil Nadu"
          icon={<Network className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Total Squads"
          value={formatNumber(totalSquads)}
          sub="Active field units"
          icon={<Layers className="w-5 h-5" />}
          color="violet"
        />
        <KPICard
          title="Avg Members / Cluster"
          value={avgMembers}
          sub="Per cluster average"
          icon={<Users className="w-5 h-5" />}
          color="emerald"
        />
        <KPICard
          title="Top Cluster"
          value={topCluster?.name ?? '—'}
          sub={topCluster ? `${formatNumber(topCluster.supporters)} supporters` : ''}
          icon={<Award className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Table card */}
      <Card className="overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] max-w-sm">
            <Input
              placeholder="Search clusters, locality, leader…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={constituencyFilter}
            onChange={val => setConstituencyFilter(val)}
            options={constituencyOptions}
            className="min-w-[180px]"
          />
          <p className="text-xs text-gray-400 ml-auto">
            {filtered.length} of {totalClusters} clusters
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Cluster</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Locality</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Constituency</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Leader</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Squads</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Supporters</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Missions</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">People Helped</th>
                <th className="w-10 py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(cluster => (
                <Fragment key={cluster.id}>
                  <tr
                    onClick={() => setExpandedId(prev => (prev === cluster.id ? null : cluster.id))}
                    className={cn(
                      'border-b border-gray-50 hover:bg-violet-50/40 transition-colors cursor-pointer',
                      expandedId === cluster.id && 'bg-violet-50/30'
                    )}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {cluster.locality.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{cluster.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{cluster.locality}</td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{cluster.constituencyName}</p>
                        <p className="text-xs text-gray-400">{cluster.districtName}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{cluster.leader}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-bold">
                        {cluster.squads.length}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="min-w-[100px]">
                        <span className="font-bold text-blue-700 text-sm">{formatNumber(cluster.supporters)}</span>
                        <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
                            style={{ width: `${(cluster.supporters / maxSupporters) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">{cluster.missions}</td>
                    <td className="py-3.5 px-4 text-gray-700">{formatNumber(cluster.peopleHelped)}</td>
                    <td className="py-3.5 px-4">
                      <button
                        className="p-1.5 rounded-lg hover:bg-violet-100 text-gray-400 hover:text-violet-600 transition-colors"
                        onClick={e => {
                          e.stopPropagation()
                          setExpandedId(prev => (prev === cluster.id ? null : cluster.id))
                        }}
                      >
                        {expandedId === cluster.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  <tr className="border-0">
                    <td colSpan={9} className="p-0 border-0">
                      <AnimatePresence>
                        {expandedId === cluster.id && (
                          <SquadGrid squads={cluster.squads} clusterName={cluster.name} />
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
            <Network className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No clusters match the current filters</p>
          </div>
        )}
      </Card>
    </div>
  )
}
