import { motion } from 'framer-motion'

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
}

export const slideUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.24, ease: 'easeOut' } },
}

export const hoverLift = { y: -3, transition: { duration: 0.2, ease: 'easeOut' } }

export { motion }