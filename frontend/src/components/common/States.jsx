import { AlertTriangle, LoaderCircle, ScanLine } from 'lucide-react'
import { motion } from './motion.js'

export function EmptyState({ title = 'No records found', description = 'Your next chapter has not been recorded.' }) {
  return (
    <div className="sys-inset grid place-items-center border-dashed px-6 py-12 text-center">
      <ScanLine className="mb-3 text-system-400/60" size={24} />
      <h3 className="font-display text-base font-bold uppercase tracking-[0.14em] text-frost-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-frost-500">{description}</p>
    </div>
  )
}

export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <LoaderCircle size={16} className="animate-spin text-system-400" />
      <span className="label-caps animate-sys-pulse text-frost-400">{label}…</span>
    </div>
  )
}

export function ErrorState({ title = 'System error', description = 'Something prevented this module from loading.' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="sys-panel tone-penalty px-6 py-8 text-center"
    >
      <AlertTriangle className="mx-auto mb-3 text-penalty-400" size={22} />
      <h3 className="sys-title text-base [text-shadow:0_0_14px_rgba(255,77,94,0.6)]">{title}</h3>
      <p className="mt-2 text-sm text-penalty-200/80">{description}</p>
    </motion.div>
  )
}
