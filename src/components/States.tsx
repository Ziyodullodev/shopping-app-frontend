import type { ReactNode } from 'react'

export function Spinner({ full }: { full?: boolean }) {
  return <div className={full ? 'spinner-wrap spinner-wrap--full' : 'spinner-wrap'}><span className="spinner" aria-label="Loading" /></div>
}

export function ErrorState({ message, onRetry, children }: { message: string; onRetry?: () => void; children?: ReactNode }) {
  return (
    <div className="empty">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {children}
      {onRetry && <button className="btn-outline" style={{ marginTop: 20 }} onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid">
      {Array.from({ length: count }, (_, i) => <div key={i} className="card skeleton" style={{ height: 270 }} />)}
    </div>
  )
}
