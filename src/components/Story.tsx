import { useEffect, useRef, type CSSProperties } from 'react'
import { PerspectiveCamera, View } from '@react-three/drei'
import { byId } from '../data/colorways'
import { useStore } from '../state/store'
import { ClayObject } from '../three/ClayObject'
import { Stage } from '../three/Stage'
import { FitCamera } from '../three/views'
import { Fade, Lines, IMG } from './ui'
import { prefersReducedMotion } from '../lib/scroll'

const DETAILS = [
  ['Handmade feel', 'Soft edges, thumb marks, small lumps. Left in on purpose.'],
  ['Tactile texture', 'Matte clay with a fine grain you notice every time you reach for it.'],
  ['Organic shapes', 'A rounded base on the wall and a bent, rolled hook. Nothing on it is square.'],
  ['Ten combinations', 'Two clay colors per piece, paired to sit well together.'],
  ['Made to be used', 'Stick it by the door or next to the mirror and hang what you wear most on it.'],
  ['Collectible', 'Each color is its own small character. Put a few in a row on one wall.'],
]

export function Details() {
  const { selected } = useStore()
  const c = byId(selected)
  return (
    <section className="details" id="details" aria-labelledby="details-title">
      <Lines as="h2" className="display details-title" lines={['Nothing has', 'to be', 'perfect.']} />
      <span id="details-title" className="sr-only">
        Nothing has to be perfect
      </span>
      <View className="details-stage" aria-label={`Close-up of the ${c.name} wall hook`} {...IMG}>
        <PerspectiveCamera makeDefault />
        <FitCamera w={3.0} h={2.8} dir={[-1.1, 0.25, 0.9]} />
        <Stage />
        <ClayObject colorway={c} spin={0.15} sway={0.3} shadow={0.5} />
      </View>
      <ul className="details-list">
        {DETAILS.map(([h, p], i) => (
          <Fade as="li" key={h} i={i}>
            <h3>{h}</h3>
            <p>{p}</p>
          </Fade>
        ))}
      </ul>
    </section>
  )
}

/** Big type that inks in word by word as it moves through the viewport. */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const words = ['Made', 'to', 'be', 'shaped,', 'not', 'kept', 'perfect.']
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = Array.from(el.querySelectorAll<HTMLElement>('.w'))
    if (prefersReducedMotion()) return
    const on = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.25)))
      spans.forEach((s, i) => {
        const t = Math.min(1, Math.max(0, p * (spans.length + 1.5) - i))
        s.style.setProperty('--o', String(0.14 + 0.86 * t))
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <section className="manifesto" aria-label="Made to be shaped, not kept perfect">
      <div ref={ref} className="display manifesto-text" aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="w">{w}</span>{' '}
          </span>
        ))}
      </div>
      <div className="manifesto-aside">
        <Fade as="p" className="statement" style={{ fontSize: 'clamp(22px, 2vw, 30px)' } as CSSProperties}>
          Every hook starts as a soft lump of clay and ends up slightly lopsided. That&rsquo;s the point.
        </Fade>
      </div>
    </section>
  )
}

/** A strip of the live colorway that slides sideways with the scroll. */
export function Band() {
  const row = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = row.current
    if (!el || prefersReducedMotion()) return
    const on = () => {
      const r = el.getBoundingClientRect()
      const x = (r.top - window.innerHeight) * 0.35
      el.style.transform = `translate3d(${x}px,0,0)`
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const phrase = ['Color.', 'Texture.', 'Imagination.']
  return (
    <section className="band" aria-label="Color. Texture. Imagination.">
      <div className="band-row display" ref={row} aria-hidden>
        {[0, 1, 2].flatMap((k) => phrase.map((p) => <span key={`${k}${p}`}>{p}</span>))}
      </div>
    </section>
  )
}
