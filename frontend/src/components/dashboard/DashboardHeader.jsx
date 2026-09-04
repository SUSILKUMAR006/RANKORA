import { motion } from 'framer-motion'

function DashboardHeader({ playerName }) {
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())
  return <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4"><div><p className="label-caps text-cyan-300/70">RANKORA SYSTEM / PLAYER CONTROL CENTER</p><h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">GOOD MORNING, {playerName.toUpperCase()}</h1><p className="mt-3 text-sm text-slate-400">Your progress is built one action at a time.</p></div><p className="label-caps text-slate-500">{date.replace(',', ' •').toUpperCase()}</p></motion.header>
}
export default DashboardHeader
