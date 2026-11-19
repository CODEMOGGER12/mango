import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { COLORWAYS, PRICE } from '../data/colorways'

export type CartLine = { id: string; qty: number }
type State = { selected: string; cart: CartLine[]; cartOpen: boolean; bump: number }
type Action =
  | { type: 'select'; id: string }
  | { type: 'add'; id: string; qty: number }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' }
  | { type: 'open' }
  | { type: 'close' }

export const MAX_QTY = 99
const KEY = 'mango.cart.v1'

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return parsed.filter((l) => COLORWAYS.some((c) => c.id === l.id) && l.qty > 0).map((l) => ({ id: l.id, qty: Math.min(MAX_QTY, Math.floor(l.qty)) }))
  } catch {
    return []
  }
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'select':
      return { ...s, selected: a.id }
    case 'add': {
      const existing = s.cart.find((l) => l.id === a.id)
      const cart = existing
        ? s.cart.map((l) => (l.id === a.id ? { ...l, qty: Math.min(MAX_QTY, l.qty + a.qty) } : l))
        : [...s.cart, { id: a.id, qty: Math.min(MAX_QTY, a.qty) }]
      return { ...s, cart, bump: s.bump + 1 }
    }
    case 'setQty':
      return { ...s, cart: s.cart.map((l) => (l.id === a.id ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, a.qty)) } : l)) }
    case 'remove':
      return { ...s, cart: s.cart.filter((l) => l.id !== a.id) }
    case 'clear':
      return { ...s, cart: [] }
    case 'open':
      return { ...s, cartOpen: true }
    case 'close':
      return { ...s, cartOpen: false }
  }
}

type Store = State & {
  select: (id: string) => void
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  count: number
  subtotal: number
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ selected: COLORWAYS[0].id, cart: load(), cartOpen: false, bump: 0 }))

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.cart))
    } catch {
      /* storage unavailable: the cart still works for this visit */
    }
  }, [state.cart])

  const value = useMemo<Store>(() => {
    const count = state.cart.reduce((n, l) => n + l.qty, 0)
    return {
      ...state,
      count,
      subtotal: count * PRICE,
      select: (id) => dispatch({ type: 'select', id }),
      add: (id, qty = 1) => dispatch({ type: 'add', id, qty }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
      openCart: () => dispatch({ type: 'open' }),
      closeCart: () => dispatch({ type: 'close' }),
    }
  }, [state])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside StoreProvider')
  return s
}
