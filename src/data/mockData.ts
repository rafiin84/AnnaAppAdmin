import { districts, getAllConstituencies } from './tamilnadu'

// ─── SUPPORTERS ──────────────────────────────────────────────────────────────
const firstNames = ['Murugan','Selvam','Krishnan','Rajan','Kumar','Vijay','Balan','Senthil','Arun','Mani','Durai','Siva','Anbu','Guru','Karthik','Deepa','Priya','Kavitha','Meena','Lakshmi','Usha','Radha','Geetha','Anitha','Sumathi','Chandran','Gopal','Raja','Velu','Pandian','Surya','Kiran','Arjun','Sakthi','Nithya','Divya','Sudha','Vanitha','Prabha','Vani']
const lastNames = ['Murugesan','Krishnamurthy','Rajagopal','Subramanian','Natarajan','Palaniswamy','Veerasamy','Annamalai','Thangavel','Periyasamy','Govindaraj','Velayutham','Pandiarajan','Subramaniam','Ramasamy','Shanmugam','Muthukrishnan','Rangasamy','Kandasamy','Duraisamy']

function rng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

const r = rng(42)

export function randomItem<T>(arr: T[], rand = Math.random): T {
  return arr[Math.floor(rand() * arr.length)]
}

const allConstituencies = getAllConstituencies()

export interface Supporter {
  id: string
  name: string
  phone: string
  district: string
  constituency: string
  cluster: string
  squad: string
  joinedAt: string
  sevaiPoints: number
  missionsCount: number
  status: 'active' | 'inactive' | 'pending'
  avatar: string
  role: 'supporter' | 'squad_leader' | 'cluster_leader' | 'constituency_leader'
}

export const supporters: Supporter[] = Array.from({ length: 200 }, (_, i) => {
  const con = allConstituencies[i % allConstituencies.length]
  const cluster = con.clusters[i % con.clusters.length]
  const squad = cluster.squads[i % cluster.squads.length]
  const fn = firstNames[i % firstNames.length]
  const ln = lastNames[i % lastNames.length]
  const dist = districts.find(d => d.id === con.districtId)!
  const roles: Supporter['role'][] = ['supporter','supporter','supporter','supporter','squad_leader','cluster_leader']
  return {
    id: `SUP-${String(i + 1).padStart(4, '0')}`,
    name: `${fn} ${ln}`,
    phone: `+91 ${9000000000 + i * 7}`,
    district: dist.name,
    constituency: con.name,
    cluster: cluster.name,
    squad: squad.name,
    joinedAt: new Date(2022, Math.floor(i / 20), (i % 28) + 1).toISOString(),
    sevaiPoints: 100 + Math.floor(r() * 9900),
    missionsCount: Math.floor(r() * 30),
    status: i % 10 === 0 ? 'pending' : i % 15 === 0 ? 'inactive' : 'active',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fn}${ln}&backgroundColor=2563eb&textColor=ffffff`,
    role: roles[i % roles.length],
  }
})

// ─── MISSIONS ────────────────────────────────────────────────────────────────
const missionTypes = ['Clean-up Drive','Tree Plantation','Medical Camp','Awareness Campaign','Community Service','Documentation Drive','Blood Donation Camp','Voter Awareness'] as const
export type MissionType = typeof missionTypes[number]

const missionStatuses = ['active','completed','upcoming','cancelled'] as const

export interface Mission {
  id: string
  title: string
  type: MissionType
  district: string
  constituency: string
  date: string
  capacity: number
  enrolled: number
  completed: number
  leader: string
  status: typeof missionStatuses[number]
  description: string
  peopleHelped: number
  sevaiPoints: number
  proofSubmitted: boolean
  verified: boolean
  location: string
}

export const missions: Mission[] = Array.from({ length: 80 }, (_, i) => {
  const dist = districts[i % districts.length]
  const con = dist.constituencies[i % dist.constituencies.length]
  const type = missionTypes[i % missionTypes.length]
  const status = missionStatuses[i % missionStatuses.length]
  const capacity = 20 + Math.floor(r() * 80)
  const enrolled = Math.floor(capacity * (0.4 + r() * 0.5))
  return {
    id: `MSN-${String(i + 1).padStart(4, '0')}`,
    title: `${type} — ${con.name}`,
    type,
    district: dist.name,
    constituency: con.name,
    date: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
    capacity,
    enrolled,
    completed: status === 'completed' ? enrolled : 0,
    leader: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    status,
    description: `${type} organized at ${con.name} to serve the community.`,
    peopleHelped: status === 'completed' ? 50 + Math.floor(r() * 450) : 0,
    sevaiPoints: (50 + Math.floor(r() * 150)) * enrolled,
    proofSubmitted: status === 'completed',
    verified: status === 'completed' && i % 3 !== 0,
    location: con.clusters[0]?.locality || con.name,
  }
})

// ─── HELP REQUESTS ───────────────────────────────────────────────────────────
const helpTypes = ['Blood Donation','Platelet Donation','Medical Emergency','Document Assistance','Job Guidance','General Help','Legal Aid','Educational Support'] as const
export type HelpType = typeof helpTypes[number]
const urgencyLevels = ['low','medium','high','critical'] as const

export interface HelpRequest {
  id: string
  title: string
  type: HelpType
  requesterName: string
  district: string
  constituency: string
  status: 'open' | 'assigned' | 'resolved' | 'escalated' | 'closed'
  urgency: typeof urgencyLevels[number]
  createdAt: string
  resolvedAt?: string
  assignedTo?: string
  slaHours: number
  hoursElapsed: number
  description: string
  donorFound?: boolean
  verified: boolean
}

export const helpRequests: HelpRequest[] = Array.from({ length: 120 }, (_, i) => {
  const dist = districts[i % districts.length]
  const con = dist.constituencies[i % dist.constituencies.length]
  const type = helpTypes[i % helpTypes.length]
  const created = new Date(2024, i % 12, (i % 28) + 1)
  const statuses: HelpRequest['status'][] = ['open','assigned','resolved','escalated','closed']
  const st = statuses[i % statuses.length]
  const sla = type === 'Blood Donation' || type === 'Medical Emergency' ? 4 : 24
  const elapsed = Math.floor(r() * 48)
  return {
    id: `HR-${String(i + 1).padStart(4, '0')}`,
    title: `${type} needed — ${con.name}`,
    type,
    requesterName: `${firstNames[i % firstNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
    district: dist.name,
    constituency: con.name,
    status: st,
    urgency: urgencyLevels[i % urgencyLevels.length],
    createdAt: created.toISOString(),
    resolvedAt: st === 'resolved' || st === 'closed' ? new Date(created.getTime() + elapsed * 3600000).toISOString() : undefined,
    assignedTo: st !== 'open' ? `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}` : undefined,
    slaHours: sla,
    hoursElapsed: elapsed,
    description: `${type} required urgently in ${con.name}. Please coordinate immediately.`,
    donorFound: type === 'Blood Donation' ? st === 'resolved' : undefined,
    verified: st === 'resolved' || st === 'closed',
  }
})

// ─── COMMUNITIES ─────────────────────────────────────────────────────────────
const communityTypes = ['Yoga Group','Walking Club','Cycling Club','Sports Group','Book Club','Chai Meet','Meditation Group','Nature Club'] as const

export interface Community {
  id: string
  name: string
  type: typeof communityTypes[number]
  district: string
  constituency: string
  members: number
  meetingsPerMonth: number
  lastMeetingDate: string
  leader: string
  description: string
  attendance: number[]
  active: boolean
}

export const communities: Community[] = Array.from({ length: 60 }, (_, i) => {
  const dist = districts[i % districts.length]
  const con = dist.constituencies[i % dist.constituencies.length]
  const type = communityTypes[i % communityTypes.length]
  return {
    id: `COM-${String(i + 1).padStart(4, '0')}`,
    name: `${con.name} ${type}`,
    type,
    district: dist.name,
    constituency: con.name,
    members: 10 + Math.floor(r() * 90),
    meetingsPerMonth: 2 + Math.floor(r() * 6),
    lastMeetingDate: new Date(2024, 10, (i % 28) + 1).toISOString(),
    leader: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    description: `A vibrant ${type} from ${con.name} focused on community wellness.`,
    attendance: Array.from({ length: 6 }, () => 5 + Math.floor(r() * 45)),
    active: i % 8 !== 0,
  }
})

// ─── EVENTS ──────────────────────────────────────────────────────────────────
const eventTypes = ['Rally','Town Hall','Workshop','Training','Cultural Program','Sports Day','Health Camp','Felicitation'] as const

export interface Event {
  id: string
  title: string
  type: typeof eventTypes[number]
  district: string
  venue: string
  date: string
  capacity: number
  rsvp: number
  attended: number
  speakers: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  description: string
}

export const events: Event[] = Array.from({ length: 50 }, (_, i) => {
  const dist = districts[i % districts.length]
  const type = eventTypes[i % eventTypes.length]
  const cap = 100 + Math.floor(r() * 1900)
  const rsvp = Math.floor(cap * (0.5 + r() * 0.4))
  const statuses: Event['status'][] = ['upcoming','upcoming','completed','completed','ongoing']
  return {
    id: `EVT-${String(i + 1).padStart(4, '0')}`,
    title: `${type} — ${dist.name}`,
    type,
    district: dist.name,
    venue: `${dist.constituencies[0]?.name || dist.name} Community Hall`,
    date: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
    capacity: cap,
    rsvp,
    attended: statuses[i % statuses.length] === 'completed' ? Math.floor(rsvp * 0.85) : 0,
    speakers: [`${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`, `${firstNames[(i + 1) % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`],
    status: statuses[i % statuses.length],
    description: `${type} organized in ${dist.name} for movement empowerment.`,
  }
})

// ─── MONTHLY TREND DATA ───────────────────────────────────────────────────────
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export const monthlyGrowth = months.map((month, i) => ({
  month,
  supporters: 1200 + i * 380 + Math.floor(r() * 300),
  peopleHelped: 800 + i * 220 + Math.floor(r() * 200),
  missions: 40 + i * 12 + Math.floor(r() * 20),
  helpRaisedTotal: 60 + i * 8 + Math.floor(r() * 15),
  helpResolvedTotal: 50 + i * 9 + Math.floor(r() * 12),
  communities: 8 + i * 3 + Math.floor(r() * 4),
}))

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
export type ActivityType = 'supporter_joined' | 'mission_completed' | 'help_resolved' | 'leader_promoted' | 'community_formed' | 'event_completed'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  subtitle: string
  time: string
  district: string
  meta?: string
}

export const recentActivity: Activity[] = [
  { id: 'a1', type: 'supporter_joined', title: 'Karthik Selvam joined', subtitle: 'Anna Nagar, Chennai', time: '2m ago', district: 'Chennai' },
  { id: 'a2', type: 'mission_completed', title: 'Tree Plantation completed', subtitle: 'Velachery — 120 helped', time: '15m ago', district: 'Chennai', meta: '450 pts' },
  { id: 'a3', type: 'help_resolved', title: 'Blood donation resolved', subtitle: 'Coimbatore North', time: '1h ago', district: 'Coimbatore' },
  { id: 'a4', type: 'leader_promoted', title: 'Meena Krishnan promoted', subtitle: 'Cluster Leader — Madurai East', time: '2h ago', district: 'Madurai' },
  { id: 'a5', type: 'supporter_joined', title: 'Vijay Rajan joined', subtitle: 'RS Puram, Coimbatore', time: '3h ago', district: 'Coimbatore' },
  { id: 'a6', type: 'mission_completed', title: 'Medical Camp completed', subtitle: 'Srirangam — 310 helped', time: '5h ago', district: 'Tiruchirappalli', meta: '720 pts' },
  { id: 'a7', type: 'community_formed', title: 'New Yoga Group formed', subtitle: 'Erode East', time: '8h ago', district: 'Erode' },
  { id: 'a8', type: 'help_resolved', title: 'Document assistance done', subtitle: 'Tirunelveli', time: '12h ago', district: 'Tirunelveli' },
  { id: 'a9', type: 'supporter_joined', title: 'Priya Natarajan joined', subtitle: 'Nagercoil', time: '14h ago', district: 'Kanyakumari' },
  { id: 'a10', type: 'event_completed', title: 'Town Hall completed', subtitle: 'Salem — 850 attended', time: '1d ago', district: 'Salem' },
]

// ─── APPROVALS ───────────────────────────────────────────────────────────────
export interface ApprovalItem {
  id: string
  type: 'supporter' | 'leader' | 'mission_proof' | 'community'
  name: string
  requestedBy: string
  district: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  priority: 'normal' | 'high'
}

export const approvals: ApprovalItem[] = Array.from({ length: 40 }, (_, i) => {
  const dist = districts[i % districts.length]
  const types: ApprovalItem['type'][] = ['supporter','leader','mission_proof','community']
  return {
    id: `APR-${String(i + 1).padStart(4, '0')}`,
    type: types[i % types.length],
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    requestedBy: `${firstNames[(i + 2) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}`,
    district: dist.name,
    submittedAt: new Date(2024, 11, (i % 28) + 1).toISOString(),
    status: i % 5 === 0 ? 'approved' : i % 7 === 0 ? 'rejected' : 'pending',
    priority: i % 4 === 0 ? 'high' : 'normal',
  }
})

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
export interface LeaderEntry {
  rank: number
  id: string
  name: string
  role: string
  district: string
  constituency: string
  sevaiPoints: number
  supporters: number
  missions: number
  peopleHelped: number
  badge: string
  level: string
  avatar: string
}

const badges = ['Gold Star','Silver Star','Bronze Star','Community Hero','Mission Champion','Growth Leader']
const levels = ['Diamond','Platinum','Gold','Silver','Bronze']

export const leaderboard: LeaderEntry[] = Array.from({ length: 50 }, (_, i) => {
  const dist = districts[i % districts.length]
  const con = dist.constituencies[i % dist.constituencies.length]
  const fn = firstNames[i % firstNames.length]
  const ln = lastNames[i % lastNames.length]
  return {
    rank: i + 1,
    id: `LDR-${String(i + 1).padStart(4, '0')}`,
    name: `${fn} ${ln}`,
    role: i < 5 ? 'Constituency Leader' : i < 20 ? 'Cluster Leader' : 'Squad Leader',
    district: dist.name,
    constituency: con.name,
    sevaiPoints: 50000 - i * 900 + Math.floor(r() * 500),
    supporters: 500 - i * 9 + Math.floor(r() * 50),
    missions: 50 - Math.floor(i / 2) + Math.floor(r() * 10),
    peopleHelped: 5000 - i * 90 + Math.floor(r() * 200),
    badge: badges[i % badges.length],
    level: levels[Math.floor(i / 10)],
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fn}${ln}&backgroundColor=1d4ed8&textColor=ffffff`,
  }
})

// ─── KPI SUMMARY ─────────────────────────────────────────────────────────────
export const kpiSummary = {
  totalSupporters: 847293,
  peopleHelped: 234817,
  activeMissions: missions.filter(m => m.status === 'active').length,
  helpRequestsOpen: helpRequests.filter(h => h.status === 'open' || h.status === 'assigned').length,
  constituenciesActive: allConstituencies.filter(c => c.supporters > 5000).length,
  growthPercent: 18.4,
  districtsActive: districts.length,
  totalMissions: missions.length,
  totalCommunities: communities.length,
  totalEvents: events.length,
}
