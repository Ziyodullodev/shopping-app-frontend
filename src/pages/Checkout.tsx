import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { CardIcon, CheckIcon, PinIcon, UserIcon } from '../components/Icons'
import { money, type Order } from '../lib/types'
import { useStore } from '../context/Store'

export default function Checkout() {
  const { cart, user, placeOrder } = useStore()
  const nav = useNavigate()
  const [placed, setPlaced] = useState<Order | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    phone: user?.phone ?? '',
    address: '',
    comment: '',
    payment_method: 'cash' as 'card' | 'cash',
  })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  if (placed) {
    return (
      <main className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="empty fade-in">
          <div className="empty__icon" style={{ background: '#3d7eeb', color: '#fff', borderRadius: '50%' }}><CheckIcon size={40} /></div>
          <h3>Order #{placed.id} placed!</h3>
          <p>We sent the details to your Telegram chat and will call you to confirm delivery.</p>
          <button className="btn-primary" style={{ marginTop: 28 }} onClick={() => nav('/orders', { replace: true })}>View my orders</button>
          <button className="btn-outline" style={{ marginTop: 12 }} onClick={() => nav('/home', { replace: true })}>Continue shopping</button>
        </div>
      </main>
    )
  }

  if (cart.count === 0) return <Navigate to="/cart" replace />

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      setPlaced(await placeOrder(form))
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Could not place the order')
    } finally {
      setBusy(false)
    }
  }

  const ready = form.phone.trim() && form.address.trim()

  return (
    <main className="screen">
      <TopBar title="Checkout" />
      <form onSubmit={submit}>
        <p className="label" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><UserIcon size={18} /> Contact</p>
        <input className="field" placeholder="Full name" autoComplete="name" value={form.full_name} onChange={set('full_name')} />
        <input className="field" placeholder="Phone, e.g. +998 90 123 45 67" type="tel" autoComplete="tel" required value={form.phone} onChange={set('phone')} />

        <p className="label" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><PinIcon /> Delivery address</p>
        <input className="field" placeholder="Street, house, city" autoComplete="street-address" required value={form.address} onChange={set('address')} />
        <textarea className="field" placeholder="Comment for the courier (optional)" value={form.comment} onChange={set('comment')} />

        <p className="label" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><CardIcon /> Payment method</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {(['cash', 'card'] as const).map(m => (
            <button type="button" key={m} className={`size ${form.payment_method === m ? 'size--on' : ''}`} style={{ flex: 1, width: 'auto', height: 50 }} onClick={() => setForm(f => ({ ...f, payment_method: m }))}>
              {m === 'card' ? 'Card to courier' : 'Cash on delivery'}
            </button>
          ))}
        </div>

        <div className="summary">
          <div><span>Items ({cart.count})</span><span>{money(cart.subtotal)}</span></div>
          <div><span>Shipping</span><span>{money(cart.shipping_fee)}</span></div>
          <div className="total"><span>Total</span><span>{money(cart.total)}</span></div>
        </div>
        {err && <div className="form-error" role="alert">{err}</div>}
        <button className="btn-primary" type="submit" disabled={!ready || busy}>
          {busy ? 'Placing order…' : `Place order · ${money(cart.total)}`}
        </button>
      </form>
    </main>
  )
}
