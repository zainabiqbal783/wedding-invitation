import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import FallingPetals from './FallingPetals'
import useFit from './useFit'

/* Page 5 of the reference set — "Come celebrate with us" (dark gold page).
   Background: /assets/page5/bg.jpg (your reference with the text, heart and petals removed).
   Heart, ring, wording and falling petals are live. */

const W = 1008
const CLUSTER_TOP = 320 // top of the ring
const CLUSTER_H = 1430 // down to the bottom ornament
const EASE = [0.22, 1, 0.36, 1]

const PETALS = [
  { l: 6, d: 20, delay: 0, s: 1.6, blur: 1, o: 0.9, color: '#f1b4ae' }, { l: 20, d: 25, delay: 8, s: 1.0, blur: 0.4, o: 0.85, color: '#f6c9c2' },
  { l: 38, d: 23, delay: 3, s: 1.2, blur: 1.6, o: 0.5, color: '#eaa9a2' }, { l: 58, d: 27, delay: 12, s: 0.9, blur: 0.4, o: 0.85, color: '#f4bdb6' },
  { l: 76, d: 21, delay: 6, s: 1.7, blur: 1.2, o: 0.8, color: '#f1b4ae' }, { l: 90, d: 26, delay: 15, s: 1.1, blur: 0.6, o: 0.85, color: '#f6c9c2' },
]

const Heart = () => (
  <svg viewBox="0 0 100 90" width="236" height="212">
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6d49a" /><stop offset="0.55" stopColor="#d9a560" /><stop offset="1" stopColor="#a9733a" />
      </linearGradient>
      <filter id="hglow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.2" /></filter>
    </defs>
    <path d="M50 84 C16 58 6 38 12 24 C18 8 40 8 50 26 C60 8 82 8 88 24 C94 38 84 58 50 84 Z" fill="#f0b86a" opacity="0.55" filter="url(#hglow)" />
    <path d="M50 82 C18 57 9 38 14 25 C19 11 40 11 50 28 C60 11 81 11 86 25 C91 38 82 57 50 82 Z" fill="url(#hg)" stroke="#fbe3b3" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M30 24 C36 18 44 20 47 28" stroke="#fff6df" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
)

const Ornament = () => (
  <svg viewBox="0 0 280 60" width="300" height="64" fill="none" stroke="#d6a863" strokeWidth="2.2" strokeLinecap="round">
    <path d="M4 30 H96 C108 30 112 22 122 22" /><path d="M276 30 H184 C172 30 168 22 158 22" />
    <path d="M140 6 C150 14 152 24 140 32 C128 24 130 14 140 6 Z" /><path d="M140 32 C150 40 152 48 140 56 C128 48 130 40 140 32 Z" />
    <path d="M118 30 C124 22 130 22 134 30 C130 38 124 38 118 30 Z" /><path d="M162 30 C156 22 150 22 146 30 C150 38 156 38 162 30 Z" />
    <circle cx="140" cy="31" r="2.4" fill="#d6a863" />
  </svg>
)

export default function Celebrate() {
  const [box, { sc, top }] = useFit(W, CLUSTER_TOP, CLUSTER_H)
  const show = useInView(box, { once: true, amount: 0.45 })
  const rise = (delay, y = 24) => ({
    initial: { opacity: 0, y },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 1.1, delay, ease: EASE },
  })
  const line = { position: 'absolute', left: 0, width: W, margin: 0, textAlign: 'center', whiteSpace: 'nowrap' }
  const title = { ...line, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 126, lineHeight: '140px', color: '#fdf3e3', textShadow: '0 0 30px rgba(255,200,130,0.25)' }
  const body = { ...line, fontFamily: "'EB Garamond', serif", fontWeight: 400, fontSize: 54, lineHeight: '90px', color: '#f6e9d6' }

  return (
    <section
      ref={box}
      className="relative h-[100dvh] w-full snap-start overflow-hidden"
      style={{ background: `#2a1609 url(/assets/page5/bg.jpg) center / cover no-repeat` }}
    >
      <div style={{ position: 'absolute', left: '50%', top, width: W, height: 1900, marginLeft: -W / 2, transform: `scale(${sc})`, transformOrigin: 'top center' }}>
        {/* glowing ring + heart */}
        <motion.div
          style={{ position: 'absolute', left: 512 - 244, top: 568 - 244, width: 488, height: 488, borderRadius: '50%', border: '4px solid rgba(240,196,120,0.9)', boxShadow: '0 0 40px 6px rgba(240,180,90,0.35), inset 0 0 40px 4px rgba(240,180,90,0.25)' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={show ? { opacity: [0.85, 1, 0.85], scale: 1 } : { opacity: 0, scale: 0.85 }}
          transition={show ? { scale: { duration: 1.4, ease: EASE }, opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' } } : {}}
        />
        <motion.div
          style={{ position: 'absolute', left: 512 - 118, top: 568 - 106 }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={show ? { opacity: 1, scale: [1, 1.06, 1] } : { opacity: 0, scale: 0.7 }}
          transition={show ? { opacity: { duration: 1, delay: 0.4 }, scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } } : {}}
        >
          <Heart />
        </motion.div>

        <motion.p {...rise(0.7)} style={{ ...title, top: 946 }}>Come celebrate</motion.p>
        <motion.p {...rise(0.9)} style={{ ...title, top: 1090 }}>with us.</motion.p>
        <motion.svg {...rise(1.1, 0)} viewBox="0 0 20 20" style={{ position: 'absolute', left: 512 - 9, top: 1280 - 9, width: 18, height: 18 }}>
          <path d="M10 1 L14 10 L10 19 L6 10 Z" fill="#d6a863" />
        </motion.svg>
        <motion.p {...rise(1.2)} style={{ ...body, top: 1331 }}>Your presence will add joy,</motion.p>
        <motion.p {...rise(1.4)} style={{ ...body, top: 1421 }}>love and warmth to our</motion.p>
        <motion.p {...rise(1.6)} style={{ ...body, top: 1511 }}>special day.</motion.p>
        <motion.div {...rise(1.9, 12)} style={{ position: 'absolute', left: 0, top: 1676, width: W, display: 'flex', justifyContent: 'center' }}>
          <Ornament />
        </motion.div>
      </div>

      <FallingPetals list={PETALS} active={show} />
    </section>
  )
}
