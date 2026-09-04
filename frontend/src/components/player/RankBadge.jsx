import Badge from '../common/Badge.jsx'

const rankStyles = { E: 'border-slate-400/30 bg-slate-400/10 text-slate-200', D: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200', C: 'border-cyan-300/30 bg-cyan-400/10 text-cyan-200', B: 'border-blue-300/30 bg-blue-400/10 text-blue-200', A: 'border-violet-300/30 bg-violet-400/10 text-violet-200', S: 'border-amber-300/40 bg-amber-400/10 text-amber-200' }

function RankBadge({ rank = 'E', size = 'md' }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-11 w-11 text-base', lg: 'h-16 w-16 text-2xl' }
  return <Badge tone="rank" className={`justify-center rounded-xl border font-mono font-medium ${rankStyles[rank] || rankStyles.E} ${sizes[size] || sizes.md}`}>{rank}</Badge>
}

export default RankBadge
