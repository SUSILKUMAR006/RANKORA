import { motion } from 'framer-motion'

function ToggleSwitch({ checked, onChange, label, description, disabled = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0 flex-1">
        <label className="font-display text-sm font-medium text-white cursor-pointer select-none">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-rankora-950 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked
            ? 'border-cyan-300/50 bg-cyan-400 shadow-[0_0_12px_rgba(103,232,249,0.3)]'
            : 'border-white/10 bg-white/[0.08]'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`inline-block h-4 w-4 rounded-full transition-colors ${
            checked ? 'bg-rankora-950 translate-x-5.5' : 'bg-slate-400 translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export default ToggleSwitch
