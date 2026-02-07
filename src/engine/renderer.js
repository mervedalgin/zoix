import { COLS, ROWS } from '../utils/constants'
import { getGhostY } from './pieces'

export function drawBlock(ctx, x, y, color, glow, bw, bh, ghost = false) {
  const px = x * bw
  const py = y * bh

  if (ghost) {
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.2
    ctx.strokeRect(px + 1, py + 1, bw - 2, bh - 2)
    ctx.globalAlpha = 1
    return
  }

  // Glow
  ctx.shadowColor = glow
  ctx.shadowBlur = 8
  ctx.fillStyle = color
  ctx.fillRect(px + 1, py + 1, bw - 2, bh - 2)
  ctx.shadowBlur = 0

  // Inner highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillRect(px + 2, py + 2, bw - 4, (bh - 4) * 0.35)

  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 0.5
  ctx.strokeRect(px + 1, py + 1, bw - 2, bh - 2)
}

export function drawBoard(ctx, state, blockWidth, blockHeight) {
  const { board, current, shielded, powerUpNotification } = state
  const canvasWidth = COLS * blockWidth
  const canvasHeight = ROWS * blockHeight

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // Subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 0.5
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath()
    ctx.moveTo(0, r * blockHeight)
    ctx.lineTo(canvasWidth, r * blockHeight)
    ctx.stroke()
  }
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath()
    ctx.moveTo(c * blockWidth, 0)
    ctx.lineTo(c * blockWidth, canvasHeight)
    ctx.stroke()
  }

  if (!board) return

  // Board cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        drawBlock(ctx, c, r, board[r][c].color, board[r][c].glow, blockWidth, blockHeight)
      }
    }
  }

  if (!current) return

  // Ghost piece
  const gy = getGhostY(current, board)
  for (let r = 0; r < current.shape.length; r++) {
    for (let c = 0; c < current.shape[r].length; c++) {
      if (current.shape[r][c]) {
        drawBlock(ctx, current.x + c, gy + r, current.color, current.glow, blockWidth, blockHeight, true)
      }
    }
  }

  // Current piece
  for (let r = 0; r < current.shape.length; r++) {
    for (let c = 0; c < current.shape[r].length; c++) {
      if (current.shape[r][c]) {
        drawBlock(ctx, current.x + c, current.y + r, current.color, current.glow, blockWidth, blockHeight)
      }
    }
  }

  // Shield glow border
  if (shielded) {
    ctx.save()
    ctx.strokeStyle = '#00b4ff'
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(0,180,255,0.6)'
    ctx.shadowBlur = 12
    ctx.strokeRect(1, 1, canvasWidth - 2, canvasHeight - 2)
    ctx.shadowBlur = 0
    ctx.restore()
  }

  // Power-up notification
  if (powerUpNotification) {
    drawPowerUpNotification(ctx, powerUpNotification, canvasWidth, canvasHeight)
  }
}

function drawPowerUpNotification(ctx, notification, canvasWidth, canvasHeight) {
  const elapsed = performance.now() - notification.startTime
  const duration = 1500
  if (elapsed > duration) return

  const progress = elapsed / duration
  const cx = canvasWidth / 2
  const cy = canvasHeight / 2

  ctx.save()

  // Background flash
  if (progress < 0.2) {
    const flashAlpha = (1 - progress / 0.2) * 0.3
    ctx.fillStyle = notification.color
    ctx.globalAlpha = flashAlpha
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  // Main content alpha
  let alpha
  if (progress < 0.15) alpha = progress / 0.15
  else if (progress > 0.7) alpha = (1 - progress) / 0.3
  else alpha = 1

  // Scale animation
  let scale
  if (progress < 0.15) scale = 0.5 + (progress / 0.15) * 0.5
  else if (progress < 0.25) scale = 1 + Math.sin((progress - 0.15) / 0.1 * Math.PI) * 0.15
  else scale = 1

  ctx.globalAlpha = alpha

  // Emoji
  ctx.save()
  ctx.translate(cx, cy - 20 * scale)
  ctx.scale(scale, scale)
  ctx.font = '40px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(notification.emoji, 0, 0)
  ctx.restore()

  // Power name text
  ctx.save()
  ctx.translate(cx, cy + 25 * scale)
  ctx.scale(scale, scale)
  ctx.font = "bold 16px 'Orbitron', sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = notification.glow
  ctx.shadowBlur = 15
  ctx.fillStyle = notification.color
  ctx.fillText(notification.name, 0, 0)
  ctx.shadowBlur = 0
  ctx.restore()

  // Particles (computed from elapsed time — no state mutation)
  if (notification.particles) {
    const frames = elapsed / 16.67
    notification.particles.forEach(p => {
      const px = p.vx * frames
      const py = p.vy * frames
      const life = Math.max(0, 1 - frames / (duration / 16.67))
      if (life <= 0) return

      ctx.globalAlpha = alpha * life
      ctx.fillStyle = notification.color
      ctx.shadowColor = notification.glow
      ctx.shadowBlur = p.size
      ctx.fillRect(cx + px - p.size / 2, cy + py - p.size / 2, p.size, p.size)
      ctx.shadowBlur = 0
    })
  }

  ctx.restore()
}

export function drawNextPiece(ctx, next, canvasSize) {
  ctx.clearRect(0, 0, canvasSize, canvasSize)
  if (!next) return

  const s = 24
  const ox = Math.floor((canvasSize - next.shape[0].length * s) / 2)
  const oy = Math.floor((canvasSize - next.shape.length * s) / 2)

  for (let r = 0; r < next.shape.length; r++) {
    for (let c = 0; c < next.shape[r].length; c++) {
      if (next.shape[r][c]) {
        const px = ox + c * s
        const py = oy + r * s
        ctx.shadowColor = next.glow
        ctx.shadowBlur = 6
        ctx.fillStyle = next.color
        ctx.fillRect(px + 1, py + 1, s - 2, s - 2)
        ctx.shadowBlur = 0
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        ctx.fillRect(px + 2, py + 2, s - 4, (s - 4) * 0.35)
      }
    }
  }
}
