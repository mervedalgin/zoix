import { useState, useEffect, useRef } from 'react'
import useGameStore from '../../stores/gameStore'

function PixelBurst() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const colors = ['#00ffc8', '#c850ff', '#ff6090', '#ffe600', '#00b4ff', '#ff6020', '#00ff88']

    for (let i = 0; i < 24; i++) {
      const el = document.createElement('div')
      el.className = 'px-particle'
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const dist = 40 + Math.random() * 50
      const tx = Math.cos(angle) * dist
      const ty = Math.sin(angle) * dist
      const size = 4 + Math.floor(Math.random() * 6)
      const color = colors[Math.floor(Math.random() * colors.length)]
      const dur = 2 + Math.random() * 2
      const delay = Math.random() * 2
      el.style.cssText = `--tx:${tx}px;--ty:${ty}px;--size:${size}px;--color:${color};--glow:${size + 4}px;--dur:${dur}s;--delay:${delay}s;`
      container.appendChild(el)
    }

    return () => { container.innerHTML = '' }
  }, [])

  return <div className="pixel-burst" ref={containerRef} />
}

function Typewriter({ text }) {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 70)
    return () => clearInterval(interval)
  }, [text])

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 530)
    return () => clearInterval(blink)
  }, [])

  return (
    <p className="typewriter-text">
      {displayed}
      <span className={`tw-cursor${showCursor ? '' : ' hidden'}`}>▌</span>
    </p>
  )
}

export default function StartScreen() {
  const gameState = useGameStore(s => s.gameState)
  const startGame = useGameStore(s => s.startGame)

  if (gameState !== 'idle') return null

  return (
    <div className="overlay">
      <div className="start-title-wrap">
        <PixelBurst />
        <h2 className="start-title">ZOIX</h2>
      </div>
      <Typewriter text="Tetris Evreninin Kapılarını Arala" />
      <button className="btn" onClick={startGame}>BAŞLA</button>
    </div>
  )
}
