import { COLS, ROWS, POWER_UP_INTERVAL } from '../utils/constants'

export const POWER_UPS = [
  { id: 'bomb',    name: 'BOMBA',        emoji: '💣', color: '#ff6020', glow: 'rgba(255,96,32,0.6)' },
  { id: 'shield',  name: 'KALKAN',       emoji: '🛡️', color: '#00b4ff', glow: 'rgba(0,180,255,0.6)' },
  { id: 'cleaner', name: 'SATIR SİLİCİ', emoji: '⚡', color: '#ffe600', glow: 'rgba(255,230,0,0.6)' },
]

export function shouldGrantPowerUp(score, lastPowerUpScore) {
  const threshold = Math.floor(score / POWER_UP_INTERVAL) * POWER_UP_INTERVAL
  return threshold > 0 && threshold > lastPowerUpScore
}

export function getRandomPowerUp() {
  return POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)]
}

export function applyBomb(board) {
  const newBoard = board.map(row => [...row])
  for (let i = 0; i < 3; i++) {
    newBoard.splice(ROWS - 1, 1)
    newBoard.unshift(Array(COLS).fill(0))
  }
  return newBoard
}

export function applyCleaner(board) {
  const newBoard = board.map(row => [...row])
  let bestRow = -1
  let bestCount = 0

  for (let r = 0; r < ROWS; r++) {
    const count = newBoard[r].filter(cell => cell).length
    if (count > bestCount && count < COLS) {
      bestCount = count
      bestRow = r
    }
  }

  if (bestRow >= 0) {
    newBoard.splice(bestRow, 1)
    newBoard.unshift(Array(COLS).fill(0))
  }

  return newBoard
}
