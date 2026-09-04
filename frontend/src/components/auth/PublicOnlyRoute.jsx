import { Navigate } from 'react-router-dom'

export function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem('rankora_token')
  const rawPlayer = localStorage.getItem('rankora_player')

  let player = null
  try {
    player = rawPlayer ? JSON.parse(rawPlayer) : null
  } catch {
    player = null
  }

  if (token || (player && (player.email || player.playerName))) {
    if (player && player.onboardingCompleted === false) {
      return <Navigate to="/awakening" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute
