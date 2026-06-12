import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Download,
  Filter,
} from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import AreaChart from '@/components/charts/AreaChart'
import { supporters, monthlyGrowth, type Supporter } from '@/data/mockData'
import { districts } from '@/data/tamilnadu'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

const roleConfig: Record<Supporter['role'], { label: string; variant: 'gray' | 'blue' | 'violet' | 'emerald' }> = {
  supporter: { label: 'Supporter', variant: 'gray' },
  squad_leader: { label: 'Squad Leader', variant: 'blue' },
  cluster_leader: { label: 'Cluster Leader', variant: 'violet' },
  constituency_leader: { label: 'Constituency Leader', variant: 'emerald' },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function SupportersPage() {
  const [search, setSearch] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [constituencyFilter, setConstituencyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)

  const districtOptions = useMemo(
    () => [
      { label: 'All Districts', value: 'all' },
      ...districts.map(d => ({ label: d.name, value: d.name })),
    ],
    []
  )

  const constituencyOptions = useMemo(() => {
    if (districtFilter === 'all') return [{ label: 'All Constituencies', value: 'all' }]
    const dist = districts.find(d => d.name === districtFilter)
    return [
      { label: 'All Constituencies', value: 'all' },
      ...(dist?.constituencies.map(c => ({ label: c.name, value: c.name })) ?? []),
    ]
  }, [districtFilter])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return supporters.filter(s => {
      if (q && !s.name.toLowerCase().includes(q) && !s.district.toLowerCase().includes(q) && !s.constituency.toLowerCase().includes(q)) return false
      if (districtFilter !== 'all' && s.district !== districtFilter) return false
      if (constituencyFilter !== 'all' && s.constituency !== constituencyFilter) return false
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      if (roleFilter !== 'all' && s.role !== roleFilter) return false
      return true
    })
  }, [search, districtFilter, constituencyFilter, statusFilter, roleFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = useMemo(() => ({
    total: supporters.length,
    active: supporters.filter(s => s.status === 'active').length,
    pending: supporters.filter(s => s.status === 'pending').length,
    growth: 18.4,
  }), [])

  const handleDistrictChange = (val: string) => {
    setDistrictFilter(val)
    setConstituencyFilter('all')
    setPage(1)
  }

  const growthData = monthlyGrowth.map(m => ({
    month: m.month,
    supporters: m.supporters,
  }))

  const columns = [
    {
      key: 'name',
      header: 'Supporter',
      render: (row: Supporter) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getInitials(row.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
            <p className="text-xs text-gray-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'district',
      header: 'District',
      render: (row: Supporter) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {row.district}
        </div>
      ),
    },
    {
      key: 'constituency',
      header: 'Constituency',
      render: (row: Supporter) => <span className="text-sm text-gray-600">{row.constituency}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      render: (row: Supporter) => {
        const cfg = roleConfig[row.role]
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>
      },
    },
    {
      key: 'sevaiPoints',
      header: 'Sevai Points',
      render: (row: Supporter) => (
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold text-gray-900 text-sm">{row.sevaiPoints.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'missionsCount',
      header: 'Missions',
      render: (row: Supporter) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
          {row.missionsCount}
        </span>
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (row: Supporter) => (
        <span className="text-sm text-gray-500">
          {new Date(row.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Supporter) => <StatusBadge status={row.status} />,
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
          <h1 className="text-2xl font-bold text-gray-900">Supporters</h1>
          <p className="text-sm text-gray-500 mt-0.5">Directory of all movement supporters across Tamil Nadu</p>
        </div>
        <Button icon={<Download className="w-4 h-4" />} variant="secondary" size="sm">
          Export CSV
        </Button>
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
            title="Total Supporters"
            value={stats.total.toLocaleString()}
            sub="All roles"
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Active"
            value={stats.active.toLocaleString()}
            sub={`${((stats.active / stats.total) * 100).toFixed(0)}% of total`}
            icon={<UserCheck className="w-5 h-5" />}
            color="emerald"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Pending Approval"
            value={stats.pending.toLocaleString()}
            sub="Awaiting review"
            icon={<Clock className="w-5 h-5" />}
            color="amber"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Monthly Growth"
            value={`+${stats.growth}%`}
            sub="vs. last month"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={stats.growth}
            color="violet"
          />
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] max-w-xs">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="Search by name, district…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <Select
              value={districtFilter}
              onChange={handleDistrictChange}
              options={districtOptions}
              className="min-w-[160px]"
            />
            <Select
              value={constituencyFilter}
              onChange={v => { setConstituencyFilter(v); setPage(1) }}
              options={constituencyOptions}
              className="min-w-[180px]"
            />
            <Select
              value={roleFilter}
              onChange={v => { setRoleFilter(v); setPage(1) }}
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Supporter', value: 'supporter' },
                { label: 'Squad Leader', value: 'squad_leader' },
                { label: 'Cluster Leader', value: 'cluster_leader' },
                { label: 'Constituency Leader', value: 'constituency_leader' },
              ]}
              className="min-w-[160px]"
            />
            <Select
              value={statusFilter}
              onChange={v => { setStatusFilter(v); setPage(1) }}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Pending', value: 'pending' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              className="min-w-[130px]"
            />
            {(search || districtFilter !== 'all' || statusFilter !== 'all' || roleFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setDistrictFilter('all')
                  setConstituencyFilter('all')
                  setStatusFilter('all')
                  setRoleFilter('all')
                  setPage(1)
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                {filtered.length.toLocaleString()} supporters
              </span>
              {filtered.length !== supporters.length && (
                <span className="text-xs text-gray-400">(filtered from {supporters.length})</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              Page {page} of {totalPages || 1}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${districtFilter}-${statusFilter}-${roleFilter}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Table
                columns={columns as any}
                data={paginated as any}
                keyField="id"
              />
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="px-5 py-4 flex items-center justify-between border-t border-gray-50">
            <p className="text-xs text-gray-400">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                if (pageNum > totalPages) return null
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-semibold transition-all',
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.28 }}
      >
        <Card className="p-5">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900">Supporter Growth</h2>
            <p className="text-xs text-gray-400 mt-0.5">Monthly new supporter count over the past year</p>
          </div>
          <AreaChart
            data={growthData as any}
            xKey="month"
            series={[
              { key: 'supporters', label: 'Supporters', color: '#2563eb' },
            ]}
            height={220}
          />
        </Card>
      </motion.div>
    </div>
  )
}
