import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Shoe from '../components/Shoe'
import { ErrorState, Spinner } from '../components/States'
import { HeartIcon } from '../components/Icons'
import { api } from '../lib/api'
import { haptic } from '../lib/telegram'
import { money } from '../lib/types'
import { useAsync } from '../lib/useAsync'
import { useStore } from '../context/Store'

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const nav = useNavigate()
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const [size, setSize] = useState<number | null>(null)
  const { data: product, error, loading, reload } = useAsync(() => api.product(slug), [slug])

  if (loading) return <main className="screen"><TopBar title="Details" /><Spinner /></main>
  if (error || !product) return <main className="screen"><TopBar title="Details" /><ErrorState message={error ?? 'Not found'} onRetry={reload} /></main>

  const fav = isFavorite(product.slug)
  const anyStock = product.sizes?.some(s => s.in_stock)

  return (
    <main className="screen">
      <TopBar
        title="Details"
        right={
          <button className="icon-btn" aria-label="Wishlist" style={{ color: fav ? '#3d7eeb' : undefined }} onClick={() => toggleFavorite(product)}>
            <HeartIcon filled={fav} />
          </button>
        }
      />
      <div className="detail__hero fade-in">
        <span className="detail__rating">★ {product.rating.toFixed(1)}</span>
        <Shoe product={product} />
      </div>
      <div className="detail__head">
        <div>
          <div className="detail__brand">{product.brand.name}</div>
          <h1 className="detail__name">{product.name}</h1>
        </div>
        <div className="detail__price">{money(product.price)}</div>
      </div>
      <p className="detail__desc">{product.description}</p>

      <p className="label">Select size (EU)</p>
      <div className="sizes">
        {product.sizes?.map(s => (
          <button
            key={s.size}
            disabled={!s.in_stock}
            className={`size ${size === s.size ? 'size--on' : ''}`}
            onClick={() => { haptic.select(); setSize(s.size) }}
          >{s.size}</button>
        ))}
      </div>

      <button
        className="btn-primary"
        disabled={size === null}
        onClick={() => { addToCart(product, size); nav('/cart') }}
      >
        {!anyStock ? 'Sold out' : size === null ? 'Choose a size' : `Add to cart · ${money(product.price)}`}
      </button>
    </main>
  )
}
