import LeftPanel from './LeftPanel'
import MainPanel from './MainPanel'
import SidePanel from './SidePanel'
import Footer from './Footer'
import Scoreboard from '../scoreboard/Scoreboard'
import PlayCounter from '../ui/PlayCounter'
import useResponsive from '../../hooks/useResponsive'
import useKeyboard from '../../hooks/useKeyboard'

export default function GameWrapper({ highlightScore }) {
  const { blockWidth, blockHeight, canvasWidth, canvasHeight, nextPieceSize, isMobile } = useResponsive()

  useKeyboard()

  return (
    <>
      <div className="game-wrapper">
        {!isMobile && <LeftPanel highlightScore={highlightScore} />}
        <MainPanel
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          blockWidth={blockWidth}
          blockHeight={blockHeight}
        />
        <SidePanel nextPieceSize={nextPieceSize} />
        {isMobile && (
          <div className="scoreboard-mobile">
            <Scoreboard highlightScore={highlightScore} />
          </div>
        )}
      </div>
      <PlayCounter />
      <Footer />
    </>
  )
}
