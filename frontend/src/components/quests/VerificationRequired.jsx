import { Camera, ChevronRight } from 'lucide-react'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'

function VerificationRequired({ type, onProceed, feedback }) {
  return (
    <Card variant="standard" tone="gold">
      <div className="flex gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-gold-400/60 bg-gold-500/10 text-gold-300">
          <Camera size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="label-caps flex items-center gap-2 text-gold-300">
            <span className="h-1.5 w-1.5 rotate-45 animate-sys-pulse bg-gold-400 shadow-[0_0_8px_rgba(255,194,51,0.9)]" />
            Verification required
          </p>
          <p className="mt-2 text-sm leading-6 text-frost-300">This mission requires verification before rewards can be issued.</p>
          <p className="mt-3 font-mono text-xs text-gold-200">[ {type.toUpperCase()} ]</p>
          <Button variant="secondary" className="mt-4 w-full sm:w-auto" onClick={onProceed}>
            {feedback ? 'VERIFICATION MODULE NOT INITIALIZED' : 'PROCEED TO VERIFICATION'}
            {!feedback && <ChevronRight size={15} />}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default VerificationRequired
