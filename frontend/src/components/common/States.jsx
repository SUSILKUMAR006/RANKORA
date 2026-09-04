import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react'
import { motion } from './motion.js'

export function EmptyState({ title = 'Nothing here yet', description = 'Your next chapter has not been recorded.' }) {
  return <div className="grid place-items-center rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center"><Inbox className="mb-4 text-slate-500" size={26} /><h3 className="font-display text-base font-semibold text-slate-200">{title}</h3><p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p></div>
}

export function LoadingState({ label = 'Loading system' }) {
  return <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-400"><LoaderCircle size={18} className="animate-spin text-cyan-300" />{label}</div>
}

export function ErrorState({ title = 'System interruption', description = 'Something prevented this module from loading.' }) {
  return <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="rounded-2xl border border-rose-300/20 bg-rose-400/5 px-6 py-8 text-center"><AlertTriangle className="mx-auto mb-3 text-rose-300" size={24} /><h3 className="font-display font-semibold text-rose-100">{title}</h3><p className="mt-2 text-sm text-rose-200/60">{description}</p></motion.div>
}
