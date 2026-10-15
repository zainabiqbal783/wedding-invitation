import { motion } from 'framer-motion'

/* Soft petals drifting down the whole page. `list` items: { l: left %, d: seconds, delay, s: size, blur, o: opacity } */
export default function FallingPetals({ list, color = '#f4b9b0', active = true }) {
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {list.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 30 40"
          className="absolute"
          style={{ left: `${p.l}%`, top: '-8%', width: 22 * p.s, filter: p.blur ? `blur(${p.blur}px)` : undefined, opacity: p.o ?? 0.85 }}
          animate={{ y: ['0vh', '115vh'], x: [0, 30, -22, 12], rotate: [0, 140, 280, 420] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        >
          <path d="M15 0 C29 9 30 28 15 40 C0 28 1 9 15 0 Z" fill={p.color || color} />
          <path d="M15 4 C22 12 22 26 15 36" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" fill="none" />
        </motion.svg>
      ))}
    </div>
  )
}
