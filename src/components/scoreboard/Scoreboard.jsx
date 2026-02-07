import { useState, useEffect, useCallback } from 'react'
import { fetchLeaderboard } from '../../services/scoreService'
import ScoreEntry from './ScoreEntry'
import LiveFeed from './LiveFeed'
import MatrixRain from '../effects/MatrixRain'

const PERIODS = [
  { key: 'daily', label: 'GÜNLÜK' },
  { key: 'weekly', label: 'HAFTALIK' },
  { key: 'alltime', label: 'TÜM ZAMANLAR' },
]

export default function Scoreboard({ highlightScore }) {
  const [data, setData] = useState({ daily: [], weekly: [], alltime: [] })
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    setLoading(true)
    const [daily, weekly, alltime] = await Promise.all([
      fetchLeaderboard('daily'),
      fetchLeaderboard('weekly'),
      fetchLeaderboard('alltime'),
    ])
    setData({ daily, weekly, alltime })
    setLoading(false)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  useEffect(() => {
    if (highlightScore) loadAll()
  }, [highlightScore, loadAll])

  return (
    <div className="scoreboard-panel">
      <MatrixRain />
      <div className="sb-scanlines" />

      <div className="sb-header">
        <div className="sb-header-title">Hall of Fame</div>
        <div className="sb-header-line" />
        <div className="sb-header-sub">En iyi oyuncular · Canlı</div>
      </div>

      {PERIODS.map(({ key, label }) => (
        <div key={key} className="sb-section">
          <div className="sb-section-title">{label}</div>
          <ul className="sb-list">
            {loading ? (
              <li className="sb-empty sb-empty-sm">⏳</li>
            ) : data[key].length === 0 ? (
              <li className="sb-empty sb-empty-sm">Henüz skor yok</li>
            ) : (
              data[key].slice(0, 5).map((entry, i) => (
                <ScoreEntry
                  key={entry.id || i}
                  entry={entry}
                  rank={i + 1}
                  highlight={highlightScore && entry.score === highlightScore}
                />
              ))
            )}
          </ul>
        </div>
      ))}

      <LiveFeed />
    </div>
  )
}
