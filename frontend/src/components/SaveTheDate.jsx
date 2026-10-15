import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import config from '../config.json'
import FallingPetals from './FallingPetals'
import useFit from './useFit'

/* Page 5 — "Save the date". Paper background and flowers come from the page-3 assets;
   the card, date and wording are live (edit config.json: dateDisplay + saveTheDate). */

const W = 924
const CLUSTER_TOP = 386 // ornament above the card
const CLUSTER_H = 1190 // down to the last line of the note
const EASE = [0.22, 1, 0.36, 1]
const P3 = '/assets/page3/'
const COPPER = '#b0663a'

const PETALS = [
  { l: 8, d: 22, delay: 0, s: 1.7, blur: 2.2, o: 0.55, color: '#f2c3b4' }, { l: 22, d: 26, delay: 9, s: 1.2, blur: 1.2, o: 0.7, color: '#f4b9b0' },
  { l: 48, d: 24, delay: 4, s: 1.9, blur: 2.6, o: 0.5, color: '#f7d9c6' }, { l: 66, d: 28, delay: 13, s: 1.1, blur: 1, o: 0.7, color: '#f1a9a0' },
  { l: 82, d: 23, delay: 7, s: 2.1, blur: 2.4, o: 0.5, color: '#f2c3b4' }, { l: 92, d: 27, delay: 16, s: 1.0, blur: 1, o: 0.7, color: '#f4b9b0' },
]

const TopOrnament = () => (
  <svg viewBox="0 0 204 46" width="260" height="59" fill="none" stroke="#a96a3e" strokeWidth="2.2" strokeLinecap="round">
    <path d="M2 30 C30 30 52 28 74 22 C84 20 92 24 100 14 C108 24 116 20 130 22 C152 28 174 30 202 30" />
    <path d="M102 6 C110 12 110 20 102 28 C94 20 94 12 102 6 Z" fill="#fbf2e4" />
    <path d="M74 22 C70 30 78 34 84 30" /><path d="M130 22 C134 30 126 34 120 30" />
    <circle cx="102" cy="17" r="2" fill="#a96a3e" />
  </svg>
)
const MidOrnament = () => (
  <svg viewBox="0 0 306 64" width="360" height="75" fill="none" stroke="#b27c4e" strokeWidth="2.1" strokeLinecap="round">
    <path d="M2 32 H118" /><path d="M188 32 H304" />
    <path d="M153 6 C165 14 168 24 153 32 C138 24 141 14 153 6 Z" /><path d="M153 32 C168 40 165 50 153 58 C141 50 138 40 153 32 Z" />
    <path d="M128 32 C136 22 142 22 146 32 C142 42 136 42 128 32 Z" /><path d="M178 32 C170 22 164 22 160 32 C164 42 170 42 178 32 Z" />
    <circle cx="153" cy="32" r="2.4" fill="#b27c4e" />
  </svg>
)

export default function SaveTheDate() {
  const [box, { sc, top }] = useFit(W, CLUSTER_TOP, CLUSTER_H)
  const show = useInView(box, { once: true, amount: 0.45 })
  const d = config.dateDisplay
  const note = config.saveTheDate.note
  const weekday = d.weekday.charAt(0) + d.weekday.slice(1).toLowerCase()

  const rise = (delay, y = 28) => ({
    initial: { opacity: 0, y },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 1.1, delay, ease: EASE },
  })
  const corner = (fromX, fromY, delay) => ({
    initial: { opacity: 0, x: fromX, y: fromY },
    animate: show ? { opacity: 1, x: 0, y: 0, rotate: [0, 0.9, 0, -0.7, 0] } : { opacity: 0, x: fromX, y: fromY },
    transition: show
      ? { opacity: { duration: 1.2, delay }, x: { duration: 1.5, delay, ease: EASE }, y: { duration: 1.5, delay, ease: EASE }, rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.5 } }
      : {},
  })
  const text = { fontFamily: "'EB Garamond', serif", position: 'absolute', left: 0, width: W, textAlign: 'center', margin: 0, whiteSpace: 'nowrap' }

  return (
    <section
      ref={box}
      className="relative h-[100dvh] w-full snap-start overflow-hidden"
      style={{ background: `#f6e7d3 url(${P3}paper.jpg) center / cover no-repeat` }}
    >
      {/* Flowers: sized in % of the screen and pinned to the TRUE corners, so they always bleed off the edges
          (the PNGs' flat cut edges sit just outside the screen). */}
      <motion.img src={P3 + 'flowers-tl.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ left: '-3%', top: '-1.5%', width: '54%', transformOrigin: '0% 0%' }} {...corner(-50, -50, 0.1)} />
      <motion.img src={P3 + 'flowers-bl.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ left: '-5%', bottom: '-1%', width: '46%', transformOrigin: '0% 100%' }} {...corner(-50, 50, 0.25)} />
      <motion.img src={P3 + 'flowers-br.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ right: '-4%', bottom: '-3%', width: '38%', transformOrigin: '100% 100%' }} {...corner(50, 50, 0.2)} />

      {/* content stage: always scaled to the full screen width */}
      <div style={{ position: 'absolute', left: '50%', top, width: W, height: 1700, marginLeft: -W / 2, transform: `scale(${sc})`, transformOrigin: 'top center' }}>
        {/* card frame: one SVG path with a gap at the top for the ornament */}
        <motion.svg
          viewBox="0 0 734 843"
          className="absolute"
          style={{ left: 113, top: 421, width: 734, height: 843, overflow: 'visible' }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
          transition={{ duration: 1.3, delay: 0.3, ease: EASE }}
        >
          <path
            d="M485 1 H704 Q733 1 733 30 V813 Q733 842 704 842 H30 Q1 842 1 813 V30 Q1 1 30 1 H249"
            fill="rgba(255,250,240,0.18)" stroke="rgba(176,112,68,0.62)" strokeWidth="2.4" strokeLinecap="round"
          />
        </motion.svg>
        <motion.div {...rise(0.6, 12)} className="absolute flex justify-center" style={{ left: 0, top: 386, width: W }}>
          <div style={{ marginLeft: -2 }}><TopOrnament /></div>
        </motion.div>

        <motion.p {...rise(0.8)} style={{ ...text, top: 483, fontWeight: 500, fontSize: 46, letterSpacing: '0.23em', paddingLeft: '0.23em', lineHeight: '60px', color: '#4c2d27' }}>
          SAVE THE DATE
        </motion.p>
        <motion.p
          {...rise(1.0, 40)}
          style={{
            ...text, top: 566, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 262, lineHeight: '300px', fontVariantNumeric: 'lining-nums',
            background: 'linear-gradient(180deg,#bd7040 0%,#a2602f 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
          }}
        >
          {d.day}
        </motion.p>
        <motion.p {...rise(1.25)} style={{ ...text, top: 849, fontWeight: 500, fontSize: 64, letterSpacing: '0.17em', paddingLeft: '0.17em', lineHeight: '80px', color: '#3d2723', WebkitTextStroke: '0.7px #3d2723', fontVariantNumeric: 'lining-nums' }}>
          {d.month} {d.year}
        </motion.p>
        <motion.p {...rise(1.45)} style={{ ...text, top: 1009, fontWeight: 400, fontSize: 68, lineHeight: '80px', color: '#3b2a26', fontVariantNumeric: 'lining-nums' }}>
          {weekday}&nbsp;&nbsp;·&nbsp;&nbsp;{d.time}
        </motion.p>
        <motion.div
          className="absolute flex justify-center"
          style={{ left: 0, top: 1144, width: W }}
          initial={{ opacity: 0, scaleX: 0.3 }}
          animate={show ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.3 }}
          transition={{ duration: 1.2, delay: 1.7, ease: EASE }}
        >
          <MidOrnament />
        </motion.div>

        {note.map((line, i) => (
          <motion.p
            key={i}
            {...rise(2.0 + i * 0.25, 20)}
            style={{ ...text, top: 1400 + i * 80, fontFamily: "'Dancing Script', cursive", fontWeight: 500, fontSize: 70, lineHeight: '80px', color: '#5d3030' }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <FallingPetals list={PETALS} active={show} />
    </section>
  )
}
