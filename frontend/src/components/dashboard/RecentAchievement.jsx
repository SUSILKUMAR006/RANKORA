import { motion } from 'framer-motion'
import { ChevronRight, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../common/Card.jsx'
import { getLatestUnlockedAchievement } from '../../utils/achievementUtils.js'

function RecentAchievement({ achievement }) {
  const current = achievement || getLatestUnlockedAchievement() || {}
  const Icon = current.icon || Trophy
  const title = current.title || 'FIRST AWAKENING'
  const detail = current.detail || 'Unlocked on registration'

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <Card variant="highlighted" className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-300/10 text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.15)]">
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="label-caps text-amber-200/70">RECENT ACHIEVEMENT</p>
          <h2 className="mt-1 font-display font-semibold text-white">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <Link to="/achievements" aria-label="View achievements" className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-white">
          <ChevronRight size={18} />
        </Link>
      </Card>
    </motion.div>
  )
}
export default RecentAchievement
