import { useState, useCallback } from 'react'
import useGameStore from '../../stores/gameStore'
import { formatScore } from '../../utils/helpers'
import NextPieceCanvas from '../game/NextPieceCanvas'
import PowerIndicator from '../game/PowerIndicator'
import Hearts from '../ui/Hearts'
import StatRow from '../ui/StatRow'
import sfx from '../../audio/soundManager'

export default function SidePanel({ nextPieceSize }) {
  const score = useGameStore(s => s.score)
  const level = useGameStore(s => s.level)
  const lines = useGameStore(s => s.lines)
  const gameState = useGameStore(s => s.gameState)
  const pauseGame = useGameStore(s => s.pauseGame)
  const resumeGame = useGameStore(s => s.resumeGame)
  const [muted, setMuted] = useState(false)

  const isPlaying = gameState === 'playing'
  const isPaused = gameState === 'paused'

  const toggleMute = useCallback(() => {
    const nowMuted = sfx.toggleMute()
    setMuted(nowMuted)
  }, [])

  return (
    <div className="side-panel">
      <div className="panel-box">
        <h3>Skor</h3>
        <div className="score-value">{formatScore(score)}</div>
        <StatRow label="SEVİYE" value={level} />
        <StatRow label="SATIR" value={lines} />
        <StatRow label="CAN" className="mt-3">
          <Hearts />
        </StatRow>
        <PowerIndicator />
      </div>
      <div className="panel-box">
        <h3>Sıradaki</h3>
        <NextPieceCanvas size={nextPieceSize} />
      </div>
      <div className="side-btn-row">
        <button
          className="side-btn pause-btn"
          onClick={isPaused ? resumeGame : pauseGame}
          disabled={!isPlaying && !isPaused}
          title={isPaused ? 'Devam Et' : 'Durdur'}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
        <button className="side-btn mute-btn" onClick={toggleMute} title={muted ? 'Sesi Aç' : 'Sesi Kapat'}>
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  )
}
