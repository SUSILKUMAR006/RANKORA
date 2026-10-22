import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }
// Each tone sets its accent/edge and a stronger pop-up glow in the same colour.
const tones = {
  system: '[--panel-glow:rgba(30,144,255,0.35)]',
  penalty: 'tone-penalty [--panel-glow:rgba(240,42,62,0.35)]',
  shadow: 'tone-shadow [--panel-glow:rgba(127,69,245,0.38)]',
  gold: 'tone-gold [--panel-glow:rgba(255,194,51,0.3)]',
  clear: 'tone-clear [--panel-glow:rgba(52,217,156,0.3)]',
}

// System pop-up. Opens the way System windows do in Solo Leveling:
// a thin line of light that unfolds vertically into the window.
function Modal({ open, onClose, title, eyebrow = 'System', children, footer, size = 'md', tone = 'system' }) {
  const handleClose = typeof onClose === 'function' ? onClose : undefined

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-void-950/80 p-4 backdrop-blur-[3px]"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className={`sys-panel max-h-[calc(100vh-2rem)] w-full ${sizes[size] || sizes.md} overflow-y-auto ${tones[tone] || tones.system}`}
            initial={{ scaleY: 0.02, scaleX: 0.6, opacity: 0 }}
            animate={{ scaleY: 1, scaleX: 1, opacity: 1, transition: { scaleX: { duration: 0.16 }, scaleY: { delay: 0.12, duration: 0.26, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.1 } } }}
            exit={{ scaleY: 0.02, opacity: 0, transition: { duration: 0.16 } }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="relative border-b border-(--panel-edge,var(--color-edge)) px-6 py-4 text-center">
              <p className="label-caps text-(--panel-accent,var(--color-system-400))">{eyebrow}</p>
              <h2 className="sys-title mt-1 text-lg sm:text-xl">{title}</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={handleClose}
                className="absolute right-3 top-3 border border-transparent p-1.5 text-frost-500 transition-colors hover:border-edge hover:text-frost-50"
              >
                <X size={16} />
              </button>
            </header>
            <div className="px-6 py-5 text-sm leading-6 text-frost-200">{children}</div>
            {footer && (
              <div className="flex flex-wrap justify-end gap-3 border-t border-(--panel-edge,var(--color-edge)) px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
