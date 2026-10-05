import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider, useStore } from './context/Store'
import Layout from './components/Layout'
import Toast from './components/Toast'
import Logo from './components/Logo'
import { ErrorState, Spinner } from './components/States'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Orders from './pages/Orders'

const BOT_URL = import.meta.env.VITE_BOT_URL as string | undefined

function Gate() {
  const { status, error, retry, onboarded } = useStore()

  if (status === 'loading') return <Spinner full />
  if (status === 'error') return <main className="screen" style={{ display: 'grid', placeItems: 'center' }}><ErrorState message={error ?? ''} onRetry={retry} /></main>
  if (status === 'outside') {
    return (
      <main className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="empty">
          <Logo />
          <h3 style={{ marginTop: 24 }}>Open in Telegram</h3>
          <p>This shop works as a Telegram Mini App. Open it from our bot to continue.</p>
          {BOT_URL && <a className="btn-primary" style={{ display: 'grid', placeItems: 'center', marginTop: 24 }} href={BOT_URL}>Open the bot</a>}
        </div>
      </main>
    )
  }

  return (
    <Routes>
      <Route path="/" element={onboarded ? <Navigate to="/home" replace /> : <Onboarding />} />
      <Route path="/welcome" element={<Onboarding />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="phone">
          <Gate />
          <Toast />
        </div>
      </BrowserRouter>
    </StoreProvider>
  )
}
