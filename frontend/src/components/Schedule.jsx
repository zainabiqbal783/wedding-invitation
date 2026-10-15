import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import config from '../config.json'
import useFit from './useFit'

/* Page 6 — "Our Schedule". Timeline items come from config.json -> schedule
   (time, title, note, icon). Flowers are the cut-outs in /assets/page6/. */

const W = 1008
const CLUSTER_TOP = 200 // title
const CLUSTER_H = 1580 // down to the end of the timeline line
const EASE = [0.22, 1, 0.36, 1]
const P3 = '/assets/page3/'
const P6 = '/assets/page6/'
const FIRST_Y = 570 // centre of the first circle
const STEP = 330 // distance between circles

const ICONS = {
  guests: (
    <>
      <circle cx="8.2" cy="8" r="2.7" /><circle cx="15.8" cy="8" r="2.7" />
      <path d="M2.8 18.5c.3-3 2.4-5 5.4-5s5.1 2 5.4 5Z" /><path d="M13.6 13.7c.7-.2 1.4-.3 2.2-.2 2.5.3 4.4 2.2 4.7 5" />
    </>
  ),
  reception: <path d="M12 20.5S4.5 16.2 4.5 10.2A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7.5 2.5c0 6-7.5 10.3-7.5 10.3Z" />,
  dinner: (
    <>
      <path d="M6.2 3v6.5a2 2 0 0 0 4 0V3M8.2 3v18" /><path d="M16.5 21V3c-2.2 1.5-3.2 4-3.2 7.5h3.2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" />
    </>
  ),
}

const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" width="92" height="92" fill="none" stroke="#fff8ec" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    {ICONS[name] || ICONS.music}
  </svg>
)

export default function Schedule() {
  const [box, { sc, top }] = useFit(W, CLUSTER_TOP, CLUSTER_H)
  const show = useInView(box, { once: true, amount: 0.4 })
  const items = config.schedule

  const rise = (delay, x = 0, y = 26) => ({
    initial: { opacity: 0, x, y },
    animate: show ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y },
    transition: { duration: 1, delay, ease: EASE },
  })
  const txt = { position: 'absolute', left: 323, margin: 0, whiteSpace: 'nowrap', fontFamily: "'EB Garamond', serif", fontWeight: 400, color: '#2f2420', height: 80, lineHeight: '80px' }
  const lineBottom = FIRST_Y + (items.length - 1) * STEP + 195

  return (
    <section
      ref={box}
      className="relative h-[100dvh] w-full snap-start overflow-hidden"
      style={{ background: `#f6e7d3 url(${P3}paper.jpg) center / cover no-repeat` }}
    >
      {/* flowers pinned to the true corners (flat cut edges sit just off-screen) */}
      <motion.img src={P6 + 'tl.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ left: '-1%', top: '-1%', width: '36%', transformOrigin: '0% 0%' }} {...rise(0.1, -30, -30)} />
      <motion.img src={P6 + 'bl.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ left: 0, bottom: '-0.5%', width: '33%', transformOrigin: '0% 100%' }} {...rise(0.25, -30, 30)} />
      <motion.img src={P6 + 'br.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ right: '-0.5%', bottom: '-0.5%', width: '32%', transformOrigin: '100% 100%' }} {...rise(0.2, 30, 30)} />

      <div style={{ position: 'absolute', left: '50%', top, width: W, height: 2000, marginLeft: -W / 2, transform: `scale(${sc})`, transformOrigin: 'top center' }}>
        <motion.h2
          {...rise(0.3, 0, 20)}
          style={{ position: 'absolute', left: 0, top: 205, width: W, margin: 0, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 118, lineHeight: '150px', color: '#4a1a12' }}
        >
          Our Schedule
        </motion.h2>
        <motion.svg {...rise(0.5, 0, 0)} viewBox="0 0 20 20" style={{ position: 'absolute', left: 503 - 11, top: 386 - 11, width: 22, height: 22 }}>
          <path d="M10 1 L14 10 L10 19 L6 10 Z" fill="#c9985a" />
        </motion.svg>

        {/* vertical line */}
        <motion.div
          style={{ position: 'absolute', left: 158, top: 432, width: 6, height: lineBottom - 432, background: 'linear-gradient(180deg,#d3a76c,#c08f50)', borderRadius: 3, transformOrigin: 'top' }}
          initial={{ scaleY: 0 }}
          animate={show ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
        />

        {items.map((it, i) => {
          const cy = FIRST_Y + i * STEP
          const d = 0.7 + i * 0.35
          return (
            <div key={it.title}>
              <motion.div
                {...rise(d, 0, 0)}
                style={{ position: 'absolute', left: 78, top: cy - 83, width: 166, height: 166, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 35% 30%, #d3a76a 0%, #c0904f 55%, #b3803f 100%)', boxShadow: '0 8px 22px rgba(150,100,45,0.25)' }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.9, delay: d, ease: EASE }}
              >
                <Icon name={it.icon} />
              </motion.div>
              <motion.p {...rise(d + 0.15, 30, 0)} style={{ ...txt, top: cy - 105, fontSize: 62 }}>{it.time}</motion.p>
              <motion.p {...rise(d + 0.25, 30, 0)} style={{ ...txt, top: cy - 25, fontSize: 62 }}>{it.title}</motion.p>
              <motion.p {...rise(d + 0.35, 30, 0)} style={{ ...txt, top: cy + 50, fontSize: 48, color: '#3b2a26' }}>{it.note}</motion.p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
