import { Navigate, useLocation } from 'react-router-dom'

export function ProtectedRoute({ children, allowUnawakened = false }) {
  const location = useLocation()
  const token = localStorage.getItem('rankora_token')
  const rawPlayer = localStorage.getItem('rankora_player')

  let player = null
  try {
    player = rawPlayer ? JSON.parse(rawPlayer) : null
  } catch {
    player = null
  }

  // Not Authenticated -> Redirect to Login
  if (!token && !player?.email && !player?.playerName) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Authenticated but hasn't finished Awakening ritual -> Force /awakening
  if (player && player.onboardingCompleted === false && !allowUnawakened) {
    return <Navigate to="/awakening" replace />
  }

  return children
}

export default ProtectedRoute
