import { COLS, ROWS } from '../utils/constants'

export function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
}

export function lockPiece(board, piece) {
  const newBoard = board.map(row => [...row])
  let topOut = false

  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue
      const y = piece.y + r
      if (y < 0) {
        topOut = true
        continue
      }
      newBoard[y][piece.x + c] = { color: piece.color, glow: piece.glow }
    }
  }

  return { board: newBoard, topOut }
}

export function clearLines(board) {
  let cleared = 0
  const newBoard = board.map(row => [...row])

  for (let r = ROWS - 1; r >= 0; r--) {
    if (newBoard[r].every(cell => cell)) {
      newBoard.splice(r, 1)
      newBoard.unshift(Array(COLS).fill(0))
      cleared++
      r++ // re-check same row
    }
  }

  return { board: newBoard, cleared }
}
