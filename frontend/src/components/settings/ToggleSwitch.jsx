import { motion } from 'framer-motion'

// System toggle: square track and square knob. Off = dark void slot,
// on = charged system-blue slot with a glowing knob.
function ToggleSwitch({ checked, onChange, label, description, disabled = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0 flex-1">
        <label className="cursor-pointer select-none font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50">
          {label}
        </label>
        {description && <p className="mt-1 text-xs leading-5 text-frost-400">{description}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-xs border transition-[background-color,border-color,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
          checked
            ? 'border-system-400 bg-system-500/40 shadow-[0_0_14px_-2px_rgba(30,144,255,0.7),inset_0_0_8px_rgba(30,144,255,0.35)]'
            : 'border-edge bg-void-800 hover:border-edge-strong'
        }`}
      >
        <motion.span
          initial={false}
          animate={{ x: checked ? 23 : 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={`inline-block h-4 w-4 transition-colors ${
            checked ? 'bg-frost-50 shadow-[0_0_10px_rgba(74,174,255,0.95)]' : 'bg-frost-500'
          }`}
        />
      </button>
    </div>
  )
}

export default ToggleSwitch
