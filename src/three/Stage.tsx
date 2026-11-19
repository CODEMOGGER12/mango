import * as THREE from 'three'

let blob: THREE.CanvasTexture | null = null

/** Soft radial falloff used for the contact darkening where the puck meets the wall. */
export function blobTexture() {
  if (blob) return blob
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grd.addColorStop(0, 'rgba(0,0,0,1)')
  grd.addColorStop(0.45, 'rgba(0,0,0,0.55)')
  grd.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, size, size)
  blob = new THREE.CanvasTexture(c)
  blob.colorSpace = THREE.SRGBColorSpace
  return blob
}

/**
 * Studio lighting for a wall-mounted piece: soft hemisphere, one shadow-casting key from the
 * upper left in front of the wall (so the hook's shadow falls down and to the right on the wall),
 * a warm grazing rim and a cool front fill.
 */
export function Stage({ shadowSize = 1024, floor = false }: { shadowSize?: number; floor?: boolean }) {
  return (
    <>
      <hemisphereLight args={['#fff7ee', '#7d736a', floor ? 1.35 : 1.25]} />
      <directionalLight
        castShadow
        position={floor ? [-2.4, 4.6, 2.6] : [-2.3, 3.1, 4.4]}
        intensity={2.3}
        color="#fff4e8"
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-2.4}
        shadow-camera-right={2.4}
        shadow-camera-top={2.4}
        shadow-camera-bottom={-2.4}
        shadow-camera-near={0.5}
        shadow-camera-far={14}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-radius={5}
      />
      <directionalLight position={floor ? [3.2, 1.6, -2.4] : [3.4, 1.2, 0.9]} intensity={floor ? 0.9 : 0.85} color="#ffe6cf" />
      <directionalLight position={floor ? [2.4, 0.6, 3.4] : [1.6, -0.8, 4]} intensity={floor ? 0.4 : 0.45} color="#f1f4ff" />
    </>
  )
}
