import { initData } from './telegram'
import type { Brand, Cart, Order, OrderInput, Paginated, Product, User } from './types'

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '/api'

export class ApiError extends Error {
  status: number
  data: unknown
  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

let access: string | null = null

function errorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback
  const d = data as Record<string, unknown>
  if (typeof d.detail === 'string') return d.detail
  const first = Object.entries(d)[0]
  if (first) {
    const [field, value] = first
    const text = Array.isArray(value) ? value.join(' ') : String(value)
    return field === 'non_field_errors' ? text : `${field}: ${text}`
  }
  return fallback
}

async function raw<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (auth && access) headers.set('Authorization', `Bearer ${access}`)
  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) throw new ApiError(res.status, errorMessage(data, `Request failed (${res.status})`), data)
  return data as T
}

/** Authenticated request that logs in again once if the token expired. */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    return await raw<T>(path, init)
  } catch (e) {
    if (e instanceof ApiError && e.status === 401 && path !== '/auth/telegram/') {
      await login()
      return raw<T>(path, init)
    }
    throw e
  }
}

const num = (v: unknown) => (v === null || v === undefined ? null : Number(v))

function normProduct(p: Product): Product {
  return { ...p, price: Number(p.price), old_price: num(p.old_price), rating: Number(p.rating) }
}

function normCart(c: Cart): Cart {
  return {
    items: c.items.map(l => ({ ...l, product: normProduct(l.product), line_total: Number(l.line_total) })),
    count: c.count,
    subtotal: Number(c.subtotal),
    shipping_fee: Number(c.shipping_fee),
    total: Number(c.total),
  }
}

function normOrder(o: Order): Order {
  return {
    ...o,
    subtotal: Number(o.subtotal),
    shipping_fee: Number(o.shipping_fee),
    total: Number(o.total),
    items: o.items.map(i => ({ ...i, price: Number(i.price), line_total: Number(i.line_total) })),
  }
}

export async function login(): Promise<User> {
  const res = await raw<{ access: string; user: User }>(
    '/auth/telegram/', { method: 'POST', body: JSON.stringify({ init_data: initData() }) }, false,
  )
  access = res.access
  return res.user
}

export const api = {
  login,
  me: () => request<User>('/auth/me/'),

  brands: () => raw<Brand[]>('/brands/', {}, false),
  products: async (params: { brand?: string; search?: string; ordering?: string } = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][])
    const res = await request<Paginated<Product>>(`/products/?${qs}`)
    return { ...res, results: res.results.map(normProduct) }
  },
  product: async (slug: string) => normProduct(await request<Product>(`/products/${encodeURIComponent(slug)}/`)),

  favorites: async () => (await request<Product[]>('/favorites/')).map(normProduct),
  addFavorite: (slug: string) => request('/favorites/', { method: 'POST', body: JSON.stringify({ product: slug }) }),
  removeFavorite: (slug: string) => request(`/favorites/${encodeURIComponent(slug)}/`, { method: 'DELETE' }),

  cart: async () => normCart(await request<Cart>('/cart/')),
  addToCart: async (slug: string, size?: number | null, quantity = 1) =>
    normCart(await request<Cart>('/cart/items/', { method: 'POST', body: JSON.stringify({ product: slug, size: size ?? undefined, quantity }) })),
  setCartQty: async (slug: string, size: number, quantity: number) =>
    normCart(await request<Cart>('/cart/items/', { method: 'PUT', body: JSON.stringify({ product: slug, size, quantity }) })),
  clearCart: async () => normCart(await request<Cart>('/cart/', { method: 'DELETE' })),

  orders: async () => (await request<Paginated<Order>>('/orders/')).results.map(normOrder),
  createOrder: async (data: OrderInput) => normOrder(await request<Order>('/orders/', { method: 'POST', body: JSON.stringify(data) })),
  cancelOrder: async (id: number) => normOrder(await request<Order>(`/orders/${id}/cancel/`, { method: 'POST' })),
}
