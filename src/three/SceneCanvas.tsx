import { Canvas, useFrame } from '@react-three/fiber'
import { View } from '@react-three/drei'
import * as THREE from 'three'
import type { RefObject } from 'react'

function ClearEachFrame() {
  useFrame(({ gl }) => {
    gl.setScissorTest(false)
    gl.clear(true, true, true)
  }, 1)
  return null
}

/**
 * One WebGL renderer for the whole page. Every 3D view in the DOM (hero, configurator,
 * color run, collection tiles) is a drei <View> drawn into this fixed canvas with scissoring,
 * so the page never holds more than a single GL context.
 */
export function SceneCanvas({ eventSource }: { eventSource: RefObject<HTMLElement> }) {
  return (
    <Canvas
      eventSource={eventSource as RefObject<HTMLElement>}
      className="gl-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none' }}
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, powerPreference: 'high-performance' }}
    >
      <ClearEachFrame />
      <View.Port />
    </Canvas>
  )
}
