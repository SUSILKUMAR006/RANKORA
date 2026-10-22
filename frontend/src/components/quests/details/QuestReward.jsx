import { Award, Gift, Zap } from 'lucide-react'
import SystemWindow from '../../common/SystemWindow.jsx'

function QuestReward({ quest }) {
  return (
    <SystemWindow title="Reward" tone="gold" icon={<Gift size={13} />}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sys-inset flex items-center gap-3 px-4 py-3">
          <Zap className="shrink-0 text-gold-400 drop-shadow-[0_0_6px_rgba(255,194,51,0.7)]" size={22} />
          <div className="min-w-0">
            <p className="label-caps text-frost-500">Experience</p>
            <p className="font-mono text-2xl font-bold text-gold-300 sys-glow">+{quest.xp} EXP</p>
          </div>
        </div>
        <div className="sys-inset flex items-center gap-3 px-4 py-3">
          <Award className="shrink-0 text-shadow-300" size={20} />
          <div className="min-w-0">
            <p className="label-caps text-frost-500">Stat reward</p>
            <p className="font-mono text-lg font-bold text-shadow-200">{quest.statReward}</p>
          </div>
        </div>
      </div>
    </SystemWindow>
  )
}
export default QuestReward
