import { Link, useNavigate } from 'react-router-dom'
import Shoe from '../components/Shoe'
import TopBar from '../components/TopBar'
import { CartIcon, TrashIcon } from '../components/Icons'
import { money } from '../lib/types'
import { useStore } from '../context/Store'

export default function Cart() {
  const { cart, changeQty, clearCart } = useStore()
  const nav = useNavigate()

  return (
    <main className="screen">
      <TopBar
        title="My Cart"
        back={false}
        right={cart.items.length > 0 && <button className="icon-btn" aria-label="Clear cart" onClick={clearCart}><TrashIcon /></button>}
      />

      {cart.items.length === 0 ? (
        <div className="empty">
          <div className="empty__icon"><CartIcon size={36} /></div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven’t added anything yet.</p>
          <Link to="/home" className="btn-outline" style={{ display: 'grid', placeItems: 'center', marginTop: 24 }}>Start shopping</Link>
        </div>
      ) : (
        <>
          {cart.items.map(line => (
            <div className="row fade-in" key={`${line.product.slug}-${line.size}`}>
              <Link to={`/product/${line.product.slug}`} className="row__img"><Shoe product={line.product} /></Link>
              <div className="row__body">
                <div className="row__name">{line.product.name}</div>
                <div className="row__meta">{line.product.brand.name} · Size {line.size}</div>
                <div className="row__price">{money(line.line_total)}</div>
              </div>
              <div className="qty">
                <button aria-label="Decrease" onClick={() => changeQty(line.product, line.size, -1)}>−</button>
                <span>{line.quantity}</span>
                <button aria-label="Increase" onClick={() => changeQty(line.product, line.size, 1)}>+</button>
              </div>
            </div>
          ))}

          <div className="summary">
            <div><span>Items ({cart.count})</span><span>{money(cart.subtotal)}</span></div>
            <div><span>Shipping</span><span>{money(cart.shipping_fee)}</span></div>
            <div className="total"><span>Total</span><span>{money(cart.total)}</span></div>
          </div>
          <button className="btn-primary" onClick={() => nav('/checkout')}>Checkout</button>
        </>
      )}
    </main>
  )
}
