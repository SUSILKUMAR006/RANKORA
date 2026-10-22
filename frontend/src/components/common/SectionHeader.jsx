import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Top-of-page header: "SYSTEM ▸ MODULE" eyebrow, large glowing caps title,
// optional description and actions, then a fading system rule.
export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <motion.header
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0 max-w-3xl">
          {eyebrow && (
            <p className="label-caps flex items-center gap-2 text-system-300">
              <span className="h-1.5 w-1.5 rotate-45 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" />
              {eyebrow}
            </p>
          )}
          <h1 className="sys-title mt-2 text-3xl leading-none sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 text-sm leading-6 text-frost-400 sm:text-base">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      <hr className="sys-rule mt-6" />
    </motion.header>
  )
}

// Section header inside a page: ◆ TITLE ───────── [link]
function SectionHeader({ eyebrow, title, description, linkTo, linkLabel = 'View all', actions, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rotate-45 border border-system-400 bg-system-500/40" />
          <h2 className="font-display text-lg font-bold uppercase tracking-[0.14em] text-frost-50">{title}</h2>
          {eyebrow && <span className="label-caps hidden text-frost-500 sm:inline">/ {eyebrow}</span>}
        </div>
        <span className="hidden h-px min-w-8 flex-1 bg-linear-to-r from-edge-strong to-transparent sm:block" />
        {actions}
        {linkTo && (
          <Link
            to={linkTo}
            className="group label-caps ml-auto inline-flex items-center gap-1 text-system-300 transition-colors hover:text-frost-50 sm:ml-0"
          >
            {linkLabel}
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {description && <p className="mt-1.5 pl-4.5 text-sm text-frost-500">{description}</p>}
    </div>
  )
}

export default SectionHeader
