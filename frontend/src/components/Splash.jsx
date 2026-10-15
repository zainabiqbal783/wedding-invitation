import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from './Decor'

/* Opening screen built from the supplied PNGs.
   Everything is placed in "design pixels" on a 941 x 1672 stage (the reference
   image), and the stage is scaled to cover the phone screen. Coordinates below
   are the exact positions measured from the reference. */

const W = 941
const H = 1672
const A = '/assets/front/'

const BOKEH = [
  [18, 14, 90, 0.5], [70, 9, 120, 0.45], [86, 24, 70, 0.55], [44, 30, 140, 0.35],
  [8, 38, 80, 0.4], [92, 40, 100, 0.45], [60, 20, 60, 0.5], [30, 6, 70, 0.4],
]

const PETALS = [
  { l: 12, d: 13, delay: 0, s: 1 }, { l: 28, d: 17, delay: 4, s: 0.8 }, { l: 46, d: 15, delay: 8, s: 1.1 },
  { l: 63, d: 19, delay: 2, s: 0.9 }, { l: 78, d: 14, delay: 6, s: 1.2 }, { l: 90, d: 18, delay: 10, s: 0.85 },
]

function Petal({ l, d, delay, s }) {
  return (
    <motion.svg
      viewBox="0 0 30 40"
      className="pointer-events-none absolute"
      style={{ left: `${l}%`, top: '-6%', width: 22 * s }}
      animate={{ y: ['0vh', '112vh'], x: [0, 30, -20, 10], rotate: [0, 160, 300, 420] }}
      transition={{ duration: d, repeat: Infinity, delay, ease: 'linear' }}
    >
      <path d="M15 0 C29 9 30 28 15 40 C0 28 1 9 15 0 Z" fill="#f2bcc4" opacity="0.92" />
      <path d="M15 4 C22 12 22 26 15 36" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" fill="none" />
    </motion.svg>
  )
}

const Ornament = ({ width = 250 }) => (
  <div className="flex items-center justify-center" style={{ width }}>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a15b]" />
    <svg viewBox="0 0 40 24" width="44" className="mx-1">
      <g fill="none" stroke="#b98d45" strokeWidth="1.2">
        <path d="M20 2 L26 12 L20 22 L14 12 Z" />
        <path d="M6 12 H14 M26 12 H34" />
        <circle cx="20" cy="12" r="2" fill="#b98d45" />
      </g>
    </svg>
    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a15b]" />
  </div>
)

const FLOOR = 'linear-gradient(180deg,#e8b88a 0%,#f0c493 18%,#ecb18c 38%,#fbd4a9 62%,#f5cca5 82%,#e9bc8b 100%)'
const floor = (clip) => (
  <div style={{ position: 'absolute', left: 0, top: 1372, width: 941, height: 300, background: FLOOR, clipPath: clip }} />
)

const img = (src, x, y, w, h, extra = {}) => (
  <img
    src={A + src}
    alt=""
    draggable={false}
    style={{ position: 'absolute', left: x, top: y, width: w, height: h, userSelect: 'none', ...extra }}
  />
)

export default function Splash({ onTap, onDone }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0.5)
  const [opening, setOpening] = useState(false)

  useLayoutEffect(() => {
    const el = box.current
    const calc = () => setScale(Math.max(el.clientWidth / W, el.clientHeight / H))
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const open = () => {
    if (opening) return
    setOpening(true)
    onTap() // start music inside the user gesture
    setTimeout(onDone, 3400)
  }

  const split = (dir) => ({
    animate: opening ? { x: dir * 560 } : { x: 0 },
    transition: { duration: 1.6, delay: 0.55, ease: [0.76, 0, 0.24, 1] },
  })

  return (
    <motion.div
      ref={box}
      className="fixed inset-0 z-50 mx-auto max-w-md overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#fbecc9 0%,#f7e0b0 38%,#f3d49a 72%,#ecc785 100%)' }}
      animate={opening ? { opacity: [1, 1, 0] } : { opacity: 1 }}
      transition={{ duration: 3.4, times: [0, 0.68, 1] }}
    >
      {/* ---- background: warm glow, soft curtain, bokeh (swap for your own background image if you have one) ---- */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 18%, rgba(255,250,228,0.95) 0%, rgba(255,240,200,0.5) 38%, rgba(255,240,200,0) 70%)' }} />
      <div className="absolute inset-y-0 right-0 w-[34%]" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,248,232,0.55) 40%,rgba(236,205,150,0.45) 100%)', filter: 'blur(6px)' }} />
      {BOKEH.map(([x, y, s, o], i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: `${x}%`, top: `${y}%`, width: s * scale * 0.7, height: s * scale * 0.7, background: 'radial-gradient(circle,#fff6d8 0%,rgba(255,226,150,0.55) 55%,rgba(255,226,150,0) 72%)', opacity: o }}
          animate={{ opacity: [o, o * 0.4, o], scale: [1, 1.12, 1] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      <div className="absolute inset-0 overflow-hidden"><Sparkles count={26} /></div>

      {/* ---- stage ---- */}
      <div
        style={{
          position: 'absolute', left: '50%', top: '50%', width: W, height: H,
          marginLeft: -W / 2, marginTop: -H / 2, transform: `scale(${scale})`, transformOrigin: 'center',
        }}
      >
        {/* heading */}
        <motion.div
          className="absolute flex flex-col items-center"
          style={{ left: 0, top: 322, width: W }}
          animate={opening ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Ornament width={250} />
          <p className="font-serif uppercase text-[#a8803c]" style={{ fontSize: 24, letterSpacing: '0.34em', margin: '26px 0 24px', paddingLeft: '0.34em' }}>
            A Special Invitation
          </p>
          <Ornament width={250} />
        </motion.div>

        {/* left door: envelope's left half + left flowers/candle */}
        <motion.div className="absolute inset-0" {...split(-1)}>
          {floor('inset(0 49.8% 0 0)')}
          {img('envelope.png', 9, 555, 924, 826, { clipPath: 'inset(0 49.8% 0 0)' })}
          {img('floor-center.png', 421, 1360, 115, 312, { clipPath: 'inset(0 50.4% 0 0)' })}
          {img('half-left.png', 0, 502, 441, 1170)}
        </motion.div>

        {/* right door */}
        <motion.div className="absolute inset-0" {...split(1)}>
          {floor('inset(0 0 0 49.8%)')}
          {img('envelope.png', 9, 555, 924, 826, { clipPath: 'inset(0 0 0 49.8%)' })}
          {img('floor-center.png', 421, 1360, 115, 312, { clipPath: 'inset(0 0 0 49.6%)' })}
          {img('half-right.png', 516, 654, 425, 1018)}
        </motion.div>

        {/* candle glow */}
        <motion.div
          className="absolute rounded-full"
          style={{ left: -40, top: 1190, width: 190, height: 190, background: 'radial-gradient(circle,rgba(255,214,120,0.85) 0%,rgba(255,200,100,0) 65%)', mixBlendMode: 'screen' }}
          animate={opening ? { opacity: 0 } : { opacity: [0.55, 0.95, 0.65, 1, 0.6] }}
          transition={opening ? { duration: 0.5 } : { duration: 2.2, repeat: Infinity }}
        />

        {/* seal */}
        <motion.div
          className="absolute"
          style={{ left: 320, top: 739, width: 291, height: 281 }}
          animate={opening ? { scale: [1, 1.18, 1.5], opacity: [1, 1, 0], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(2)'] } : { scale: [1, 1.035, 1] }}
          transition={opening ? { duration: 1.1, times: [0, 0.4, 1] } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {img('seal.png', 0, 0, 291, 281, { filter: 'drop-shadow(0 14px 18px rgba(110,75,20,0.35))' })}
          {/* glint */}
          <motion.svg
            viewBox="0 0 40 40"
            style={{ position: 'absolute', left: 205, top: 8, width: 70, height: 70 }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.15, 0.7], rotate: [0, 45, 0] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          >
            <path d="M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z" fill="#fffbe8" />
          </motion.svg>
        </motion.div>

        {/* golden light burst from the seal */}
        {opening && (
          <motion.div
            className="pointer-events-none absolute rounded-full"
            style={{ left: 466 - 700, top: 880 - 700, width: 1400, height: 1400, background: 'radial-gradient(circle,#fffbe6 0%,#ffe9a0 30%,rgba(246,205,110,0) 68%)' }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 0.9], scale: [0.2, 1, 1.6] }}
            transition={{ duration: 2.2, delay: 0.25, ease: 'easeOut' }}
          />
        )}

        {/* corner flowers */}
        <motion.div
          className="absolute"
          style={{ left: 0, top: 0, width: 442, height: 745 }}
          animate={opening ? { x: -160, y: -160, opacity: 0 } : { rotate: [0, 0.6, 0] }}
          transition={opening ? { duration: 1.6, delay: 0.5, ease: 'easeInOut' } : { duration: 6, repeat: Infinity }}
        >
          {img('corner.png', 0, 0, 442, 745)}
        </motion.div>

        {/* bird */}
        <motion.div
          className="absolute"
          style={{ left: 640, top: 186, width: 251, height: 320 }}
          animate={opening ? { x: 420, y: -380, opacity: 0, rotate: 8 } : { y: [0, -14, 0], x: [0, -6, 0] }}
          transition={opening ? { duration: 1.8, delay: 0.3, ease: 'easeIn' } : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {img('bird.png', 0, 0, 251, 320)}
        </motion.div>
      </div>

      {/* falling pink petals (above everything) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PETALS.map((p, i) => <Petal key={i} {...p} />)}
      </div>

      {/* whole screen is the tap target */}
      <button
        onClick={open}
        aria-label="Tap to open the invitation"
        className="absolute inset-0 z-10 cursor-pointer bg-transparent outline-none"
      />
    </motion.div>
  )
}
