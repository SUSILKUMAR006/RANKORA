import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided.',
    })
  }

  try {
    const secret = process.env.JWT_SECRET || 'rankora_jwt_secret_key_2026_super_secure_telemetry'
    const decoded = jwt.verify(token, secret)

    const user = await User.findById(decoded.id).select('-passwordHash')
    if (!user) {
      // Fallback mock user if DB is in transition
      req.user = {
        _id: decoded.id || 'mock-user-id',
        name: decoded.name || 'PLAYER',
        email: decoded.email || 'player@rankora.system',
      }
      return next()
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid or expired token.',
    })
  }
}
