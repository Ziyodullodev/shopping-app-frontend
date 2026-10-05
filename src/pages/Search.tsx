import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import TopBar from '../components/TopBar'
import { ErrorState, SkeletonGrid } from '../components/States'
import { CloseIcon, SearchIcon } from '../components/Icons'
import { api } from '../lib/api'
import { useAsync } from '../lib/useAsync'

export default function Search() {
  const [q, setQ] = useState('')
  const [term, setTerm] = useState('')

  useEffect(() => {
    const t = window.setTimeout(() => setTerm(q.trim()), 300)
    return () => window.clearTimeout(t)
  }, [q])

  const { data, error, loading, reload } = useAsync(() => api.products({ search: term }), [term])

  return (
    <main className="screen">
      <TopBar title="Search" />
      <label className="search">
        <SearchIcon size={20} />
        <input autoFocus placeholder="Search shoes or brands" value={q} onChange={e => setQ(e.target.value)} enterKeyHint="search" />
        {q && <button aria-label="Clear" onClick={() => setQ('')}><CloseIcon size={18} /></button>}
      </label>
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <SkeletonGrid count={2} />
      ) : data?.results.length === 0 ? (
        <div className="empty"><h3>Nothing found</h3><p>Try a different name or brand.</p></div>
      ) : (
        <div className="grid" style={{ opacity: loading ? 0.6 : 1 }}>{data?.results.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      )}
    </main>
  )
}
