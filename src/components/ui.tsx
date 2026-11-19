import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from 'react'
import type { Colorway } from '../data/colorways'

/* Icons: one family, 1.5 stroke, square caps */
type IconProps = { size?: number }
const S = ({ size = 18, children }: { size?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" aria-hidden>
    {children}
  </svg>
)
export const IconArrow = ({ size }: IconProps) => (
  <S size={size}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </S>
)
export const IconArrowLeft = ({ size }: IconProps) => (
  <S size={size}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </S>
)
export const IconPlus = ({ size }: IconProps) => (
  <S size={size}>
    <path d="M12 4v16M4 12h16" />
  </S>
)
export const IconMinus = ({ size }: IconProps) => (
  <S size={size}>
    <path d="M4 12h16" />
  </S>
)
export const IconClose = ({ size }: IconProps) => (
  <S size={size}>
    <path d="M5 5l14 14M19 5L5 19" />
  </S>
)
export const IconReset = ({ size }: IconProps) => (
  <S size={size}>
    <path d="M4.5 9.5A8 8 0 1 1 4 13" />
    <path d="M4 4v5.5h5.5" />
  </S>
)

/** MANGO wordmark. The O is a pressed pebble of clay in the live colorway. */
export function Wordmark({ className = '', label = true }: { className?: string; label?: boolean }) {
  return (
    <span className={`wordmark ${className}`} aria-label={label ? 'MANGO' : undefined} role={label ? 'img' : undefined}>
      <span aria-hidden>MANG</span>
      <svg className="wm-o" viewBox="0 0 100 94" aria-hidden>
        <path
          d="M50.5 2.5C77 2 97.5 18.5 97.5 46.5S78.5 92 49 91.5 2.5 74 2.5 47.5 23 3 50.5 2.5Z"
          fill="var(--sel-base)"
          style={{ transition: 'fill .6s' }}
        />
        <path d="M27 44.5c9-9.5 30.5-12 46-4.5" stroke="var(--sel-top)" strokeWidth="15" strokeLinecap="round" fill="none" style={{ transition: 'stroke .6s' }} />
      </svg>
    </span>
  )
}

/** Flat front-view drawing of the hook on its wall, used where a live 3D view would be overkill (cart, widget). */
export function ProductGlyph({ c, size = 64 }: { c: Colorway; size?: number }) {
  return (
    <svg width={size * 0.8} height={size} viewBox="0 0 96 120" aria-hidden>
      <path d="M48 44c22 0 38 14 38 35s-16 37-38 37-38-15-37-37 15-35 37-35Z" fill={c.base} />
      <ellipse cx="44" cy="70" rx="26" ry="20" fill="#fff" opacity=".1" />
      <path d="M58 88c3-12 2-30-2-46s-6-25-10-30" stroke={c.top} strokeWidth="17" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function SwatchArt({ c }: { c: Colorway }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="19" fill={c.base} />
      <path d="M20 1a19 19 0 0 1 0 38Z" fill={c.top} transform="rotate(-35 20 20)" />
      <circle cx="20" cy="20" r="19" fill="none" stroke="rgba(28,22,19,.14)" />
    </svg>
  )
}

export function useInView<T extends Element>(opts: IntersectionObserverInit = { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }, once = true) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        if (once) io.disconnect()
      } else if (!once) setInView(false)
    }, opts)
    io.observe(el)
    return () => io.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, inView] as const
}

/** Headline lines that rise out of their own masks when scrolled into view. */
export function Lines({ lines, as: Tag = 'h2', className = '', style }: { lines: ReactNode[]; as?: ElementType; className?: string; style?: CSSProperties }) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag ref={ref} className={`reveal ${className}`} data-in={inView || undefined} style={style}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span className="line-inner" style={{ '--i': i } as CSSProperties}>
            {l}
          </span>
        </span>
      ))}
    </Tag>
  )
}

export function Fade({ children, as: Tag = 'div', className = '', i = 0, ...rest }: { children: ReactNode; as?: ElementType; className?: string; i?: number } & Record<string, unknown>) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag ref={ref} className={`fade ${className}`} data-in={inView || undefined} style={{ '--i': i } as CSSProperties} {...rest}>
      {children}
    </Tag>
  )
}

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

/** role=img for <View> trackers (drei's props type doesn't list ARIA roles, but forwards them). */
export const IMG = { role: 'img' } as Record<string, string>
