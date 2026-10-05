/** Flat illustration in the style of the Figma onboarding art. Variant changes the scene slightly. */
export default function Illustration({ variant = 0 }: { variant?: number }) {
  const blue = '#3d7eeb'
  const dark = '#2b2f3a'
  const skin = '#f5c9b0'
  return (
    <svg className="illu" viewBox="0 0 320 260" aria-hidden="true">
      {/* boxes */}
      <rect x="40" y="160" width="110" height="80" fill="#efe6e3" stroke={blue} strokeWidth="3" />
      <rect x="40" y="160" width="110" height="10" fill={blue} />
      <path d="M52 220h18M52 226h18M52 232h18" stroke="#fff" strokeWidth="2" />
      <rect x="80" y="122" width="60" height="38" fill="#efe6e3" stroke={blue} strokeWidth="3" />
      <rect x="135" y="122" width="10" height="118" fill={blue} />
      {/* ground line */}
      <path d="M20 240h290" stroke={blue} strokeWidth="2" />
      {/* map pin left */}
      <g transform="translate(26 116)">
        <path d="M18 0a18 18 0 0 1 18 18c0 14-18 34-18 34S0 32 0 18A18 18 0 0 1 18 0z" fill="#b9bcc4" />
        <circle cx="18" cy="18" r="7" fill="#fff" />
      </g>
      {/* sitting woman */}
      <g>
        <circle cx="110" cy="62" r="11" fill={skin} />
        <path d="M100 58c0-12 22-14 22 0-6-4-14-4-22 0z" fill={dark} />
        <path d="M98 74h24l4 40H96z" fill={blue} />
        <path d="M96 112h40l26 4-2 10-34-4H96z" fill={dark} />
        <path d="M152 116l6 30h8" stroke={dark} strokeWidth="8" strokeLinecap="round" />
        <rect x="112" y="82" width="34" height="18" rx="3" fill={blue} stroke="#fff" strokeWidth="2" />
        <circle cx="129" cy="91" r="3" fill="#fff" />
        <path d="M122 74a8 8 0 1 1 14 0l-7 10z" fill="#b9bcc4" />
      </g>
      {/* standing man */}
      <g transform={variant === 1 ? 'translate(-6 0)' : variant === 2 ? 'translate(6 0)' : undefined}>
        <circle cx="250" cy="70" r="12" fill={skin} />
        <path d="M238 66c2-12 22-12 24 0-8-3-16-3-24 0z" fill={dark} />
        <path d="M234 84h34l6 56h-46z" fill={blue} />
        <path d="M232 140h40l-6 96h-10l-4-70-6 70h-10z" fill={dark} />
        <rect x="226" y="108" width="36" height="22" rx="3" fill={blue} stroke="#fff" strokeWidth="2" />
        <path d="M228 116h32" stroke="#fff" strokeWidth="2" />
        <g transform="translate(196 48)">
          <path d="M18 0a18 18 0 0 1 18 18c0 14-18 34-18 34S0 32 0 18A18 18 0 0 1 18 0z" fill={blue} />
          <circle cx="18" cy="18" r="7" fill="#fff" />
        </g>
      </g>
      <ellipse cx="292" cy="232" rx="8" ry="12" fill="#efe6e3" transform="rotate(30 292 232)" />
    </svg>
  )
}
