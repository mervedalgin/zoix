import { useRef, useCallback } from 'react'
import useGameStore from '../../stores/gameStore'

function MobButton({ className, onAction, children, repeat = false }) {
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const startAction = useCallback((e) => {
    e.preventDefault()
    const state = useGameStore.getState()
    if (state.gameState !== 'playing') return
    onAction()
    if (repeat) {
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          const s = useGameStore.getState()
          if (s.gameState === 'playing') onAction()
        }, 80)
      }, 200)
    }
  }, [onAction, repeat])

  const stopAction = useCallback((e) => {
    e.preventDefault()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null
  }, [])

  return (
    <div
      className={`mob-btn ${className}`}
      onTouchStart={startAction}
      onTouchEnd={stopAction}
      onTouchCancel={stopAction}
      onMouseDown={startAction}
      onMouseUp={stopAction}
      onMouseLeave={stopAction}
    >
      {children}
    </div>
  )
}

export default function MobileControls() {
  const moveLeft = useGameStore(s => s.moveLeft)
  const moveRight = useGameStore(s => s.moveRight)
  const moveDown = useGameStore(s => s.moveDown)
  const rotatePiece = useGameStore(s => s.rotatePiece)
  const hardDrop = useGameStore(s => s.hardDrop)
  const gameState = useGameStore(s => s.gameState)
  const pauseGame = useGameStore(s => s.pauseGame)
  const resumeGame = useGameStore(s => s.resumeGame)

  const handlePause = useCallback(() => {
    if (gameState === 'playing') pauseGame()
    else if (gameState === 'paused') resumeGame()
  }, [gameState, pauseGame, resumeGame])

  return (
    <div className="mobile-controls">
      <div className="controls-row">
        <div className="control-group left">
          <MobButton className="dir" onAction={moveLeft} repeat>◀</MobButton>
          <MobButton className="dir" onAction={moveDown} repeat>▼</MobButton>
          <MobButton className="dir" onAction={moveRight} repeat>▶</MobButton>
        </div>
        <div className="control-group center">
          <div className="mob-btn pause" onClick={handlePause}>⏸</div>
        </div>
        <div className="control-group right">
          <MobButton className="action primary" onAction={rotatePiece}>↻</MobButton>
          <MobButton className="drop" onAction={hardDrop}>BIRAK</MobButton>
        </div>
      </div>
    </div>
  )
}
