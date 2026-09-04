const tones = {
  rank: 'border-violet-300/25 bg-violet-400/10 text-violet-200',
  difficulty: 'border-amber-300/25 bg-amber-400/10 text-amber-200',
  status: 'border-cyan-300/25 bg-cyan-400/10 text-cyan-200',
  category: 'border-white/15 bg-white/[0.06] text-slate-300',
  success: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200',
  danger: 'border-rose-300/25 bg-rose-400/10 text-rose-200',
}

function Badge({ children, tone = 'category', className = '' }) {
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] ${tones[tone]} ${className}`}>{children}</span>
}

export default Badge
