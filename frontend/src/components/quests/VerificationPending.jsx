import { Clock3 } from 'lucide-react'
import Card from '../common/Card.jsx'

function VerificationPending() {
  return (
    <Card variant="standard" tone="gold">
      <div className="flex gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-gold-400/60 bg-gold-500/10 text-gold-300">
          <Clock3 size={18} />
        </span>
        <div className="min-w-0">
          <p className="label-caps flex items-center gap-2 text-gold-300">
            <span className="h-1.5 w-1.5 rotate-45 animate-sys-pulse bg-gold-400 shadow-[0_0_8px_rgba(255,194,51,0.9)]" />
            Verifying
          </p>
          <h3 className="mt-1 font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">Verification pending</h3>
          <p className="mt-1.5 text-sm leading-6 text-frost-300">Evidence submitted. Awaiting System verification.</p>
        </div>
      </div>
    </Card>
  )
}

export default VerificationPending
