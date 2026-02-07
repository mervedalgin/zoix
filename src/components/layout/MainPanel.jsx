import GlitchTitle from '../ui/GlitchTitle'
import GameCanvas from '../game/GameCanvas'
import MobileControls from '../game/MobileControls'
import StartScreen from '../overlays/StartScreen'
import PauseScreen from '../overlays/PauseScreen'
import GameOverScreen from '../overlays/GameOverScreen'

export default function MainPanel({ canvasWidth, canvasHeight, blockWidth, blockHeight }) {
  return (
    <div className="main-panel">
      <GlitchTitle />
      <div className="board-frame">
        <GameCanvas
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          blockWidth={blockWidth}
          blockHeight={blockHeight}
        />
        <StartScreen />
        <PauseScreen />
        <GameOverScreen />
      </div>
      <MobileControls />
    </div>
  )
}
