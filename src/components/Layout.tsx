import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { bindBackButton } from '../lib/telegram'
import BottomNav from './BottomNav'

const TAB_ROOTS = ['/home', '/wishlist', '/cart', '/profile']

export default function Layout() {
  const { pathname } = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    if (TAB_ROOTS.includes(pathname)) return
    return bindBackButton(() => nav(-1))
  }, [pathname, nav])

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}
