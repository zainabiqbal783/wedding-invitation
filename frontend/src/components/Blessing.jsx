import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import config from '../config.json'

/* Page 3 ("With love, we begin."), built on a 1024 x 2172 design stage (the reference).
   - paper.jpg is a clean paper background made from the reference
   - the flower PNGs are yours (baked-in partial text/ornament/button pieces were removed)
   - heading + paragraph are live text, so you can edit them in config.json */

const W = 1024
const H = 2172
const A = '/assets/page3/'
const EASE = [0.22, 1, 0.36, 1]

const img = (src, x, y, w, h, extra = {}) => (
  <img
    src={A + src}
    alt=""
    draggable={false}
    style={{ position: 'absolute', left: x, top: y, width: w, height: h, userSelect: 'none', pointerEvents: 'none', ...extra }}
  />
)

export default function Blessing({ onNext }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0.4)
  const [extra, setExtra] = useState(0)
  const show = useInView(box, { once: true, amount: 0.45 })

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

  const mid = extra * 0.5 // centre block sits half-way through any spare height
  const t = config.blessing
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

  return (
    <section
      ref={box}
      className="relative h-[100dvh] w-full snap-start overflow-hidden"
      style={{ background: `#f6e7d3 url(${A}paper.jpg) center / cover no-repeat` }}
    >
      <div
        style={{
          position: 'absolute', left: '50%', top: 0, width: W, height: H + extra,
          marginLeft: -W / 2, transform: `scale(${scale})`, transformOrigin: 'top center',
        }}
      >
        {/* flowers */}
        <motion.div className="absolute" style={{ left: 0, top: 0, width: 650, height: 738, transformOrigin: '0% 0%' }} {...corner(-60, -60, 0.1)}>
          {img('flowers-tl.png', 0, 0, 650, 738)}
        </motion.div>
        <motion.div className="absolute" style={{ left: 0, top: 1448 + extra, width: 531, height: 724, transformOrigin: '0% 100%' }} {...corner(-60, 60, 0.25)}>
          {img('flowers-bl.png', 0, 0, 531, 724)}
        </motion.div>
        <motion.div className="absolute" style={{ left: 673, top: 1386 + extra, width: 351, height: 786, transformOrigin: '100% 100%' }} {...corner(60, 60, 0.2)}>
          {img('flowers-br.png', 0, 0, 351, 786)}
        </motion.div>

        {/* bird (cut out of your reference; replace public/assets/page3/bird.png with your own PNG) */}
        <motion.div
          className="absolute"
          style={{ left: 728, top: 305, width: 169, height: 225 }}
          initial={{ opacity: 0, x: 260, y: -160 }}
          animate={show ? { opacity: 1, x: 0, y: [0, -14, 0], rotate: [0, -2, 0] } : { opacity: 0, x: 260, y: -160 }}
          transition={show ? { opacity: { duration: 0.8, delay: 0.5 }, x: { duration: 2.2, delay: 0.5, ease: 'easeOut' }, y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 2.7 }, rotate: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 2.7 } } : {}}
        >
          {img('bird.png', 0, 0, 169, 225)}
        </motion.div>

        {/* centre block */}
        <motion.div
          className="absolute"
          style={{ left: 148, top: 611 + mid, width: 730, height: 185 }}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 24, filter: 'blur(8px)' }}
          transition={{ duration: 1.5, delay: 0.5, ease: EASE }}
        >
          {img('arabic.png', 0, 0, 730, 185)}
        </motion.div>

        {[['div1.png', 257, 836, 513, 62, 1.0], ['div2.png', 303, 1525, 419, 96, 1.9]].map(([f, x, y, w, h, d]) => (
          <motion.div
            key={f}
            className="absolute"
            style={{ left: x, top: y + mid, width: w, height: h }}
            initial={{ clipPath: 'inset(0 50% 0 50%)', opacity: 0 }}
            animate={show ? { clipPath: 'inset(0 0% 0 0%)', opacity: 1 } : { clipPath: 'inset(0 50% 0 50%)', opacity: 0 }}
            transition={{ duration: 1.3, delay: d, ease: EASE }}
          >
            {img(f, 0, 0, w, h)}
          </motion.div>
        ))}

        <motion.h2
          {...rise(1.2)}
          className="absolute m-0 text-center"
          style={{ left: 0, top: 962 + mid, width: W, paddingLeft: 6, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 82, lineHeight: '110px', color: '#4a2620', whiteSpace: 'nowrap' }}
        >
          {t.heading}
        </motion.h2>

        {t.lines.map((line, i) => (
          <motion.p
            key={i}
            {...rise(1.5 + i * 0.16, 20)}
            className="absolute m-0 text-center"
            style={{ left: 0, top: 1120 + i * 85 + mid, width: W, paddingLeft: 6, fontFamily: "'EB Garamond', serif", fontWeight: 500, fontSize: 57, lineHeight: '85px', color: '#41342f', whiteSpace: 'nowrap' }}
          >
            {line}
          </motion.p>
        ))}

        {/* scroll down button */}
        <motion.button
          onClick={onNext}
          aria-label="Scroll down"
          className="absolute flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 outline-none"
          style={{ left: 262, top: 1892 + extra, width: 496, height: 200 }}
          initial={{ opacity: 0, y: 30 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.2, delay: 2.1, ease: EASE }}
        >
          <motion.span
            className="flex items-center justify-center"
            style={{
              width: 496, height: 130, borderRadius: 65,
              background: 'linear-gradient(180deg,#f5dcb4 0%,#efcd9c 100%)',
              border: '1px solid rgba(196,150,96,0.45)',
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 40, letterSpacing: '0.13em', paddingLeft: '0.13em', color: '#2e1d12',
            }}
            animate={show ? { boxShadow: ['0 8px 18px rgba(150,100,50,0.16)', '0 8px 30px rgba(214,160,80,0.5)', '0 8px 18px rgba(150,100,50,0.16)'] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            SCROLL DOWN
          </motion.span>
          <motion.svg
            viewBox="0 0 50 27" width="54" style={{ marginTop: 22 }}
            animate={show ? { y: [0, 8, 0] } : {}} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M3 3 L25 23 L47 3" fill="none" stroke="#4a2a14" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.button>
      </div>
    </section>
  )
}
