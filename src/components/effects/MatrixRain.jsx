import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ZOIX'

export default function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let raf
    let columns = []
    const fontSize = 13
    const speed = 33

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      const colCount = Math.floor(canvas.width / fontSize)
      columns = Array.from({ length: colCount }, () =>
        Math.random() * canvas.height / fontSize | 0
      )
    }

    resize()

    let lastTime = 0
    function draw(time) {
      if (time - lastTime < speed) {
        raf = requestAnimationFrame(draw)
        return
      }
      lastTime = time

      ctx.fillStyle = 'rgba(8, 8, 16, 0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.random() * CHARS.length | 0]
        const x = i * fontSize
        const y = columns[i] * fontSize

        // Head character — bright green/cyan
        const brightness = 0.4 + Math.random() * 0.35
        const hue = 130 + Math.random() * 30
        ctx.font = `${fontSize}px monospace`
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${brightness})`
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.5)`
        ctx.shadowBlur = 6
        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        columns[i]++

        if (y > canvas.height && Math.random() > 0.975) {
          columns[i] = 0
        }
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: 0.6,
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }}
    />
  )
}
