import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { api, ApiError } from '../lib/api'
import { haptic, isTelegram } from '../lib/telegram'
import type { Cart, CartLine, Order, OrderInput, Product, User } from '../lib/types'

type Status = 'loading' | 'ready' | 'error' | 'outside'

type Store = {
  status: Status
  error: string | null
  retry: () => void
  user: User | null
  cart: Cart
  linesFor: (slug: string) => CartLine[]
  addToCart: (product: Product, size?: number | null) => void
  setQty: (product: Product, size: number, qty: number) => void
  changeQty: (product: Product, size: number, delta: number) => void
  clearCart: () => void
  refreshCart: () => Promise<void>
  favorites: Set<string>
  isFavorite: (slug: string) => boolean
  toggleFavorite: (product: Product) => void
  placeOrder: (data: OrderInput) => Promise<Order>
  toast: string | null
  notify: (msg: string) => void
  onboarded: boolean
  finishOnboarding: () => void
}

const EMPTY_CART: Cart = { items: [], count: 0, subtotal: 0, shipping_fee: 0, total: 0 }
const Ctx = createContext<Store | null>(null)

const readFlag = (key: string) => { try { return localStorage.getItem(key) === '1' } catch { return false } }
const writeFlag = (key: string) => { try { localStorage.setItem(key, '1') } catch { /* storage unavailable */ } }
const message = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong')

/** Recomputes totals locally so optimistic updates look right before the server answers. */
function withTotals(items: CartLine[], fee: number): Cart {
  const subtotal = items.reduce((n, l) => n + l.product.price * l.quantity, 0)
  const shipping = items.length ? fee : 0
  return {
    items: items.map(l => ({ ...l, line_total: l.product.price * l.quantity })),
    count: items.reduce((n, l) => n + l.quantity, 0),
    subtotal,
    shipping_fee: shipping,
    total: subtotal + shipping,
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<Cart>(EMPTY_CART)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [onboarded, setOnboarded] = useState(() => readFlag('shoer.onboarded'))
  const [toast, setToast] = useState<string | null>(null)

  const toastTimer = useRef<number | undefined>(undefined)
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  const pending = useRef(0)
  const fee = useRef(0)
  // Mirrors `cart` synchronously so rapid taps in the same frame build on each other.
  const cartRef = useRef<Cart>(EMPTY_CART)

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2000)
  }, [])

  const applyServerCart = useCallback((c: Cart) => {
    if (c.shipping_fee) fee.current = c.shipping_fee
    cartRef.current = c
    setCart(c)
  }, [])

  const load = useCallback(async () => {
    try {
      setUser(await api.login())
      const [c, favs] = await Promise.all([api.cart(), api.favorites()])
      applyServerCart(c)
      setFavorites(new Set(favs.map(p => p.slug)))
      setStatus('ready')
    } catch (e) {
      if (e instanceof ApiError && e.status === 401 && !isTelegram) {
        setStatus('outside')
      } else {
        setError(message(e))
        setStatus('error')
      }
    }
  }, [applyServerCart])

  // All state updates in load() happen after an await, so this does not cascade renders.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { void load() }, [load])

  const boot = useCallback(() => {
    setStatus('loading')
    setError(null)
    void load()
  }, [load])

  /**
   * Applies an optimistic change now and queues the request. Requests run one at a time,
   * and the server cart is applied only once the queue is empty, so fast taps don't flicker.
   */
  const mutateCart = useCallback((optimistic: (items: CartLine[]) => CartLine[], req: () => Promise<Cart>) => {
    const next = withTotals(optimistic(cartRef.current.items), fee.current)
    cartRef.current = next
    setCart(next)
    pending.current += 1
    queue.current = queue.current
      .then(req)
      .then(server => {
        pending.current -= 1
        if (pending.current === 0) applyServerCart(server)
      })
      .catch(async e => {
        pending.current -= 1
        haptic.error()
        notify(message(e))
        if (pending.current === 0) {
          try { applyServerCart(await api.cart()) } catch { /* keep optimistic state */ }
        }
      })
  }, [applyServerCart, notify])

  const addToCart = useCallback((product: Product, size?: number | null) => {
    const s = size ?? product.default_size
    if (s == null) { notify('Out of stock'); return }
    haptic.tap()
    const isFirst = !cartRef.current.items.some(l => l.product.slug === product.slug)
    mutateCart(
      items => {
        const hit = items.find(l => l.product.slug === product.slug && l.size === s)
        return hit
          ? items.map(l => (l === hit ? { ...l, quantity: l.quantity + 1 } : l))
          : [...items, { id: -Date.now(), product, size: s, quantity: 1, line_total: product.price }]
      },
      () => api.addToCart(product.slug, s),
    )
    if (isFirst) notify(`${product.name} added to cart`)
  }, [mutateCart, notify])

  const setQty = useCallback((product: Product, size: number, qty: number) => {
    haptic.select()
    mutateCart(
      items => {
        const hit = items.find(l => l.product.slug === product.slug && l.size === size)
        if (qty <= 0) return items.filter(l => l !== hit)
        if (hit) return items.map(l => (l === hit ? { ...l, quantity: qty } : l))
        return [...items, { id: -Date.now(), product, size, quantity: qty, line_total: product.price * qty }]
      },
      () => api.setCartQty(product.slug, size, Math.max(qty, 0)),
    )
  }, [mutateCart])

  const changeQty = useCallback((product: Product, size: number, delta: number) => {
    const line = cartRef.current.items.find(l => l.product.slug === product.slug && l.size === size)
    setQty(product, size, Math.max((line?.quantity ?? 0) + delta, 0))
  }, [setQty])

  const clearCart = useCallback(() => mutateCart(() => [], api.clearCart), [mutateCart])

  const refreshCart = useCallback(async () => { applyServerCart(await api.cart()) }, [applyServerCart])

  const toggleFavorite = useCallback((product: Product) => {
    haptic.tap()
    const slug = product.slug
    const was = favorites.has(slug)
    const flip = (on: boolean) => setFavorites(f => {
      const next = new Set(f)
      if (on) next.add(slug); else next.delete(slug)
      return next
    })
    flip(!was)
    ;(was ? api.removeFavorite(slug) : api.addFavorite(slug)).catch(e => { flip(was); notify(message(e)) })
  }, [favorites, notify])

  const placeOrder = useCallback(async (data: OrderInput) => {
    await queue.current // let pending cart edits reach the server first
    try {
      const order = await api.createOrder(data)
      haptic.success()
      applyServerCart(EMPTY_CART)
      return order
    } catch (e) {
      haptic.error()
      throw e
    }
  }, [applyServerCart])

  const value = useMemo<Store>(() => ({
    status,
    error,
    retry: boot,
    user,
    cart,
    linesFor: (slug: string) => cart.items.filter(l => l.product.slug === slug),
    addToCart,
    setQty,
    changeQty,
    clearCart,
    refreshCart,
    favorites,
    isFavorite: (slug: string) => favorites.has(slug),
    toggleFavorite,
    placeOrder,
    toast,
    notify,
    onboarded,
    finishOnboarding: () => { writeFlag('shoer.onboarded'); setOnboarded(true) },
  }), [status, error, boot, user, cart, addToCart, setQty, changeQty, clearCart, refreshCart, favorites, toggleFavorite, placeOrder, toast, notify, onboarded])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
