// Hunter rank insignia: a hexagon in the rank's colour with a glowing letter.
const rankStyles = {
  E: { ring: 'bg-frost-500', fill: 'bg-void-900', text: 'text-frost-300', glow: '' },
  D: { ring: 'bg-clear-400', fill: 'bg-clear-950', text: 'text-clear-200', glow: 'drop-shadow-[0_0_6px_rgba(52,217,156,0.55)]' },
  C: { ring: 'bg-system-400', fill: 'bg-system-950', text: 'text-system-200', glow: 'drop-shadow-[0_0_6px_rgba(74,174,255,0.6)]' },
  B: { ring: 'bg-shadow-400', fill: 'bg-shadow-950', text: 'text-shadow-200', glow: 'drop-shadow-[0_0_7px_rgba(155,107,255,0.6)]' },
  A: { ring: 'bg-ember-400', fill: 'bg-void-900', text: 'text-ember-300', glow: 'drop-shadow-[0_0_8px_rgba(255,138,61,0.6)]' },
  S: { ring: 'bg-gold-400', fill: 'bg-gold-950', text: 'text-gold-200', glow: 'drop-shadow-[0_0_10px_rgba(255,194,51,0.75)]' },
}

const sizes = {
  sm: 'h-8 w-7 text-sm',
  md: 'h-11 w-10 text-xl',
  lg: 'h-16 w-14 text-3xl',
  xl: 'h-24 w-[5.25rem] text-5xl',
}

const hex = '[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]'

function RankBadge({ rank = 'E', size = 'md' }) {
  const style = rankStyles[rank] || rankStyles.E
  return (
    <span title={`${rank}-Rank`} className={`relative inline-grid shrink-0 ${sizes[size] || sizes.md} ${style.glow}`}>
      <span className={`absolute inset-0 ${hex} ${style.ring}`} />
      <span className={`absolute inset-[1.5px] ${hex} ${style.fill}`} />
      <span className={`relative grid place-items-center font-display font-bold leading-none ${style.text} sys-glow`}>{rank}</span>
    </span>
  )
}

export default RankBadge
