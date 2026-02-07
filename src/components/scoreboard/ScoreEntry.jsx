import { formatScore } from '../../utils/helpers'

const MEDALS = ['🥇', '🥈', '🥉']

export default function ScoreEntry({ entry, rank, highlight }) {
  const medal = MEDALS[rank - 1]

  return (
    <li className={`sb-entry${highlight ? ' highlight' : ''}`}>
      <span className="sb-rank">{medal ? <span className="sb-medal">{medal}</span> : rank}</span>
      <span className="sb-name">{entry.username}</span>
      <span className="sb-dots">··········</span>
      <span className="sb-score">{formatScore(entry.score)}</span>
    </li>
  )
}
