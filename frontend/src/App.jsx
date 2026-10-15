import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import config from './config.json'
import Splash from './components/Splash'
import Rsvp from './components/Rsvp'
import Hero from './components/Hero'
import Blessing from './components/Blessing'
import Countdown from './components/Countdown'
import SaveTheDate from './components/SaveTheDate'
import Schedule from './components/Schedule'
import Celebrate from './components/Celebrate'
import Venue from './components/Venue'
import DressCode from './components/DressCode'

const API = import.meta.env.VITE_API_URL || '/api'
const TOTAL = 9 // number of full-height sections

export default function App() {
  const [opened, setOpened] = useState(false)
  const [muted, setMuted] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [page, setPage] = useState(0)
  const [guest, setGuest] = useState(null)
  const [thanks, setThanks] = useState(false)
  const scroller = useRef(null)
  const audio = useRef(null)

  // /invite/:slug personalised link
  const slug = window.location.pathname.match(/^\/invite\/([\w-]+)/)?.[1] || null
  useEffect(() => {
    if (!slug) return
    fetch(`${API}/invite/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setGuest(d.name))
      .catch(() => {})
  }, [slug])

  useEffect(() => {
    audio.current = new Audio(config.music)
    audio.current.loop = true
    audio.current.volume = 0.6
  }, [])

  const startMusic = () => audio.current?.play().catch(() => {})
  const toggleMute = () => {
    setMuted((m) => {
      if (audio.current) audio.current.muted = !m
      return !m
    })
  }

  const onScroll = () => {
    const el = scroller.current
    setPage(Math.round(el.scrollTop / el.clientHeight))
  }
  const next = () => {
    const el = scroller.current
    el.scrollBy({ top: el.clientHeight, behavior: 'smooth' })
  }

  const ringed = page === 2 || page === 4 || (page === 8 && thanks)
  return (
    <div className="mx-auto h-full max-w-md overflow-hidden bg-cream shadow-2xl">
      <div
        ref={scroller}
        onScroll={onScroll}
        className={`no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth ${opened ? '' : 'pointer-events-none'}`}
      >
        <Hero guestName={guest} show={reveal} onNext={next} />
        <Blessing onNext={next} />
        <Countdown onNext={next} />
        <SaveTheDate />
        <Celebrate />
        <Schedule />
        <Venue />
        <DressCode />
        <Rsvp slug={slug} guestName={guest} onThanks={setThanks} onHome={() => scroller.current?.scrollTo({ top: 0, behavior: 'smooth' })} />
      </div>

      {!opened && <Splash onTap={() => { startMusic(); setTimeout(() => setReveal(true), 1900) }} onDone={() => setOpened(true)} />}

      {opened && (
        <>
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            className="fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-0 shadow-lg"
            style={{ right: 'max(1rem, calc(50% - 13.5rem))', background: ringed ? 'rgba(24,12,6,0.35)' : page === 7 ? '#1f3b2b' : 'rgba(74,58,46,0.92)', boxShadow: ringed ? 'inset 0 0 0 1.5px #c9a15b' : page === 7 ? 'inset 0 0 0 1.5px #c9a15b' : undefined, transition: 'background .4s, box-shadow .4s' }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={ringed || page === 7 ? '#e8cf9a' : '#fff'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity={muted ? 0.55 : 1}>
              <path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" />
              {muted && <path d="M3 3 L21 21" />}
            </svg>
          </button>
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 mx-auto flex max-w-md justify-center">
            <AnimatePresence>
              {page === 5 && (
                <motion.button
                  onClick={next}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="label pointer-events-auto rounded-full bg-gold px-8 py-3 !text-white shadow-lg"
                >
                  Scroll down
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  )
}
