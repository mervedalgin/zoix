import { useState, useEffect, useRef } from 'react'
import { getPlayCount } from '../../services/playCounterService'

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)
  const prevValue = useRef(0)

  useEffect(() => {
    if (value === 0) return

    const start = prevValue.current
    const diff = value - start
    if (diff === 0) return

    const duration = Math.min(2000, Math.max(600, Math.abs(diff) * 15))
    const startTime = performance.now()

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Elastic ease out
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(start + diff * eased)
      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        prevValue.current = value
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])

  return <span className="play-count-number">{display.toLocaleString('tr-TR')}</span>
}

export default function PlayCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getPlayCount().then(c => setCount(c))

    const interval = setInterval(() => {
      getPlayCount().then(c => setCount(c))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (count === 0) return null

  return (
    <div className="play-counter">
      <div className="play-counter-icon">🎮</div>
      <AnimatedNumber value={count} />
      <span className="play-count-label">kere oynandı</span>
    </div>
  )
}
