import { useId, useState } from 'react'
import { formatPrice, PRICE } from '../data/colorways'
import { Fade, IconPlus, Lines } from './ui'

export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <Lines as="h2" className="display about-title" lines={['A little', 'less', 'serious.']} />
      <span id="about-title" className="sr-only">
        About MANGO
      </span>
      <div className="about-body">
        <Fade as="p" className="statement">
          MANGO is a small studio making clay hooks for your wall: a rounded clay base that sticks on, with a sculpted hook pressed on top. Soft, matte and slightly uneven.
        </Fade>
        <Fade as="p" className="small" i={1}>
          We make them in ten color pairs and sell every one for {formatPrice(PRICE)}, so choosing a color is the hardest part.
        </Fade>
      </div>
    </section>
  )
}

const QA = [
  ['Is every piece the same?', 'No. Each one is formed by hand, so the curves, dents and proportions shift a little from piece to piece. The one you get will be its own.'],
  ['How much does it cost?', `${formatPrice(PRICE)} for any color. There are no premium colors and no special editions.`],
  ['Can I order more than one color?', 'Yes. Add as many colors and pieces as you like to the cart, and change quantities there at any time.'],
  ['How does ordering work?', 'Place an order request from the cart and you get a request number straight away. Nothing is charged online: we confirm your order before any payment.'],
  ['What is it for?', 'Hanging your clothes. Stick it to a wall, by the door or next to the mirror, and hang what you wear most on it.'],
]

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="faq-item">
      <button className="faq-q" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <span className="faq-icon">
          <IconPlus size={22} />
        </span>
      </button>
      <div className="faq-a" id={id} data-open={open || undefined} role="region" aria-hidden={!open}>
        <div>
          <p>{a}</p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  return (
    <section className="faq" id="answers" aria-labelledby="faq-title">
      <h2 id="faq-title" className="faq-title">
        SOME ANSWERS
      </h2>
      {QA.map(([q, a]) => (
        <Item key={q} q={q} a={a} />
      ))}
    </section>
  )
}
