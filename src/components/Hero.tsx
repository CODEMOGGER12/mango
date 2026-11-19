import { useRef } from 'react'
import { PerspectiveCamera, View } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../state/store'
import { byId, COLORWAYS } from '../data/colorways'
import { ClayObject } from '../three/ClayObject'
import { Stage } from '../three/Stage'
import { FitCamera, StageRig } from '../three/views'
import { scrollToId } from '../lib/scroll'
import { IconArrow, Lines, useMedia, IMG } from './ui'

const HERO_TARGET = new THREE.Vector3(-0.85, 0.2, 0.42)
const HERO_TARGET_NARROW = new THREE.Vector3(0, 0.15, 0.42)

export function Hero() {
  const { selected } = useStore()
  const c = byId(selected)
  const fine = useMedia('(pointer: fine)')
  const narrow = useMedia('(max-width: 720px)')
  const target = narrow ? HERO_TARGET_NARROW : HERO_TARGET
  const hold = useRef(false)
  const home = useRef<THREE.Vector3 | null>(null)

  return (
    <section className="hero" id="top">
      <Lines as="h1" className="display hero-title" lines={['Play takes', 'shape.']} />
      <View className="hero-stage" data-interactive={fine || undefined} aria-label={`${c.name} MANGO clay wall hook, drag to turn`} {...IMG}>
        <PerspectiveCamera makeDefault />
        <FitCamera key={narrow ? 'n' : 'w'} w={narrow ? 2.8 : 3.8} h={narrow ? 2.6 : 3.1} target={target} onFit={(p) => (home.current = p)} />
        <Stage />
        <ClayObject colorway={c} seed={COLORWAYS[0].seed} holdRef={hold} rotationY={-0.15} />
        {fine && <StageRig holdRef={hold} home={home} allowZoom={false} target={target} />}
      </View>
      <div className="hero-foot">
        <p>A clay hook for your wall. Sculpted soft, left a little off. Stick it up, hang your clothes on it. Ten colors, one price.</p>
        <button className="btn" onClick={() => scrollToId('colors')}>
          Explore the colors <IconArrow />
        </button>
      </div>
    </section>
  )
}
