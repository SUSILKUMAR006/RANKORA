import { motion } from 'framer-motion'

// The login / register form sits inside a System window that unfolds open.
function AuthCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.03, scaleX: 0.7 }}
      animate={{
        opacity: 1,
        scaleY: 1,
        scaleX: 1,
        transition: { scaleX: { duration: 0.2 }, scaleY: { delay: 0.18, duration: 0.35, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.15 } },
      }}
      className="sys-panel w-full max-w-lg p-6 [--panel-glow:rgba(30,144,255,0.3)] sm:p-8"
    >
      {children}
    </motion.div>
  )
}

export default AuthCard
