import { Link } from 'react-router-dom'
import { money, type Product } from '../lib/types'
import { useStore } from '../context/Store'
import { HeartIcon } from './Icons'
import Shoe from './Shoe'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, changeQty, toggleFavorite, isFavorite, linesFor } = useStore()
  const fav = isFavorite(product.slug)
  const lines = linesFor(product.slug)
  const qty = lines.reduce((n, l) => n + l.quantity, 0)
  const last = lines[lines.length - 1]
  const soldOut = product.default_size == null

  return (
    <article className="card fade-in">
      <span className="card__badge">{product.rating.toFixed(1)}</span>
      <button
        className="card__fav"
        aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{ color: fav ? '#3d7eeb' : '#1a1a1a' }}
        onClick={() => toggleFavorite(product)}
      >
        <HeartIcon size={22} filled={fav} />
      </button>
      <Link to={`/product/${product.slug}`}>
        <div className="card__img"><Shoe product={product} /></div>
        <div className="card__name">{product.name}</div>
        <div className="card__desc">{product.short_description}</div>
      </Link>
      <div className="card__foot">
        <span className="card__price">{money(product.price)}</span>
        {qty === 0 ? (
          <button className="btn-add" disabled={soldOut} onClick={() => addToCart(product)}>
            {soldOut ? 'Sold out' : 'Add'}
          </button>
        ) : (
          <div className="stepper fade-in" aria-label={`${qty} in cart`}>
            <button aria-label="Remove one" onClick={() => changeQty(product, last.size, -1)}>−</button>
            <span>{qty}</span>
            <button aria-label="Add one" onClick={() => changeQty(product, last.size, 1)}>+</button>
          </div>
        )}
      </div>
    </article>
  )
}
