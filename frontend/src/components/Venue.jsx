import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import config from '../config.json'

/* Page 7 — "Our Venue". Name, city and map link come from config.json -> venue.
   Illustration = your reference with its wording removed (/assets/page7/bgA.jpg, bgB.jpg);
   corner flowers are your transparent PNGs (tl.png, bl.png). */

const W = 1024
const A_H = 1262 // height of the top picture (sky + building)
const B_H = 274 // height of the bottom picture (paper + corner flowers)
const FULL_H = 1536
const EASE = [0.22, 1, 0.36, 1]
const P7 = '/assets/page7/'
const PAPER = '#faf0e2'

export default function Venue() {
  const v = config.venue
  const box = useRef(null)
  const show = useInView(box, { once: true, amount: 0.45 })
  const [m, setM] = useState({ sc: 0.4, gap: 0 })
  useLayoutEffect(() => {
    const el = box.current
    const calc = () => {
      const sc = el.clientWidth / W
      setM({ sc, gap: Math.max(0, el.clientHeight - FULL_H * sc) })
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const { sc, gap } = m
  const fade = gap > 1 // only blend the two pictures when a screen is tall enough to separate them

  const rise = (delay, y = 24) => ({
    initial: { opacity: 0, y },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 1.1, delay, ease: EASE },
  })
  const centre = { position: 'absolute', left: 0, width: W, margin: 0, textAlign: 'center', whiteSpace: 'nowrap' }

  return (
    <section ref={box} className="relative h-[100dvh] w-full snap-start overflow-hidden" style={{ background: PAPER }}>
      {/* top picture, pinned to the top, full width */}
      <img src={P7 + 'bgA.jpg'} alt="" draggable={false} className="pointer-events-none absolute left-0 top-0 w-full select-none"
        style={{ WebkitMaskImage: fade ? 'linear-gradient(#000 96%, transparent)' : undefined, maskImage: fade ? 'linear-gradient(#000 96%, transparent)' : undefined }} />
      {/* bottom picture, pinned to the bottom */}
      <img src={P7 + 'bgB.jpg'} alt="" draggable={false} className="pointer-events-none absolute bottom-0 left-0 w-full select-none"
        style={{ WebkitMaskImage: fade ? 'linear-gradient(transparent, #000 12%)' : undefined, maskImage: fade ? 'linear-gradient(transparent, #000 12%)' : undefined }} />

      {/* your transparent flower PNGs, at the same size/position as in the reference */}
      <motion.img src={P7 + 'tl.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ left: 0, top: 0, width: `${(381 / W) * 100}%`, transformOrigin: '0% 0%' }}
        initial={{ opacity: 0.0 }} animate={show ? { opacity: 1, rotate: [0, 0.8, 0, -0.6, 0] } : { opacity: 0 }}
        transition={show ? { opacity: { duration: 1.2 }, rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } } : {}} />
      <motion.img src={P7 + 'bl.png'} alt="" draggable={false} className="pointer-events-none absolute select-none"
        style={{ left: 0, bottom: 0, width: `${(265 / W) * 100}%`, transformOrigin: '0% 100%' }}
        initial={{ opacity: 0 }} animate={show ? { opacity: 1, rotate: [0, -0.8, 0, 0.6, 0] } : { opacity: 0 }}
        transition={show ? { opacity: { duration: 1.2, delay: 0.2 }, rotate: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } } : {}} />

      {/* wording + button: scaled to the screen width, sits right under the picture */}
      <div style={{ position: 'absolute', left: '50%', top: 0, width: W, height: FULL_H, marginLeft: -W / 2, transform: `scale(${sc})`, transformOrigin: 'top center' }}>
        <motion.h2 {...rise(0.3)} style={{ ...centre, top: 200, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 136, lineHeight: '150px', color: '#8a5a1c' }}>
          Our Venue
        </motion.h2>
        <motion.svg {...rise(0.5, 0)} viewBox="0 0 360 40" style={{ position: 'absolute', left: 332, top: 357, width: 360, height: 40 }} fill="none" stroke="#9a6a26" strokeWidth="3" strokeLinecap="round">
          <path d="M2 20 H138" /><path d="M222 20 H358" />
          <path d="M180 6 C190 12 192 18 180 22 C168 18 170 12 180 6 Z" fill="#9a6a26" /><path d="M180 22 C190 26 190 32 180 36 C170 32 170 26 180 22 Z" fill="#9a6a26" />
          <path d="M158 20 C164 12 172 12 176 20 C172 28 164 28 158 20 Z" /><path d="M202 20 C196 12 188 12 184 20 C188 28 196 28 202 20 Z" />
        </motion.svg>

        <motion.p {...rise(0.9)} style={{ ...centre, top: 1160, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 90, lineHeight: '100px', color: '#1d4a34' }}>
          {v.name}
        </motion.p>
        <motion.div {...rise(1.1)} style={{ ...centre, top: 1264, height: 66, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
          <svg viewBox="0 0 24 24" width="58" height="58" fill="none" stroke="#2a4b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.5S5 14.8 5 9.5a7 7 0 0 1 14 0C19 14.8 12 21.5 12 21.5Z" /><circle cx="12" cy="9.5" r="2.6" />
          </svg>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 56, color: '#3a2a22' }}>{v.city}</span>
        </motion.div>
        <motion.a
          {...rise(1.3)}
          href={v.mapUrl} target="_blank" rel="noreferrer"
          style={{ position: 'absolute', left: 287, top: 1362, width: 461, height: 103, borderRadius: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, textDecoration: 'none', color: '#fff8ec', fontFamily: "'EB Garamond', serif", fontSize: 54, background: 'linear-gradient(180deg,#c29a52,#a97b32)', boxShadow: '0 10px 26px rgba(150,100,40,0.28)', pointerEvents: 'auto' }}
        >
          View location
          <svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="#fff8ec" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </svg>
        </motion.a>
      </div>
    </section>
  )
}
