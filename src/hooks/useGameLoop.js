import { useEffect, useRef } from 'react'
import useGameStore from '../stores/gameStore'
import { drawBoard } from '../engine/renderer'

export default function useGameLoop(canvasRef, blockWidth, blockHeight) {
  const rafRef = useRef(null)
  const bwRef = useRef(blockWidth)
  const bhRef = useRef(blockHeight)
  bwRef.current = blockWidth
  bhRef.current = blockHeight

  useEffect(() => {
    const loop = (time) => {
      const state = useGameStore.getState()

      if (state.gameState === 'playing') {
        state.tick(time)
        state.clearPowerUpNotification()
      }

      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        drawBoard(ctx, state, bwRef.current, bhRef.current)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
