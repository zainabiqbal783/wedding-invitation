
import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import '@fontsource/playfair-display/400-italic.css'
import config from '../config.json'

const W = 941
const H = 1672
const A = '/assets/page2/'

const PETALS = [
  { l: 8, d: 16, delay: 0, s: 1 },
  { l: 24, d: 20, delay: 5, s: 0.8 },
  { l: 41, d: 17, delay: 9, s: 1.1 },
  { l: 58, d: 21, delay: 2, s: 0.9 },
  { l: 74, d: 18, delay: 7, s: 1.15 },
  { l: 90, d: 22, delay: 11, s: 0.85 },
]

function Petal({ l, d, delay, s }) {
  return (
    <motion.svg
      viewBox="0 0 30 40"
      className="pointer-events-none absolute"
      style={{ left: `${l}%`, top: '-6%', width: 20 * s }}
      animate={{
        y: ['0vh', '112vh'],
        x: [0, 26, -18, 8],
        rotate: [0, 150, 290, 400],
      }}
      transition={{
        duration: d,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <path
        d="M15 0 C29 9 30 28 15 40 C0 28 1 9 15 0 Z"
        fill="#f4b9b0"
        opacity="0.8"
      />
      <path
        d="M15 4 C22 12 22 26 15 36"
        stroke="#fff"
        strokeOpacity="0.45"
        strokeWidth="1"
        fill="none"
      />
    </motion.svg>
  )
}

const img = (src, x, y, w, h, extra = {}) => (
  <img
    src={A + src}
    alt=""
    draggable={false}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      userSelect: 'none',
      pointerEvents: 'none',
      ...extra,
    }}
  />
)

const COPPER =
  'linear-gradient(180deg,#74380a 0%,#8f4f17 55%,#a8672a 100%)'

// Playfair Display Italic for the invitation names
const script = {
  fontFamily: "'Playfair Display', serif",
  fontStyle: 'italic',
  fontWeight: 400,
  letterSpacing: '0',
  background: COPPER,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  padding: '0.12em 0.18em',
  lineHeight: 1.1,
  whiteSpace: 'nowrap',
}

const scriptPlain = {
  fontFamily: "'Playfair Display', serif",
  fontStyle: 'italic',
  fontWeight: 400,
  letterSpacing: '0',
  color: '#8f4f17',
  lineHeight: 1.1,
}

export default function Hero({ guestName, show, onNext }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0.5)
  const [extra, setExtra] = useState(0)

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return

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

  const st = show ? 'show' : 'hide'

  const rise = (delay) => ({
    initial: 'hide',
    animate: st,
    variants: {
      hide: { opacity: 0, y: 30 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 1.1,
          delay,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    },
  })

  return (
    <section
      ref={box}
      className="relative h-[100dvh] w-full snap-start overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg,#fdf5e6 0%,#fef1e0 45%,#fbe8d0 100%)',
      }}
    >
      {/* Soft paper glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 38%, rgba(255,252,242,0.95) 0%, rgba(255,246,228,0.5) 45%, rgba(255,246,228,0) 75%)',
        }}
      />

      {/* Design stage */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: W,
          height: H + extra,
          marginLeft: -W / 2,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,#fdf5e6 0px,#fef1e0 ${
              H * 0.45
            }px,#fef4e9 ${907 + extra}px,#fdebd2 100%)`,
          }}
        />

        {/* Garden */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: 40 }}
          animate={
            show
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 40 }
          }
          transition={{
            duration: 1.4,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {img('garden.png', 0, 907 + extra, 941, 765)}
        </motion.div>

        {/* Top-left roses */}
        <motion.div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: 615,
            height: 583,
            transformOrigin: '0% 0%',
          }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={
            show
              ? { opacity: 1, scale: [1, 1.012, 1] }
              : { opacity: 0, scale: 1.08 }
          }
          transition={
            show
              ? {
                  opacity: { duration: 1.2 },
                  scale: {
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.2,
                  },
                }
              : {}
          }
        >
          {img('flowers-tl.png', 0, 0, 615, 583)}
        </motion.div>

        {/* Top-right artwork */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {img('top-right.png', 522, 0, 418, 648)}
        </motion.div>

        {/* Lantern */}
        <motion.div
          className="absolute"
          style={{
            left: 862,
            top: 221,
            width: 78,
            height: 426,
            transformOrigin: '79% 0%',
          }}
          initial={{ opacity: 0 }}
          animate={
            show
              ? { opacity: 1, rotate: [-1.4, 1.4, -1.4] }
              : { opacity: 0 }
          }
          transition={
            show
              ? {
                  opacity: { duration: 1.2, delay: 0.5 },
                  rotate: {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
              : {}
          }
        >
          {img('lantern.png', 0, 0, 78, 426)}

          <motion.div
            className="absolute rounded-full"
            style={{
              left: -10,
              top: 250,
              width: 100,
              height: 100,
              background:
                'radial-gradient(circle,rgba(255,214,120,0.9) 0%,rgba(255,200,100,0) 65%)',
              mixBlendMode: 'screen',
            }}
            animate={{ opacity: [0.5, 1, 0.65, 0.95, 0.55] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
        </motion.div>

        {/* Dove */}
        <motion.div
          className="absolute"
          style={{
            left: 596,
            top: 58,
            width: 260,
            height: 213,
          }}
          initial={{ opacity: 0, x: 260, y: -140 }}
          animate={
            show
              ? {
                  opacity: 1,
                  x: 0,
                  y: [0, -12, 0],
                  rotate: [0, -1.5, 0],
                }
              : { opacity: 0, x: 260, y: -140 }
          }
          transition={
            show
              ? {
                  opacity: { duration: 0.8 },
                  x: { duration: 2.2, ease: 'easeOut' },
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2.2,
                  },
                  rotate: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2.2,
                  },
                }
              : {}
          }
        >
          {img('bird.png', 0, 0, 260, 213)}
        </motion.div>

        {/* Heading */}
        <motion.div
          {...rise(0.5)}
          className="absolute text-center uppercase"
          style={{
            left: 0,
            top: 384,
            width: W,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: 30,
            lineHeight: '37px',
            letterSpacing: '0.31em',
            paddingLeft: '0.31em',
            color: '#6b3a12',
            fontVariantNumeric: 'lining-nums',
          }}
        >
          <div>Together with</div>
          <div>their families</div>
        </motion.div>

        {/* Guest greeting */}
        {guestName && (
          <motion.p
            {...rise(0.4)}
            className="absolute text-center"
            style={{
              left: 0,
              top: 300,
              width: W,
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 44,
              color: '#8f4f17',
            }}
          >
            Dear {guestName},
          </motion.p>
        )}

        {/* Invitation names — Playfair Display Italic */}
        <motion.div
          {...rise(0.7)}
          className="absolute flex flex-col items-center text-center"
          style={{
            left: 0,
            top: 478 + extra * 0.5,
            width: W,
            gap: 8,
          }}
        >
          <span style={{ ...script, fontSize: 150 }}>
            {config.hero?.groom ?? 'Mr. Ali'}
          </span>

          <span style={{ ...scriptPlain, fontSize: 48 }}>
            {config.hero?.joiner ?? 'with'}
          </span>

          <span style={{ ...scriptPlain, fontSize: 42 }}>
            {config.hero?.relation ?? 'Daughter of'}
          </span>

          <span style={{ ...scriptPlain, fontSize: 52 }}>
            {config.hero?.father ?? 'Muhammad Amair'}
          </span>
        </motion.div>

        {/* Month and year */}
        <motion.p
          {...rise(1.0)}
          className="absolute text-center uppercase"
          style={{
            left: 0,
            top: 1030 + extra,
            width: W,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: '0.29em',
            paddingLeft: '0.29em',
            color: '#6b3a12',
            fontVariantNumeric: 'lining-nums',
          }}
        >
          {config.monthYear ?? 'November 2026'}
        </motion.p>

        {/* Scroll-down button */}
        <motion.button
          type="button"
          onClick={onNext}
          aria-label="Scroll down"
          className="absolute cursor-pointer bg-transparent outline-none"
          style={{
            left: 330,
            top: 1523 + extra,
            width: 280,
            height: 94,
            borderRadius: 48,
          }}
          animate={
            show
              ? {
                  boxShadow: [
                    '0 0 0 0 rgba(201,161,91,0)',
                    '0 0 26px 6px rgba(214,170,90,0.55)',
                    '0 0 0 0 rgba(201,161,91,0)',
                  ],
                }
              : {}
          }
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Falling petals */}
      {show && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {PETALS.map((petal, index) => (
            <Petal key={index} {...petal} />
          ))}
        </div>
      )}
    </section>
  )
}
