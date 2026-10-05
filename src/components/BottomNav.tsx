import { NavLink } from 'react-router-dom'
import { useStore } from '../context/Store'
import { CartIcon, HeartIcon, HomeIcon, UserIcon } from './Icons'

const items = [
  { to: '/home', label: 'Home', icon: <HomeIcon size={24} /> },
  { to: '/wishlist', label: 'Wishlist', icon: <HeartIcon size={24} filled /> },
  { to: '/cart', label: 'Cart', icon: <CartIcon size={24} /> },
  { to: '/profile', label: 'Profile', icon: <UserIcon size={24} /> },
]

export default function BottomNav() {
  const { cart } = useStore()
  const cartCount = cart.count
  return (
    <nav className="bottomnav" aria-label="Main">
      {items.map(it => (
        <NavLink key={it.to} to={it.to} aria-label={it.label}>
          {({ isActive }) => (
            <span className={`bottomnav__item rel ${isActive ? 'bottomnav__item--active' : ''}`}>
              {it.icon}
              {it.to === '/cart' && cartCount > 0 && <span className="bottomnav__count">{cartCount}</span>}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
