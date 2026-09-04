import { motion } from './motion.js'

const variants = {
  standard: 'border-white/10 bg-rankora-900/80',
  glass: 'glass-panel',
  highlighted: 'glass-panel glow-border',
  interactive: 'glass-panel transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:shadow-[0_0_30px_rgba(103,232,249,0.1)]',
}

function Card({ children, variant = 'standard', className = '', as = 'div', ...props }) {
  const Component = variant === 'interactive' ? motion[as] || motion.div : as
  const motionProps = variant === 'interactive' ? { whileHover: { y: -3 }, ...props } : props
  return <Component className={`min-w-0 rounded-2xl border p-5 ${variants[variant]} ${className}`} {...motionProps}>{children}</Component>
}

export default Card
