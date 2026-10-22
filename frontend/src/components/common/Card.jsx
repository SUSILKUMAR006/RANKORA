import { motion } from './motion.js'

// Every Card is a System window: corner brackets, thin frame, cold glow.
// `tone` recolours the frame: system (default) | penalty | shadow | gold | clear.
const variants = {
  standard: 'sys-panel',
  glass: 'sys-panel',
  highlighted: 'sys-panel [--panel-edge:var(--color-system-600)] [--panel-glow:rgba(30,144,255,0.28)]',
  interactive: 'sys-panel transition-[border-color,box-shadow] duration-200 hover:[--panel-edge:var(--color-edge-strong)] hover:[--panel-glow:rgba(30,144,255,0.3)]',
  inset: 'sys-inset',
}

const tones = {
  system: '',
  penalty: 'tone-penalty',
  shadow: 'tone-shadow',
  gold: 'tone-gold',
  clear: 'tone-clear',
}

function Card({ children, variant = 'standard', tone = 'system', className = '', as = 'div', ...props }) {
  const Component = variant === 'interactive' ? motion[as] || motion.div : as
  return (
    <Component
      className={`min-w-0 p-5 ${variants[variant] || variants.standard} ${tones[tone] || ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
