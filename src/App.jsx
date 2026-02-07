import { useState, useEffect, useRef, Component } from 'react'
import useGameStore from './stores/gameStore'
import GameWrapper from './components/layout/GameWrapper'
import ParticleBackground from './components/effects/ParticleBackground'
import AnimatedGrid from './components/effects/AnimatedGrid'
import PulseOverlay from './components/effects/PulseOverlay'
import ScanlineOverlay from './components/effects/ScanlineOverlay'
import NameInputModal from './components/scoreboard/NameInputModal'
import { isTopScore } from './services/scoreService'
import { getThemeForLevel } from './utils/themes'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ZOIX Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          color: '#ff4070',
          fontFamily: "'Orbitron', sans-serif",
          padding: '40px',
          textAlign: 'center',
        }}>
          <h2 style={{ marginBottom: '16px' }}>Bir hata oluştu</h2>
          <p style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 24px',
              border: '1px solid #00ffc8',
              background: 'rgba(0,255,200,0.1)',
              color: '#00ffc8',
              cursor: 'pointer',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '2px',
            }}
          >
            YENİDEN BAŞLAT
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function AppContent() {
  const gameState = useGameStore(s => s.gameState)
  const score = useGameStore(s => s.score)
  const level = useGameStore(s => s.level)
  const [showNameModal, setShowNameModal] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [highlightScore, setHighlightScore] = useState(null)

  const [levelFlash, setLevelFlash] = useState(false)
  const prevLevelRef = useRef(1)

  // Propagate theme to CSS variables on :root + flash on level up
  useEffect(() => {
    const { theme } = getThemeForLevel(level)
    const root = document.documentElement
    root.style.setProperty('--bg-primary', theme.primary)
    root.style.setProperty('--bg-secondary', theme.secondary)
    root.style.setProperty('--bg-primary-rgb', theme.rgb)

    if (level > prevLevelRef.current) {
      setLevelFlash(true)
      setTimeout(() => setLevelFlash(false), 800)
    }
    prevLevelRef.current = level
  }, [level])

  useEffect(() => {
    if (gameState === 'gameover' && score > 0 && isTopScore(score)) {
      setFinalScore(score)
      // Wait for meme to finish (3s) before showing name input
      const timer = setTimeout(() => setShowNameModal(true), 3200)
      return () => clearTimeout(timer)
    }
  }, [gameState, score])

  const handleScoreSubmitted = (name, submittedScore) => {
    setHighlightScore(submittedScore)
    setTimeout(() => setHighlightScore(null), 5000)
  }

  return (
    <>
      <ParticleBackground />
      <AnimatedGrid />
      <PulseOverlay />
      {levelFlash && <div className="level-flash" />}
      <GameWrapper highlightScore={highlightScore} />
      <ScanlineOverlay />
      <NameInputModal
        visible={showNameModal}
        score={finalScore}
        onClose={() => setShowNameModal(false)}
        onSubmitted={handleScoreSubmitted}
      />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}
