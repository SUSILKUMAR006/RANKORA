import { CheckCircle2, ChevronRight, Skull } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../common/Badge.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import { getStoredWeeklyBoss } from '../../utils/bossUtils.js'

function WeeklyBossCard({ boss }) {
  const liveData = getStoredWeeklyBoss()?.currentBoss
  const current = boss || liveData || {}
  const hp = current.currentHp !== undefined ? current.currentHp : current.hp !== undefined ? current.hp : 620
  const maxHp = current.maxHp || 1000
  const isDefeated = current.status === 'DEFEATED' || hp <= 0
  const remaining = Math.max(0, hp)
  const attacks = current.attacks || [
    { label: 'Gym', damage: 100 },
    { label: 'Coding', damage: 100 },
    { label: 'Reading', damage: 50 },
    { label: 'Water', damage: 30 },
  ]

  return (
    <SystemWindow
      title="Weekly Boss"
      tone={isDefeated ? 'clear' : 'penalty'}
      icon={isDefeated ? <CheckCircle2 size={14} /> : <Skull size={14} />}
      actions={isDefeated ? <Badge tone="success">Defeated</Badge> : <Badge tone="danger">Active</Badge>}
      className="overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`label-caps ${isDefeated ? 'text-clear-300' : 'text-penalty-300'}`}>
            {isDefeated ? 'Target eliminated' : 'Target'}
          </p>
          <h2
            className={`sys-title mt-2 text-3xl leading-none break-words sm:text-4xl ${
              isDefeated
                ? 'text-clear-100 [text-shadow:0_0_18px_rgba(52,217,156,0.55)]'
                : 'text-penalty-50 [text-shadow:0_0_18px_rgba(255,77,94,0.7)]'
            }`}
          >
            {current.name || 'THE PROCRASTINATOR'}
          </h2>
        </div>
        <span className="relative grid h-14 w-14 shrink-0 place-items-center">
          <span
            className={`absolute inset-1.5 rotate-45 border ${
              isDefeated
                ? 'border-clear-400/70 bg-clear-500/10 shadow-[0_0_18px_rgba(52,217,156,0.4)]'
                : 'border-penalty-400/70 bg-penalty-500/10 shadow-[0_0_18px_rgba(240,42,62,0.5)]'
            }`}
          />
          {isDefeated ? (
            <CheckCircle2 size={24} className="relative text-clear-300" />
          ) : (
            <Skull size={24} className="relative text-penalty-200" />
          )}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="label-caps text-penalty-300">Boss HP</span>
          <span className={`font-mono text-sm ${isDefeated ? 'text-clear-300' : 'text-penalty-100'}`}>
            {hp} <span className="text-frost-500">/ {maxHp}</span>
          </span>
        </div>
        <ProgressBar value={hp} max={maxHp} tone="boss" size="lg" />
        <p className={`mt-2 font-mono text-xs ${isDefeated ? 'text-gold-300' : 'text-penalty-200'}`}>
          {isDefeated ? 'BOUNTY CLAIMED · +1,000 XP' : `${remaining} DAMAGE REMAINING`}
        </p>
      </div>

      <div className="mt-6">
        <p className="label-caps mb-2 text-frost-500">Attack sources</p>
        <div className="grid grid-cols-2 gap-2">
          {attacks.map((attack) => (
            <div key={attack.label || attack.id} className="sys-inset flex min-w-0 items-center justify-between gap-2 px-3 py-2 text-xs">
              <span className="label-caps truncate text-frost-300">{attack.label}</span>
              <span className="shrink-0 font-mono font-bold text-penalty-200">+{attack.damage} DMG</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/boss"
        className="group mt-6 flex items-center justify-between border border-penalty-400/60 bg-penalty-500/10 px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.16em] text-penalty-100 transition-[background-color,box-shadow] hover:bg-penalty-500/20 hover:shadow-[0_0_18px_-4px_rgba(240,42,62,0.6)]"
      >
        View boss battle <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </SystemWindow>
  )
}

export default WeeklyBossCard
