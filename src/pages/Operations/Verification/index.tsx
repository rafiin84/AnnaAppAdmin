import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Eye, ClipboardList, Heart, ShieldCheck } from 'lucide-react'
import { Card, KPICard } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { missions, helpRequests } from '@/data/mockData'
import { formatDate, formatNumber } from '@/lib/utils'

const missionTypeColors: Record<string, string> = {
  'Clean-up Drive': 'bg-emerald-50 text-emerald-700',
  'Tree Plantation': 'bg-green-50 text-green-700',
  'Medical Camp': 'bg-blue-50 text-blue-700',
  'Awareness Campaign': 'bg-violet-50 text-violet-700',
  'Community Service': 'bg-amber-50 text-amber-700',
  'Documentation Drive': 'bg-gray-100 text-gray-600',
  'Blood Donation Camp': 'bg-red-50 text-red-600',
  'Voter Awareness': 'bg-indigo-50 text-indigo-700',
}

const fadeStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const fadeItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export default function VerificationPage() {
  const [tab, setTab] = useState<'missions' | 'help'>('missions')
  const [missionStates, setMissionStates] = useState<Record<string, 'pending' | 'verified' | 'rejected'>>({})
  const [helpStates, setHelpStates] = useState<Record<string, 'pending' | 'verified' | 'rejected'>>({})

  const pendingMissions = missions.filter(m => m.proofSubmitted && !m.verified)
  const pendingHelp = helpRequests.filter(h => h.status === 'resolved')

  const pendingMissionCount = pendingMissions.filter(m => !missionStates[m.id] || missionStates[m.id] === 'pending').length
  const pendingHelpCount = pendingHelp.filter(h => !helpStates[h.id] || helpStates[h.id] === 'pending').length

  const verifiedToday = Object.values(missionStates).filter(s => s === 'verified').length
    + Object.values(helpStates).filter(s => s === 'verified').length + 8
  const rejectedToday = Object.values(missionStates).filter(s => s === 'rejected').length
    + Object.values(helpStates).filter(s => s === 'rejected').length + 2

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Verification</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review proof submissions for missions and help requests</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Pending Verification"
          value={formatNumber(pendingMissionCount + pendingHelpCount)}
          sub={`${pendingMissionCount} missions · ${pendingHelpCount} help requests`}
          icon={<ShieldCheck size={18} />}
          color="amber"
        />
        <KPICard
          title="Verified Today"
          value={formatNumber(verifiedToday)}
          sub="Including pre-existing verifications"
          icon={<CheckCircle size={18} />}
          color="emerald"
        />
        <KPICard
          title="Rejected Today"
          value={formatNumber(rejectedToday)}
          sub="Including pre-existing rejections"
          icon={<XCircle size={18} />}
          color="rose"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setTab('missions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'missions' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ClipboardList size={15} />
          Mission Proofs
          <span className="ml-0.5 bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
            {pendingMissionCount}
          </span>
        </button>
        <button
          onClick={() => setTab('help')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'help' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Heart size={15} />
          Help Request Proofs
          <span className="ml-0.5 bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
            {pendingHelpCount}
          </span>
        </button>
      </div>

      {/* Mission Proofs */}
      {tab === 'missions' && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={fadeStagger}
          initial="hidden"
          animate="show"
        >
          {pendingMissions.map(m => {
            const state = missionStates[m.id] ?? 'pending'
            return (
              <motion.div key={m.id} variants={fadeItem}>
                <Card className={`p-4 border-l-4 ${state === 'verified' ? 'border-emerald-500' : state === 'rejected' ? 'border-red-400' : 'border-blue-300'} transition-colors`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${missionTypeColors[m.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {m.type}
                    </span>
                    {state !== 'pending' ? <StatusBadge status={state} /> : <Badge variant="amber">Pending</Badge>}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{m.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-3">{m.district} · {formatDate(m.date)}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Leader</p>
                      <p className="text-xs font-semibold text-gray-700 truncate">{m.leader}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">People Helped</p>
                      <p className="text-xs font-semibold text-blue-700">{m.peopleHelped}</p>
                    </div>
                  </div>

                  {state === 'pending' ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" icon={<Eye size={12} />} className="flex-1 justify-center">
                        Review
                      </Button>
                      <button
                        onClick={() => setMissionStates(s => ({ ...s, [m.id]: 'verified' }))}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle size={12} /> Verify
                      </button>
                      <button
                        onClick={() => setMissionStates(s => ({ ...s, [m.id]: 'rejected' }))}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center pt-1">
                      {state === 'verified' ? '✓ Verified' : '✗ Rejected'}
                    </p>
                  )}
                </Card>
              </motion.div>
            )
          })}
          {pendingMissions.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400 text-sm">No pending mission proofs.</div>
          )}
        </motion.div>
      )}

      {/* Help Request Proofs */}
      {tab === 'help' && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={fadeStagger}
          initial="hidden"
          animate="show"
        >
          {pendingHelp.map(h => {
            const state = helpStates[h.id] ?? 'pending'
            return (
              <motion.div key={h.id} variants={fadeItem}>
                <Card className={`p-4 border-l-4 ${state === 'verified' ? 'border-emerald-500' : state === 'rejected' ? 'border-red-400' : 'border-violet-300'} transition-colors`}>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={h.urgency === 'critical' ? 'red' : h.urgency === 'high' ? 'amber' : h.urgency === 'medium' ? 'blue' : 'gray'}>
                      {h.urgency}
                    </Badge>
                    {state !== 'pending' ? <StatusBadge status={state} /> : <Badge variant="amber">Pending</Badge>}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{h.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{h.requesterName}</p>
                  <p className="text-xs text-gray-400 mb-3">{h.district} · {h.resolvedAt ? formatDate(h.resolvedAt) : '—'}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Type</p>
                      <p className="text-xs font-semibold text-gray-700 truncate">{h.type}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Assigned To</p>
                      <p className="text-xs font-semibold text-gray-700 truncate">{h.assignedTo ?? '—'}</p>
                    </div>
                  </div>

                  {state === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHelpStates(s => ({ ...s, [h.id]: 'verified' }))}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle size={12} /> Verify
                      </button>
                      <button
                        onClick={() => setHelpStates(s => ({ ...s, [h.id]: 'rejected' }))}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center pt-1">
                      {state === 'verified' ? '✓ Verified' : '✗ Rejected'}
                    </p>
                  )}
                </Card>
              </motion.div>
            )
          })}
          {pendingHelp.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400 text-sm">
              No resolved help requests pending verification.
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
