import { supabase } from '../config/supabase'

export async function getOrCreatePlayer() {
  if (!supabase) return null

  try {
    const { data } = await supabase.auth.getSession()
    if (data.session) return data.session.user.id

    const { data: anonData, error } = await supabase.auth.signInAnonymously()
    if (error) return null
    return anonData.user.id
  } catch {
    return null
  }
}
