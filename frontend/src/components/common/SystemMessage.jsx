import { motion } from './motion.js'

const tones = {
  system: { panel: '', box: 'border-system-400 text-system-200', eyebrow: 'text-system-300' },
  penalty: { panel: 'tone-penalty', box: 'border-penalty-400 text-penalty-200', eyebrow: 'text-penalty-300' },
  shadow: { panel: 'tone-shadow', box: 'border-shadow-400 text-shadow-200', eyebrow: 'text-shadow-300' },
  gold: { panel: 'tone-gold', box: 'border-gold-400 text-gold-200', eyebrow: 'text-gold-300' },
}

// The "[!] NOTIFICATION" box from the System.
function SystemMessage({ title = 'Daily quest updated', message = 'Your next objective awaits.', eyebrow = 'Notification', tone = 'system' }) {
  const style = tones[tone] || tones.system
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.4 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`sys-panel origin-top px-5 py-4 ${style.panel}`}
    >
      <div className="flex items-start gap-4">
        <span className={`grid h-8 w-8 shrink-0 place-items-center border font-display text-lg font-bold ${style.box}`}>!</span>
        <div className="min-w-0">
          <p className={`label-caps ${style.eyebrow}`}>{eyebrow}</p>
          <h3 className="sys-title mt-1 text-sm sm:text-base">{title}</h3>
          <p className="mt-1.5 text-sm text-frost-300">{message}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default SystemMessage
