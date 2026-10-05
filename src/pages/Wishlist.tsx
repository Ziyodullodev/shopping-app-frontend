import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import TopBar from '../components/TopBar'
import { ErrorState, SkeletonGrid } from '../components/States'
import { HeartIcon } from '../components/Icons'
import { api } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { useStore } from '../context/Store'

export default function Wishlist() {
  const { favorites } = useStore()
  const { data, error, loading, reload } = useAsync(() => api.favorites(), [])
  // Hide items un-hearted on this screen without refetching.
  const list = (data ?? []).filter(p => favorites.has(p.slug))

  return (
    <main className="screen">
      <TopBar title="Wishlist" back={false} />
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <SkeletonGrid count={2} />
      ) : list.length === 0 ? (
        <div className="empty">
          <div className="empty__icon"><HeartIcon size={36} /></div>
          <h3>No favourites yet</h3>
          <p>Tap the heart on any product to save it here.</p>
          <Link to="/home" className="btn-outline" style={{ display: 'grid', placeItems: 'center', marginTop: 24 }}>Explore products</Link>
        </div>
      ) : (
        <div className="grid">{list.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      )}
    </main>
  )
}
