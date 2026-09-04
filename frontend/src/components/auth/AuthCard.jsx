import { motion } from 'framer-motion'
import Card from '../common/Card.jsx'

function AuthCard({ children }) {
  return <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.42, ease: 'easeOut' }} className="w-full max-w-lg"><Card variant="glass" className="p-6 sm:p-8">{children}</Card></motion.div>
}

export default AuthCard
