import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { byId, formatPrice, PRICE } from '../data/colorways'
import { useStore, type CartLine } from '../state/store'
import { lockScroll } from '../lib/scroll'
import { IconArrow, IconClose, ProductGlyph } from './ui'
import { Stepper } from './Configurator'

const ease = [0.16, 1, 0.3, 1] as const

type Request = { number: string; lines: CartLine[]; total: number; count: number }

export function CartDrawer() {
  const { cart, cartOpen, closeCart, setQty, remove, count, subtotal, clear } = useStore()
  const [request, setRequest] = useState<Request | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    lockScroll(cartOpen)
    if (!cartOpen) return
    const prev = document.activeElement as HTMLElement | null
    const t = window.setTimeout(() => closeRef.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [cartOpen, closeCart])

  const placeRequest = () => {
    const number = `MG-${Math.floor(1000 + Math.random() * 9000)}`
    setRequest({ number, lines: cart, total: subtotal, count })
    clear()
  }

  const done = () => {
    closeCart()
    window.setTimeout(() => setRequest(null), 500)
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={closeCart} />
          <motion.div
            ref={panelRef}
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease }}
          >
            <div className="drawer-head">
              <span>{request ? 'Order request' : `Cart (${count})`}</span>
              <button ref={closeRef} className="link" onClick={request ? done : closeCart} aria-label="Close cart">
                Close <IconClose size={16} />
              </button>
            </div>

            <div className="drawer-body">
              {request ? (
                <div className="request">
                  <span className="small muted">Request number</span>
                  <span className="display request-num">{request.number}</span>
                  <p className="statement" style={{ fontSize: 26 }}>
                    Thank you. We&rsquo;ll confirm your order before any payment is taken.
                  </p>
                  <dl className="totals">
                    {request.lines.map((l) => {
                      const c = byId(l.id)
                      return (
                        <div key={l.id}>
                          <dt>
                            {c.name} × {l.qty}
                          </dt>
                          <dd className="price">{formatPrice(l.qty * PRICE)}</dd>
                        </div>
                      )
                    })}
                    <div className="grand">
                      <dt>Total</dt>
                      <dd className="price">{formatPrice(request.total)}</dd>
                    </div>
                  </dl>
                </div>
              ) : cart.length === 0 ? (
                <div className="drawer-empty">
                  <p className="statement">Nothing here yet.</p>
                  <p className="small muted" style={{ margin: 0 }}>
                    Ten colors, {formatPrice(PRICE)} each. Pick one and it lands here.
                  </p>
                  <button className="btn btn-ghost" onClick={closeCart}>
                    Continue shopping <IconArrow />
                  </button>
                </div>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  <AnimatePresence initial={false}>
                    {cart.map((l) => {
                      const c = byId(l.id)
                      return (
                        <motion.li
                          key={l.id}
                          layout
                          className="cart-line"
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
                          transition={{ duration: 0.45, ease }}
                        >
                          <div className="cart-thumb" style={{ background: c.field }}>
                            <ProductGlyph c={c} size={64} />
                          </div>
                          <div className="cart-line-info">
                            <span className="cart-line-name">{c.name}</span>
                            <span className="small muted">
                              {c.baseName} / {c.topName} · {formatPrice(PRICE)} each
                            </span>
                            <div className="cart-line-controls">
                              <Stepper value={l.qty} onChange={(n) => setQty(l.id, n)} label={`${c.name} quantity`} />
                              <button className="link small" onClick={() => remove(l.id)} aria-label={`Remove ${c.name}`}>
                                Remove
                              </button>
                            </div>
                          </div>
                          <span className="cart-line-total price">{formatPrice(l.qty * PRICE)}</span>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {!request && cart.length > 0 && (
              <div className="drawer-foot">
                <dl className="totals">
                  <div>
                    <dt className="muted">Subtotal · {count} item{count === 1 ? '' : 's'}</dt>
                    <dd className="price">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="grand">
                    <dt>Total</dt>
                    <dd className="price">{formatPrice(subtotal)}</dd>
                  </div>
                </dl>
                <button className="btn" onClick={placeRequest}>
                  Place order request <IconArrow />
                </button>
                <button className="btn btn-ghost" onClick={closeCart}>
                  Continue shopping
                </button>
                <p className="drawer-note">No payment is taken online. We confirm every order first.</p>
              </div>
            )}
            {request && (
              <div className="drawer-foot">
                <button className="btn" onClick={done}>
                  Done <IconArrow />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
