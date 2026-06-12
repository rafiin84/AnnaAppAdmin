import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Star, Target, HeartHandshake, UsersRound,
  CalendarDays, Map, Building2, GitBranch, Shield, CheckSquare,
  Activity, TrendingUp, Globe, UserCheck, BarChart3, Settings,
  ChevronDown, ChevronRight, Zap,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  icon: React.ElementType
  href?: string
  children?: { label: string; href: string; icon?: React.ElementType }[]
}

const nav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  {
    label: 'People',
    icon: Users,
    children: [
      { label: 'Supporters', href: '/people/supporters', icon: Users },
      { label: 'Leaders', href: '/people/leaders', icon: Star },
      { label: 'Recognition', href: '/people/recognition', icon: Zap },
    ],
  },
  {
    label: 'Activities',
    icon: Target,
    children: [
      { label: 'Missions', href: '/activities/missions', icon: Target },
      { label: 'Help Requests', href: '/activities/help-requests', icon: HeartHandshake },
      { label: 'Communities', href: '/activities/communities', icon: UsersRound },
      { label: 'Events', href: '/activities/events', icon: CalendarDays },
    ],
  },
  {
    label: 'Organization',
    icon: Building2,
    children: [
      { label: 'Districts', href: '/organization/districts', icon: Map },
      { label: 'Constituencies', href: '/organization/constituencies', icon: Building2 },
      { label: 'Clusters', href: '/organization/clusters', icon: GitBranch },
      { label: 'Squads', href: '/organization/squads', icon: Shield },
    ],
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    children: [
      { label: 'Growth', href: '/analytics/growth', icon: TrendingUp },
      { label: 'Geography', href: '/analytics/geography', icon: Globe },
      { label: 'Retention', href: '/analytics/retention', icon: Activity },
      { label: 'Performance', href: '/analytics/performance', icon: BarChart3 },
    ],
  },
  {
    label: 'Operations',
    icon: CheckSquare,
    children: [
      { label: 'Approvals', href: '/operations/approvals', icon: CheckSquare },
      { label: 'Verification', href: '/operations/verification', icon: UserCheck },
      { label: 'SLA Monitor', href: '/operations/sla', icon: Activity },
    ],
  },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

function NavGroup({ item }: { item: NavItem }) {
  const location = useLocation()
  const isActive = item.children?.some(c => location.pathname.startsWith(c.href))
  const [open, setOpen] = useState(isActive ?? false)

  if (!item.children) {
    return (
      <NavLink
        to={item.href!}
        end
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
            isActive
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )
        }
      >
        <item.icon size={17} />
        {item.label}
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
          isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <item.icon size={17} />
        <span className="flex-1 text-left">{item.label}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-0.5 border-l-2 border-gray-100 pl-3 flex flex-col gap-0.5 pb-1">
              {item.children.map(child => (
                <NavLink
                  key={child.href}
                  to={child.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-150',
                      isActive
                        ? 'text-blue-600 font-semibold bg-blue-50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
                    )
                  }
                >
                  {child.icon && <child.icon size={14} />}
                  {child.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-100 flex flex-col z-40 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-base">A</span>
        </div>
        <div>
          <div className="font-bold text-gray-900 text-base leading-tight">Anna App</div>
          <div className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Movement OS</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 flex flex-col gap-0.5">
        {nav.map(item => (
          <NavGroup key={item.label} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">State Command</div>
            <div className="text-xs text-gray-400">Tamil Nadu</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
