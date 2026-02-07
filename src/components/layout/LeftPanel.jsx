import Scoreboard from '../scoreboard/Scoreboard'

export default function LeftPanel({ highlightScore }) {
  return (
    <div className="left-panel">
      <Scoreboard highlightScore={highlightScore} />
      <div className="panel-box controls-info">
        <h3>Kontroller</h3>
        <span>←→</span> Hareket<br />
        <span>↑</span> Döndür<br />
        <span>↓</span> Hızlandır<br />
        <span>SPACE</span> Düşür<br />
        <span>ESC</span> Durdur
      </div>
    </div>
  )
}
