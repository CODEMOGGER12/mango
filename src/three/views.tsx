import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

/** Centre of the wall-mounted hook: the puck is on the wall (z = 0), the stem comes out toward +z. */
export const TARGET = new THREE.Vector3(0, 0.15, 0.42)
export const WALL_DIR: [number, number, number] = [1.05, 0.32, 1]

/**
 * Frames the object inside whatever box its <View> has: picks the distance that fits a
 * width x height window around the target for the current aspect ratio.
 */
export function fitDistance(fov: number, aspect: number, w: number, h: number) {
  const t = Math.tan(THREE.MathUtils.degToRad(fov / 2))
  return Math.max(h / (2 * t), w / (2 * t * aspect))
}

export function FitCamera({ fov = 26, dir = WALL_DIR, w = 3, h = 3, target = TARGET, onFit }: { fov?: number; dir?: [number, number, number]; w?: number; h?: number; target?: THREE.Vector3; onFit?: (pos: THREE.Vector3) => void }) {
  const { camera, size } = useThree()
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.fov = fov
    cam.near = 0.1
    cam.far = 50
    const aspect = size.width / Math.max(1, size.height)
    const d = fitDistance(fov, aspect, w, h)
    const pos = target.clone().add(new THREE.Vector3(...dir).normalize().multiplyScalar(d))
    cam.position.copy(pos)
    cam.lookAt(target)
    cam.updateProjectionMatrix()
    onFit?.(pos)
  }, [camera, size.width, size.height]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export type RigApi = { zoom: (factor: number) => void; reset: () => void }

/**
 * Orbit controls for the product stage: drag to turn (full 360), pinch / ctrl-scroll / buttons to zoom,
 * animated reset. Idle spin pauses while held and for a moment after.
 */
export function StageRig({ apiRef, holdRef, home, minDistance = 2.2, maxDistance = 11, allowZoom = true, target = TARGET }: { apiRef?: RefObject<RigApi | null>; holdRef: RefObject<boolean>; home: RefObject<THREE.Vector3 | null>; minDistance?: number; maxDistance?: number; allowZoom?: boolean; target?: THREE.Vector3 }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const anim = useRef<THREE.Vector3 | null>(null)
  const timer = useRef<number>(0)
  const connected = useThree((st) => st.events.connected) as HTMLElement | undefined

  // Plain wheel keeps scrolling the page; pinch (ctrl+wheel on trackpads) and touch pinch zoom the object.
  useEffect(() => {
    if (!allowZoom || !connected) return
    const onWheel = (e: WheelEvent) => {
      if (controls.current) controls.current.enableZoom = e.ctrlKey
    }
    const onDown = (e: PointerEvent) => {
      if (controls.current && e.pointerType === 'touch') controls.current.enableZoom = true
    }
    connected.addEventListener('wheel', onWheel, { capture: true, passive: true })
    connected.addEventListener('pointerdown', onDown, { capture: true })
    return () => {
      connected.removeEventListener('wheel', onWheel, { capture: true })
      connected.removeEventListener('pointerdown', onDown, { capture: true })
    }
  }, [allowZoom, connected])

  useEffect(() => {
    if (!apiRef) return
    ;(apiRef as { current: RigApi | null }).current = {
      zoom: (f) => {
        const c = controls.current
        if (!c) return
        const off = camera.position.clone().sub(c.target)
        const d = THREE.MathUtils.clamp(off.length() * f, minDistance, maxDistance)
        anim.current = c.target.clone().add(off.setLength(d))
      },
      reset: () => {
        if (home.current) anim.current = home.current.clone()
      },
    }
  })

  useFrame((_, dt) => {
    const c = controls.current
    if (!c || !anim.current) return
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 6)
    camera.position.lerp(anim.current, k)
    c.target.lerp(target, k)
    c.update()
    if (camera.position.distanceTo(anim.current) < 0.005) anim.current = null
  })

  const hold = (on: boolean) => {
    window.clearTimeout(timer.current)
    if (on) (holdRef as { current: boolean }).current = true
    else timer.current = window.setTimeout(() => ((holdRef as { current: boolean }).current = false), 1800)
  }

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={[target.x, target.y, target.z]}
      enablePan={false}
      enableZoom={allowZoom}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.8}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI * 0.86}
      onStart={() => {
        anim.current = null
        hold(true)
      }}
      onEnd={() => hold(false)}
    />
  )
}
