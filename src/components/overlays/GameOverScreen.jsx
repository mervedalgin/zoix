import { useState, useEffect, useRef } from 'react'
import useGameStore from '../../stores/gameStore'
import { formatScore } from '../../utils/helpers'

// Auto-detect all meme files from src/assets/memes/ — just drop files in, no code change needed
const memeModules = import.meta.glob('../../assets/memes/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })
const MEMES = Object.values(memeModules)

const MEME_DURATION = 3000

// Shuffle bag: ensures all memes are shown before repeating
let memeBag = []
function pickMeme() {
  if (MEMES.length === 0) return null
  if (memeBag.length === 0) {
    memeBag = [...MEMES]
    // Fisher-Yates shuffle
    for (let i = memeBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [memeBag[i], memeBag[j]] = [memeBag[j], memeBag[i]]
    }
  }
  return memeBag.pop()
}

export default function GameOverScreen() {
  const gameState = useGameStore(s => s.gameState)
  const score = useGameStore(s => s.score)
  const startGame = useGameStore(s => s.startGame)
  const [meme, setMeme] = useState(null)
  const [showContent, setShowContent] = useState(false)
  const prevState = useRef(gameState)

  useEffect(() => {
    if (prevState.current !== 'gameover' && gameState === 'gameover') {
      const pick = pickMeme()
      setMeme(pick)
      setShowContent(false)

      const timer = setTimeout(() => {
        setMeme(null)
        setShowContent(true)
      }, MEME_DURATION)

      return () => clearTimeout(timer)
    }
    if (gameState !== 'gameover') {
      setMeme(null)
      setShowContent(false)
    }
    prevState.current = gameState
  }, [gameState])

  if (gameState !== 'gameover') return null

  // Meme splash phase
  if (meme) {
    return (
      <div className="overlay meme-overlay">
        <img
          src={meme}
          alt="Game Over Meme"
          className="meme-img"
          onError={(e) => {
            // If image fails to load, skip to content
            e.target.style.display = 'none'
            setMeme(null)
            setShowContent(true)
          }}
        />
      </div>
    )
  }

  return (
    <div className="overlay">
      <h2>OYUN BİTTİ</h2>
      <div className="final-score">{formatScore(score)}</div>
      <p>puan kazandınız</p>
      <button className="btn" onClick={startGame}>TEKRAR OYNA</button>
    </div>
  )
}
