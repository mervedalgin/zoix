import { useEffect, useRef } from 'react'
import useGameStore from '../../stores/gameStore'
import { LEVEL_THEMES } from '../../utils/themes'
import { isMobile } from '../../utils/helpers'

class Particle {
  constructor(theme, width, height) {
    this.reset(theme, width, height)
  }

  reset(theme, width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.size = Math.random() * 3 + 1
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = Math.random() * 0.5 + 0.2
    this.opacity = Math.random() * 0.5 + 0.2
    this.color = theme.primary
    this.twinkle = Math.random() * Math.PI * 2
    this.twinkleSpeed = Math.random() * 0.05 + 0.02
  }

  update(theme, width, height, rainbowHue) {
    this.x += this.speedX
    this.y += this.speedY
    this.twinkle += this.twinkleSpeed

    if (this.y > height) { this.y = 0; this.x = Math.random() * width }
    if (this.x < 0) this.x = width
    if (this.x > width) this.x = 0

    if (theme.rainbow) {
      const hue = (rainbowHue + this.x * 0.1) % 360
      this.color = `hsl(${hue}, 100%, 60%)`
    } else {
      this.color = Math.random() > 0.5 ? theme.primary : theme.secondary
    }
  }

  draw(ctx) {
    const flicker = Math.sin(this.twinkle) * 0.3 + 0.7
    ctx.save()
    ctx.globalAlpha = this.opacity * flicker
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = this.size * 2

    ctx.beginPath()
    const spikes = 4
    const outerRadius = this.size
    const innerRadius = this.size * 0.4
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / spikes - Math.PI / 2
      const x = this.x + Math.cos(angle) * radius
      const y = this.y + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rainbowHueRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let rafId
    const loop = () => {
      const { level, gameState } = useGameStore.getState()
      const themeIndex = Math.min(level - 1, LEVEL_THEMES.length - 1)
      const theme = LEVEL_THEMES[themeIndex]

      // Particles start at level 2, grow to 60 at level 10
      let targetCount = 0
      if (gameState !== 'idle' && level >= 2) {
        targetCount = Math.min(60, 5 + (level - 2) * 7)
        if (isMobile()) targetCount = Math.floor(targetCount / 2)
      }

      const particles = particlesRef.current
      while (particles.length < targetCount) {
        particles.push(new Particle(theme, canvas.width, canvas.height))
      }
      while (particles.length > targetCount) {
        particles.pop()
      }

      if (theme.rainbow) {
        rainbowHueRef.current = (rainbowHueRef.current + 1) % 360
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update(theme, canvas.width, canvas.height, rainbowHueRef.current)
        p.draw(ctx)
      })

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
