import { motion } from 'framer-motion'

/* Placeholder watercolor-style art drawn in SVG.
   Replace any of these with your own transparent PNGs later
   (e.g. <img src="/assets/flowers.png" />). */

const Petals = ({ cx, cy, r, n = 7, rot = 0 }) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
    {Array.from({ length: n }).map((_, i) => (
      <ellipse
        key={i}
        cx="0"
        cy={-r * 0.55}
        rx={r * 0.36}
        ry={r * 0.6}
        fill="url(#petal)"
        stroke="#cdbfdc"
        strokeWidth="0.7"
        opacity="0.96"
        transform={`rotate(${(360 / n) * i})`}
      />
    ))}
    <circle r={r * 0.2} fill="#e8d3a0" />
    <circle r={r * 0.1} fill="#c9a15b" opacity="0.7" />
  </g>
)

export function Flowers({ className = '', flip = false, style }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="petal" cx="50%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f7f1ef" />
          <stop offset="100%" stopColor="#dcd2e6" />
        </radialGradient>
      </defs>
      {/* leaves */}
      <g fill="#a9b4d4" opacity="0.65">
        <ellipse cx="40" cy="60" rx="9" ry="30" transform="rotate(-35 40 60)" />
        <ellipse cx="150" cy="40" rx="8" ry="28" transform="rotate(40 150 40)" />
        <ellipse cx="60" cy="150" rx="8" ry="26" transform="rotate(-70 60 150)" />
        <ellipse cx="165" cy="120" rx="7" ry="24" transform="rotate(70 165 120)" />
      </g>
      <Petals cx={100} cy={95} r={50} n={8} rot={8} />
      <Petals cx={52} cy={120} r={32} n={7} rot={-15} />
      <Petals cx={140} cy={135} r={36} n={7} rot={20} />
      <Petals cx={115} cy={42} r={24} n={6} rot={5} />
      <Petals cx={32} cy={70} r={20} n={6} rot={30} />
      {/* tiny buds */}
      <circle cx="170" cy="75" r="5" fill="#cdbfdc" opacity="0.8" />
      <circle cx="20" cy="150" r="4" fill="#cdbfdc" opacity="0.8" />
      <circle cx="90" cy="175" r="4" fill="#e8d3a0" opacity="0.9" />
    </svg>
  )
}

export function Balloon({ className = '', size = 34 }) {
  return (
    <svg viewBox="0 0 40 70" width={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id="balloon" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="55%" stopColor="#e6d2a4" />
          <stop offset="100%" stopColor="#b99654" />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="22" rx="16" ry="20" fill="url(#balloon)" />
      <path d="M17 41 L20 46 L23 41 Z" fill="#b99654" />
      <path d="M20 46 C 14 54 26 58 20 68" stroke="#b99654" strokeWidth="0.8" fill="none" />
      <ellipse cx="13" cy="14" rx="4" ry="6" fill="#fff" opacity="0.45" />
    </svg>
  )
}

export function Bird({ className = '', size = 44 }) {
  return (
    <svg viewBox="0 0 64 40" width={size} className={className} aria-hidden="true">
      <path d="M4 22 C 14 8 26 10 32 20 C 40 6 54 6 60 14 C 50 14 44 20 38 28 C 34 34 24 34 20 30 C 14 28 8 26 4 22 Z" fill="#d9c9a6" stroke="#b99654" strokeWidth="0.8" />
      <circle cx="12" cy="21" r="1" fill="#4a3320" />
    </svg>
  )
}

export function Ribbon({ className = '', flip = false }) {
  return (
    <svg viewBox="0 0 100 80" className={className} style={{ transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden="true">
      <defs>
        <linearGradient id="rib" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3dfe0" />
          <stop offset="100%" stopColor="#d9b4b4" />
        </linearGradient>
      </defs>
      <path d="M50 38 C 30 8 8 14 6 30 C 5 46 30 44 50 38 Z" fill="url(#rib)" />
      <path d="M50 38 C 70 8 92 14 94 30 C 95 46 70 44 50 38 Z" fill="url(#rib)" />
      <path d="M46 40 L28 76 L40 70 L46 78 L52 48 Z" fill="#d9b4b4" />
      <path d="M54 40 L72 76 L60 70 L54 78 L48 48 Z" fill="#e6c6c6" />
      <circle cx="50" cy="38" r="6" fill="#d3a8a8" />
    </svg>
  )
}

export function House({ className = '' }) {
  return (
    <svg viewBox="0 0 240 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6ead6" />
          <stop offset="100%" stopColor="#e5d2ad" />
        </linearGradient>
        <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b9a6d6" />
          <stop offset="100%" stopColor="#8f7fb6" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="238" rx="100" ry="14" fill="#c9b78f" opacity="0.35" />
      <rect x="40" y="110" width="160" height="124" fill="url(#wall)" stroke="#b59a68" strokeWidth="1" />
      <path d="M26 114 L120 30 L214 114 Z" fill="url(#roof)" stroke="#6f5f96" strokeWidth="1" />
      <path d="M70 114 L120 70 L170 114" fill="none" stroke="#fff" strokeOpacity="0.35" />
      <rect x="150" y="50" width="16" height="36" fill="#d9c9a6" stroke="#b59a68" />
      {[62, 150].map((x) => (
        <g key={x}>
          <path d={`M${x} 190 V150 a14 14 0 0 1 28 0 V190 Z`} fill="#6f5f96" opacity="0.85" />
          <path d={`M${x + 14} 136 V190 M${x} 164 H${x + 28}`} stroke="#f6ead6" strokeWidth="1.4" />
        </g>
      ))}
      <path d="M104 234 V190 a16 16 0 0 1 32 0 V234 Z" fill="#8f7fb6" />
      <circle cx="130" cy="214" r="1.6" fill="#e8d3a0" />
      <circle cx="108" cy="104" r="9" fill="#f6ead6" stroke="#b59a68" />
      {/* flowers at base */}
      {[46, 74, 166, 196].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={228 - (i % 2) * 6} r="9" fill="#d9cbe8" />
          <circle cx={x + 6} cy={222 - (i % 2) * 6} r="6" fill="#fff" opacity="0.9" />
          <circle cx={x - 5} cy={224 - (i % 2) * 6} r="5" fill="#a9b4d4" />
        </g>
      ))}
    </svg>
  )
}

/* ---------- Opening-screen art (closer to the reference video) ---------- */

const Peony = ({ cx, cy, r, rot = 0, tint = '#f1e2d6' }) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
    {[1, 0.76, 0.52, 0.3].map((k, ring) =>
      Array.from({ length: 7 - ring }).map((_, i) => (
        <ellipse
          key={`${ring}-${i}`}
          cx="0"
          cy={-r * k * 0.5}
          rx={r * k * 0.42}
          ry={r * k * 0.56}
          fill={ring % 2 ? '#fcf6ef' : tint}
          stroke="#d6c3b4"
          strokeWidth="0.6"
          opacity="0.97"
          transform={`rotate(${(360 / (7 - ring)) * i + ring * 23})`}
        />
      ))
    )}
    <circle r={r * 0.09} fill="#d9bb82" />
  </g>
)

const Leaf = ({ x, y, rot, s = 1, fill = '#8f9cc4' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 0 C 8 -16 30 -20 50 -9 C 34 8 12 12 0 0 Z" fill={fill} opacity="0.88" />
    <path d="M2 0 C 18 -4 32 -6 46 -9" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="0.8" fill="none" />
  </g>
)

const Hydrangea = ({ cx, cy, r = 24, fill = '#e9cdd0' }) => (
  <g>
    {[
      [0, 0], [-9, -6], [9, -6], [-12, 6], [12, 6], [0, 11], [0, -13], [-17, -1], [17, -1], [-6, 17], [7, 16],
    ].map(([dx, dy], i) => (
      <circle key={i} cx={cx + (dx * r) / 24} cy={cy + (dy * r) / 24} r={(r / 24) * 7} fill={i % 3 ? fill : '#fbf1f1'} stroke="#d7b6bb" strokeWidth="0.4" />
    ))}
  </g>
)

/* Flowers sit toward the bottom-left of the box; stems run off the top-right edge.
   Rotate 180deg to hang it off the bottom-left corner instead. */
export function Bouquet({ className = '', style }) {
  return (
    <svg viewBox="0 0 220 240" className={className} style={style} aria-hidden="true">
      <g stroke="#7d8a5d" strokeWidth="2.2" fill="none" opacity="0.75">
        <path d="M220 0 C 190 40 150 70 110 110" />
        <path d="M230 20 C 190 60 140 90 88 130" />
        <path d="M210 -10 C 185 30 160 80 128 150" />
      </g>
      <Leaf x={150} y={78} rot={150} s={1.1} />
      <Leaf x={168} y={44} rot={118} s={0.95} fill="#a9b4d4" />
      <Leaf x={92} y={96} rot={190} s={1.15} fill="#a9b4d4" />
      <Leaf x={120} y={168} rot={-80} s={1.0} />
      <Leaf x={60} y={140} rot={-150} s={0.85} fill="#a9b4d4" />
      <Hydrangea cx={52} cy={104} r={26} fill="#ecd3d6" />
      <Hydrangea cx={150} cy={118} r={22} fill="#f0dcdc" />
      <Peony cx={96} cy={132} r={52} rot={10} tint="#efdccd" />
      <Peony cx={58} cy={176} r={34} rot={-20} tint="#f6ebe2" />
      <Peony cx={142} cy={170} r={30} rot={35} tint="#f3e4d8" />
      <Peony cx={112} cy={80} r={24} rot={-8} tint="#f6ebe2" />
      <Hydrangea cx={96} cy={206} r={20} fill="#e8d0d4" />
      <circle cx="30" cy="150" r="5" fill="#cfd6ea" />
      <circle cx="176" cy="150" r="4" fill="#cfd6ea" />
    </svg>
  )
}

const BALLOON_POS = [
  [22, 20, '#e8d6ae'], [46, 14, '#f3e6c7'], [68, 22, '#d9c08a'],
  [32, 44, '#f1e2bd'], [56, 42, '#dcc592'], [78, 46, '#eadbb6'], [46, 68, '#d6bb82'],
]
export function BalloonCluster({ className = '', size = 90 }) {
  return (
    <svg viewBox="0 0 100 130" width={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id="bshine" cx="32%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="#b9a479" strokeWidth="0.7" fill="none" opacity="0.8">
        {BALLOON_POS.map(([x, y], i) => (
          <path key={i} d={`M${x} ${y + 14} Q ${(x + 50) / 2} 100 50 118`} />
        ))}
      </g>
      {BALLOON_POS.map(([x, y, c], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="13" ry="15" fill={c} stroke="#b99f6c" strokeWidth="0.6" />
          <ellipse cx={x} cy={y} rx="13" ry="15" fill="url(#bshine)" />
          <path d={`M${x - 2} ${y + 15} L${x} ${y + 18} L${x + 2} ${y + 15} Z`} fill="#b99f6c" />
        </g>
      ))}
    </svg>
  )
}

export function Sparkles({ count = 18 }) {
  const dots = Array.from({ length: count }).map((_, i) => ({
    left: (i * 53 + 11) % 100,
    top: (i * 37 + 7) % 100,
    size: 2 + (i % 4),
    delay: (i % 7) * 0.5,
    dur: 2.2 + (i % 5) * 0.6,
  }))
  return (
    <>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-[#f6dc8a]"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, boxShadow: '0 0 8px 2px rgba(246,220,138,0.8)' }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.3, 0.6] }}
          transition={{ duration: d.dur, repeat: Infinity, delay: d.delay }}
        />
      ))}
    </>
  )
}

export function Petals2({ count = 7 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute block rounded-[60%_40%_60%_40%] bg-white/90"
          style={{ left: `${(i * 29 + 8) % 92}%`, top: '-4%', width: 12 + (i % 3) * 5, height: 8 + (i % 3) * 4, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}
          animate={{ y: ['0vh', '108vh'], x: [0, i % 2 ? 40 : -40, 0], rotate: [0, 200, 360] }}
          transition={{ duration: 11 + (i % 4) * 2.5, repeat: Infinity, delay: i * 1.6, ease: 'linear' }}
        />
      ))}
    </>
  )
}

export function Float({ children, className = '', amp = 10, dur = 5, delay = 0, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{ y: [0, -amp, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}
