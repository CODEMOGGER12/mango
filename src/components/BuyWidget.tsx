import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { byId, formatPrice, PRICE } from '../data/colorways'
import { useStore } from '../state/store'
import { ProductGlyph } from './ui'

/** The floating buy card from the reference, carrying whichever color is selected. */
export function BuyWidget() {
  const { selected, add, cartOpen } = useStore()
  const c = byId(selected)
  const [dismissed, setDismissed] = useState(false)
  const [blocked, setBlocked] = useState<Record<string, boolean>>({})
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const targets = ['run', 'shop', 'details', 'colors', 'answers', 'footer'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => setBlocked((b) => ({ ...b, ...Object.fromEntries(entries.map((e) => [e.target.id, e.isIntersecting])) })),
      { threshold: 0.12 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  const show = !dismissed && !cartOpen && !Object.values(blocked).some(Boolean)

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          className="buy"
          aria-label="Quick add"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="buy-thumb">
            <ProductGlyph c={c} size={56} />
          </div>
          <div className="buy-body">
            <span className="buy-name">{c.name}</span>
            <span className="muted price">{formatPrice(PRICE)}</span>
            <div className="buy-actions">
              <button className="link" onClick={() => setDismissed(true)}>
                Close
              </button>
              <button
                className="link"
                style={{ fontWeight: 560 }}
                onClick={() => {
                  add(c.id)
                  setAdded(true)
                  window.setTimeout(() => setAdded(false), 1500)
                }}
              >
                {added ? 'Added' : 'Add to cart'}
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
