import { COLORWAYS } from '../data/colorways'
import { useStore } from '../state/store'
import { scrollToId } from '../lib/scroll'
import { Wordmark } from './ui'

export function Footer() {
  const { openCart } = useStore()
  const year = new Date().getFullYear()
  return (
    <footer className="footer" id="footer">
      <div className="footer-top">
        <p className="footer-tag">
          Play takes shape.
          <br />
          <span className="muted">Ten colors, one price.</span>
        </p>
        <div className="footer-col">
          <h3>Shop</h3>
          <button className="link" onClick={() => scrollToId('shop')}>
            Configure yours
          </button>
          <button className="link" onClick={openCart}>
            Cart
          </button>
        </div>
        <div className="footer-col">
          <h3>Colors</h3>
          <button className="link" onClick={() => scrollToId('colors')}>
            Color collection
          </button>
          <button className="link" onClick={() => scrollToId('run')}>
            All {COLORWAYS.length}, one by one
          </button>
        </div>
        <div className="footer-col">
          <h3>About</h3>
          <button className="link" onClick={() => scrollToId('about')}>
            The studio
          </button>
          <button className="link" onClick={() => scrollToId('answers')}>
            Answers
          </button>
        </div>
      </div>
      <div className="footer-mark" aria-hidden>
        <Wordmark label={false} />
      </div>
      <div className="footer-bottom">
        <span>© {year} MANGO. All rights reserved.</span>
        <span>Prices in RMB. {COLORWAYS.length} colors, ¥12 each.</span>
      </div>
    </footer>
  )
}
