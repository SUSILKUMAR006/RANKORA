import Card from '../common/Card.jsx'

function WeeklyOverview({ weekly = [], streak = 0 }) {
  const safeWeekly = Array.isArray(weekly) && weekly.length > 0 ? weekly : [
    { day: 'MON', value: 'empty' },
    { day: 'TUE', value: 'empty' },
    { day: 'WED', value: 'empty' },
    { day: 'THU', value: 'empty' },
    { day: 'FRI', value: 'empty' },
    { day: 'SAT', value: 'empty' },
    { day: 'SUN', value: 'empty' },
  ]
  const safeStreak = streak ?? 0

  return (
    <Card variant="glass">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-cyan-300/70">Progression rhythm</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-white">THIS WEEK</h2>
        </div>
        <span className="font-mono text-xs text-cyan-200">ACTIVE TELEMETRY</span>
      </div>
      <div className="mt-6 grid grid-cols-7 gap-2">
        {safeWeekly.map(({ day, value }) => (
          <div key={day} className="text-center">
            <p className="font-mono text-[0.62rem] text-slate-600">{day}</p>
            <div
              className={`mx-auto mt-3 grid aspect-square w-full max-w-10 place-items-center rounded-lg border text-xs ${
                value === 'done'
                  ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
                  : value === '75%'
                  ? 'border-cyan-300/40 bg-cyan-400/10 text-cyan-200'
                  : 'border-white/10 bg-white/[0.03] text-slate-600'
              }`}
            >
              {value === 'done' ? '✓' : value === 'empty' ? '—' : value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
        <div>
          <p className="label-caps text-slate-600">Discipline</p>
          <p className="mt-1 font-mono text-sm text-white">RHYTHM</p>
        </div>
        <div>
          <p className="label-caps text-slate-600">Streak</p>
          <p className="mt-1 font-mono text-sm text-white">{safeStreak} days</p>
        </div>
        <div>
          <p className="label-caps text-slate-600">Status</p>
          <p className="mt-1 font-mono text-sm text-cyan-300">ONLINE</p>
        </div>
      </div>
    </Card>
  )
}
export default WeeklyOverview
