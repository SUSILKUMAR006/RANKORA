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
import SystemWindow from '../common/SystemWindow.jsx'

// Tile tones scale with strike power: heavy hits burn red, lighter hits read as system blue.
const intensity = {
  critical: {
    icon: 'border-penalty-400/80 bg-penalty-500/20 text-penalty-200 shadow-[0_0_14px_-2px_rgba(240,42,62,0.6)]',
    cell: 'bg-penalty-400 shadow-[0_0_6px_rgba(255,77,94,0.7)]',
    dmg: 'text-penalty-300',
  },
  heavy: {
    icon: 'border-penalty-400/50 bg-penalty-500/10 text-penalty-300',
    cell: 'bg-penalty-500/80',
    dmg: 'text-penalty-300',
  },
  light: {
    icon: 'border-system-400/50 bg-system-500/10 text-system-200',
    cell: 'bg-system-400/80',
    dmg: 'text-system-200',
  },
}

const attackItems = [
  {
    category: 'Fitness',
    title: 'Gym Workout',
    damage: 100,
    icon: Dumbbell,
    tone: intensity.critical,
    desc: 'Mandatory photo proof. Maximum physical strike power.',
  },
  {
    category: 'Discipline',
    title: 'Wake Up at 5:30 AM',
    damage: 50,
    icon: Sunrise,
    tone: intensity.heavy,
    desc: 'Morning momentum breaks early procrastination.',
  },
  {
    category: 'Knowledge',
    title: 'Read Book Daily',
    damage: 40,
    icon: BookOpen,
    tone: intensity.light,
    desc: '10+ pages read. Sharpens intelligence and mental focus.',
  },
  {
    category: 'Discipline',
    title: 'No Fap (Self-Mastery)',
    damage: 50,
    icon: Flame,
    tone: intensity.heavy,
    desc: 'Mastery of mind and energy strikes boss focus.',
  },
  {
    category: 'Discipline',
    title: 'No Junk Food',
    damage: 50,
    icon: UtensilsCrossed,
    tone: intensity.heavy,
    desc: 'Clean nutrition destroys sluggishness and inertia.',
  },
  {
    category: 'Health',
    title: 'Drink 3L Water',
    damage: 30,
    icon: Droplets,
    tone: intensity.light,
    desc: 'Full cellular hydration powers steady execution.',
  },
  {
    category: 'Health',
    title: 'Sleep Before 11:00 PM',
    damage: 50,
    icon: Moon,
    tone: intensity.heavy,
    desc: 'Recovery window resets willpower for tomorrow.',
  },
]

// 10-cell power meter: one cell per 10 damage.
function PowerCells({ damage, cellClass }) {
  const filled = Math.round(damage / 10)
  return (
    <div className="grid grid-cols-10 gap-0.5" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={`aspect-square ${i < filled ? cellClass : 'border border-edge/60 bg-void-950'}`} />
      ))}
    </div>
  )
}

function BossDamageMatrix({ isDefeated }) {
  return (
    <SystemWindow
      title="Damage Matrix"
      icon={<Swords size={13} />}
      actions={
        <Link
          to="/quests"
          className="label-caps inline-flex items-center gap-1 text-system-300 transition-colors hover:text-frost-50"
        >
          <span className="hidden sm:inline">Go to</span> Daily quests <ChevronRight size={14} />
        </Link>
      }
    >
      <p className="label-caps mb-4 text-frost-500">Combat mechanics · damage per cleared quest</p>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {attackItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.22 }}
              className="sys-inset flex flex-col justify-between p-3.5 transition-colors hover:border-edge-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center border ${item.tone.icon}`}>
                  <Icon size={17} />
                </span>
                <span className={`font-mono text-sm font-bold ${item.tone.dmg}`}>+{item.damage} DMG</span>
              </div>
              <div className="mt-3">
                <p className="label-caps text-frost-600">{item.category}</p>
                <h3 className="mt-0.5 font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-frost-400">{item.desc}</p>
              </div>
              <div className="mt-3">
                <PowerCells damage={item.damage} cellClass={item.tone.cell} />
              </div>
            </motion.div>
          )
        })}

        {/* Custom quests rule */}
        <div className="flex flex-col justify-between border border-system-400/40 bg-system-500/5 p-3.5 sm:col-span-2 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="label-caps flex items-center gap-2 text-system-200">
              <Shield size={15} />
              Combat execution rule
            </p>
            <span className="font-mono text-xs font-bold text-system-200">+50 DMG per Custom Quest</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-frost-300">
            Every daily routine mission and custom quest completed in real life lands a direct strike on the Weekly Boss in MongoDB Atlas.
          </p>
          <p className={`mt-2 font-mono text-[0.7rem] ${isDefeated ? 'text-clear-300' : 'text-system-300/80'}`}>
            {isDefeated ? 'Boss vanquished this week · +1,000 XP claimed' : 'Active battle underway · 0 mock attacks'}
          </p>
        </div>
      </div>
    </SystemWindow>
  )
}

export default BossDamageMatrix
