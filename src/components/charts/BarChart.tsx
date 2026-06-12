import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface BarChartProps {
  data: Record<string, unknown>[]
  xKey: string
  yKey: string
  color?: string
  height?: number
  horizontal?: boolean
  label?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-elevated p-3">
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900">{payload[0]?.value?.toLocaleString()}</p>
    </div>
  )
}

export default function BarChart({ data, xKey, yKey, color = '#2563eb', height = 240, horizontal = false }: BarChartProps) {
  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={data} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)} />
          <YAxis type="category" dataKey={xKey} tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={yKey} radius={[0, 6, 6, 0]} maxBarSize={24}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#2563eb' : i < 3 ? '#3b82f6' : '#93c5fd'} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={40} />
      </ReBarChart>
    </ResponsiveContainer>
  )
}
