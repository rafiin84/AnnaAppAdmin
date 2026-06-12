import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Crown,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Heart,
  Award,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { leaderboard, type LeaderEntry } from '@/data/mockData'
import { cn } from '@/lib/utils'

// ─── Animations ──────────────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

// ─── Badge definitions ────────────────────────────────────────────────────────
const badgeDefinitions = [
  {
    name: 'Gold Star',
    icon: <Star className="w-5 h-5 text-amber-500" />,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-700',
    description: 'Awarded to top performers with 40,000+ Sevai Points and exceptional mission records.',
  },
  {
    name: 'Silver Star',
    icon: <Star className="w-5 h-5 text-gray-400" />,
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-600',
    description: 'Recognises leaders with 25,000–40,000 Sevai Points and strong community presence.',
  },
  {
    name: 'Bronze Star',
    icon: <Star className="w-5 h-5 text-orange-400" />,
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    text: 'text-orange-600',
    description: 'Given to rising leaders with 10,000–25,000 Sevai Points.',
  },
  {
    name: 'Community Hero',
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-600',
    description: 'For leaders who have directly helped more than 3,000 people through service activities.',
  },
  {
    name: 'Mission Champion',
    icon: <Zap className="w-5 h-5 text-blue-500" />,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-700',
    description: 'Recognises those who have completed 40+ missions with verified outcomes.',
  },
  {
    name: 'Growth Leader',
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-700',
    description: 'Awarded to leaders who have recruited the most new supporters in a quarter.',
  },
]

// ─── Level thresholds ─────────────────────────────────────────────────────────
const levelThresholds = [
  { level: 'Bronze', min: 0, max: 9999, color: 'bg-orange-400', textColor: 'text-orange-600', lightBg: 'bg-orange-50', borderColor: 'border-orange-300' },
  { level: 'Silver', min: 10000, max: 19999, color: 'bg-gray-400', textColor: 'text-gray-600', lightBg: 'bg-gray-50', borderColor: 'border-gray-300' },
  { level: 'Gold', min: 20000, max: 34999, color: 'bg-amber-400', textColor: 'text-amber-600', lightBg: 'bg-amber-50', borderColor: 'border-amber-300' },
  { level: 'Platinum', min: 35000, max: 44999, color: 'bg-violet-500', textColor: 'text-violet-700', lightBg: 'bg-violet-50', borderColor: 'border-violet-300' },
  { level: 'Diamond', min: 45000, max: 50000, color: 'bg-blue-600', textColor: 'text-blue-700', lightBg: 'bg-blue-50', borderColor: 'border-blue-400' },
]

// Mock current user's sevai points
const CURRENT_USER_POINTS = 28400
const CURRENT_USER_NAME = 'Karthik Murugesan'

function getInitials(name: string) {
  return name.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
}

function ChangeCell({ change }: { change: number }) {
  if (change === 0) return <span className="flex items-center gap-1 text-gray-400 text-xs font-semibold"><Minus className="w-3 h-3" />—</span>
  if (change > 0)
    return <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><TrendingUp className="w-3 h-3" />+{change}</span>
  return <span className="flex items-center gap-1 text-red-500 text-xs font-bold"><TrendingDown className="w-3 h-3" />{change}</span>
}

// Deterministic mock rank changes
function mockChange(rank: number): number {
  const changes = [0, 2, -1, 1, 3, -2, 0, 1, -1, 4, 0, -3, 2, 1, 0, -1, 2, -2, 1, 0]
  return changes[rank % changes.length]
}

// ─── Podium Card ──────────────────────────────────────────────────────────────
function PodiumCard({ leader, position }: { leader: LeaderEntry; position: 1 | 2 | 3 }) {
  const configs = {
    1: {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100/60',
      border: 'border-amber-200',
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      label: '1st Place',
      labelColor: 'text-amber-700',
      size: 'scale-105',
      order: 'order-2',
      avatarBg: 'bg-amber-500',
      pointsColor: 'text-amber-700',
    },
    2: {
      bg: 'bg-gradient-to-br from-gray-50 to-gray-100/60',
      border: 'border-gray-200',
      icon: <Medal className="w-5 h-5 text-gray-500" />,
      label: '2nd Place',
      labelColor: 'text-gray-600',
      size: '',
      order: 'order-1',
      avatarBg: 'bg-gray-500',
      pointsColor: 'text-gray-700',
    },
    3: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100/60',
      border: 'border-orange-200',
      icon: <Award className="w-5 h-5 text-orange-500" />,
      label: '3rd Place',
      labelColor: 'text-orange-600',
      size: '',
      order: 'order-3',
      avatarBg: 'bg-orange-500',
      pointsColor: 'text-orange-700',
    },
  }
  const cfg = configs[position]

  return (
    <motion.div
      variants={item}
      className={cn('flex-1 min-w-[200px] max-w-[280px]', cfg.order)}
    >
      <div className={cn('rounded-2xl border p-5 text-center shadow-sm transition-transform', cfg.bg, cfg.border, cfg.size)}>
        <div className="flex justify-center mb-3">{cfg.icon}</div>
        <div className={cn('w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold shadow-md', cfg.avatarBg)}>
          {getInitials(leader.name)}
        </div>
        <p className={cn('text-xs font-bold uppercase tracking-wide mb-0.5', cfg.labelColor)}>{cfg.label}</p>
        <h3 className="text-base font-bold text-gray-900 leading-tight">{leader.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{leader.role}</p>
        <p className="text-xs text-gray-400 mt-0.5">{leader.district}</p>
        <div className="mt-3 pt-3 border-t border-white/60">
          <p className={cn('text-xl font-black', cfg.pointsColor)}>{leader.sevaiPoints.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Sevai Points</p>
        </div>
        <div className="mt-2">
          <Badge variant="blue" className="text-xs">{leader.badge}</Badge>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RecognitionPage() {
  const top3 = useMemo(() => leaderboard.slice(0, 3), [])
  const tableData = useMemo(() => leaderboard, [])

  // Current user level calculation
  const currentLevel = useMemo(() => {
    const found = [...levelThresholds].reverse().find(t => CURRENT_USER_POINTS >= t.min)
    return found ?? levelThresholds[0]
  }, [])

  const nextLevel = useMemo(() => {
    const idx = levelThresholds.findIndex(t => t.level === currentLevel.level)
    return idx < levelThresholds.length - 1 ? levelThresholds[idx + 1] : null
  }, [currentLevel])

  const progressPercent = useMemo(() => {
    if (!nextLevel) return 100
    const range = nextLevel.min - currentLevel.min
    const progress = CURRENT_USER_POINTS - currentLevel.min
    return Math.min(100, Math.round((progress / range) * 100))
  }, [currentLevel, nextLevel])

  const currentLevelIndex = levelThresholds.findIndex(t => t.level === currentLevel.level)

  const leaderboardColumns = [
    {
      key: 'rank',
      header: '#',
      render: (row: LeaderEntry) => {
        const change = mockChange(row.rank)
        return (
          <div className="flex items-center gap-2">
            <span className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
              row.rank === 1 ? 'bg-amber-400 text-white' :
              row.rank === 2 ? 'bg-gray-400 text-white' :
              row.rank === 3 ? 'bg-orange-400 text-white' :
              'bg-gray-100 text-gray-600'
            )}>
              {row.rank}
            </span>
            <ChangeCell change={change} />
          </div>
        )
      },
    },
    {
      key: 'name',
      header: 'Leader',
      render: (row: LeaderEntry) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getInitials(row.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
            <p className="text-xs text-gray-400">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      render: (row: LeaderEntry) => {
        const cfg = levelThresholds.find(t => t.level === row.level)
        return (
          <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', cfg?.lightBg ?? 'bg-gray-50', cfg?.textColor ?? 'text-gray-600')}>
            {row.level}
          </span>
        )
      },
    },
    {
      key: 'badge',
      header: 'Badge',
      render: (row: LeaderEntry) => (
        <Badge variant="blue" className="text-xs">{row.badge}</Badge>
      ),
    },
    {
      key: 'district',
      header: 'District',
      render: (row: LeaderEntry) => <span className="text-sm text-gray-600">{row.district}</span>,
    },
    {
      key: 'sevaiPoints',
      header: 'Sevai Points',
      render: (row: LeaderEntry) => (
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-bold text-gray-900 text-sm">{row.sevaiPoints.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'pointsChange',
      header: 'Change',
      render: (row: LeaderEntry) => <ChangeCell change={mockChange(row.rank) * 120} />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recognition</h1>
        </div>
        <p className="text-sm text-gray-500 ml-12">Sevai Points hall of fame — celebrating service excellence</p>
      </motion.div>

      {/* Podium */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-gray-900">Hall of Fame — Top 3</h2>
          </div>
          <div className="flex flex-wrap justify-center items-end gap-4">
            <PodiumCard leader={top3[1]} position={2} />
            <PodiumCard leader={top3[0]} position={1} />
            <PodiumCard leader={top3[2]} position={3} />
          </div>
        </Card>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Card>
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <h2 className="text-base font-bold text-gray-900">Full Leaderboard</h2>
              <span className="text-xs text-gray-400 ml-1">{tableData.length} leaders</span>
            </div>
          </div>
          <Table
            columns={leaderboardColumns as any}
            data={tableData as any}
            keyField="id"
          />
        </Card>
      </motion.div>

      {/* Badges Explained */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.28 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-gray-900">Badge Guide</h2>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {badgeDefinitions.map(badge => (
              <motion.div
                key={badge.name}
                variants={item}
                className={cn('rounded-xl border p-4 flex gap-3', badge.bg, badge.border)}
              >
                <div className="flex-shrink-0 mt-0.5">{badge.icon}</div>
                <div>
                  <p className={cn('text-sm font-bold', badge.text)}>{badge.name}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>

      {/* Level Progression */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-gray-900">Your Level Progression</h2>
            <span className="text-xs text-gray-400">— {CURRENT_USER_NAME}</span>
          </div>

          {/* Current level summary */}
          <div className="flex items-center gap-4 mb-6">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', currentLevel.lightBg)}>
              <Star className={cn('w-6 h-6', currentLevel.textColor)} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Current Level</p>
              <p className={cn('text-xl font-black', currentLevel.textColor)}>{currentLevel.level}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Your Points</p>
              <p className="text-xl font-black text-gray-900">{CURRENT_USER_POINTS.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={cn('text-xs font-bold', currentLevel.textColor)}>{currentLevel.level}</span>
              {nextLevel && <span className={cn('text-xs font-bold', nextLevel.textColor)}>{nextLevel.level}</span>}
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                className={cn('h-full rounded-full', currentLevel.color)}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-gray-400">{currentLevel.min.toLocaleString()} pts</span>
              {nextLevel ? (
                <span className="text-xs text-gray-500 font-semibold">
                  {(nextLevel.min - CURRENT_USER_POINTS).toLocaleString()} pts to {nextLevel.level}
                </span>
              ) : (
                <span className="text-xs text-blue-600 font-bold">Max Level Reached!</span>
              )}
              {nextLevel && <span className="text-xs text-gray-400">{nextLevel.min.toLocaleString()} pts</span>}
            </div>
          </div>

          {/* All level tiers */}
          <div className="grid grid-cols-5 gap-2">
            {levelThresholds.map((lvl, idx) => {
              const isActive = lvl.level === currentLevel.level
              const isPast = idx < currentLevelIndex
              return (
                <div
                  key={lvl.level}
                  className={cn(
                    'rounded-xl p-3 text-center border transition-all',
                    isActive
                      ? cn(lvl.lightBg, 'border-2', lvl.borderColor)
                      : isPast
                      ? 'bg-gray-50 border-gray-100 opacity-60'
                      : 'bg-white border-gray-100'
                  )}
                >
                  <div className={cn('w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center', isActive || isPast ? lvl.color : 'bg-gray-200')}>
                    <Star className={cn('w-3 h-3', isActive || isPast ? 'text-white' : 'text-gray-400')} />
                  </div>
                  <p className={cn('text-xs font-bold', isActive ? lvl.textColor : isPast ? 'text-gray-500' : 'text-gray-300')}>{lvl.level}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{lvl.min >= 1000 ? `${(lvl.min / 1000).toFixed(0)}K` : String(lvl.min)}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
