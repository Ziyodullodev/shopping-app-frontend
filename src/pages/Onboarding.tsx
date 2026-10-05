import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/Store'
import Illustration from '../components/Illustration'
import { ArrowRight } from '../components/Icons'

const SLIDES = [
  { title: 'Find your wish', text: 'Browse hundreds of sneakers from the brands you love, all in one place.' },
  { title: 'Fast delivery', text: 'Order in a few taps and get your new pair delivered right to your door.' },
  { title: 'Easy returns', text: 'Not the right fit? Return or exchange your shoes within 30 days.' },
]

export default function Onboarding() {
  const [i, setI] = useState(0)
  const nav = useNavigate()
  const { finishOnboarding } = useStore()
  const done = () => { finishOnboarding(); nav('/home', { replace: true }) }
  const next = () => (i < SLIDES.length - 1 ? setI(i + 1) : done())

  return (
    <main className="onboard">
      <div className="onboard__art">
        <svg className="onboard__blob" viewBox="0 0 400 520" preserveAspectRatio="none" aria-hidden="true">
          <path d="M120 0h280v520H320c-40-80 10-150-40-210-50-60-140-40-150-140C120 100 180 60 120 0z" fill="#eef4fd" />
          <path d="M300 160c60-10 100 40 100 40v220c-40 10-90-10-100-60-12-60-50-80-40-130 6-40 20-66 40-70z" fill="#dce9fb" />
        </svg>
        <Illustration key={i} variant={i} />
      </div>
      <div className="dots" aria-hidden="true">
        {SLIDES.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}
      </div>
      <section key={i} className="fade-in">
        <h1>{SLIDES[i].title}</h1>
        <p>{SLIDES[i].text}</p>
      </section>
      <div className="onboard__foot">
        <button className="link-muted" onClick={done}>Skip</button>
        <button className="fab" aria-label="Next" onClick={next}><ArrowRight /></button>
      </div>
    </main>
  )
}
