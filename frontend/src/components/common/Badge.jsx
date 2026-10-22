const tones = {
  rank: 'border-shadow-400/50 bg-shadow-500/10 text-shadow-200',
  difficulty: 'border-gold-400/50 bg-gold-500/10 text-gold-200',
  status: 'border-system-400/60 bg-system-500/10 text-system-200',
  category: 'border-edge-strong bg-void-850 text-frost-300',
  success: 'border-clear-400/50 bg-clear-500/10 text-clear-200',
  danger: 'border-penalty-400/60 bg-penalty-500/10 text-penalty-200',
  shadow: 'border-shadow-400/50 bg-shadow-500/10 text-shadow-200',
}

function Badge({ children, tone = 'category', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 font-display text-[0.7rem] font-bold uppercase leading-4 tracking-[0.14em] ${tones[tone] || tones.category} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
