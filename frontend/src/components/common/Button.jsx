import { LoaderCircle } from 'lucide-react'

const variants = {
  primary:
    'border border-system-400 bg-system-500/20 text-frost-50 shadow-[0_0_18px_-4px_rgba(30,144,255,0.6),inset_0_0_12px_rgba(30,144,255,0.25)] hover:bg-system-500/35 hover:shadow-[0_0_24px_-2px_rgba(30,144,255,0.75),inset_0_0_14px_rgba(30,144,255,0.35)]',
  secondary: 'border border-edge-strong bg-void-850/80 text-frost-200 hover:border-system-400 hover:text-frost-50',
  ghost: 'border border-transparent text-frost-400 hover:border-edge hover:bg-void-850 hover:text-frost-50',
  danger:
    'border border-penalty-400/70 bg-penalty-500/15 text-penalty-200 hover:bg-penalty-500/25 hover:shadow-[0_0_18px_-4px_rgba(240,42,62,0.6)]',
  gold:
    'border border-gold-400 bg-gold-500/15 text-gold-100 shadow-[0_0_18px_-4px_rgba(255,194,51,0.55),inset_0_0_12px_rgba(255,194,51,0.2)] hover:bg-gold-500/25 hover:shadow-[0_0_24px_-2px_rgba(255,194,51,0.7),inset_0_0_14px_rgba(255,194,51,0.3)]',
  success:
    'border border-clear-400/60 bg-clear-500/15 text-clear-200 hover:bg-clear-500/25 hover:shadow-[0_0_18px_-4px_rgba(52,217,156,0.5)]',
}

function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xs px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.14em] transition-[background-color,border-color,box-shadow,color] duration-150 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${variants[variant] || variants.primary} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

export default Button
