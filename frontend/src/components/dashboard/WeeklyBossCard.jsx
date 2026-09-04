import { CheckCircle2, ChevronRight, Skull } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
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
    <Card variant="standard" className="relative overflow-hidden border-rose-300/20 bg-linear-to-br from-rose-950/30 to-rankora-900">
      <div className="pointer-events-none absolute -right-12 top-8 h-44 w-44 rounded-full bg-rose-400/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="label-caps text-rose-200/70">WEEKLY BOSS</p>
              {isDefeated && (
                <span className="rounded bg-emerald-400/20 px-1.5 py-0.2 font-mono text-[0.6rem] font-bold text-emerald-300 uppercase">
                  Defeated
                </span>
              )}
            </div>
            <h2 className="mt-2 font-display text-xl font-semibold text-white">{current.name || 'THE PROCRASTINATOR'}</h2>
          </div>
          <div className={`grid h-14 w-14 place-items-center rounded-2xl border sm:shrink-0 ${isDefeated ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-rose-300/25 bg-rose-400/10 text-rose-200'}`}>
            {isDefeated ? <CheckCircle2 size={27} /> : <Skull size={27} />}
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between font-mono text-xs">
            <span className="text-slate-500">BOSS HP</span>
            <span className={isDefeated ? 'text-emerald-300' : 'text-rose-200'}>{hp} / {maxHp}</span>
          </div>
          <ProgressBar value={hp} max={maxHp} tone="boss" />
          <p className="mt-2 font-mono text-xs text-rose-200">
            {isDefeated ? 'BOUNTY CLAIMED · +1,000 XP' : `${remaining} DAMAGE REMAINING`}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          {attacks.map((attack) => (
            <div key={attack.label || attack.id} className="flex items-center justify-between rounded-lg bg-black/15 px-3 py-2 text-xs">
              <span className="text-slate-400">{attack.label}</span>
              <span className="font-mono text-rose-200">+{attack.damage} DMG</span>
            </div>
          ))}
        </div>
        <Link to="/boss" className="mt-6 flex items-center justify-between rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100 transition hover:bg-rose-400/20">
          VIEW BOSS BATTLE <ChevronRight size={16} />
        </Link>
      </div>
    </Card>
  )
}

export default WeeklyBossCard
