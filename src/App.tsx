import { useEffect, useRef } from 'react'
import { StoreProvider, useStore } from './state/store'
import { byId } from './data/colorways'
import { initScroll } from './lib/scroll'
import { SceneCanvas } from './three/SceneCanvas'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ColorRun } from './components/ColorRun'
import { Configurator } from './components/Configurator'
import { Collection } from './components/Collection'
import { Band, Details, Manifesto } from './components/Story'
import { About, Faq } from './components/About'
import { Footer } from './components/Footer'
import { BuyWidget } from './components/BuyWidget'
import { CartDrawer } from './components/CartDrawer'

function Shell() {
  const root = useRef<HTMLDivElement>(null!)
  const { selected } = useStore()

  useEffect(() => initScroll(), [])

  // the live colorway tints the wordmark, the band and the buy widget
  useEffect(() => {
    const c = byId(selected)
    const s = document.documentElement.style
    s.setProperty('--sel-base', c.base)
    s.setProperty('--sel-top', c.top)
    s.setProperty('--sel-field', c.field)
    s.setProperty('--sel-ink', c.ink)
  }, [selected])

  return (
    <div ref={root}>
      <Nav />
      <main>
        <Hero />
        <ColorRun />
        <Configurator />
        <Details />
        <Collection />
        <Manifesto />
        <Band />
        <About />
        <Faq />
      </main>
      <Footer />
      <BuyWidget />
      <CartDrawer />
      <SceneCanvas eventSource={root} />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
