import { useLayoutEffect, useRef, useState } from 'react'

/* Scales a fixed-size "stage" (W units wide) so it ALWAYS fills the full width of the screen,
   and centres the content block (clusterTop … clusterTop+clusterH) vertically.
   Only if the screen is extremely short does the block shrink a little to fit.
   Decorations (flowers) are positioned with % of the section, so they hug the true corners. */
export default function useFit(W, clusterTop, clusterH, pad = 120) {
  const ref = useRef(null)
  const [fit, setFit] = useState({ sc: 0.4, top: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    const calc = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const sc = Math.min(w / W, h / (clusterH + pad))
      setFit({ sc, top: (h - clusterH * sc) / 2 - clusterTop * sc })
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [W, clusterTop, clusterH, pad])
  return [ref, fit]
}
