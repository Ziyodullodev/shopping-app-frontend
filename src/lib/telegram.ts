/* Thin wrapper around window.Telegram.WebApp so the app also runs in a normal browser. */

type HapticImpact = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
type HapticNotice = 'error' | 'success' | 'warning'

interface TgUser { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string; language_code?: string }

interface TgWebApp {
  initData: string
  initDataUnsafe: { user?: TgUser; start_param?: string }
  platform: string
  version: string
  colorScheme: 'light' | 'dark'
  ready(): void
  expand(): void
  close(): void
  isVersionAtLeast(v: string): boolean
  setHeaderColor(color: string): void
  setBackgroundColor(color: string): void
  setBottomBarColor?(color: string): void
  disableVerticalSwipes?(): void
  enableClosingConfirmation?(): void
  openTelegramLink(url: string): void
  showAlert(message: string, cb?: () => void): void
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void }
  HapticFeedback: { impactOccurred(s: HapticImpact): void; notificationOccurred(t: HapticNotice): void; selectionChanged(): void }
}

declare global {
  interface Window { Telegram?: { WebApp: TgWebApp } }
}

export const tg: TgWebApp | undefined = window.Telegram?.WebApp
/** True only when the page was opened from Telegram (initData is signed by Telegram). */
export const isTelegram = Boolean(tg?.initData)

export function initTelegram() {
  if (!tg || !isTelegram) return
  tg.ready()
  tg.expand()
  const at = (v: string) => tg.isVersionAtLeast(v)
  if (at('6.1')) {
    tg.setHeaderColor('#ffffff')
    tg.setBackgroundColor('#ffffff')
  }
  if (at('7.10')) tg.setBottomBarColor?.('#ffffff')
  if (at('7.7')) tg.disableVerticalSwipes?.()
  document.documentElement.classList.add('in-telegram')
}

export const initData = () => tg?.initData ?? ''
export const telegramUser = () => tg?.initDataUnsafe.user

export const haptic = {
  tap: () => { if (isTelegram && tg!.isVersionAtLeast('6.1')) tg!.HapticFeedback.impactOccurred('light') },
  select: () => { if (isTelegram && tg!.isVersionAtLeast('6.1')) tg!.HapticFeedback.selectionChanged() },
  success: () => { if (isTelegram && tg!.isVersionAtLeast('6.1')) tg!.HapticFeedback.notificationOccurred('success') },
  error: () => { if (isTelegram && tg!.isVersionAtLeast('6.1')) tg!.HapticFeedback.notificationOccurred('error') },
}

/** Shows Telegram's native back button and returns a cleanup function. */
export function bindBackButton(onBack: () => void) {
  if (!isTelegram || !tg!.isVersionAtLeast('6.1')) return () => {}
  tg!.BackButton.onClick(onBack)
  tg!.BackButton.show()
  return () => {
    tg!.BackButton.offClick(onBack)
    tg!.BackButton.hide()
  }
}
