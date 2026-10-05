import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { ErrorState, Spinner } from '../components/States'
import { BoxIcon } from '../components/Icons'
import { api } from '../lib/api'
import { money } from '../lib/types'
import { useAsync } from '../lib/useAsync'
import { useStore } from '../context/Store'

export default function Orders() {
  const { notify } = useStore()
  const { data, error, loading, reload, setData } = useAsync(() => api.orders(), [])

  const cancel = async (id: number) => {
    try {
      const updated = await api.cancelOrder(id)
      setData(list => list?.map(o => (o.id === id ? updated : o)) ?? null)
      notify(`Order #${id} cancelled`)
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not cancel')
    }
  }

  return (
    <main className="screen">
      <TopBar title="My orders" />
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <Spinner />
      ) : !data?.length ? (
        <div className="empty">
          <div className="empty__icon"><BoxIcon size={36} /></div>
          <h3>No orders yet</h3>
          <p>Your orders will show up here.</p>
          <Link to="/home" className="btn-outline" style={{ display: 'grid', placeItems: 'center', marginTop: 24 }}>Start shopping</Link>
        </div>
      ) : (
        data.map(o => (
          <article className="order fade-in" key={o.id}>
            <div className="order__head">
              <div>
                <div className="order__id">Order #{o.id}</div>
                <div className="order__date">{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <span className={`status status--${o.status}`}>{o.status_display}</span>
            </div>
            <div className="order__items">
              {o.items.map(i => <div key={i.id}>{i.product_name} · EU {i.size} × {i.quantity}</div>)}
            </div>
            <div className="order__foot">
              <strong>{money(o.total)}</strong>
              {o.status === 'new' && <button className="btn-add" onClick={() => cancel(o.id)}>Cancel</button>}
            </div>
          </article>
        ))
      )}
    </main>
  )
}
