type P = { size?: number; filled?: boolean; className?: string }
const base = (size = 24) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const })

export const MenuIcon = ({ size }: P) => (
  <svg {...base(size)} strokeWidth={2.4}><path d="M3 6h18M3 12h12M3 18h18" /></svg>
)
export const SearchIcon = ({ size }: P) => (
  <svg {...base(size)} strokeWidth={2.6}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.5-4.5" /></svg>
)
export const HeartIcon = ({ size, filled }: P) => (
  <svg {...base(size)} fill={filled ? 'currentColor' : 'none'}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" /></svg>
)
export const HomeIcon = ({ size }: P) => (
  <svg {...base(size)} fill="currentColor" stroke="none"><path d="M12 3.2 2.5 11h2.7v9h5.3v-6h3v6h5.3v-9h2.7z" /></svg>
)
export const CartIcon = ({ size }: P) => (
  <svg {...base(size)}><path d="M2 3h3l2.7 11.2a1.5 1.5 0 0 0 1.5 1.1h8.6a1.5 1.5 0 0 0 1.4-1L22 7H6" /><circle cx="9.5" cy="20" r="1.5" /><circle cx="17.5" cy="20" r="1.5" /><path d="M1 8h3M2 11h3" /></svg>
)
export const UserIcon = ({ size }: P) => (
  <svg {...base(size)} fill="currentColor" stroke="none"><circle cx="12" cy="7.5" r="4.5" /><path d="M3 21c0-4.4 4-7 9-7s9 2.6 9 7z" /></svg>
)
export const ChevronDown = ({ size = 18 }: P) => (
  <svg {...base(size)}><path d="m6 9 6 6 6-6" /></svg>
)
export const ChevronRight = ({ size = 18 }: P) => (
  <svg {...base(size)}><path d="m9 6 6 6-6 6" /></svg>
)
export const BackIcon = ({ size }: P) => (
  <svg {...base(size)} strokeWidth={2.4}><path d="M15 5 8 12l7 7" /></svg>
)
export const ArrowRight = ({ size }: P) => (
  <svg {...base(size)} strokeWidth={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const TrashIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
)
export const BoxIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>
)
export const PinIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
)
export const CardIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
)
export const BellIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>
)
export const LogoutIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
)
export const CloseIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const CheckIcon = ({ size = 20 }: P) => (
  <svg {...base(size)} strokeWidth={3}><path d="M20 6 9 17l-5-5" /></svg>
)
