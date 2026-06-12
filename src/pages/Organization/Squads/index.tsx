import { useState, useMemo } from 'react'
import { Shield, Users, Target, Zap, Search } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import BarChart from '@/components/charts/BarChart'
import { districts } from '@/data/tamilnadu'
import { formatNumber, cn } from '@/lib/utils'

// ─── Build flat squad list with parent context ────────────────────────────────

interface FlatSquad {
  id: string
  name: string
  leader: string
  members: number
  missions: number
  clusterName: string
  clusterId: string
  constituencyName: string
  districtName: string
}

function buildFlatSquads(): FlatSquad[] {
  const result: FlatSquad[] = []
  for (const district of districts) {
    for (const constituency of district.constituencies) {
      for (const cluster of constituency.clusters) {
        for (const squad of cluster.squads) {
          result.push({
            id: squad.id,
            name: squad.name,
            leader: squad.leader,
            members: squad.members,
            missions: squad.missions,
            clusterName: cluster.name,
            clusterId: cluster.id,
            constituencyName: constituency.name,
            districtName: district.name,
          })
        }
      }
    }
  }
  return result
}

// ─── District squad breakdown sub-component ──────────────────────────────────

function DistrictSquadBreakdown({ flatSquads }: { flatSquads: FlatSquad[] }) {
  const distEntries = useMemo(() => {
    const distMap: Record<string, number> = {}
    flatSquads.forEach(sq => {
      distMap[sq.districtName] = (distMap[sq.districtName] ?? 0) + 1
    })
    return Object.entries(distMap).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [flatSquads])

  const maxCount = distEntries[0]?.[1] ?? 1

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Squads by District (Top 8)</p>
      <div className="space-y-2">
        {distEntries.map(([name, count]) => (
          <div key={name} className="flex items-center gap-3">
            <p className="text-xs text-gray-700 w-28 truncate font-medium">{name}</p>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-700 w-8 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SquadsPage() {
  const [search, setSearch] = useState('')

  const flatSquads = useMemo(() => buildFlatSquads(), [])

  // KPI stats
  const totalSquads = flatSquads.length
  const totalMembers = useMemo(
    () => flatSquads.reduce((s, sq) => s + sq.members, 0),
    [flatSquads]
  )
  const avgMissions = useMemo(
    () =>
      parseFloat(
        (flatSquads.reduce((s, sq) => s + sq.missions, 0) / (flatSquads.length || 1)).toFixed(1)
      ),
    [flatSquads]
  )
  const activeSquads = useMemo(
    () => flatSquads.filter(sq => sq.missions >= 5).length,
    [flatSquads]
  )

  // Top 10 squads by members for bar chart
  const top10ByMembers = useMemo(
    () =>
      [...flatSquads]
        .sort((a, b) => b.members - a.members)
        .slice(0, 10)
        .map(sq => ({
          name: `${sq.name} (${sq.clusterName.replace(' Cluster', '')})`,
          members: sq.members,
        })),
    [flatSquads]
  )

  // Filtered table data
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return flatSquads.filter(
      sq =>
        sq.name.toLowerCase().includes(q) ||
        sq.leader.toLowerCase().includes(q) ||
        sq.clusterName.toLowerCase().includes(q) ||
        sq.constituencyName.toLowerCase().includes(q) ||
        sq.districtName.toLowerCase().includes(q)
    )
  }, [flatSquads, search])

  const columns = [
    {
      key: 'name',
      header: 'Squad',
      render: (row: FlatSquad & Record<string, unknown>) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(row.name as string).replace('Squad ', '')}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{row.name as string}</p>
            <p className="text-xs text-gray-400">{row.leader as string}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'clusterName',
      header: 'Cluster',
      render: (row: FlatSquad & Record<string, unknown>) => (
        <span className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
          {row.clusterName as string}
        </span>
      ),
    },
    {
      key: 'constituencyName',
      header: 'Constituency',
      render: (row: FlatSquad & Record<string, unknown>) => (
        <span className="text-xs text-gray-700">{row.constituencyName as string}</span>
      ),
    },
    {
      key: 'districtName',
      header: 'District',
      render: (row: FlatSquad & Record<string, unknown>) => (
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {row.districtName as string}
        </span>
      ),
    },
    {
      key: 'leader',
      header: 'Leader',
      render: (row: FlatSquad & Record<string, unknown>) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
            {(row.leader as string).charAt(0)}
          </div>
          <span className="text-xs text-gray-700">{row.leader as string}</span>
        </div>
      ),
    },
    {
      key: 'members',
      header: 'Members',
      render: (row: FlatSquad & Record<string, unknown>) => {
        const members = row.members as number
        const maxM = 20
        return (
          <div className="min-w-[80px]">
            <span className="font-bold text-emerald-700">{members}</span>
            <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full',
                  members >= 16 ? 'bg-emerald-500' : members >= 12 ? 'bg-blue-500' : 'bg-gray-400'
                )}
                style={{ width: `${Math.min((members / maxM) * 100, 100)}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      key: 'missions',
      header: 'Missions',
      render: (row: FlatSquad & Record<string, unknown>) => {
        const missions = row.missions as number
        return (
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold',
              missions >= 8
                ? 'bg-emerald-50 text-emerald-700'
                : missions >= 5
                ? 'bg-blue-50 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {missions}
          </span>
        )
      },
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Squads</h1>
        <p className="text-sm text-gray-500 mt-0.5">All field squads across Tamil Nadu</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Squads"
          value={formatNumber(totalSquads)}
          sub="Active field units"
          icon={<Shield className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Total Members"
          value={formatNumber(totalMembers)}
          sub="Across all squads"
          icon={<Users className="w-5 h-5" />}
          color="emerald"
        />
        <KPICard
          title="Avg Missions / Squad"
          value={avgMissions}
          sub="Per squad average"
          icon={<Target className="w-5 h-5" />}
          color="violet"
        />
        <KPICard
          title="Active Squads"
          value={formatNumber(activeSquads)}
          sub="5+ missions completed"
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Top 10 chart + table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar chart */}
        <Card className="p-5 xl:col-span-1">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900">Top 10 Squads by Members</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ranked by total member count</p>
          </div>
          <BarChart
            data={top10ByMembers}
            xKey="name"
            yKey="members"
            color="#2563eb"
            height={300}
            horizontal
          />
        </Card>

        {/* Quick stats */}
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900">Squad Distribution</h2>
            <p className="text-xs text-gray-400 mt-0.5">Member count breakdown</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              {
                label: 'Large (16–20)',
                count: flatSquads.filter(s => s.members >= 16).length,
                color: 'emerald',
              },
              {
                label: 'Medium (12–15)',
                count: flatSquads.filter(s => s.members >= 12 && s.members < 16).length,
                color: 'blue',
              },
              {
                label: 'Small (8–11)',
                count: flatSquads.filter(s => s.members < 12).length,
                color: 'gray',
              },
            ].map(group => (
              <div key={group.label} className={cn(
                'rounded-xl p-4 text-center border',
                group.color === 'emerald' ? 'bg-emerald-50 border-emerald-100'
                  : group.color === 'blue' ? 'bg-blue-50 border-blue-100'
                  : 'bg-gray-50 border-gray-200'
              )}>
                <p className={cn(
                  'text-2xl font-bold',
                  group.color === 'emerald' ? 'text-emerald-700'
                    : group.color === 'blue' ? 'text-blue-700'
                    : 'text-gray-600'
                )}>
                  {group.count}
                </p>
                <p className="text-xs text-gray-500 mt-1">{group.label}</p>
                <p className="text-xs font-semibold text-gray-400 mt-0.5">
                  {((group.count / totalSquads) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
          {/* Top district breakdown */}
          <DistrictSquadBreakdown flatSquads={flatSquads} />
        </Card>
      </div>

      {/* Full table card */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] max-w-sm">
            <Input
              placeholder="Search squads, leaders, clusters…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <p className="text-xs text-gray-400 ml-auto">
            {filtered.length} of {totalSquads} squads
          </p>
        </div>

        <Table<FlatSquad & Record<string, unknown>>
          columns={columns as any}
          data={filtered as any[]}
          keyField="id"
        />

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No squads match "{search}"</p>
          </div>
        )}
      </Card>
    </div>
  )
}
