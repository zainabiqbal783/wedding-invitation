import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import config from '../config.json'
import FallingPetals from './FallingPetals'

/* Page 4 — "Counting the days." (dark, lantern-lit).
   The background is made from your reference screen with the baked-in text/boxes removed;
   the countdown boxes, wording and button are live. Target date: config.weddingDate. */

const W = 988
const H = 2172
const EASE = [0.22, 1, 0.36, 1]
const GOLD = '#c9a15b'

const GLOWS = [ // lantern lamps, in stage coordinates
  { x: 107, y: 353, r: 190, d: 3.1 }, { x: 683, y: 173, r: 80, d: 2.4 }, { x: 707, y: 387, r: 95, d: 2.9 },
  { x: 613, y: 433, r: 80, d: 3.4 }, { x: 813, y: 333, r: 95, d: 2.6 }, { x: 907, y: 273, r: 105, d: 3.7 },
]
const BOKEH = [
  [12, 62, 7, 0], [28, 80, 5, 2], [46, 70, 6, 4], [64, 86, 8, 1], [82, 66, 5, 3], [20, 40, 4, 5], [74, 48, 6, 2.5], [54, 30, 5, 6], [90, 88, 7, 3.5], [36, 92, 5, 1.5],
]
const PETALS = [
  { l: 6, d: 19, delay: 0, s: 1.1, o: 0.9 }, { l: 24, d: 23, delay: 6, s: 0.8, blur: 1, o: 0.7 }, { l: 44, d: 20, delay: 11, s: 1.2, o: 0.9 },
  { l: 62, d: 25, delay: 3, s: 0.9, blur: 1.5, o: 0.7 }, { l: 78, d: 21, delay: 8, s: 1.1, o: 0.9 }, { l: 90, d: 24, delay: 14, s: 0.8, blur: 1, o: 0.7 },
]

function useCountdown(target) {
  const calc = () => {
    const ms = Math.max(0, new Date(target).getTime() - Date.now())
    const s = Math.floor(ms / 1000)
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

const Star = ({ x, y, show, delay }) => (
  <motion.svg
    viewBox="0 0 20 20"
    className="absolute"
    style={{ left: x - 11, top: y - 11, width: 22, height: 22 }}
    initial={{ opacity: 0, scale: 0 }}
    animate={show ? { opacity: [0.5, 1, 0.5], scale: 1 } : { opacity: 0, scale: 0 }}
    transition={{ scale: { duration: 0.8, delay }, opacity: { duration: 2.6, repeat: Infinity, delay } }}
  >
    <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={GOLD} />
  </motion.svg>
)

const Flourish = () => (
  <svg viewBox="0 0 280 80" width="277" height="80">
    <g fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round">
      <path d="M2 40 H100" /><path d="M180 40 H278" />
      <path d="M100 40 C108 40 110 32 118 32 C126 32 126 40 120 42 C114 44 110 38 116 36" />
      <path d="M180 40 C172 40 170 32 162 32 C154 32 154 40 160 42 C166 44 170 38 164 36" />
      <path d="M140 12 C150 20 150 30 140 40 C130 30 130 20 140 12 Z" />
      <path d="M140 40 C150 50 150 60 140 68 C130 60 130 50 140 40 Z" />
      <path d="M124 40 H156" />
    </g>
    <circle cx="140" cy="40" r="3" fill={GOLD} />
  </svg>
)

function Box({ value, label, i, show }) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: [37, 276, 513, 749][i], top: 844, width: 222, height: 311, borderRadius: 48,
        border: '1.6px solid rgba(196,150,88,0.78)',
        background: 'linear-gradient(180deg,rgba(34,17,9,0.66) 0%,rgba(22,10,5,0.78) 100%)',
        backdropFilter: 'blur(2.5px)', WebkitBackdropFilter: 'blur(2.5px)', boxShadow: 'inset 0 0 36px rgba(0,0,0,0.3)',
      }}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.94 }}
      transition={{ duration: 1, delay: 0.7 + i * 0.13, ease: EASE }}
    >
      <div className="absolute inset-x-0 flex justify-center overflow-hidden" style={{ top: 38, height: 120 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: -36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 36, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ fontFamily: "'EB Garamond', serif", fontWeight: 400, fontSize: 100, lineHeight: '120px', color: '#fbf1e2', fontVariantNumeric: 'lining-nums' }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-0 text-center" style={{ top: 189, fontFamily: "'EB Garamond', serif", fontSize: 52, lineHeight: '60px', color: '#f1e2cd' }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function Countdown({ onNext }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0.4)
  const [extra, setExtra] = useState(0)
  const show = useInView(box, { once: true, amount: 0.45 })
  const t = useCountdown(config.weddingDate)
  const c = config.countdown

  useLayoutEffect(() => {
    const el = box.current
    const calc = () => {
      const s = Math.min(el.clientWidth / W, el.clientHeight / H)
      setScale(s)
      setExtra(Math.max(0, el.clientHeight / s - H))
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const mid = extra * 0.5
  const rise = (delay, y = 30) => ({
    initial: { opacity: 0, y },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 1.1, delay, ease: EASE },
  })
  const serifItalic = { fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontWeight: 400, color: '#fbf1e2', whiteSpace: 'nowrap', margin: 0 }

  return (
    <section
      ref={box}
      className="relative h-[100dvh] w-full snap-start overflow-hidden"
      style={{ background: `#24120a url(/assets/page4/bg.jpg) center / cover no-repeat` }}
    >
      {/* lantern glow + drifting golden bokeh */}
      <div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: 'screen' }}>
        {BOKEH.map(([l, tp, s, d], i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ left: `${l}%`, top: `${tp}%`, width: s * 2.4, height: s * 2.4, background: 'radial-gradient(circle,rgba(255,206,120,0.9) 0%,rgba(255,190,90,0) 70%)' }}
            animate={{ y: [0, -40, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: d, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', left: '50%', top: 0, width: W, height: H + extra, marginLeft: -W / 2, transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        {GLOWS.map((g, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: g.x - g.r, top: g.y - g.r, width: g.r * 2, height: g.r * 2, background: 'radial-gradient(circle,rgba(255,184,84,0.55) 0%,rgba(255,170,70,0) 66%)', mixBlendMode: 'screen' }}
            animate={{ opacity: [0.45, 0.95, 0.6, 1, 0.5] }}
            transition={{ duration: g.d, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <motion.h2 {...rise(0.1)} className="absolute text-center" style={{ ...serifItalic, left: 0, top: 613 + mid, width: W, fontSize: 112, lineHeight: '140px' }}>
          {c.title}
        </motion.h2>
        <Star x={494} y={796 + mid} show={show} delay={0.5} />

        <div className="absolute inset-0" style={{ top: mid }}>
          <Box value={t.d} label="Days" i={0} show={show} />
          <Box value={String(t.h).padStart(2, '0')} label="Hours" i={1} show={show} />
          <Box value={String(t.m).padStart(2, '0')} label="Minutes" i={2} show={show} />
          <Box value={String(t.s).padStart(2, '0')} label="Seconds" i={3} show={show} />
        </div>

        <Star x={494} y={1220 + mid} show={show} delay={1.4} />
        <motion.p {...rise(1.5)} className="absolute text-center" style={{ ...serifItalic, left: 0, top: 1281 + mid, width: W, fontSize: 78, lineHeight: '100px', color: '#f1e2cd' }}>
          {c.until}
        </motion.p>
        <motion.p {...rise(1.75)} className="absolute text-center" style={{ ...serifItalic, left: 0, top: 1387 + mid, width: W, fontSize: 97, lineHeight: '120px' }}>
          {c.closing}
        </motion.p>
        <motion.div
          className="absolute flex justify-center"
          style={{ left: 0, top: 1553 + mid, width: W }}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={show ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.4 }}
          transition={{ duration: 1.2, delay: 2.0, ease: EASE }}
        >
          <Flourish />
        </motion.div>

        {/* scroll down */}
        <motion.button
          onClick={onNext}
          aria-label="Scroll down"
          className="absolute flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 outline-none"
          style={{ left: 256, top: 1893 + extra, width: 497, height: 200 }}
          initial={{ opacity: 0, y: 30 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.2, delay: 2.2, ease: EASE }}
        >
          <motion.span
            className="flex items-center justify-center"
            style={{
              width: 497, height: 124, borderRadius: 62,
              background: 'linear-gradient(180deg,rgba(196,152,92,0.82) 0%,rgba(150,108,58,0.78) 100%)',
              border: '1.6px solid rgba(222,178,108,0.75)',
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 34, letterSpacing: '0.26em', paddingLeft: '0.26em', color: '#3a2412',
            }}
            animate={show ? { boxShadow: ['0 0 0 0 rgba(214,170,90,0)', '0 0 34px 6px rgba(214,170,90,0.45)', '0 0 0 0 rgba(214,170,90,0)'] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            SCROLL DOWN
          </motion.span>
          <motion.svg viewBox="0 0 50 27" width="52" style={{ marginTop: 26 }} animate={show ? { y: [0, 8, 0] } : {}} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <path d="M3 3 L25 23 L47 3" fill="none" stroke={GOLD} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.button>
      </div>

      <FallingPetals list={PETALS} active={show} />
    </section>
  )
}
