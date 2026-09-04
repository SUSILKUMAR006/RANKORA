import { LoaderCircle } from 'lucide-react'

const variants = {
  primary: 'bg-rankora-cyan text-rankora-950 shadow-[0_0_22px_rgba(103,232,249,0.18)] hover:bg-cyan-200',
  secondary: 'border border-white/15 bg-white/[0.06] text-slate-100 hover:border-cyan-300/40 hover:bg-white/10',
  ghost: 'text-slate-400 hover:bg-white/[0.06] hover:text-white',
  danger: 'border border-rose-300/25 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20',
  success: 'border border-emerald-300/25 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20',
}

function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  return (
    <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

export default Button
