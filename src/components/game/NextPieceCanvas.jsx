import { useRef, useEffect } from 'react'
import useGameStore from '../../stores/gameStore'
import { drawNextPiece } from '../../engine/renderer'

export default function NextPieceCanvas({ size }) {
  const canvasRef = useRef(null)
  const next = useGameStore(s => s.next)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    drawNextPiece(ctx, next, size)
  }, [next, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block mx-auto rounded"
    />
  )
}
