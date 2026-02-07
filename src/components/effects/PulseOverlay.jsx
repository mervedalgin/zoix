import useGameStore from '../../stores/gameStore'
import { LEVEL_THEMES } from '../../utils/themes'

export default function PulseOverlay() {
  const level = useGameStore(s => s.level)
  const themeIndex = Math.min(level - 1, LEVEL_THEMES.length - 1)
  const theme = LEVEL_THEMES[themeIndex]

  if (level < 5) return null

  // Pulse intensity grows from level 5 to 10
  const opacity = 0.04 + (level - 5) * 0.015

  return (
    <div
      className="pulse-overlay"
      style={{
        '--pulse-opacity': opacity.toFixed(3),
        '--bg-primary': theme.primary,
      }}
    />
  )
}
