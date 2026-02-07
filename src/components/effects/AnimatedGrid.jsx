import useGameStore from '../../stores/gameStore'
import { LEVEL_THEMES } from '../../utils/themes'

export default function AnimatedGrid() {
  const level = useGameStore(s => s.level)
  const themeIndex = Math.min(level - 1, LEVEL_THEMES.length - 1)
  const theme = LEVEL_THEMES[themeIndex]

  // 10 levels: speed 8s → 2s, opacity 0.03 → 0.08
  const speed = Math.max(2, 8 - (level - 1) * 0.65)
  const gridOpacity = Math.min(0.08, 0.03 + (level - 1) * 0.005)

  return (
    <div
      className="animated-grid"
      style={{
        '--bg-primary-rgb': theme.rgb,
        '--grid-speed': `${speed}s`,
        '--grid-opacity': gridOpacity,
      }}
    />
  )
}
