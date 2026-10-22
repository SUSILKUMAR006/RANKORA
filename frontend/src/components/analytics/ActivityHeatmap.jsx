import { useState } from 'react'
import { Activity } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'

const levelColors = {
  0: 'border-edge/50 bg-void-900',
  1: 'border-system-800 bg-system-950',
  2: 'border-system-700 bg-system-800',
  3: 'border-system-500 bg-system-600 shadow-[0_0_8px_rgba(30,144,255,0.35)]',
  4: 'border-system-200 bg-system-400 shadow-[0_0_14px_rgba(74,174,255,0.85)]',
}

function ActivityHeatmap({ data = [] }) {
  const [hovered, setHovered] = useState(null)

  return (
    <SystemWindow title="Daily Activity Heatmap" icon={<Activity size={13} />} bodyClassName="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-sm text-frost-400">Discipline matrix: quests cleared on each recorded day.</p>

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5 font-mono text-[0.68rem] uppercase text-frost-500">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={`h-3 w-3 border ${levelColors[level]}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="sys-inset overflow-x-auto p-3">
        <div className="inline-flex min-w-full flex-col gap-1.5">
          <div className="grid grid-flow-col grid-rows-7 gap-1 sm:gap-1.5">
            {data.map((item) => (
              <div
                key={item.date}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
                className={`relative h-6 w-6 cursor-pointer border transition-[transform,border-color] duration-150 hover:z-20 hover:scale-115 hover:border-frost-50 sm:h-7 sm:w-7 ${
                  levelColors[item.level] || levelColors[0]
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hover Information Readout */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-edge/60 pt-3 font-mono text-xs">
        {hovered ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-system-200">
            <span className="font-display font-bold uppercase tracking-widest text-frost-50">
              {hovered.formattedDate} ({hovered.dayOfWeek}):
            </span>
            <span>{hovered.completed} Quests Executed</span>
            <span className="font-bold text-gold-300">+{hovered.xp} XP</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[0.68rem] text-frost-500">
            <Activity size={12} className="shrink-0 text-system-400" />
            <span>Hover over any cell to inspect daily quest records</span>
          </div>
        )}
        <span className="label-caps text-frost-400">
          [<span className="font-mono text-system-300">{data.filter((d) => d.completed > 0).length}</span>] Active Days
        </span>
      </div>
    </SystemWindow>
  )
}

export default ActivityHeatmap
