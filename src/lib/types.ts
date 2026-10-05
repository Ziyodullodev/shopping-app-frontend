export type ShoeLook = { upper: string; sole: string; accent: string; lace: string }

export type Brand = { id: number; name: string; slug: string; logo: string | null }

export type ProductSize = { size: number; stock: number; in_stock: boolean }

export type Product = {
  id: number
  slug: string
  name: string
  brand: Brand
  short_description: string
  description?: string
  price: number
  old_price: number | null
  rating: number
  image: string | null
  look: ShoeLook
  is_favorite: boolean
  default_size: number | null
  sizes?: ProductSize[]
}

export type CartLine = { id: number; product: Product; size: number; quantity: number; line_total: number }

export type Cart = { items: CartLine[]; count: number; subtotal: number; shipping_fee: number; total: number }

export type User = {
  id: number
  telegram_id: number | null
  username: string
  first_name: string
  last_name: string
  display_name: string
  photo_url: string
  phone: string
}

export type OrderItem = { id: number; product_slug: string; product_name: string; size: number; price: number; quantity: number; line_total: number }

export type Order = {
  id: number
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  status_display: string
  payment_method: 'card' | 'cash'
  is_paid: boolean
  full_name: string
  phone: string
  address: string
  comment: string
  subtotal: number
  shipping_fee: number
  total: number
  items: OrderItem[]
  created_at: string
}

export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] }

export type OrderInput = { full_name?: string; phone: string; address: string; comment?: string; payment_method: 'card' | 'cash' }

export const money = (n: number) => `$${n.toFixed(2)}`
