import useGameStore from '../../stores/gameStore'

export default function PauseScreen() {
  const gameState = useGameStore(s => s.gameState)
  const resumeGame = useGameStore(s => s.resumeGame)

  if (gameState !== 'paused') return null

  return (
    <div className="overlay">
      <h2>DURDURULDU</h2>
      <p className="desktop-hint">Devam etmek için ESC'ye basın</p>
      <button className="btn" onClick={resumeGame}>DEVAM ET</button>
    </div>
  )
}
