import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { noise3D, rng, smoothstep } from './noise'

/**
 * Procedural clay geometry.
 *
 * The object is two pieces, after the reference photo:
 *  - a rounded, slightly lopsided puck (lathe profile, then hand-pressed deformation)
 *  - a thick rolled clay log swept along a bent curve: one end planted into the puck,
 *    the other cantilevered out past the puck's edge.
 * Every colorway gets its own seed, so no two pieces are quite the same.
 */

export const BASE_R = 1
export const BASE_H = 0.36

export type ClayGeometries = {
  base: THREE.BufferGeometry
  top: THREE.BufferGeometry
}

const cache = new Map<number, ClayGeometries>()

export function getClayGeometries(seed: number): ClayGeometries {
  let g = cache.get(seed)
  if (!g) {
    const r = rng(seed)
    const n = noise3D(seed * 7 + 3)
    const top = buildTop(r, n)
    const base = buildBase(r, n, top.contact)
    g = { base, top: top.geometry }
    cache.set(seed, g)
  }
  return g
}

type Noise = (x: number, y: number, z: number) => number
type Rand = () => number

const fbm = (n: Noise, x: number, y: number, z: number, oct = 3) => {
  let a = 0.5
  let f = 1
  let s = 0
  for (let i = 0; i < oct; i++) {
    s += a * n(x * f, y * f, z * f)
    f *= 2.03
    a *= 0.5
  }
  return s
}

/** Flip triangle winding when a closed mesh's signed volume is negative (normals pointing in). */
function ensureOutward(geo: THREE.BufferGeometry) {
  const pos = geo.getAttribute('position')
  const idx = geo.getIndex()!
  let vol = 0
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  for (let i = 0; i < idx.count; i += 3) {
    a.fromBufferAttribute(pos, idx.getX(i))
    b.fromBufferAttribute(pos, idx.getX(i + 1))
    c.fromBufferAttribute(pos, idx.getX(i + 2))
    vol += a.dot(b.clone().cross(c))
  }
  if (vol < 0) {
    for (let i = 0; i < idx.count; i += 3) {
      const t = idx.getX(i + 1)
      idx.setX(i + 1, idx.getX(i + 2))
      idx.setX(i + 2, t)
    }
    idx.needsUpdate = true
  }
}

/* ------------------------------------------------------------------ */
/* Base: a pressed clay puck                                           */
/* ------------------------------------------------------------------ */

function buildBase(r: Rand, n: Noise, contact: THREE.Vector3) {
  const R = BASE_R
  const H = BASE_H
  const eTop = 0.17 // soft rolled top edge
  const eBot = 0.07 // tighter bottom edge where it was pressed onto the table
  const pts: THREE.Vector2[] = []

  // bottom: center -> just inside the edge
  const bottomSteps = 14
  for (let i = 0; i <= bottomSteps; i++) {
    const t = i / bottomSteps
    pts.push(new THREE.Vector2((R - eBot) * t, 0.004 * (1 - t * t)))
  }
  // one continuous rounded side: tighter at the floor, fuller and softer at the top
  const sideSteps = 34
  for (let i = 1; i < sideSteps; i++) {
    const a = -Math.PI / 2 + (i / sideSteps) * Math.PI
    const sa = Math.sin(a)
    const ca = Math.cos(a)
    const e = sa < 0 ? eBot : eTop
    const yMid = eBot + (H - eTop - eBot) * 0.5
    const y = sa < 0 ? yMid + (yMid) * -Math.pow(-sa, 0.9) * 1 : yMid + (H - yMid) * Math.pow(sa, 0.85)
    const rad = R - e + e * Math.pow(Math.max(0, ca), 0.6) + 0.012 * ca
    pts.push(new THREE.Vector2(rad, Math.max(0, y)))
  }
  // top: edge -> center, slight dome
  const topSteps = 22
  for (let i = 0; i <= topSteps; i++) {
    const t = i / topSteps
    const rad = (R - eTop) * (1 - t)
    const k = rad / R
    pts.push(new THREE.Vector2(rad, H + 0.025 * (1 - k * k)))
  }

  let geo: THREE.BufferGeometry = new THREE.LatheGeometry(pts, 144)
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  geo = mergeVertices(geo, 1e-5)

  // Hand-pressed deformation
  const ph = [r() * 6.28, r() * 6.28, r() * 6.28, r() * 6.28]
  const dents = Array.from({ length: 4 }, () => {
    const a = r() * Math.PI * 2
    const d = 0.25 + r() * 0.5
    return { x: Math.cos(a) * d, z: Math.sin(a) * d, rad: 0.22 + r() * 0.2, depth: 0.012 + r() * 0.02 }
  })
  const tiltX = (r() - 0.5) * 0.05
  const tiltZ = (r() - 0.5) * 0.05

  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const center = new THREE.Vector3(0, H * 0.45, 0)
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const th = Math.atan2(v.z, v.x)
    const wob = 1 + 0.028 * Math.sin(2 * th + ph[0]) + 0.016 * Math.sin(3 * th + ph[1]) + 0.008 * Math.sin(5 * th + ph[2])
    v.x *= wob * 1.035
    v.z *= wob * 0.965

    const topW = smoothstep(H * 0.55, H, v.y)
    for (const d of dents) {
      const dd = (v.x - d.x) ** 2 + (v.z - d.z) ** 2
      v.y -= d.depth * Math.exp(-dd / (d.rad * d.rad)) * topW
    }
    // the top surface is never quite level
    v.y += (v.x * tiltX + v.z * tiltZ) * topW
    // a faint thumb-smoothed ridge around the rim
    v.y += 0.006 * Math.sin(th * 7 + ph[3]) * topW * smoothstep(0.6, 0.95, Math.hypot(v.x, v.z))

    dir.copy(v).sub(center).normalize()
    const big = fbm(n, v.x * 1.6, v.y * 1.6, v.z * 1.6, 2) * 0.03
    const small = fbm(n, v.x * 6 + 11, v.y * 6, v.z * 6, 2) * 0.006
    v.addScaledVector(dir, big + small)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  ensureOutward(geo)
  geo.computeVertexNormals()

  // Baked ambient occlusion: darker where the top piece meets the puck and along the floor line
  const col = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const dc = (v.x - contact.x) ** 2 + (v.z - contact.z) ** 2
    let ao = 1 - 0.42 * Math.exp(-dc / 0.05) * smoothstep(H * 0.6, H, v.y)
    ao *= 0.62 + 0.38 * smoothstep(0, 0.14, v.y)
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = ao
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  geo.computeBoundingSphere()
  return geo
}

/* ------------------------------------------------------------------ */
/* Top: a rolled clay log, bent and planted                            */
/* ------------------------------------------------------------------ */

function buildTop(r: Rand, n: Noise) {
  const H = BASE_H
  const j = (s: number) => (r() - 0.5) * s
  const ctrl = [
    new THREE.Vector3(0.44 + j(0.08), H - 0.06, 0.1 + j(0.1)),
    new THREE.Vector3(0.42 + j(0.05), H + 0.22, 0.07),
    new THREE.Vector3(0.27 + j(0.05), H + 0.47 + j(0.04), 0.03),
    new THREE.Vector3(-0.08, H + 0.56 + j(0.04), -0.02 + j(0.06)),
    new THREE.Vector3(-0.55 + j(0.05), H + 0.53 + j(0.05), -0.07 + j(0.04)),
    new THREE.Vector3(-1.02 + j(0.08), H + 0.43 + j(0.06), -0.12 + j(0.08)),
  ]
  const curve = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal')
  const len = curve.getLength()

  const SEG = 150 // rings along the body
  const CAP = 12 // rings per end cap
  const M = 44 // vertices around
  const R0 = 0.205
  const zAxis = new THREE.Vector3(0, 0, 1)

  const pinches = Array.from({ length: 3 }, () => ({ s: 0.2 + r() * 0.7, a: r() * Math.PI * 2, depth: 0.018 + r() * 0.018, w: 0.05 + r() * 0.04 }))
  const radiusAt = (s: number) => {
    let rad = R0 * (1 + 0.07 * Math.sin(Math.PI * s) - 0.08 * s)
    rad += 0.05 * Math.exp(-((s / 0.07) ** 2)) // pressed, flared foot where it meets the base
    rad *= 1 + 0.05 * n(s * 4.0, 0.3, 7.1)
    return rad
  }

  type Ring = { c: THREE.Vector3; A: THREE.Vector3; B: THREE.Vector3; ra: number; rb: number; s: number }
  const rings: Ring[] = []
  const frameAt = (s: number) => {
    const t = curve.getTangentAt(Math.min(1, Math.max(0, s))).normalize()
    const A = new THREE.Vector3().crossVectors(t, zAxis).normalize()
    const B = new THREE.Vector3().crossVectors(A, t).normalize()
    return { t, A, B }
  }
  // flattening: rolled logs get pressed down, so they're a touch wider than tall
  const FA = 0.9
  const FB = 1.1

  // start cap (s = 0), from apex-adjacent ring outward
  {
    const { t, A, B } = frameAt(0)
    const c0 = curve.getPointAt(0)
    const rad = radiusAt(0)
    for (let k = CAP - 1; k >= 1; k--) {
      const phi = (k / CAP) * (Math.PI / 2)
      const c = c0.clone().addScaledVector(t, -Math.sin(phi) * rad * 0.8)
      rings.push({ c, A, B, ra: rad * FA * Math.cos(phi), rb: rad * FB * Math.cos(phi), s: 0 })
    }
  }
  for (let i = 0; i <= SEG; i++) {
    const s = i / SEG
    const { A, B } = frameAt(s)
    const rad = radiusAt(s)
    rings.push({ c: curve.getPointAt(s), A, B, ra: rad * FA, rb: rad * FB, s })
  }
  {
    const { t, A, B } = frameAt(1)
    const c1 = curve.getPointAt(1)
    const rad = radiusAt(1)
    for (let k = 1; k <= CAP - 1; k++) {
      const phi = (k / CAP) * (Math.PI / 2)
      const c = c1.clone().addScaledVector(t, Math.sin(phi) * rad * 0.92)
      rings.push({ c, A, B, ra: rad * FA * Math.cos(phi), rb: rad * FB * Math.cos(phi), s: 1 })
    }
  }

  const startApex = curve.getPointAt(0).addScaledVector(frameAt(0).t, -radiusAt(0) * 0.8)
  const endApex = curve.getPointAt(1).addScaledVector(frameAt(1).t, radiusAt(1) * 0.92)

  const verts: number[] = []
  const v = new THREE.Vector3()
  const d = new THREE.Vector3()
  const push = (p: THREE.Vector3, dirv: THREE.Vector3, s: number, ang: number) => {
    // clay surface: low-frequency lumps plus finer handling marks
    let disp = fbm(n, p.x * 2.4, p.y * 2.4, p.z * 2.4, 2) * 0.026 + fbm(n, p.x * 7 + 5, p.y * 7, p.z * 7, 2) * 0.006
    for (const q of pinches) {
      const da = Math.atan2(Math.sin(ang - q.a), Math.cos(ang - q.a))
      disp -= q.depth * Math.exp(-((((s - q.s) * len) / q.w) ** 2)) * Math.exp(-((da / 0.9) ** 2))
    }
    v.copy(p).addScaledVector(dirv, disp)
    verts.push(v.x, v.y, v.z)
  }

  for (const ring of rings) {
    for (let m = 0; m < M; m++) {
      const ang = (m / M) * Math.PI * 2
      const ca = Math.cos(ang)
      const sa = Math.sin(ang)
      // superellipse cross-section: squarer than a tube, rounder than a box
      const e = 2.4
      const cx = Math.sign(ca) * Math.pow(Math.abs(ca), 2 / e)
      const sy = Math.sign(sa) * Math.pow(Math.abs(sa), 2 / e)
      d.copy(ring.A).multiplyScalar(cx * ring.ra).addScaledVector(ring.B, sy * ring.rb)
      const p = ring.c.clone().add(d)
      const dirv = d.lengthSq() > 1e-10 ? d.clone().normalize() : ring.A.clone()
      push(p, dirv, ring.s, ang)
    }
  }
  const apex0 = verts.length / 3
  push(startApex, frameAt(0).t.clone().negate(), 0, 0)
  const apex1 = verts.length / 3
  push(endApex, frameAt(1).t.clone(), 1, 0)

  const idx: number[] = []
  for (let i = 0; i < rings.length - 1; i++) {
    for (let m = 0; m < M; m++) {
      const a = i * M + m
      const b = i * M + ((m + 1) % M)
      const c = (i + 1) * M + m
      const e = (i + 1) * M + ((m + 1) % M)
      idx.push(a, c, b, b, c, e)
    }
  }
  const last = (rings.length - 1) * M
  for (let m = 0; m < M; m++) {
    idx.push(apex0, m, (m + 1) % M)
    idx.push(apex1, last + ((m + 1) % M), last + m)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setIndex(idx)
  ensureOutward(geo)
  geo.computeVertexNormals()

  // Baked AO: darker near the puck surface and on the underside of the overhang
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const nor = geo.getAttribute('normal') as THREE.BufferAttribute
  const col = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const ny = nor.getY(i)
    const inside = Math.hypot(v.x, v.z) < BASE_R * 1.04 ? 1 : 0
    let ao = 1 - inside * 0.45 * (1 - smoothstep(H, H + 0.22, v.y))
    ao *= 1 - 0.18 * smoothstep(0.1, -0.8, ny)
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = Math.max(0.35, ao)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  geo.computeBoundingSphere()

  return { geometry: geo, contact: curve.getPointAt(0) }
}
