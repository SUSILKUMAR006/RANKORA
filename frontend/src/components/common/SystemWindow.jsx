import { motion } from 'framer-motion'

const toneClass = {
  system: '',
  penalty: 'tone-penalty',
  shadow: 'tone-shadow',
  gold: 'tone-gold',
  clear: 'tone-clear',
}

const iconTone = {
  system: 'border-system-400 text-system-200',
  penalty: 'border-penalty-400 text-penalty-200',
  shadow: 'border-shadow-400 text-shadow-200',
  gold: 'border-gold-400 text-gold-200',
  clear: 'border-clear-400 text-clear-200',
}

/**
 * The signature Solo Leveling window: a framed panel with a centred
 * bracketed title bar — "[ QUEST INFO ]" — and an optional icon box.
 *
 *   <SystemWindow title="Status" icon={<Sparkles size={14} />} actions={...}>…</SystemWindow>
 */
function SystemWindow({ title, icon, actions, tone = 'system', align = 'left', className = '', bodyClassName = '', children }) {
  return (
    <motion.section
      initial={{ opacity: 0, scaleY: 0.92 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`sys-panel min-w-0 origin-top ${toneClass[tone] || ''} ${className}`}
    >
      {title && (
        <header
          className={`flex items-center gap-3 border-b border-(--panel-edge,var(--color-edge)) px-5 py-3 ${
            align === 'center' ? 'justify-center text-center' : 'justify-between'
          }`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            {icon && (
              <span className={`grid h-6 w-6 shrink-0 place-items-center border ${iconTone[tone] || iconTone.system}`}>
                {icon}
              </span>
            )}
            <h2 className="sys-title truncate text-sm sm:text-base">
              <span className="text-(--panel-accent,var(--color-system-400))">[</span> {title}{' '}
              <span className="text-(--panel-accent,var(--color-system-400))">]</span>
            </h2>
          </div>
          {actions && align !== 'center' && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </motion.section>
  )
}

export default SystemWindow
