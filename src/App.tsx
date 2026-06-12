import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Supporters from './pages/People/Supporters'
import Leaders from './pages/People/Leaders'
import Recognition from './pages/People/Recognition'
import Missions from './pages/Activities/Missions'
import HelpRequests from './pages/Activities/HelpRequests'
import Communities from './pages/Activities/Communities'
import Events from './pages/Activities/Events'
import Districts from './pages/Organization/Districts'
import Constituencies from './pages/Organization/Constituencies'
import Clusters from './pages/Organization/Clusters'
import Squads from './pages/Organization/Squads'
import GrowthAnalytics from './pages/Analytics/Growth'
import GeographyAnalytics from './pages/Analytics/Geography'
import RetentionAnalytics from './pages/Analytics/Retention'
import PerformanceAnalytics from './pages/Analytics/Performance'
import Approvals from './pages/Operations/Approvals'
import Verification from './pages/Operations/Verification'
import SLAMonitor from './pages/Operations/SLAMonitor'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="people/supporters" element={<Supporters />} />
          <Route path="people/leaders" element={<Leaders />} />
          <Route path="people/recognition" element={<Recognition />} />
          <Route path="activities/missions" element={<Missions />} />
          <Route path="activities/help-requests" element={<HelpRequests />} />
          <Route path="activities/communities" element={<Communities />} />
          <Route path="activities/events" element={<Events />} />
          <Route path="organization/districts" element={<Districts />} />
          <Route path="organization/constituencies" element={<Constituencies />} />
          <Route path="organization/clusters" element={<Clusters />} />
          <Route path="organization/squads" element={<Squads />} />
          <Route path="analytics/growth" element={<GrowthAnalytics />} />
          <Route path="analytics/geography" element={<GeographyAnalytics />} />
          <Route path="analytics/retention" element={<RetentionAnalytics />} />
          <Route path="analytics/performance" element={<PerformanceAnalytics />} />
          <Route path="operations/approvals" element={<Approvals />} />
          <Route path="operations/verification" element={<Verification />} />
          <Route path="operations/sla" element={<SLAMonitor />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
