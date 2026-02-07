import { supabase } from '../config/supabase'

let cachedCount = null

export async function getPlayCount() {
  if (!supabase) return getLocalPlayCount()

  try {
    const { data, error } = await supabase
      .from('play_counter')
      .select('total_plays')
      .eq('id', 1)
      .single()

    if (error || !data) return getLocalPlayCount()
    cachedCount = data.total_plays
    return cachedCount
  } catch {
    return getLocalPlayCount()
  }
}

export async function incrementPlayCount() {
  incrementLocalPlayCount()

  if (!supabase) return getLocalPlayCount()

  try {
    const { data, error } = await supabase.rpc('increment_play_count')
    if (error) return getLocalPlayCount()
    cachedCount = data
    return data
  } catch {
    return getLocalPlayCount()
  }
}

function getLocalPlayCount() {
  try {
    return parseInt(localStorage.getItem('zoixPlayCount') || '0', 10)
  } catch {
    return 0
  }
}

function incrementLocalPlayCount() {
  const count = getLocalPlayCount() + 1
  localStorage.setItem('zoixPlayCount', String(count))
  return count
}
