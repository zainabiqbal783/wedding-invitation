import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import FallingPetals from './FallingPetals'

/* Last two pages: the RSVP form and the "Thank You!" screen shown after it is sent.
   Both are drawn live (no images), so every word can be edited here. */

const API = import.meta.env.VITE_API_URL || '/api'
const EASE = [0.22, 1, 0.36, 1]
const W = 399
const H = 702
const INK = '#4b2a22'
const GOLD = '#c58f48'

const THANK_PETALS = [
  { l: 8, d: 20, delay: 0, s: 1.3, blur: 0.5, o: 0.9, color: '#e9a5a8' },
  { l: 30, d: 26, delay: 8, s: 0.9, blur: 1.2, o: 0.6, color: '#f6d3c4' },
  { l: 62, d: 23, delay: 4, s: 1.2, blur: 0.6, o: 0.85, color: '#f6d9cd' },
  { l: 86, d: 28, delay: 12, s: 1.0, blur: 1.5, o: 0.55, color: '#e9a5a8' },
]
const BOKEH = [
  [10, 7, 34, 3.2], [72, 18, 26, 4], [8, 44, 30, 5], [44, 6, 22, 3.6], [88, 60, 38, 4.4], [6, 76, 34, 3.8], [80, 90, 28, 5.2],
  [26, 58, 22, 4.6], [62, 70, 20, 3.4], [92, 34, 24, 4.1], [20, 24, 18, 3.3], [50, 90, 26, 4.8], [38, 36, 16, 5.5],
]

/* scales a W×H design stage to the section, centred */
function useStage() {
  const ref = useRef(null)
  const [fit, setFit] = useState({ sc: 0.9, top: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    const calc = () => {
      const sc = Math.min(el.clientWidth / W, el.clientHeight / (H + 40))
      setFit({ sc, top: (el.clientHeight - H * sc) / 2 })
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, fit]
}

const Sprig = ({ style, flip }) => (
  <svg viewBox="0 0 60 70" width="60" height="70" fill="none" stroke="#dca56b" strokeWidth="1.4" strokeLinecap="round" opacity=".75" style={{ position: 'absolute', transform: flip ? 'scaleY(-1)' : undefined, ...style }}>
    <path d="M6 66 C10 44 18 26 34 10" /><path d="M14 46 C20 44 24 40 26 34" /><path d="M20 32 C28 32 34 28 36 22" /><path d="M10 58 C16 58 20 54 22 48" />
    {[[34, 10], [26, 34], [36, 22], [22, 48], [46, 6], [52, 14]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#e7b682" stroke="none" />)}
  </svg>
)

const TinyOrnament = ({ color = '#c58f48', w = 140 }) => (
  <svg viewBox="0 0 140 24" width={w} height={w * 24 / 140} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
    <path d="M2 12 H46" /><path d="M94 12 H138" />
    <path d="M46 12 C52 6 58 6 62 12 C58 18 52 18 46 12 Z" /><path d="M94 12 C88 6 82 6 78 12 C82 18 88 18 94 12 Z" />
    <path d="M70 3 C76 8 76 16 70 21 C64 16 64 8 70 3 Z" /><circle cx="70" cy="12" r="2" fill={color} />
  </svg>
)

const Label = ({ children }) => (
  <span style={{ position: 'absolute', left: 18, top: -11, padding: '0 8px 0 0', fontFamily: "'EB Garamond', serif", fontWeight: 500, fontSize: 16, lineHeight: '20px', color: '#4b2a22', background: 'linear-gradient(180deg,transparent 0 45%,#fffaf2 45%)', pointerEvents: 'none' }}>
    {children}
  </span>
)
const Chevron = () => (
  <svg viewBox="0 0 20 12" width="18" height="11" style={{ position: 'absolute', right: 20, top: 22, pointerEvents: 'none' }} fill="none" stroke="#8a7a72" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2 L10 10 L18 2" /></svg>
)

function Envelope() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" overflow="visible">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffc46a" stopOpacity=".55" /><stop offset="100%" stopColor="#ff9a3a" stopOpacity="0" /></radialGradient>
        <linearGradient id="env" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0cf9e" /><stop offset="100%" stopColor="#a8783e" /></linearGradient>
        <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f7e0b8" /><stop offset="100%" stopColor="#c99a5e" /></linearGradient>
      </defs>
      <circle cx="100" cy="104" r="96" fill="url(#glow)" />
      <motion.circle cx="100" cy="82" r="68" fill="none" stroke="#e9a757" strokeWidth="1.2" strokeDasharray="3 5" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '100px 82px' }} opacity=".8" />
      {/* open flap behind */}
      <path d="M52 100 L100 62 L148 100 Z" fill="#d9ad72" stroke="#f5dba8" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="100" cy="70" r="32" fill="rgba(30,15,8,.55)" stroke="#f2cd8e" strokeWidth="1.8" />
      <motion.path d="M84 71 L96 83 L117 59" fill="none" stroke="#fff6e3" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.6 }} />
      {/* body */}
      <path d="M50 96 L100 128 L150 96 L150 154 Q150 160 144 160 L56 160 Q50 160 50 154 Z" fill="url(#env)" stroke="#f5dba8" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M50 96 L100 128 L150 96" fill="none" stroke="#f9e6c0" strokeWidth="1.4" opacity=".8" />
      <path d="M50 158 L100 120 L150 158" fill="none" stroke="#f9e6c0" strokeWidth="1.2" opacity=".7" />
      <path d="M50 96 L98 124 L50 156 Z" fill="url(#flap)" opacity=".9" /><path d="M150 96 L102 124 L150 156 Z" fill="url(#flap)" opacity=".9" />
      <path d="M52 158 L100 118 L148 158 Z" fill="#e8c78f" stroke="#fbeccb" strokeWidth="1.2" strokeLinejoin="round" />
      <motion.ellipse cx="54" cy="122" rx="16" ry="5" fill="#fff0cc" animate={{ opacity: [0.35, 0.95, 0.35] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ filter: 'blur(3px)' }} />
      <motion.ellipse cx="148" cy="124" rx="14" ry="4.5" fill="#fff0cc" animate={{ opacity: [0.9, 0.35, 0.9] }} transition={{ duration: 2.8, repeat: Infinity }} style={{ filter: 'blur(3px)' }} />
      {[[30, 40], [172, 32], [158, 70], [44, 80], [118, 8], [64, 24], [180, 96]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={1.6 + (i % 3) * 0.5} fill="#ffd994" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.4 }} />
      ))}
    </svg>
  )
}

function Thanks({ onHome, attending }) {
  const [ref, { sc, top }] = useStage()
  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(120% 90% at 30% 20%, #3d2210 0%, #24130a 55%, #170b05 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: 'screen' }}>
        {BOKEH.map(([l, t, s, d], i) => (
          <motion.span key={i} className="absolute rounded-full"
            style={{ left: `${l}%`, top: `${t}%`, width: s * 2, height: s * 2, background: 'radial-gradient(circle,rgba(255,196,110,0.55) 0%,rgba(255,170,80,0.12) 55%,rgba(255,170,80,0) 72%)' }}
            animate={{ opacity: [0.25, 0.8, 0.25], scale: [1, 1.12, 1] }} transition={{ duration: d + 1, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-[3px] rounded-[14px]" style={{ border: '1px solid rgba(214,170,104,0.55)' }} />

      <div style={{ position: 'absolute', left: '50%', top, width: W, height: H, marginLeft: -W / 2, transform: `scale(${sc})`, transformOrigin: 'top center' }}>
        <motion.div style={{ position: 'absolute', left: 99, top: 108 }} initial={{ opacity: 0, scale: 0.8, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.3, ease: EASE }}>
          <Envelope />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8, ease: EASE }}
          style={{ position: 'absolute', left: 0, width: W, top: 350, margin: 0, textAlign: 'center', fontFamily: "'Great Vibes', cursive", fontWeight: 400, fontSize: 62, lineHeight: '80px', color: '#fdf3e4' }}>
          Thank You!
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.0, ease: EASE }}
          style={{ position: 'absolute', left: 0, width: W, top: 428, margin: 0, textAlign: 'center', fontFamily: "'EB Garamond', serif", fontSize: 23, lineHeight: '30px', color: '#f6e7d4' }}>
          {attending ? 'Your RSVP has been' : 'Your reply has been'}<br />successfully submitted!
        </motion.p>
        <motion.div initial={{ opacity: 0, scaleX: 0.3 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 1, delay: 1.2, ease: EASE }} style={{ position: 'absolute', left: 0, width: W, top: 504, display: 'flex', justifyContent: 'center' }}>
          <TinyOrnament w={150} />
        </motion.div>
        <motion.button onClick={onHome} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.4, ease: EASE }} whileTap={{ scale: 0.97 }}
          className="cursor-pointer outline-none"
          style={{ position: 'absolute', left: 92, top: 578, width: 203, height: 54, borderRadius: 28, border: '1.2px solid rgba(232,190,120,0.7)', background: 'linear-gradient(180deg,#9a7040 0%,#7d5a30 100%)', color: '#fbeedb', fontFamily: "'EB Garamond', serif", fontSize: 21, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, boxShadow: '0 0 24px rgba(214,160,80,0.25)' }}>
          Back to Home
          <svg viewBox="0 0 22 14" width="22" height="14" fill="none" stroke="#fbeedb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 7 H20 M14 1 L20 7 L14 13" /></svg>
        </motion.button>
      </div>
      <FallingPetals list={THANK_PETALS} active />
    </motion.div>
  )
}

export default function Rsvp({ slug, guestName, onHome, onThanks }) {
  const [form, setForm] = useState({ name: guestName || '', attending: 'yes', guests: '1', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [ref, { sc, top }] = useStage()
  const show = useInView(ref, { once: true, amount: 0.4 })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setStatus('sending')
    try {
      const res = await fetch(`${API}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), attending: form.attending === 'yes', guests: form.attending === 'yes' ? Number(form.guests) : 0, message: form.message, slug: slug || null }),
      })
      if (!res.ok) throw new Error('bad status')
      setStatus('done')
      onThanks?.(true)
    } catch {
      setStatus('error')
    }
  }
  const home = () => { onThanks?.(false); onHome?.(); setTimeout(() => setStatus('idle'), 900) }

  const rise = (delay, y = 18) => ({ initial: { opacity: 0, y }, animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y }, transition: { duration: 0.9, delay, ease: EASE } })
  const box = { position: 'absolute', left: 40, width: 319, borderRadius: 16, background: 'linear-gradient(180deg,#fffaf2 0%,#fbf0e1 100%)', border: '1px solid #efd9c0', boxShadow: '0 6px 14px rgba(190,140,90,0.14), inset 0 1px 0 #fff' }
  const ctl = { width: '100%', height: '100%', border: 0, outline: 'none', background: 'transparent', fontFamily: "'EB Garamond', serif", color: INK, appearance: 'none', WebkitAppearance: 'none' }

  return (
    <section
      ref={ref}
      className="relative h-[100dvh] w-full snap-start overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#f7e8d6 0%,#f4e1cb 100%)' }}
    >
      <div className="absolute inset-0" style={{ background: 'url(/assets/page3/paper.jpg) center / cover', opacity: 0.55 }} />
      <div style={{ position: 'absolute', left: '50%', top, width: W, height: H, marginLeft: -W / 2, transform: `scale(${sc})`, transformOrigin: 'top center' }}>
        <div style={{ position: 'absolute', left: 38, top: 27, width: 339, height: 658, border: '1px solid rgba(220,170,120,0.35)', borderRadius: 4 }} />
        <Sprig style={{ left: 40, top: 30 }} /><Sprig flip style={{ left: 38, top: 640, transform: 'scale(0.55,-0.55)', transformOrigin: '0 0' }} />

        <motion.h2 {...rise(0.2)} style={{ position: 'absolute', left: 0, width: W, top: 50, margin: 0, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 52, lineHeight: '60px', letterSpacing: '0.02em', color: '#5a1d14' }}>RSVP</motion.h2>
        <motion.p {...rise(0.35)} style={{ position: 'absolute', left: 0, width: W, top: 109, margin: 0, textAlign: 'center', fontFamily: "'EB Garamond', serif", fontSize: 19, lineHeight: '27px', color: INK }}>
          Please confirm your attendance<br />by filling out the form below.
        </motion.p>

        <form onSubmit={submit}>
          <motion.div {...rise(0.5)} style={{ ...box, top: 180, height: 55 }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#8c8480" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', left: 20, top: 16 }}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7Z" /></svg>
            <input style={{ ...ctl, paddingLeft: 60, fontSize: 19 }} className="placeholder:text-[#a69d99]" placeholder="Your Name *" value={form.name} onChange={set('name')} maxLength={80} required aria-label="Your name" />
          </motion.div>

          <motion.div {...rise(0.6)} style={{ ...box, top: 262, height: 55 }}>
            <Label>Attending? *</Label>
            <select style={{ ...ctl, padding: '14px 44px 0 22px', fontSize: 23 }} value={form.attending} onChange={set('attending')} aria-label="Attending">
              <option value="yes">Yes</option><option value="no">No</option>
            </select><Chevron />
          </motion.div>

          <motion.div {...rise(0.7)} style={{ ...box, top: 343, height: 55, opacity: undefined }}>
            <Label>Number of Guests *</Label>
            <select style={{ ...ctl, padding: '14px 44px 0 22px', fontSize: 23, opacity: form.attending === 'yes' ? 1 : 0.4 }} value={form.guests} onChange={set('guests')} disabled={form.attending !== 'yes'} aria-label="Number of guests">
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select><Chevron />
          </motion.div>

          <motion.div {...rise(0.8)} style={{ ...box, top: 424, height: 92 }}>
            <Label>Message (optional)</Label>
            <textarea style={{ ...ctl, padding: '20px 20px 10px', fontSize: 18, resize: 'none', lineHeight: '24px' }} className="placeholder:text-[#a69d99]" placeholder="Write anything..." value={form.message} onChange={set('message')} maxLength={300} aria-label="Message" />
          </motion.div>

          <motion.button
            {...rise(0.95)} type="submit" disabled={status === 'sending'} whileTap={{ scale: 0.98 }}
            className="cursor-pointer outline-none disabled:opacity-70"
            style={{ position: 'absolute', left: 38, top: 530, width: 347, height: 57, borderRadius: 29, border: 0, background: 'linear-gradient(100deg,#c48b45 0%,#c9954e 50%,#bb8240 100%)', color: '#fff8ec', fontFamily: "'EB Garamond', serif", fontSize: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, boxShadow: '0 8px 18px rgba(170,110,50,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' }}
          >
            {status === 'sending' ? 'Sending…' : 'Confirm attendance'}
            <svg viewBox="0 0 22 14" width="22" height="14" fill="none" stroke="#fff8ec" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 7 H20 M14 1 L20 7 L14 13" /></svg>
          </motion.button>
        </form>
        {status === 'error' && <p style={{ position: 'absolute', left: 0, width: W, top: 590, margin: 0, textAlign: 'center', fontFamily: "'EB Garamond', serif", fontSize: 14, color: '#a12a22' }}>Couldn’t send. Please try again in a moment.</p>}

        <motion.div {...rise(1.1, 0)} style={{ position: 'absolute', left: 0, width: W, top: 596, display: 'flex', justifyContent: 'center' }}><TinyOrnament w={70} color="#d29a58" /></motion.div>
        <motion.p {...rise(1.2)} style={{ position: 'absolute', left: 0, width: W, top: 618, margin: 0, textAlign: 'center', fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 18.5, lineHeight: '30px', color: '#5a2a20' }}>
          Thank you for being a part of our journey!
        </motion.p>
      </div>

      <AnimatePresence>{status === 'done' && <Thanks key="thanks" onHome={home} attending={form.attending === 'yes'} />}</AnimatePresence>
    </section>
  )
}
