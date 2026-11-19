import { useEffect, useRef, useState } from 'react'
import { useStore } from '../state/store'
import { scrollToId } from '../lib/scroll'
import { Wordmark } from './ui'

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  scrollToId(id)
}

export function Nav() {
  const { count, bump, openCart } = useStore()
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // restart the bump animation every time something is added
  useEffect(() => {
    const el = countRef.current
    if (!el || bump === 0) return
    el.removeAttribute('data-bump')
    void el.offsetWidth
    el.setAttribute('data-bump', '')
  }, [bump])

  const links = (
    <>
      <a className="link nav-link" href="#shop" onClick={go('shop')}>
        Shop
      </a>
      <a className="link nav-link" href="#colors" onClick={go('colors')}>
        Colors
      </a>
    </>
  )

  return (
    <>
      <header className="nav" data-solid={solid || menu || undefined}>
        <nav className="nav-left" aria-label="Primary">
          <button className="link nav-menu-btn" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)}>
            {menu ? 'Close' : 'Menu'}
          </button>
          {links}
        </nav>
        <a href="#top" onClick={go('top')} aria-label="MANGO, back to top">
          <Wordmark label={false} />
        </a>
        <div className="nav-right">
          <a className="link nav-link" href="#about" onClick={go('about')}>
            About
          </a>
          <button className="link" onClick={openCart} aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}>
            <span>
              Cart (<span className="cart-count" ref={countRef}>{count}</span>)
            </span>
          </button>
        </div>
      </header>
      {menu && (
        <div className="mobile-menu" id="mobile-menu">
          {[
            ['shop', 'Shop'],
            ['colors', 'Colors'],
            ['about', 'About'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                setMenu(false)
                go(id)(e)
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
