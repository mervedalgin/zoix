import { useEffect, useRef } from 'react'
import useGameStore from '../stores/gameStore'

export default function useTouch(canvasRef) {
  const touchStart = useRef({ x: 0, y: 0, time: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleTouchStart = (e) => {
      const state = useGameStore.getState()
      if (state.gameState !== 'playing') return
      const touch = e.touches[0]
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }
    }

    const handleTouchEnd = (e) => {
      const state = useGameStore.getState()
      if (state.gameState !== 'playing') return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.current.x
      const deltaY = touch.clientY - touchStart.current.y
      const deltaTime = Date.now() - touchStart.current.time

      const minSwipe = 30
      const maxTime = 300

      if (deltaTime < maxTime) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > minSwipe) state.moveRight()
          else if (deltaX < -minSwipe) state.moveLeft()
        } else {
          if (deltaY > minSwipe * 2) state.hardDrop()
          else if (deltaY < -minSwipe) state.rotatePiece()
        }
      } else if (deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        state.rotatePiece()
      }
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [canvasRef])
}
