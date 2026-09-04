import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

function Modal({ open, onClose, title, eyebrow = 'RANKORA SYSTEM', children, footer }) {
  return <AnimatePresence>
    {open && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-rankora-950/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="glass-panel max-h-[calc(100vh-2.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl p-6" initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.22 }} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="label-caps text-cyan-300/70">{eyebrow}</p><h2 className="mt-2 font-display text-xl font-semibold text-white">{title}</h2></div><button type="button" aria-label="Close modal" onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-white/10 hover:text-white"><X size={18} /></button></div>
        <div className="mt-6 text-sm leading-6 text-slate-300">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">{footer}</div>}
      </motion.div>
    </motion.div>}
  </AnimatePresence>
}

export default Modal
