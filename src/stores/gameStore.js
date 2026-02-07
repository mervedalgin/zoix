import { create } from 'zustand'
import { createBoard, lockPiece, clearLines } from '../engine/board'
import { randomPiece, isValid, tryRotate } from '../engine/pieces'
import { calculateLineScore, calculateLevel, getDropSpeed } from '../engine/scoring'
import { shouldGrantPowerUp, getRandomPowerUp, applyBomb, applyCleaner } from '../engine/powerups'
import { COLS, INITIAL_LIVES, POWER_UP_INTERVAL } from '../utils/constants'
import sfx from '../audio/soundManager'
import { incrementPlayCount } from '../services/playCounterService'

function createPowerUpParticles() {
  const particles = []
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2
    const speed = 2 + Math.random() * 3
    particles.push({
      x: 0, y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 4,
      life: 1,
    })
  }
  return particles
}

// Pure helper: compute power-up state updates without calling set()
function computePowerUpUpdates(score, lastPowerUpScore, powerUpsUsed, board) {
  if (!shouldGrantPowerUp(score, lastPowerUpScore)) return null

  const threshold = Math.floor(score / POWER_UP_INTERVAL) * POWER_UP_INTERVAL
  const powerUp = getRandomPowerUp()

  const updates = {
    lastPowerUpScore: threshold,
    powerUpsUsed: powerUpsUsed + 1,
    powerUpNotification: {
      emoji: powerUp.emoji,
      name: powerUp.name,
      color: powerUp.color,
      glow: powerUp.glow,
      startTime: performance.now(),
      particles: createPowerUpParticles(),
    },
  }

  switch (powerUp.id) {
    case 'bomb':
      updates.board = applyBomb(board)
      break
    case 'shield':
      updates.shielded = true
      break
    case 'cleaner':
      updates.board = applyCleaner(board)
      break
  }

  return updates
}

const useGameStore = create((set, get) => ({
  // Board
  board: null,
  current: null,
  next: null,

  // Stats
  score: 0,
  lines: 0,
  level: 1,
  lives: INITIAL_LIVES,

  // State
  gameState: 'idle', // 'idle' | 'playing' | 'paused' | 'gameover'

  // Power-up
  shielded: false,
  lastPowerUpScore: 0,
  powerUpNotification: null,

  // Theme
  currentThemeIndex: 0,

  // Game meta
  gameStartTime: null,
  powerUpsUsed: 0,

  // Timing
  lastDrop: 0,

  // Actions
  startGame: () => {
    set({
      board: createBoard(),
      current: randomPiece(),
      next: randomPiece(),
      score: 0,
      lines: 0,
      level: 1,
      lives: INITIAL_LIVES,
      gameState: 'playing',
      shielded: false,
      lastPowerUpScore: 0,
      powerUpNotification: null,
      currentThemeIndex: 0,
      gameStartTime: Date.now(),
      powerUpsUsed: 0,
      lastDrop: performance.now(),
    })
    sfx.play('gameStart')
    incrementPlayCount()
  },

  pauseGame: () => { set({ gameState: 'paused' }); sfx.play('pause') },

  resumeGame: () => { set({ gameState: 'playing' }); sfx.play('pause') },

  moveLeft: () => {
    const { current, board, gameState } = get()
    if (gameState !== 'playing' || !current || !board) return
    if (isValid(current.shape, current.x - 1, current.y, board)) {
      set({ current: { ...current, x: current.x - 1 } })
      sfx.play('move')
    }
  },

  moveRight: () => {
    const { current, board, gameState } = get()
    if (gameState !== 'playing' || !current || !board) return
    if (isValid(current.shape, current.x + 1, current.y, board)) {
      set({ current: { ...current, x: current.x + 1 } })
      sfx.play('move')
    }
  },

  moveDown: () => {
    const { current, board, score, gameState, lastPowerUpScore, powerUpsUsed } = get()
    if (gameState !== 'playing' || !current || !board) return

    if (isValid(current.shape, current.x, current.y + 1, board)) {
      const newScore = score + 1
      const updates = { current: { ...current, y: current.y + 1 }, score: newScore }
      const puUpdates = computePowerUpUpdates(newScore, lastPowerUpScore, powerUpsUsed, board)
      set(puUpdates ? { ...updates, ...puUpdates } : updates)
      sfx.play('softDrop')
    } else {
      get()._lock()
    }
  },

  hardDrop: () => {
    const { current, board, score, gameState } = get()
    if (gameState !== 'playing' || !current || !board) return

    let dropDistance = 0
    let y = current.y
    while (isValid(current.shape, current.x, y + 1, board)) {
      y++
      dropDistance++
    }

    const newScore = score + dropDistance * 2
    // Set position + score, then _lock handles locking + line clears + power-ups in one set()
    set({ current: { ...current, y }, score: newScore, lastDrop: performance.now() })
    sfx.play('hardDrop')
    get()._lock()
  },

  rotatePiece: () => {
    const { current, board, gameState } = get()
    if (gameState !== 'playing' || !current || !board) return
    const result = tryRotate(current, board)
    if (result) {
      set({ current: { ...current, shape: result.shape, x: result.x } })
      sfx.play('rotate')
    }
  },

  tick: (time) => {
    const { gameState, lastDrop, level, current, board } = get()
    if (gameState !== 'playing' || !current || !board) return

    const speed = getDropSpeed(level)
    if (time - lastDrop > speed) {
      if (isValid(current.shape, current.x, current.y + 1, board)) {
        set({ current: { ...current, y: current.y + 1 }, lastDrop: time })
      } else {
        set({ lastDrop: time })
        get()._lock()
      }
    }
  },

  // Internal: lock piece, clear lines, check power-up — all in ONE set() call
  _lock: () => {
    const { current, board, next, score, lines, level, lastPowerUpScore, powerUpsUsed } = get()
    if (!current || !board) return

    const { board: lockedBoard, topOut } = lockPiece(board, current)

    if (topOut) {
      get()._loseLife()
      return
    }

    const { board: clearedBoard, cleared } = clearLines(lockedBoard)

    let newScore = score
    let newLines = lines
    let newLevel = level

    if (cleared > 0) {
      newScore += calculateLineScore(cleared, level)
      newLines += cleared
      sfx.play(`lineClear${Math.min(cleared, 4)}`)
    } else {
      sfx.play('lock')
    }

    newLevel = calculateLevel(newScore)
    if (newLevel > level) sfx.play('levelUp')

    const newCurrent = { ...next }
    const newNext = randomPiece()

    if (!isValid(newCurrent.shape, newCurrent.x, newCurrent.y, clearedBoard)) {
      get()._loseLife()
      return
    }

    const updates = {
      board: clearedBoard,
      current: newCurrent,
      next: newNext,
      score: newScore,
      lines: newLines,
      level: newLevel,
      currentThemeIndex: Math.min(newLevel - 1, 9),
    }

    // Merge power-up updates into the same set() call
    const puUpdates = computePowerUpUpdates(newScore, lastPowerUpScore, powerUpsUsed, clearedBoard)
    if (puUpdates) {
      Object.assign(updates, puUpdates)
      sfx.play('powerUp')
    }

    set(updates)
  },

  _loseLife: () => {
    const { shielded, lives, next } = get()

    if (shielded) {
      set({
        shielded: false,
        current: { ...next, y: 0, x: Math.floor((COLS - next.shape[0].length) / 2) },
        next: randomPiece(),
        powerUpNotification: {
          emoji: '🛡️',
          name: 'KALKAN KIRILDI',
          color: '#00b4ff',
          glow: 'rgba(0,180,255,0.6)',
          startTime: performance.now(),
          particles: createPowerUpParticles(),
        },
      })
      sfx.play('shieldBreak')
      return
    }

    const newLives = lives - 1
    if (newLives <= 0) {
      set({ lives: 0, gameState: 'gameover' })
      sfx.play('gameOver')
      return
    }

    set({
      lives: newLives,
      board: createBoard(),
      current: { ...next, y: 0, x: Math.floor((COLS - next.shape[0].length) / 2) },
      next: randomPiece(),
    })
    sfx.play('lifeLost')
  },

  clearPowerUpNotification: () => {
    const { powerUpNotification } = get()
    if (powerUpNotification && performance.now() - powerUpNotification.startTime > 1500) {
      set({ powerUpNotification: null })
    }
  },
}))

export default useGameStore
