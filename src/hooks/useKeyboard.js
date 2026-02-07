import { useEffect } from 'react'
import useGameStore from '../stores/gameStore'

export default function useKeyboard() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = useGameStore.getState()

      if (state.gameState === 'gameover' || state.gameState === 'idle') return

      if (e.key === 'Escape') {
        if (state.gameState === 'paused') {
          state.resumeGame()
        } else if (state.gameState === 'playing') {
          state.pauseGame()
        }
        return
      }

      if (state.gameState !== 'playing') return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          state.moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          state.moveRight()
          break
        case 'ArrowDown':
          e.preventDefault()
          state.moveDown()
          break
        case 'ArrowUp':
          e.preventDefault()
          state.rotatePiece()
          break
        case ' ':
          e.preventDefault()
          state.hardDrop()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
