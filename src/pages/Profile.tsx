import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { BoxIcon, ChevronRight, HeartIcon, LogoutIcon } from '../components/Icons'
import { isTelegram, tg } from '../lib/telegram'
import { useStore } from '../context/Store'

export default function Profile() {
  const nav = useNavigate()
  const { user } = useStore()
  const name = user?.display_name ?? 'Guest'
  const items = [
    { icon: <BoxIcon />, label: 'My orders', onClick: () => nav('/orders') },
    { icon: <HeartIcon size={20} />, label: 'Wishlist', onClick: () => nav('/wishlist') },
  ]

  return (
    <main className="screen">
      <TopBar title="Profile" back={false} />
      <div className="profile__head">
        <div className="avatar">
          {user?.photo_url ? <img src={user.photo_url} alt="" /> : name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="profile__name">{name}</div>
          <div className="profile__mail">{user?.username && !user.username.startsWith('tg_') ? `@${user.username}` : 'Telegram account'}</div>
        </div>
      </div>
      <div className="menu">
        {items.map(it => (
          <button key={it.label} className="menu__item" onClick={it.onClick}>
            {it.icon}<span>{it.label}</span><ChevronRight />
          </button>
        ))}
        <button className="menu__item" onClick={() => { try { localStorage.removeItem('shoer.onboarded') } catch { /* ignore */ } nav('/welcome') }}>
          <LogoutIcon /><span>Replay onboarding</span><ChevronRight />
        </button>
        {isTelegram && (
          <button className="menu__item" onClick={() => tg!.close()}>
            <LogoutIcon /><span>Close app</span><ChevronRight />
          </button>
        )}
      </div>
    </main>
  )
}
