import { supabase } from '../config/supabase'
import { getOrCreatePlayer } from './playerService'

export async function submitScore({ username, score, lines, level, lives, powerUpsUsed, duration, device }) {
  const playerId = await getOrCreatePlayer()
  if (!playerId || !supabase) {
    saveLocalScore(username, score)
    return null
  }

  try {
    const { data, error } = await supabase.rpc('submit_score', {
      p_player_id: playerId,
      p_username: username.toUpperCase().slice(0, 12),
      p_score: score,
      p_lines: lines,
      p_level: level,
      p_lives: lives,
      p_powerups: powerUpsUsed,
      p_duration: duration,
      p_device: device,
    })

    if (error) {
      console.error('Score submit error:', error)
      saveLocalScore(username, score)
      return null
    }

    return data
  } catch (err) {
    console.error('Score submit failed:', err)
    saveLocalScore(username, score)
    return null
  }
}

export async function fetchLeaderboard(period = 'alltime') {
  if (!supabase) return getLocalScoreboard()

  const viewName = `leaderboard_${period}`
  try {
    const { data, error } = await supabase.from(viewName).select('*')
    if (error) {
      console.error('Leaderboard fetch error:', error)
      return getLocalScoreboard()
    }
    return data || []
  } catch {
    return getLocalScoreboard()
  }
}

export function subscribeToNewScores(callback) {
  if (!supabase) return null

  return supabase
    .channel('live-scores')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'scores',
    }, (payload) => {
      callback({
        username: payload.new.username,
        score: payload.new.score,
        level: payload.new.level_reached,
      })
    })
    .subscribe()
}

// Local fallback
function getLocalScoreboard() {
  try {
    return JSON.parse(localStorage.getItem('zoixScoreboard')) || []
  } catch {
    return []
  }
}

function saveLocalScore(name, score) {
  const sb = getLocalScoreboard()
  sb.push({ username: name.toUpperCase().slice(0, 8), score, played_at: new Date().toISOString() })
  sb.sort((a, b) => b.score - a.score)
  if (sb.length > 50) sb.length = 50
  localStorage.setItem('zoixScoreboard', JSON.stringify(sb))
}

export function isTopScore(score) {
  const sb = getLocalScoreboard()
  return score > 0 && (sb.length < 5 || score > sb[sb.length - 1].score)
}
