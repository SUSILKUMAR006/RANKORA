import { useState } from 'react'
import { Activity, Flame, Sparkles } from 'lucide-react'
import Card from '../common/Card.jsx'

const levelColors = {
  0: 'bg-white/[0.04] border-white/5',
  1: 'bg-cyan-950 border-cyan-800/40 text-cyan-200',
  2: 'bg-cyan-700/60 border-cyan-600/50 text-cyan-100 shadow-[0_0_8px_rgba(103,232,249,0.15)]',
  3: 'bg-cyan-500/80 border-cyan-400/60 text-rankora-950 shadow-[0_0_12px_rgba(103,232,249,0.25)]',
  4: 'bg-cyan-300 border-cyan-200 text-rankora-950 shadow-[0_0_16px_rgba(103,232,249,0.4)]',
}

function ActivityHeatmap({ data = [] }) {
  const [hovered, setHovered] = useState(null)

  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <p className="label-caps text-cyan-300/80">DISCIPLINE MATRIX</p>
          <h2 className="mt-1 font-display text-base font-semibold text-white">
            DAILY ACTIVITY HEATMAP
          </h2>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5 font-mono text-[0.68rem] text-slate-500">
          <span>Less</span>
          <span className="h-3 w-3 rounded-xs border border-white/5 bg-white/[0.04]" />
          <span className="h-3 w-3 rounded-xs border border-cyan-800/40 bg-cyan-950" />
          <span className="h-3 w-3 rounded-xs border border-cyan-600/50 bg-cyan-700/60" />
          <span className="h-3 w-3 rounded-xs border border-cyan-400/60 bg-cyan-500/80" />
          <span className="h-3 w-3 rounded-xs border border-cyan-200 bg-cyan-300" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex min-w-full flex-col gap-1.5">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 sm:gap-2">
            {data.map((item) => (
              <div
                key={item.date}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
                className={`relative h-6 w-6 sm:h-7 sm:w-7 rounded-md border transition-all duration-150 cursor-pointer hover:scale-115 hover:z-20 ${
                  levelColors[item.level] || levelColors[0]
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hover Information Pill */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 font-mono text-xs">
        {hovered ? (
          <div className="flex items-center gap-3 text-cyan-200">
            <span className="font-semibold text-white">
              {hovered.formattedDate} ({hovered.dayOfWeek}):
            </span>
            <span>{hovered.completed} Quests Executed</span>
            <span className="text-amber-300">+{hovered.xp} XP</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500 text-[0.68rem]">
            <Activity size={12} className="text-cyan-300" />
            <span>Hover over any cell to inspect daily quest records</span>
          </div>
        )}
        <span className="text-[0.68rem] text-slate-500">
          {data.filter((d) => d.completed > 0).length} Active Days
        </span>
      </div>
    </Card>
  )
}

export default ActivityHeatmap
