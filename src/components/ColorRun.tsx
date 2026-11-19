import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, View } from '@react-three/drei'
import * as THREE from 'three'

const FLOOR_TARGET = new THREE.Vector3(-0.08, 0.5, 0)
import { COLORWAYS, formatPrice, PRICE } from '../data/colorways'
import { useStore } from '../state/store'
import { ClayObject } from '../three/ClayObject'
import { Stage } from '../three/Stage'
import { FitCamera } from '../three/views'
import { scrollToY } from '../lib/scroll'
import { IconPlus } from './ui'

function ScrollTurn({ progress, children }: { progress: RefObject<number>; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    const want = progress.current * Math.PI * 3
    ref.current.rotation.y += (want - ref.current.rotation.y) * (1 - Math.exp(-Math.min(dt, 0.05) * 5))
  })
  return <group ref={ref}>{children}</group>
}

/** Name sizes: the longest names still sit inside the gutters. */
const nameSize = (name: string) => `min(${Math.min(19, 96 / (name.length * 0.66)).toFixed(2)}vw, 330px)`

/** The signature moment: a pinned, drenched viewport that runs through all ten colorways as you scroll. */
export function ColorRun() {
  const ref = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [idx, setIdx] = useState(0)
  const [added, setAdded] = useState<string | null>(null)
  const { add } = useStore()
  const c = COLORWAYS[idx]

  useEffect(() => {
    const on = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = Math.min(1, Math.max(0, -r.top / total))
      progress.current = p
      setIdx(Math.min(COLORWAYS.length - 1, Math.floor(p * COLORWAYS.length)))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    scrollToY(top + ((i + 0.5) / COLORWAYS.length) * total)
  }

  const onAdd = () => {
    add(c.id)
    setAdded(c.id)
    window.setTimeout(() => setAdded((a) => (a === c.id ? null : a)), 1600)
  }

  return (
    <section className="run" id="run" ref={ref} aria-label="The ten colors">
      <div className="run-sticky" style={{ '--run-field': c.field, '--run-ink': c.ink } as CSSProperties}>
        <div className="run-top">
          <h2 className="display run-title">
            Ten colors.
            <br />
            One price.
          </h2>
          <div className="run-progress">
            <span className="small price" aria-live="polite">
              {String(idx + 1).padStart(2, '0')} / {COLORWAYS.length} &nbsp;{c.name}
            </span>
            <div className="run-ticks" role="group" aria-label="Jump to a color">
              {COLORWAYS.map((cw, i) => (
                <button key={cw.id} aria-label={`Show ${cw.name}`} aria-current={i === idx} onClick={() => jump(i)} />
              ))}
            </div>
          </div>
        </div>

        <div className="run-names" aria-hidden>
          {COLORWAYS.map((cw, i) => (
            <span key={cw.id} className="display run-name" data-active={i === idx || undefined} data-past={i < idx || undefined} style={{ fontSize: nameSize(cw.name) }}>
              {cw.name}
            </span>
          ))}
        </div>

        <View className="run-stage">
          <PerspectiveCamera makeDefault />
          <FitCamera w={3.2} h={2.1} dir={[-0.1, 0.42, 1]} target={FLOOR_TARGET} />
          <Stage floor />
          <ScrollTurn progress={progress}>
            <ClayObject colorway={c} seed={COLORWAYS[0].seed} spin={0.15} rotationY={0.3} shadow={0.3} mount="floor" />
          </ScrollTurn>
        </View>

        <div className="run-side">
          <p className="serif">{c.note}</p>
          <button className="btn" onClick={onAdd}>
            {added === c.id ? `${c.name} added` : `Add ${c.name} · ${formatPrice(PRICE)}`} <IconPlus />
          </button>
        </div>
      </div>
    </section>
  )
}
