import { Bell, Search, ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': 'State Command Center',
  '/people/supporters': 'Supporters',
  '/people/leaders': 'Leaders',
  '/people/recognition': 'Recognition',
  '/activities/missions': 'Missions',
  '/activities/help-requests': 'Help Requests',
  '/activities/communities': 'Communities',
  '/activities/events': 'Events',
  '/organization/districts': 'Districts',
  '/organization/constituencies': 'Constituencies',
  '/organization/clusters': 'Clusters',
  '/organization/squads': 'Squads',
  '/analytics/growth': 'Growth Analytics',
  '/analytics/geography': 'Geography Analytics',
  '/analytics/retention': 'Retention Analytics',
  '/analytics/performance': 'Performance Analytics',
  '/operations/approvals': 'Approvals',
  '/operations/verification': 'Verification',
  '/operations/sla': 'SLA Monitor',
  '/settings': 'Settings',
}

export default function Header() {
  const location = useLocation()
  const title = titles[location.pathname] ?? 'Anna App'

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex items-center px-6 gap-4 z-30">
      <div className="flex-1">
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 w-56 border border-gray-100">
        <Search size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm outline-none text-gray-600 placeholder-gray-400 flex-1"
        />
      </div>

      {/* Notifications */}
      <button className="relative w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100">
        <Bell size={15} className="text-gray-500" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
      </button>

      {/* Profile */}
      <button className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1 transition-colors">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          SC
        </div>
        <span className="text-sm font-medium text-gray-700">State HQ</span>
        <ChevronDown size={13} className="text-gray-400" />
      </button>
    </header>
  )
}
