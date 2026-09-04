import { motion } from 'framer-motion'
import {
  BookOpen,
  ChevronRight,
  Droplets,
  Dumbbell,
  Flame,
  Moon,
  Shield,
  Sunrise,
  Swords,
  UtensilsCrossed,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../common/Card.jsx'

const attackItems = [
  {
    category: 'Fitness',
    title: 'Gym Workout',
    damage: 100,
    icon: Dumbbell,
    tone: 'text-rose-300 bg-rose-400/10 border-rose-400/25',
    desc: 'Mandatory photo proof. Maximum physical strike power.',
  },
  {
    category: 'Discipline',
    title: 'Wake Up at 5:30 AM',
    damage: 50,
    icon: Sunrise,
    tone: 'text-amber-300 bg-amber-400/10 border-amber-400/25',
    desc: 'Morning momentum breaks early procrastination.',
  },
  {
    category: 'Knowledge',
    title: 'Read Book Daily',
    damage: 40,
    icon: BookOpen,
    tone: 'text-violet-300 bg-violet-400/10 border-violet-400/25',
    desc: '10+ pages read. Sharpens intelligence and mental focus.',
  },
  {
    category: 'Discipline',
    title: 'No Fap (Self-Mastery)',
    damage: 50,
    icon: Flame,
    tone: 'text-amber-300 bg-amber-400/10 border-amber-400/25',
    desc: 'Mastery of mind and energy strikes boss focus.',
  },
  {
    category: 'Discipline',
    title: 'No Junk Food',
    damage: 50,
    icon: UtensilsCrossed,
    tone: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25',
    desc: 'Clean nutrition destroys sluggishness and inertia.',
  },
  {
    category: 'Health',
    title: 'Drink 3L Water',
    damage: 30,
    icon: Droplets,
    tone: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/25',
    desc: 'Full cellular hydration powers steady execution.',
  },
  {
    category: 'Health',
    title: 'Sleep Before 11:00 PM',
    damage: 50,
    icon: Moon,
    tone: 'text-indigo-300 bg-indigo-400/10 border-indigo-400/25',
    desc: 'Recovery window resets willpower for tomorrow.',
  },
]

function BossDamageMatrix({ isDefeated }) {
  return (
    <Card variant="glass" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="label-caps text-cyan-300/80">COMBAT MECHANICS</p>
          <h2 className="mt-1 font-display text-lg font-semibold text-white">
            ATTACK DAMAGE MATRIX
          </h2>
        </div>
        <Link
          to="/quests"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3.5 py-2 font-mono text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/20 shadow-[0_0_20px_rgba(103,232,249,0.1)]"
        >
          <Swords size={14} />
          <span>GO TO DAILY QUESTS</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {attackItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${item.tone}`}
                >
                  <Icon size={18} />
                </span>
                <span className="font-mono text-sm font-bold text-rose-300">
                  +{item.damage} DMG
                </span>
              </div>
              <div className="mt-3">
                <p className="label-caps text-[0.62rem] text-slate-500">
                  {item.category}
                </p>
                <h3 className="mt-0.5 text-xs font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-[0.72rem] leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          )
        })}

        {/* Custom Quests Card */}
        <div className="flex flex-col justify-between rounded-xl border border-cyan-300/20 bg-cyan-300/[0.03] p-4 sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-200 font-mono text-xs font-semibold">
              <Shield size={16} />
              <span>COMBAT EXECUTION RULE</span>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-200">
              +50 DMG per Custom Quest
            </span>
          </div>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-slate-300">
            Every daily routine mission and custom quest completed in real life lands a direct strike on the Weekly Boss in MongoDB Atlas.
          </p>
          <p className="mt-2 font-mono text-[0.68rem] text-cyan-300/70">
            {isDefeated ? 'Boss vanquished this week · +1,000 XP claimed' : 'Active battle underway · 0 mock attacks'}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default BossDamageMatrix
