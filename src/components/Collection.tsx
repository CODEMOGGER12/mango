import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { PerspectiveCamera, View } from '@react-three/drei'
import { COLORWAYS, formatPrice, PRICE, type Colorway } from '../data/colorways'
import { useStore } from '../state/store'
import { ClayObject } from '../three/ClayObject'
import { Stage } from '../three/Stage'
import { FitCamera } from '../three/views'
import { scrollToId } from '../lib/scroll'
import { Lines } from './ui'

function Tile({ c, i }: { c: Colorway; i: number }) {
  const { select, add } = useStore()
  const hover = useRef(false)
  const [added, setAdded] = useState(false)
  return (
    <article className="tile" aria-label={`${c.name}, ${formatPrice(PRICE)}`}>
      <button
        className="tile-media"
        style={{ '--tile-hover': `color-mix(in srgb, ${c.field} 22%, #ece8e1)` } as CSSProperties}
        aria-label={`Configure ${c.name}`}
        onClick={() => {
          select(c.id)
          scrollToId('shop')
        }}
        onPointerEnter={() => (hover.current = true)}
        onPointerLeave={() => (hover.current = false)}
        onFocus={() => (hover.current = true)}
        onBlur={() => (hover.current = false)}
      >
        <View className="tile-view">
          <PerspectiveCamera makeDefault />
          <FitCamera w={2.9} h={3.0} />
          <Stage shadowSize={512} />
          <ClayObject colorway={c} hoverRef={hover} spin={0.25} sway={0.3} rotationY={((i % 3) - 1) * 0.22} />
        </View>
      </button>
      <div className="tile-meta">
        <span className="tile-name">
          <span>{c.name}</span>
          <span className="muted">
            {c.baseName} / {c.topName}
          </span>
        </span>
        <button
          className="link tile-add"
          aria-label={`Add ${c.name} to cart`}
          onClick={() => {
            add(c.id)
            setAdded(true)
            window.setTimeout(() => setAdded(false), 1500)
          }}
        >
          {added ? 'Added' : 'Add +'}
        </button>
        <span className="muted price">{formatPrice(PRICE)}</span>
      </div>
    </article>
  )
}

export function Collection() {
  const track = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => {
      const tile = el.firstElementChild as HTMLElement | null
      if (!tile) return
      const step = tile.offsetWidth + 6
      const visible = Math.max(1, Math.round(el.clientWidth / step))
      const max = el.scrollWidth - el.clientWidth
      setPages(Math.max(1, Math.ceil(COLORWAYS.length / visible)))
      setPage(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (Math.ceil(COLORWAYS.length / visible) - 1)))
    }
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const go = (dir: number) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.98, behavior: 'smooth' })
  }

  return (
    <section className="collection" id="colors" aria-labelledby="colors-title">
      <div className="intro">
        <Lines as="h2" className="statement" lines={['One hook, ten moods.', `Every one of them ${formatPrice(PRICE)}.`]} />
        <span id="colors-title" className="sr-only">
          The color collection
        </span>
      </div>
      <div className="track" ref={track} tabIndex={0} aria-label="All colors, scroll sideways">
        {COLORWAYS.map((c, i) => (
          <Tile key={c.id} c={c} i={i} />
        ))}
      </div>
      <div className="pager">
        <button className="link" onClick={() => go(-1)} disabled={page === 0}>
          Prev
        </button>
        <div className="pager-bars" aria-hidden>
          {Array.from({ length: pages }, (_, i) => (
            <span key={i} data-on={i === page || undefined} />
          ))}
        </div>
        <button className="link" onClick={() => go(1)} disabled={page >= pages - 1}>
          Next
        </button>
      </div>
    </section>
  )
}
