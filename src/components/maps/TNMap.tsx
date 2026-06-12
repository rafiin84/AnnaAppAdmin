import { useState } from 'react'
import { motion } from 'framer-motion'
import { districts, District } from '@/data/tamilnadu'
import { formatNumber } from '@/lib/utils'

type ColorBy = 'supporters' | 'missions' | 'peopleHelped'

interface TNMapProps {
  colorBy?: ColorBy
  onDistrictClick?: (district: District) => void
  height?: number
}

interface DistrictGeo {
  d: string
  lx: number
  ly: number
  label: string
  showLabel: boolean
}

// Simplified polygon paths — ViewBox "0 0 420 560"
// Approximate geographic positions: west=NIL/COI, east=CHE/NAG, north=KRI/TVL, south=KNY
const GEO: Record<string, DistrictGeo> = {
  KRI: { label: 'Krishnagiri', lx: 182, ly: 105, showLabel: true,
    d: 'M148,70 L210,68 L215,95 L218,130 L165,136 L150,110 Z' },
  DHM: { label: 'Dharmapuri', lx: 132, ly: 158, showLabel: true,
    d: 'M105,128 L148,110 L165,136 L162,170 L140,185 L105,178 L98,152 Z' },
  TPA: { label: 'Tirupathur', lx: 235, ly: 98, showLabel: false,
    d: 'M215,68 L262,65 L265,95 L262,130 L218,130 L215,95 Z' },
  RAN: { label: 'Ranipet', lx: 278, ly: 78, showLabel: false,
    d: 'M262,65 L308,62 L312,92 L305,115 L265,115 L262,95 Z' },
  VEL: { label: 'Vellore', lx: 308, ly: 122, showLabel: true,
    d: 'M265,95 L265,115 L305,115 L312,92 L338,90 L342,118 L340,145 L278,152 L265,145 L262,130 Z' },
  TVL: { label: 'Tiruvallur', lx: 348, ly: 72, showLabel: false,
    d: 'M308,55 L372,52 L388,65 L382,92 L358,98 L338,90 L312,92 L308,72 Z' },
  CHE: { label: 'Chennai', lx: 390, ly: 68, showLabel: false,
    d: 'M372,52 L400,48 L402,78 L388,84 L382,92 L372,85 Z' },
  TVA: { label: 'Tiruvannamalai', lx: 278, ly: 162, showLabel: false,
    d: 'M262,130 L265,145 L278,152 L340,145 L342,175 L312,190 L272,188 L258,170 Z' },
  KAN: { label: 'Kancheepuram', lx: 358, ly: 128, showLabel: false,
    d: 'M342,118 L388,112 L392,128 L390,156 L365,162 L340,145 L342,118 Z' },
  CHP: { label: 'Chengalpattu', lx: 370, ly: 168, showLabel: false,
    d: 'M365,162 L390,156 L394,178 L392,202 L370,208 L350,198 L345,172 Z' },
  NIL: { label: 'Nilgiris', lx: 56, ly: 210, showLabel: false,
    d: 'M28,190 L72,184 L88,200 L82,228 L54,240 L26,228 Z' },
  COI: { label: 'Coimbatore', lx: 50, ly: 268, showLabel: true,
    d: 'M26,228 L54,240 L82,228 L90,248 L84,278 L68,298 L44,310 L18,298 L16,268 Z' },
  TPR: { label: 'Tiruppur', lx: 118, ly: 248, showLabel: false,
    d: 'M88,200 L128,195 L148,212 L150,242 L130,262 L98,265 L84,250 L82,228 Z' },
  ERT: { label: 'Erode', lx: 108, ly: 192, showLabel: false,
    d: 'M72,184 L105,178 L140,185 L148,212 L128,195 L88,200 L78,184 Z' },
  SAL: { label: 'Salem', lx: 188, ly: 185, showLabel: true,
    d: 'M140,158 L162,170 L165,136 L218,130 L225,158 L228,188 L210,212 L185,218 L162,212 L148,212 L140,185 Z' },
  NAM: { label: 'Namakkal', lx: 152, ly: 252, showLabel: false,
    d: 'M148,212 L162,212 L185,218 L192,242 L185,268 L158,275 L138,268 L128,260 L130,262 L150,242 Z' },
  KAR: { label: 'Karur', lx: 192, ly: 262, showLabel: false,
    d: 'M185,218 L210,212 L228,222 L230,252 L222,278 L198,285 L185,268 L192,242 Z' },
  TRI: { label: 'Tiruchirappalli', lx: 246, ly: 250, showLabel: true,
    d: 'M228,222 L272,188 L298,202 L305,228 L298,262 L272,278 L248,278 L230,265 L230,252 Z' },
  PRM: { label: 'Perambalur', lx: 302, ly: 220, showLabel: false,
    d: 'M298,202 L328,198 L342,218 L338,250 L310,252 L298,238 Z' },
  ARY: { label: 'Ariyalur', lx: 338, ly: 248, showLabel: false,
    d: 'M328,198 L370,195 L378,222 L370,250 L342,255 L338,250 L342,218 Z' },
  CVR: { label: 'Cuddalore', lx: 370, ly: 235, showLabel: false,
    d: 'M350,198 L370,208 L394,208 L398,235 L390,258 L370,262 L350,252 L345,228 Z' },
  VIL: { label: 'Villupuram', lx: 340, ly: 210, showLabel: false,
    d: 'M312,190 L342,175 L340,145 L365,162 L345,172 L350,198 L345,228 L330,252 L310,252 L298,202 Z' },
  KAL: { label: 'Kallakurichi', lx: 320, ly: 272, showLabel: false,
    d: 'M310,252 L338,250 L342,255 L340,278 L322,288 L300,282 L298,262 L298,238 Z' },
  MAY: { label: 'Mayiladuthurai', lx: 358, ly: 295, showLabel: false,
    d: 'M342,278 L370,272 L382,292 L372,312 L350,310 L328,310 L322,288 L340,278 Z' },
  TAN: { label: 'Thanjavur', lx: 305, ly: 320, showLabel: true,
    d: 'M272,278 L298,262 L300,282 L322,288 L328,310 L315,328 L288,332 L270,320 Z' },
  PUD: { label: 'Pudukottai', lx: 265, ly: 308, showLabel: false,
    d: 'M248,278 L272,278 L270,320 L258,342 L238,350 L222,338 L218,312 L230,285 Z' },
  TVR: { label: 'Tiruvarur', lx: 342, ly: 326, showLabel: false,
    d: 'M328,310 L352,308 L370,318 L368,340 L348,348 L328,342 L315,328 Z' },
  NAG: { label: 'Nagapattinam', lx: 376, ly: 348, showLabel: false,
    d: 'M368,315 L392,318 L396,348 L390,372 L370,372 L358,358 L362,338 Z' },
  SIV: { label: 'Sivaganga', lx: 268, ly: 348, showLabel: false,
    d: 'M238,350 L258,342 L270,320 L288,332 L298,352 L290,378 L265,385 L248,372 L240,352 Z' },
  RAM: { label: 'Ramanathapuram', lx: 315, ly: 380, showLabel: false,
    d: 'M290,378 L298,352 L328,342 L348,348 L355,372 L352,398 L332,412 L305,412 L288,398 Z' },
  DIN: { label: 'Dindigul', lx: 162, ly: 300, showLabel: true,
    d: 'M130,262 L158,275 L185,268 L198,285 L218,312 L205,332 L190,348 L162,355 L145,338 L128,320 L118,298 Z' },
  THP: { label: 'Theni', lx: 120, ly: 335, showLabel: false,
    d: 'M96,298 L118,298 L128,320 L124,350 L106,368 L86,370 L76,355 L80,328 Z' },
  MAD: { label: 'Madurai', lx: 196, ly: 362, showLabel: true,
    d: 'M162,355 L190,348 L205,332 L218,312 L222,338 L238,350 L240,352 L248,372 L242,392 L220,402 L194,400 L172,385 L158,368 Z' },
  VIR: { label: 'Virudhunagar', lx: 158, ly: 398, showLabel: false,
    d: 'M126,378 L158,368 L172,385 L168,408 L154,422 L136,432 L116,425 L106,408 L110,388 Z' },
  TIR: { label: 'Tirunelveli', lx: 116, ly: 445, showLabel: true,
    d: 'M76,418 L106,408 L116,425 L136,432 L138,458 L126,478 L102,485 L80,475 L70,452 Z' },
  TNK: { label: 'Tenkasi', lx: 86, ly: 398, showLabel: false,
    d: 'M68,378 L106,368 L106,388 L106,408 L76,418 L60,408 L60,388 Z' },
  THO: { label: 'Thoothukudi', lx: 178, ly: 438, showLabel: false,
    d: 'M154,422 L172,418 L190,412 L210,425 L216,448 L206,465 L186,472 L163,460 L150,442 Z' },
  KNY: { label: 'Kanyakumari', lx: 86, ly: 498, showLabel: false,
    d: 'M70,475 L102,480 L113,498 L103,520 L82,528 L62,518 L56,498 Z' },
}

// Approximate Tamil Nadu state boundary (background silhouette)
const TN_OUTLINE =
  'M28,190 L26,228 L16,268 L18,300 L44,312 L60,392 L60,420 L56,500 L84,530 ' +
  'L114,500 L152,445 L188,475 L216,450 L306,415 L335,415 L358,375 L395,375 ' +
  'L402,240 L402,48 L370,50 L308,52 L262,62 L210,65 L148,68 L105,128 L72,184 Z'

function getColor(value: number, max: number): string {
  const r = value / max
  if (r > 0.85) return '#1d4ed8'
  if (r > 0.7)  return '#2563eb'
  if (r > 0.55) return '#3b82f6'
  if (r > 0.4)  return '#60a5fa'
  if (r > 0.25) return '#93c5fd'
  return '#dbeafe'
}

export default function TNMap({ colorBy = 'supporters', onDistrictClick, height = 420 }: TNMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const maxVal = Math.max(...districts.map(d => d[colorBy]))
  const hoveredDistrict = hovered ? districts.find(d => d.id === hovered) : null

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox="0 0 420 560"
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        className="select-none"
      >
        {/* State silhouette background */}
        <path d={TN_OUTLINE} fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" strokeLinejoin="round" />

        {districts.map(d => {
          const geo = GEO[d.id]
          if (!geo) return null
          const isHovered = hovered === d.id
          const color = getColor(d[colorBy], maxVal)

          return (
            <g key={d.id}>
              <path
                d={geo.d}
                fill={color}
                stroke={isHovered ? '#1e3a8a' : '#ffffff'}
                strokeWidth={isHovered ? 2 : 0.8}
                strokeLinejoin="round"
                style={{
                  cursor: 'pointer',
                  filter: isHovered ? 'drop-shadow(0 2px 6px rgba(37,99,235,0.35))' : 'none',
                  transition: 'filter 0.15s',
                }}
                onMouseEnter={() => setHovered(d.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onDistrictClick?.(d)}
              />
              {geo.showLabel && (
                <text
                  x={geo.lx}
                  y={geo.ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="5.5"
                  fill="white"
                  fontWeight="700"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {geo.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {hoveredDistrict && (
        <motion.div
          key={hoveredDistrict.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-10 bg-white rounded-xl shadow-elevated border border-gray-100 p-3 pointer-events-none text-sm min-w-[160px]"
          style={{ left: Math.min(tooltipPos.x + 12, 260), top: Math.max(tooltipPos.y - 80, 8) }}
        >
          <p className="font-bold text-gray-900 mb-2">{hoveredDistrict.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 text-xs">Supporters</span>
              <span className="font-semibold text-xs">{formatNumber(hoveredDistrict.supporters)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 text-xs">Missions</span>
              <span className="font-semibold text-xs">{hoveredDistrict.missions}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 text-xs">Helped</span>
              <span className="font-semibold text-xs">{formatNumber(hoveredDistrict.peopleHelped)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 text-xs">Growth</span>
              <span className="font-semibold text-xs text-emerald-600">+{hoveredDistrict.growth}%</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        <span className="text-[9px] text-gray-400 mr-0.5">Low</span>
        {['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'].map((c, i) => (
          <div key={i} className="w-4 h-3 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-[9px] text-gray-400 ml-0.5">High</span>
      </div>
    </div>
  )
}
