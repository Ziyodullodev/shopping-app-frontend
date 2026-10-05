import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { isTelegram } from '../lib/telegram'
import { BackIcon } from './Icons'

/** Inside Telegram the native BackButton is used, so the in-page one is hidden. */
export default function TopBar({ title, right, back = true }: { title: string; right?: ReactNode; back?: boolean }) {
  const nav = useNavigate()
  const showBack = back && !isTelegram
  return (
    <header className="topbar">
      {showBack
        ? <button className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><BackIcon /></button>
        : <span style={{ width: 40 }} />}
      <span className="topbar__title">{title}</span>
      <span style={{ width: 40, display: 'grid', placeItems: 'center' }}>{right}</span>
    </header>
  )
}
