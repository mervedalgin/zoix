import { COLS, WALL_KICK_OFFSETS } from '../utils/constants'

export const PIECES = [
  { shape: [[1, 1, 1, 1]],          color: '#00f5ff', glow: 'rgba(0,245,255,0.5)' },   // I - cyan
  { shape: [[1, 1], [1, 1]],        color: '#ffe600', glow: 'rgba(255,230,0,0.5)' },    // O - yellow
  { shape: [[0, 1, 0], [1, 1, 1]],  color: '#c850ff', glow: 'rgba(200,80,255,0.5)' },   // T - purple
  { shape: [[1, 0], [1, 0], [1, 1]], color: '#ff6020', glow: 'rgba(255,96,32,0.5)' },   // L - orange
  { shape: [[0, 1], [0, 1], [1, 1]], color: '#00b4ff', glow: 'rgba(0,180,255,0.5)' },   // J - blue
  { shape: [[0, 1, 1], [1, 1, 0]],  color: '#00ff88', glow: 'rgba(0,255,136,0.5)' },    // S - green
  { shape: [[1, 1, 0], [0, 1, 1]],  color: '#ff4070', glow: 'rgba(255,64,112,0.5)' },   // Z - red
]

export function randomPiece() {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)]
  return {
    shape: p.shape.map(r => [...r]),
    color: p.color,
    glow: p.glow,
    x: Math.floor((COLS - p.shape[0].length) / 2),
    y: 0,
  }
}

export function rotate(shape) {
  const rows = shape.length
  const cols = shape[0].length
  const rotated = []
  for (let c = 0; c < cols; c++) {
    rotated.push([])
    for (let r = rows - 1; r >= 0; r--) {
      rotated[c].push(shape[r][c])
    }
  }
  return rotated
}

export function tryRotate(current, board) {
  const rotated = rotate(current.shape)
  for (const kick of WALL_KICK_OFFSETS) {
    if (isValid(rotated, current.x + kick, current.y, board)) {
      return { shape: rotated, x: current.x + kick }
    }
  }
  return null
}

export function isValid(shape, px, py, board) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue
      const nx = px + c
      const ny = py + r
      if (nx < 0 || nx >= COLS || ny >= board.length) return false
      if (ny >= 0 && board[ny][nx]) return false
    }
  }
  return true
}

export function getGhostY(current, board) {
  let gy = current.y
  while (isValid(current.shape, current.x, gy + 1, board)) gy++
  return gy
}
