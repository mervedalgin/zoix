import { useState, useEffect, useCallback } from 'react'
import { COLS, ROWS } from '../utils/constants'

export default function useResponsive() {
  const calculate = useCallback(() => {
    const isMobile = window.innerWidth <= 640
    const isLandscape = window.innerHeight < 500 && window.innerWidth > window.innerHeight

    let blockWidth, blockHeight

    if (isLandscape) {
      const maxHeight = window.innerHeight - 80
      const block = Math.floor(maxHeight / ROWS)
      blockWidth = block
      blockHeight = block
    } else if (isMobile) {
      const maxW = Math.min(window.innerWidth - 30, 300)
      const block = Math.floor(maxW / COLS)
      blockWidth = block
      blockHeight = block
    } else {
      // Desktop: rectangular blocks — height fits viewport, width fills space between panels
      const isMedium = window.innerWidth <= 900
      const panelSpace = isMedium ? (260 + 200 + 40 + 40) : (320 + 240 + 56 + 40)
      const maxCanvasHeight = window.innerHeight - 160
      const maxCanvasWidth = window.innerWidth - panelSpace

      blockHeight = Math.max(Math.floor(maxCanvasHeight / ROWS), 16)
      blockWidth = Math.max(Math.floor(maxCanvasWidth / COLS), 16)

      // Cap aspect ratio: block width can be at most 1.5x block height
      blockWidth = Math.min(blockWidth, Math.floor(blockHeight * 1.5))
      // Ensure at least square
      blockWidth = Math.max(blockWidth, blockHeight)
    }

    const canvasWidth = blockWidth * COLS
    const canvasHeight = blockHeight * ROWS
    const nextPieceSize = isMobile ? 80 : 120

    return { blockWidth, blockHeight, canvasWidth, canvasHeight, nextPieceSize, isMobile, isLandscape }
  }, [])

  const [dimensions, setDimensions] = useState(calculate)

  useEffect(() => {
    const handleResize = () => setDimensions(calculate())
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [calculate])

  return dimensions
}
