import type { Product } from '../lib/types'

/** Product photo when the admin uploaded one, otherwise a stylised sneaker drawn from `look` colours. */
export default function Shoe({ product }: { product: Pick<Product, 'image' | 'look' | 'name'> }) {
  if (product.image) return <img src={product.image} alt={product.name} loading="lazy" />
  const { upper, sole, accent, lace } = product.look
  return (
    <svg viewBox="0 0 200 120" role="img" aria-label={product.name}>
      <ellipse cx="102" cy="108" rx="88" ry="6" fill="rgba(0,0,0,.08)" />
      <path d="M14 86 L188 86 C195 86 196 96 189 99 L24 102 C13 102 9 92 14 86 Z" fill={sole} />
      <path d="M16 92 L190 92" stroke="rgba(0,0,0,.08)" strokeWidth="2" />
      <path d="M20 86 C18 64 26 52 44 50 L78 40 C88 28 102 24 114 29 L134 46 C154 54 174 58 186 72 C191 78 189 86 182 86 Z" fill={upper} />
      <path d="M20 86 C18 66 24 56 38 52 L44 86 Z" fill={accent} />
      <path d="M150 56 C166 60 180 64 186 72 C191 78 189 86 182 86 L150 86 C146 74 146 64 150 56 Z" fill="rgba(255,255,255,.18)" />
      <path d="M60 60 C80 66 110 66 140 58" stroke="rgba(0,0,0,.12)" strokeWidth="2" fill="none" />
      {[0, 1, 2, 3].map(i => (
        <path key={i} d={`M${86 + i * 10} ${38 + i * 3} L${96 + i * 10} ${48 + i * 2}`} stroke={lace} strokeWidth="4" strokeLinecap="round" />
      ))}
      <circle cx="110" cy="70" r="4" fill={accent} opacity=".7" />
    </svg>
  )
}
