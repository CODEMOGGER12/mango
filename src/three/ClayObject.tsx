import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createClayMaterial } from './clayMaterial'
import { getClayGeometries } from './geometry'
import { blobTexture } from './Stage'
import type { Colorway } from '../data/colorways'
import { prefersReducedMotion } from '../lib/scroll'

type Props = {
  colorway: Colorway
  /** geometry seed; defaults to the colorway's own hand-made variation */
  seed?: number
  /** idle sway speed (radians of phase per second) */
  spin?: number
  /** how far the idle sway turns the hook either side, in radians */
  sway?: number
  /** set to true while the visitor is dragging; idle motion pauses */
  holdRef?: RefObject<boolean>
  /** speeds the sway up on hover, for collection tiles */
  hoverRef?: RefObject<boolean>
  /** resting angle around the vertical axis */
  rotationY?: number
  /** opacity of the shadow the hook throws on the wall (or floor) */
  shadow?: number
  /** 'wall': mounted on the wall and swaying. 'floor': the original presentation, lying flat, spinning and floating. */
  mount?: 'wall' | 'floor'
}

/**
 * The MANGO hook, mounted. The puck's underside sits flat on the wall (the plane z = 0, which is
 * the page itself: the wall only shows as the shadow it receives). The rolled piece comes out of
 * the puck toward the viewer and its free end turns up, so clothes hang on the stem.
 * The geometry is modelled lying flat, so it is stood up here: local +Y (out of the puck) becomes
 * world +Z (out of the wall), and the overhang turns to point up.
 */
export function ClayObject({ colorway, seed, spin = 0.35, sway = 0.42, holdRef, hoverRef, rotationY = 0, shadow = 0.24, mount = 'wall' }: Props) {
  const geo = getClayGeometries(seed ?? colorway.seed)
  const baseMat = useMemo(() => createClayMaterial(colorway.base), []) // eslint-disable-line react-hooks/exhaustive-deps
  const topMat = useMemo(() => createClayMaterial(colorway.top), []) // eslint-disable-line react-hooks/exhaustive-deps
  const target = useRef({ base: new THREE.Color(colorway.base), top: new THREE.Color(colorway.top) })
  const swayer = useRef<THREE.Group>(null)
  const floater = useRef<THREE.Group>(null)
  const speed = useRef(spin)
  const phase = useRef(rotationY * 3.1)
  const reduced = useMemo(prefersReducedMotion, [])
  const blob = useMemo(blobTexture, [])

  useEffect(() => {
    target.current.base.set(colorway.base)
    target.current.top.set(colorway.top)
  }, [colorway.base, colorway.top])

  useEffect(
    () => () => {
      baseMat.dispose()
      topMat.dispose()
    },
    [baseMat, topMat],
  )

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const k = 1 - Math.exp(-d * 7)
    baseMat.color.lerp(target.current.base, k)
    topMat.color.lerp(target.current.top, k)
    if (reduced || !swayer.current) return
    const want = holdRef?.current ? 0 : hoverRef?.current ? spin * 4 : spin
    speed.current += (want - speed.current) * (1 - Math.exp(-d * 3))
    if (mount === 'floor') {
      swayer.current.rotation.y += speed.current * d
      if (floater.current) floater.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.035 + 0.035
      return
    }
    phase.current += speed.current * d
    swayer.current.rotation.y = rotationY + Math.sin(phase.current) * sway
    swayer.current.rotation.x = Math.sin(phase.current * 0.6 + 1.3) * sway * 0.25
  })

  if (mount === 'floor') {
    return (
      <>
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[9, 9]} />
          <shadowMaterial transparent opacity={shadow} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0.04, 0.002, 0]} scale={[2.75, 2.5, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={blob} transparent opacity={0.32} depthWrite={false} />
        </mesh>
        <group ref={floater}>
          <group ref={swayer} rotation-y={rotationY}>
            <mesh geometry={geo.base} material={baseMat} castShadow receiveShadow />
            <mesh geometry={geo.top} material={topMat} castShadow receiveShadow />
          </group>
        </group>
      </>
    )
  }

  return (
    <group ref={swayer} rotation-y={rotationY}>
      {/* the wall: invisible except for the shadow and the soft contact darkening around the puck */}
      <mesh receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={shadow} />
      </mesh>
      <mesh position={[0.05, -0.04, 0.002]} scale={[2.75, 2.6, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={blob} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <group rotation-z={-Math.PI / 2 + 0.12}>
        <group rotation-x={Math.PI / 2}>
          <mesh geometry={geo.base} material={baseMat} castShadow receiveShadow />
          <mesh geometry={geo.top} material={topMat} castShadow receiveShadow />
        </group>
      </group>
    </group>
  )
}
