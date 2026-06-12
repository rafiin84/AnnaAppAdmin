import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Shield, Users, Globe, Database, Sliders, ChevronRight, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'general', label: 'General', icon: Sliders },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'geography', label: 'Geography', icon: Globe },
  { id: 'data', label: 'Data & Export', icon: Database },
]

function Toggle({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={cn('w-10 h-5.5 rounded-full relative transition-colors duration-200 flex-shrink-0', on ? 'bg-blue-600' : 'bg-gray-200')}
        style={{ height: 22, width: 40 }}
      >
        <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200', on ? 'left-5' : 'left-0.5')} />
      </button>
    </div>
  )
}

function SavedToast({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-elevated z-50">
      <Check size={14} className="text-emerald-400" /> Settings saved
    </motion.div>
  )
}

export default function Settings() {
  const [active, setActive] = useState('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <SavedToast show={saved} />
      <div className="flex gap-6">
        {/* Sidebar */}
        <Card className="w-52 p-2 self-start">
          <nav className="space-y-0.5">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active === s.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50')}
              >
                <s.icon size={15} />
                {s.label}
                {active !== s.id && <ChevronRight size={13} className="ml-auto text-gray-300" />}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {active === 'general' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Organization Details</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Organization Name', value: 'Anna Movement — Tamil Nadu', type: 'text' },
                    { label: 'State', value: 'Tamil Nadu', type: 'text' },
                    { label: 'Headquarters', value: 'Chennai', type: 'text' },
                    { label: 'Admin Email', value: 'admin@annaapp.tn', type: 'email' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                      <input defaultValue={f.value} type={f.type}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Display Preferences</h3>
                <Toggle label="Show growth percentages on dashboard" description="Display % change indicators on KPI cards" defaultOn={true} />
                <Toggle label="Enable map animations" description="Smooth transitions on the district heat map" defaultOn={true} />
                <Toggle label="Compact table view" description="Reduce row padding for denser data display" />
                <Toggle label="Show inactive members" description="Include inactive supporters in counts" />
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </motion.div>
          )}

          {active === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Alert Preferences</h3>
                <Toggle label="New supporter registrations" defaultOn={true} />
                <Toggle label="Help request escalations" description="Notify when SLA is at risk" defaultOn={true} />
                <Toggle label="Mission completions" defaultOn={true} />
                <Toggle label="Leader promotions" defaultOn />
                <Toggle label="SLA breaches" description="Immediate alert on breach" defaultOn={true} />
                <Toggle label="Daily digest email" description="Summary at 8 AM IST" defaultOn />
                <Toggle label="Weekly performance report" />
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Notification Channels</h3>
                <Toggle label="In-app notifications" defaultOn={true} />
                <Toggle label="Email notifications" defaultOn />
                <Toggle label="SMS alerts (critical only)" />
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </motion.div>
          )}

          {active === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Admin Users</h3>
                  <Button size="sm">+ Add User</Button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'State Command', email: 'admin@annaapp.tn', role: 'Super Admin', status: 'active' },
                    { name: 'Chennai District HQ', email: 'chennai@annaapp.tn', role: 'District Admin', status: 'active' },
                    { name: 'Coimbatore District HQ', email: 'coimbatore@annaapp.tn', role: 'District Admin', status: 'active' },
                    { name: 'Analytics Team', email: 'analytics@annaapp.tn', role: 'Viewer', status: 'active' },
                  ].map(u => (
                    <div key={u.email} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{u.role}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Role Permissions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Permission</th>
                        {['Super Admin','District Admin','Viewer'].map(r => (
                          <th key={r} className="text-center py-2 px-3 text-xs font-semibold text-gray-400 uppercase">{r}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['View Dashboard', true, true, true],
                        ['Manage Supporters', true, true, false],
                        ['Approve Requests', true, true, false],
                        ['View Analytics', true, true, true],
                        ['Manage Leaders', true, false, false],
                        ['System Settings', true, false, false],
                      ].map(([perm, ...vals]) => (
                        <tr key={String(perm)} className="border-b border-gray-50">
                          <td className="py-2.5 px-3 text-gray-700">{String(perm)}</td>
                          {(vals as boolean[]).map((v, i) => (
                            <td key={i} className="py-2.5 px-3 text-center">
                              {v ? <Check size={14} className="text-emerald-500 mx-auto" /> : <span className="text-gray-200">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {active === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Security Settings</h3>
                <Toggle label="Two-factor authentication" description="Require 2FA for all admin logins" defaultOn={true} />
                <Toggle label="Session timeout (30 min)" description="Auto-logout after inactivity" defaultOn={true} />
                <Toggle label="Audit logging" description="Log all admin actions" defaultOn={true} />
                <Toggle label="IP allowlist" description="Restrict access to approved IPs" />
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">Password Policy</h3>
                <p className="text-sm text-gray-500 mb-4">Minimum requirements for all user passwords</p>
                <div className="space-y-3">
                  {['Minimum 8 characters','At least one uppercase letter','At least one number','At least one special character'].map(r => (
                    <div key={r} className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{r}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </motion.div>
          )}

          {active === 'geography' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Geography Configuration</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-sm font-semibold text-blue-800">Active Territory</p>
                    <p className="text-sm text-blue-600 mt-1">Tamil Nadu — All 38 Districts, 234 Constituencies</p>
                  </div>
                  <Toggle label="Show district boundaries on map" defaultOn={true} />
                  <Toggle label="Auto-assign constituencies by PIN code" defaultOn />
                  <Toggle label="Enable cluster auto-grouping" description="Automatically suggest cluster boundaries" />
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Organization Hierarchy</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { level: 'State', units: '1', leader: 'State Command' },
                    { level: 'District', units: '38', leader: 'District President' },
                    { level: 'Constituency', units: '234', leader: 'Constituency Coordinator' },
                    { level: 'Cluster', units: '2,808+', leader: 'Cluster Leader' },
                    { level: 'Squad', units: '14,000+', leader: 'Squad Leader' },
                  ].map(h => (
                    <div key={h.level} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="font-semibold text-gray-700">{h.level}</span>
                      <span className="text-gray-400">{h.units} units</span>
                      <span className="text-gray-500">{h.leader}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {active === 'data' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Export Data</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Supporter Directory', desc: 'All supporters with details', format: 'CSV' },
                    { label: 'Leader Directory', desc: 'All leaders with performance metrics', format: 'CSV' },
                    { label: 'Mission Report', desc: 'All missions with completion data', format: 'CSV' },
                    { label: 'Help Request Log', desc: 'All help requests with SLA data', format: 'CSV' },
                    { label: 'Analytics Summary', desc: 'Monthly growth and performance', format: 'PDF' },
                  ].map(e => (
                    <div key={e.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{e.label}</p>
                        <p className="text-xs text-gray-400">{e.desc}</p>
                      </div>
                      <Button size="sm" variant="secondary">Export {e.format}</Button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">Data Retention</h3>
                <Toggle label="Auto-archive inactive supporters (>12 months)" defaultOn={true} />
                <Toggle label="Retain resolved help requests" description="Keep data for 24 months" defaultOn={true} />
                <Toggle label="Compress old mission data" description="Archive missions older than 18 months" />
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
