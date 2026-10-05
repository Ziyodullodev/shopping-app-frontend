import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import ProductCard from '../components/ProductCard'
import { ErrorState, SkeletonGrid } from '../components/States'
import { ChevronDown, MenuIcon, SearchIcon } from '../components/Icons'
import { api } from '../lib/api'
import { haptic } from '../lib/telegram'
import { useAsync } from '../lib/useAsync'

const SORTS = [
  { key: '', label: 'Popular' },
  { key: 'price', label: 'Price: low to high' },
  { key: '-price', label: 'Price: high to low' },
  { key: '-rating', label: 'Top rated' },
] as const

const brandStyle: Record<string, React.CSSProperties> = {
  bata: { fontStyle: 'italic', fontFamily: 'Georgia, serif', fontWeight: 800 },
  nike: { fontStyle: 'italic', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'uppercase' },
  adidas: { fontWeight: 600, fontSize: 13, letterSpacing: '0.5px', textTransform: 'lowercase' },
  wilson: { fontFamily: 'Georgia, serif', fontWeight: 700, fontStyle: 'italic' },
  dsi: { fontWeight: 800, fontStyle: 'italic' },
}

export default function Home() {
  const [brand, setBrand] = useState('')
  const [sort, setSort] = useState('')
  const [sortOpen, setSortOpen] = useState(false)

  const brands = useAsync(() => api.brands(), [])
  const products = useAsync(() => api.products({ brand, ordering: sort }), [brand, sort])

  const chips = [{ slug: '', name: 'All' }, ...(brands.data ?? [])]

  return (
    <main className="screen">
      <header className="topbar">
        <Link to="/profile" className="icon-btn" aria-label="Menu"><MenuIcon size={28} /></Link>
        <Logo />
        <Link to="/search" className="icon-btn" aria-label="Search"><SearchIcon size={26} /></Link>
      </header>

      <div className="section-head">
        <h2>Popular Products</h2>
        <div className="rel">
          <button className="sort" onClick={() => setSortOpen(o => !o)} aria-expanded={sortOpen}>
            Sort by <ChevronDown />
          </button>
          {sortOpen && (
            <ul style={{ position: 'absolute', right: 0, top: 28, zIndex: 5, listStyle: 'none', margin: 0, padding: 6, background: '#fff', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,.12)', minWidth: 170 }}>
              {SORTS.map(s => (
                <li key={s.key}>
                  <button
                    onClick={() => { haptic.select(); setSort(s.key); setSortOpen(false) }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: sort === s.key ? 600 : 400, color: sort === s.key ? '#3d7eeb' : undefined, background: sort === s.key ? '#eef4fd' : undefined }}
                  >{s.label}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="chips" role="tablist">
        {chips.map(b => (
          <button
            key={b.slug || 'all'}
            role="tab"
            aria-selected={brand === b.slug}
            className={`chip ${brand === b.slug ? 'chip--active' : ''}`}
            style={brandStyle[b.slug]}
            onClick={() => { haptic.select(); setBrand(b.slug) }}
          >
            {b.name}
          </button>
        ))}
      </div>

      {products.error ? (
        <ErrorState message={products.error} onRetry={products.reload} />
      ) : products.loading && !products.data ? (
        <SkeletonGrid />
      ) : products.data?.results.length === 0 ? (
        <div className="empty"><h3>No products yet</h3><p>Check back soon.</p></div>
      ) : (
        <div className="grid" style={{ opacity: products.loading ? 0.6 : 1, transition: 'opacity .15s' }}>
          {products.data?.results.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </main>
  )
}
