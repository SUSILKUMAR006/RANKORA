import { ChevronRight, Swords } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../common/Card.jsx'
import { getQuestIcon } from '../../../data/mockQuests.js'

function RelatedQuests({ quests = [] }) {
  return (
    <section>
      <p className="label-caps text-cyan-300/70">RELATED OBJECTIVES</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {quests.map((quest) => {
          const Icon = getQuestIcon(quest) || Swords
          return (
            <Link key={quest.id} to={`/quests/${quest.id}`}>
              <Card variant="interactive" className="flex items-center gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-cyan-200">
                  <Icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-xs text-white">{quest.title}</span>
                  <span className="mt-1 block text-xs text-slate-600">+{quest.xp} XP · {quest.difficulty}</span>
                </span>
                <ChevronRight size={15} className="text-slate-600" />
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default RelatedQuests

