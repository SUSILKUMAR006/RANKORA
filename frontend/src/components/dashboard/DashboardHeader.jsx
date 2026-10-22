import { motion } from 'framer-motion'

function DashboardHeader({ playerName }) {
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())
  return (
    <motion.header
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <p className="label-caps flex items-center gap-2 text-system-300">
          <span className="h-1.5 w-1.5 rotate-45 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" />
          System ▸ Player status
        </p>
        <h1 className="sys-title mt-2 text-3xl leading-none sm:text-4xl">
          Welcome back, <span className="text-system-300">{playerName}</span>
        </h1>
        <p className="mt-3 text-sm text-frost-400">Your progress is built one action at a time.</p>
      </div>
      <p className="label-caps border border-edge bg-void-900/70 px-3 py-1.5 text-frost-400">{date}</p>
    </motion.header>
  )
}

export default DashboardHeader
