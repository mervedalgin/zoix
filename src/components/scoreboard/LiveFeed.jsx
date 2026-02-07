import { useState, useEffect, useRef } from 'react'
import { subscribeToNewScores } from '../../services/scoreService'
import { formatScore } from '../../utils/helpers'

export default function LiveFeed() {
  const [items, setItems] = useState([])
  const channelRef = useRef(null)

  useEffect(() => {
    const channel = subscribeToNewScores((entry) => {
      setItems(prev => {
        const next = [{ ...entry, id: Date.now() }, ...prev]
        return next.slice(0, 5)
      })
    })
    channelRef.current = channel

    return () => {
      if (channelRef.current && channelRef.current.unsubscribe) {
        channelRef.current.unsubscribe()
      }
    }
  }, [])

  // Auto-remove items after 5 seconds
  useEffect(() => {
    if (items.length === 0) return
    const timer = setTimeout(() => {
      setItems(prev => prev.slice(0, -1))
    }, 5000)
    return () => clearTimeout(timer)
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="live-feed">
      {items.map(item => (
        <div key={item.id} className="live-feed-item">
          🔴 {item.username} az önce {formatScore(item.score)} puan yaptı!
        </div>
      ))}
    </div>
  )
}
