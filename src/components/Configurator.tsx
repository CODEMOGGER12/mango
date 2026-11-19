import { useRef, useState, type KeyboardEvent } from 'react'
import { PerspectiveCamera, View } from '@react-three/drei'
import type * as THREE from 'three'
import { byId, COLORWAYS, formatPrice, PRICE } from '../data/colorways'
import { MAX_QTY, useStore } from '../state/store'
import { ClayObject } from '../three/ClayObject'
import { Stage } from '../three/Stage'
import { FitCamera, StageRig, type RigApi } from '../three/views'
import { IconArrow, IconMinus, IconPlus, IconReset, Lines, SwatchArt, IMG } from './ui'

export function ColorPicker({ value, onChange, label = 'Color' }: { value: string; onChange: (id: string) => void; label?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const idx = COLORWAYS.findIndex((c) => c.id === value)
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (idx + step + COLORWAYS.length) % COLORWAYS.length
    onChange(COLORWAYS[next].id)
    refs.current[next]?.focus()
  }
  return (
    <div className="swatches" role="radiogroup" aria-label={label} onKeyDown={onKey}>
      {COLORWAYS.map((c, i) => (
        <button
          key={c.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="swatch"
          role="radio"
          aria-checked={c.id === value}
          aria-label={c.name}
          title={c.name}
          tabIndex={c.id === value ? 0 : -1}
          onClick={() => onChange(c.id)}
        >
          <SwatchArt c={c} />
        </button>
      ))}
    </div>
  )
}

export function Stepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <IconMinus size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button aria-label="Increase quantity" disabled={value >= MAX_QTY} onClick={() => onChange(value + 1)}>
        <IconPlus size={16} />
      </button>
    </div>
  )
}

export function Configurator() {
  const { selected, select, add } = useStore()
  const c = byId(selected)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const api = useRef<RigApi | null>(null)
  const hold = useRef(false)
  const home = useRef<THREE.Vector3 | null>(null)
  const timer = useRef(0)

  const onAdd = () => {
    add(c.id, qty)
    setAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <section className="section" id="shop" aria-labelledby="shop-title">
      <div className="intro">
        <Lines
          as="p"
          className="statement"
          lines={['A rounded clay base that sticks to the wall,', 'a soft rolled hook pressed on top. A little', 'lopsided, never twice the same. Pick a color.']}
        />
      </div>

      <div className="config">
        <div className="config-stage">
          <View className="config-view" aria-label={`${c.name} MANGO wall hook. Drag to turn, pinch to zoom.`} {...IMG}>
            <PerspectiveCamera makeDefault />
            <FitCamera w={3.1} h={3.05} onFit={(p) => (home.current = p)} />
            <Stage shadowSize={2048} />
            <ClayObject colorway={c} seed={COLORWAYS[0].seed} holdRef={hold} spin={0.3} />
            <StageRig apiRef={api} holdRef={hold} home={home} minDistance={2.4} maxDistance={10} />
          </View>
          <div className="config-tools">
            <button className="tool" aria-label="Reset view" title="Reset view" onClick={() => api.current?.reset()}>
              <IconReset />
            </button>
            <button className="tool" aria-label="Zoom out" title="Zoom out" onClick={() => api.current?.zoom(1.25)}>
              <IconMinus />
            </button>
            <button className="tool" aria-label="Zoom in" title="Zoom in" onClick={() => api.current?.zoom(0.8)}>
              <IconPlus />
            </button>
          </div>
          <span className="config-hint small">Drag to turn · Pinch to zoom</span>
        </div>

        <div className="config-panel">
          <div className="config-head">
            <div className="config-name-row">
              <h2 id="shop-title" className="display config-name">
                {c.name}
              </h2>
              <span className="config-price price">{formatPrice(PRICE)}</span>
            </div>
            <p className="config-note">{c.note}</p>
          </div>

          <div className="config-block">
            <div className="config-block-head">
              <span className="label">Color</span>
              <span className="small muted">
                {c.baseName} / {c.topName}
              </span>
            </div>
            <ColorPicker value={selected} onChange={select} />
          </div>

          <div className="config-block">
            <span className="label">Quantity</span>
            <div className="config-actions">
              <Stepper value={qty} onChange={setQty} label="Quantity" />
              <button className="btn" onClick={onAdd}>
                <span aria-live="polite">{added ? 'Added to cart' : `Add to cart · ${formatPrice(PRICE * qty)}`}</span>
                <IconArrow />
              </button>
            </div>
          </div>

          <dl className="config-facts">
            <div>
              <dt>Base</dt>
              <dd>{c.baseName} clay</dd>
            </div>
            <div>
              <dt>Hook</dt>
              <dd>{c.topName} clay</dd>
            </div>
            <div>
              <dt>Use</dt>
              <dd>Sticks to a wall, holds your clothes</dd>
            </div>
            <div>
              <dt>Finish</dt>
              <dd>Matte, by hand</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{formatPrice(PRICE)} each, every color</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
