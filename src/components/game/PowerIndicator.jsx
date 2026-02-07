import useGameStore from '../../stores/gameStore'

export default function PowerIndicator() {
  const shielded = useGameStore(s => s.shielded)

  if (!shielded) return null

  return (
    <div className="power-indicator active">
      <span className="power-indicator-icon">🛡️</span>
      <span>KALKAN</span>
    </div>
  )
}
