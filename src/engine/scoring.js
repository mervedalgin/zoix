import {
  LINE_POINTS,
  SOFT_DROP_POINTS,
  HARD_DROP_POINTS,
  INITIAL_DROP_SPEED,
  MIN_DROP_SPEED,
  SPEED_DECREASE_PER_LEVEL,
  SCORE_PER_LEVEL,
  MAX_LEVEL,
} from '../utils/constants'

export function calculateLineScore(linesCleared, level) {
  return (LINE_POINTS[linesCleared] || 800) * level
}

export function calculateSoftDropScore() {
  return SOFT_DROP_POINTS
}

export function calculateHardDropScore(cellsDropped) {
  return HARD_DROP_POINTS * cellsDropped
}

export function calculateLevel(score) {
  return Math.min(Math.floor(score / SCORE_PER_LEVEL) + 1, MAX_LEVEL)
}

export function getDropSpeed(level) {
  return Math.max(MIN_DROP_SPEED, INITIAL_DROP_SPEED - (level - 1) * SPEED_DECREASE_PER_LEVEL)
}
