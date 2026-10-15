import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import config from '../config.json'
import useFit from './useFit'

/* Page 8 — "Dress Code". Text, swatches and ornaments are live (edit config.json -> dressCode).
   The two flower cut-outs are in /assets/page8/ (your PNGs with the baked-in text removed). */

const W = 1024
const H = 1536
const EASE = [0.22, 1, 0.36, 1]
const GOLD = '#c19a5b'
const GREEN = '#1f3b2b'
const P8 = '/assets/page8/'

const SWATCH = {
  emerald: 'radial-gradient(circle at 35% 30%, #25573a 0%, #1b4630 55%, #143522 100%)',
  maroon: 'radial-gradient(circle at 35% 30%, #922a2e 0%, #7b1d22 55%, #621519 100%)',
  navy: 'radial-gradient(circle at 35% 30%, #27498a 0%, #1d3a73 55%, #162d5c 100%)',
  gold: 'linear-gradient(135deg, #c9ac7c 0%, #e4d0a8 38%, #cdb184 62%, #bfa072 100%)',
}
const CX = [177, 399, 619, 845]

const Divider = ({ w = 465 }) => (
  <svg viewBox="0 0 465 60" width={w} height={w * 60 / 465} fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round">
    <path d="M0 30 H178" /><circle cx="184" cy="30" r="3.2" fill={GOLD} stroke="none" />
    <path d="M287 30 H465" /><circle cx="281" cy="30" r="3.2" fill={GOLD} stroke="none" />
    <path d="M232 6 C241 14 243 22 232 30 C221 22 223 14 232 6 Z" fill={GOLD} stroke="none" />
    <path d="M232 30 C238 38 238 46 232 54 C226 46 226 38 232 30 Z" fill={GOLD} stroke="none" />
    <path d="M222 30 C212 20 206 20 204 28 C210 32 216 32 222 30 Z" fill={GOLD} stroke="none" />
    <path d="M242 30 C252 20 258 20 260 28 C254 32 248 32 242 30 Z" fill={GOLD} stroke="none" />
  </svg>
)

const Curl = ({ style, flip }) => (
  <svg viewBox="0 0 60 60" width="60" height="60" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" style={{ position: 'absolute', transform: flip ? 'scaleY(-1)' : undefined, ...style }}>
    <path d="M58 4 C40 4 22 10 10 26 C4 34 8 42 15 40 C22 38 20 30 14 31" /><path d="M58 12 C48 12 38 15 30 22" opacity=".7" />
  </svg>
)

export default function DressCode() {
  const [box, { sc, top }] = useFit(W, 0, H)
  const show = useInView(box, { once: true, amount: 0.4 })
  const d = config.dressCode

  const rise = (delay, x = 0, y = 26) => ({
    initial: { opacity: 0, x, y },
    animate: show ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y },
    transition: { duration: 1, delay, ease: EASE },
  })
  const abs = { position: 'absolute', left: 0, width: W, margin: 0, textAlign: 'center', whiteSpace: 'nowrap' }
  const lw = Math.max(1, 2 * sc)

  return (
    <section
      ref={box}
      className="relative h-[100dvh] w-full snap-start overflow-hidden"
      style={{ background: `#f6e7d3 url(/assets/page3/paper.jpg) center / cover no-repeat` }}
    >
      {/* thin gold frame (top-left stretch hidden behind the flowers, like the reference) */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          left: 22 * sc, right: 22 * sc, top: 18 * sc, bottom: 18 * sc, border: `${lw}px solid rgba(193,154,91,0.85)`, borderRadius: 16 * sc,
          clipPath: `polygon(${640 * sc}px 0, 100% 0, 100% 100%, 0 100%, 0 ${50 * sc}px, ${640 * sc}px ${50 * sc}px)`,
        }}
        initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 1.2, delay: 0.2 }}
      />
      <Curl style={{ right: 12 * sc, top: 10 * sc, transform: `scale(${sc * 1.3})`, transformOrigin: '100% 0' }} />
      <Curl flip style={{ right: 12 * sc, bottom: 10 * sc, transform: `scale(${sc * 1.3},${-sc * 1.3})`, transformOrigin: '100% 100%' }} />

      {/* flowers pinned to the true corners */}
      <motion.img src={P8 + 'tl.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ left: 0, top: 0, width: `${(476 * 1.32 / W) * 100}%`, transformOrigin: '0% 0%' }} {...rise(0.1, -30, -30)} />
      <motion.img src={P8 + 'bl.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ left: 0, bottom: 0, width: `${(515 * 1.24 / W) * 100}%`, transformOrigin: '0% 100%' }} {...rise(0.25, -30, 30)} />

      <div style={{ position: 'absolute', left: '50%', top, width: W, height: H, marginLeft: -W / 2, transform: `scale(${sc})`, transformOrigin: 'top center' }}>
        <motion.h2 {...rise(0.3, 0, 20)} style={{ ...abs, top: 262, left: 0, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 142, lineHeight: '170px', color: GREEN, paddingLeft: 0 }}>
          {d.heading}
        </motion.h2>
        <motion.p {...rise(0.5, 0, 16)} style={{ ...abs, top: 424, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 104, lineHeight: '120px', color: '#9a6f34' }}>
          {d.event}
        </motion.p>

        <motion.div {...rise(0.7, 0, 0)} style={{ position: 'absolute', left: 285, top: 536 }}><Divider /></motion.div>

        {d.text.map((line, i) => (
          <motion.p key={i} {...rise(0.9 + i * 0.15, 0, 20)} style={{ ...abs, top: 622 + i * 61, fontFamily: "'EB Garamond', serif", fontWeight: 400, fontSize: 56, lineHeight: '64px', color: GREEN }}>
            {line}
          </motion.p>
        ))}
        <motion.p {...rise(1.25, 0, 18)} style={{ ...abs, top: 760, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 45, lineHeight: '64px', color: GREEN }}>
          {d.tagline}
        </motion.p>

        {d.colors.map((c, i) => (
          <div key={c.name}>
            <motion.div
              style={{ position: 'absolute', left: CX[i] - 95, top: 975 - 95, width: 190, height: 190 }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.9, delay: 1.4 + i * 0.15, ease: EASE }}
            >
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2.4px solid ${GOLD}` }} />
              <div style={{ position: 'absolute', inset: 9, borderRadius: '50%', background: SWATCH[c.swatch] || c.hex, boxShadow: 'inset 0 0 22px rgba(0,0,0,0.22), inset 0 2px 5px rgba(255,255,255,0.12)' }} />
              {[-1, 1].map((s) => (
                <svg key={s} viewBox="0 0 20 24" width="20" height="24" style={{ position: 'absolute', left: 75, top: s < 0 ? -12 : 190 - 12 }}>
                  <path d="M10 1 L15 12 L10 23 L5 12 Z" fill={GOLD} />
                </svg>
              ))}
            </motion.div>
            <motion.p {...rise(1.6 + i * 0.15, 0, 14)} style={{ position: 'absolute', left: CX[i] - 150, width: 300, top: 1086, margin: 0, textAlign: 'center', fontFamily: "'EB Garamond', serif", fontWeight: 400, fontSize: 40, lineHeight: '38px', color: GREEN }}>
              {c.name.split('\n').map((l, k) => <span key={k} style={{ display: 'block' }}>{l}</span>)}
            </motion.p>
          </div>
        ))}

        <motion.div {...rise(2.1, 0, 0)} style={{ position: 'absolute', left: 345, top: 1197 }}><Divider w={333} /></motion.div>
      </div>
    </section>
  )
}
