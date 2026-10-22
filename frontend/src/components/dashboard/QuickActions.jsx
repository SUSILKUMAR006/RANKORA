import { motion } from 'framer-motion'
import { ChevronRight, Sparkles, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'
import SystemWindow from '../common/SystemWindow.jsx'

function QuickActions({ actions = [] }) {
  return (
    <SystemWindow title="Quick Actions" icon={<Terminal size={14} />}>
      <p className="label-caps mb-3 text-frost-500">Shortcuts</p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {actions.map(({ label, detail, icon, path }, index) => {
          const Icon = icon || Sparkles
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * index }}
              whileHover={{ y: -2 }}
            >
              <Link
                to={path}
                className="group relative flex h-full min-h-32 flex-col justify-between border border-edge bg-void-950/60 p-3.5 transition-[border-color,background-color,box-shadow] duration-150 hover:border-system-400 hover:bg-system-500/10 hover:shadow-[0_0_16px_-4px_rgba(30,144,255,0.6),inset_0_0_12px_rgba(30,144,255,0.15)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-8 w-8 place-items-center border border-system-400/50 bg-system-500/10 text-system-200 transition-shadow group-hover:shadow-[0_0_10px_rgba(74,174,255,0.6)]">
                    <Icon size={16} />
                  </span>
                  <span className="font-mono text-[0.6rem] text-frost-600">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="mt-4 min-w-0">
                  <p className="font-display text-sm font-bold uppercase leading-tight tracking-widest text-frost-50 group-hover:text-system-100">
                    {label}
                  </p>
                  <p className="mt-1 text-xs leading-4 text-frost-500">{detail}</p>
                </div>
                <ChevronRight
                  size={14}
                  className="absolute bottom-3 right-3 text-frost-600 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-system-300"
                />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </SystemWindow>
  )
}

export default QuickActions
