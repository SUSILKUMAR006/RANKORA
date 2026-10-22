import { motion } from 'framer-motion'
import { ChevronRight, Network, Swords } from 'lucide-react'
import { Link } from 'react-router-dom'
import SystemWindow from '../../common/SystemWindow.jsx'
import { getQuestIcon } from '../../../data/mockQuests.js'

function RelatedQuests({ quests = [] }) {
  return (
    <SystemWindow title="Related Objectives" icon={<Network size={13} />} bodyClassName="p-0">
      <div className="divide-y divide-edge/60">
        {quests.map((quest, index) => {
          const Icon = getQuestIcon(quest) || Swords
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Link
                to={`/quests/${quest.id}`}
                className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-system-500/5"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center border border-edge-strong bg-void-950 text-system-300">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50 transition-colors group-hover:text-system-200">
                    {quest.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs text-frost-500">
                    <span className="text-gold-300">+{quest.xp} EXP</span> · {quest.difficulty}
                  </span>
                </span>
                <ChevronRight size={15} className="shrink-0 text-frost-600 transition-transform group-hover:translate-x-0.5 group-hover:text-system-300" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </SystemWindow>
  )
}

export default RelatedQuests
