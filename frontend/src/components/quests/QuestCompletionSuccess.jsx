import { Check, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '../common/Card.jsx'
import { formatStatReward } from '../../utils/xpUtils.js'

function QuestCompletionSuccess({ quest, levelUp }) {
  const completedAt = quest.completedAt ? new Date(quest.completedAt) : new Date()
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Card variant="standard" className="border-emerald-300/25 bg-emerald-400/[0.05]"><div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-300/15 text-emerald-200"><Check size={18} /></span><div className="flex-1"><p className="label-caps text-emerald-200/80">MISSION COMPLETE</p><p className="mt-2 text-sm text-slate-300">Rewards have been added to your profile.</p><p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Clock size={13} />Completed {completedAt.toLocaleDateString()} at {completedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p><div className="mt-4 flex flex-wrap gap-4 font-mono text-xs"><span className="flex items-center gap-1.5 text-cyan-200"><Zap size={14} />+{quest.xp} XP EARNED</span><span className="text-violet-200">{formatStatReward(quest.statReward)}</span>{levelUp && <span className="text-amber-200">LEVEL UP DETECTED</span>}</div></div></div></Card></motion.div>
}
export default QuestCompletionSuccess
