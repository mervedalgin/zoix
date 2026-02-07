import { useRef } from 'react'
import useGameLoop from '../../hooks/useGameLoop'
import useTouch from '../../hooks/useTouch'

export default function GameCanvas({ canvasWidth, canvasHeight, blockWidth, blockHeight }) {
  const canvasRef = useRef(null)

  useGameLoop(canvasRef, blockWidth, blockHeight)
  useTouch(canvasRef)

  return (
    <canvas
      ref={canvasRef}
      id="board"
      width={canvasWidth}
      height={canvasHeight}
      className="block rounded bg-[#0d0d14]"
    />
  )
}
