import { Camera, ShieldCheck } from 'lucide-react'
import SystemWindow from '../../common/SystemWindow.jsx'

function VerificationRequirement({ required }) {
  return (
    <SystemWindow
      title="Verification"
      tone={required ? 'gold' : 'clear'}
      icon={required ? <Camera size={13} /> : <ShieldCheck size={13} />}
    >
      <div className="flex gap-4">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center border ${
            required ? 'border-gold-400/60 bg-gold-500/10 text-gold-300' : 'border-clear-400/60 bg-clear-500/10 text-clear-300'
          }`}
        >
          {required ? <Camera size={18} /> : <ShieldCheck size={18} />}
        </span>
        <div className="min-w-0">
          <p className={`label-caps ${required ? 'text-gold-300' : 'text-clear-300'}`}>
            {required ? 'Verification required' : 'No verification required'}
          </p>
          <p className="mt-2 text-sm leading-6 text-frost-300">
            {required
              ? 'This quest requires photo evidence before it can be completed.'
              : 'This objective can be completed without additional evidence.'}
          </p>
          {required && <p className="mt-3 font-mono text-xs text-gold-200">[ PHOTO REQUIRED ]</p>}
        </div>
      </div>
    </SystemWindow>
  )
}
export default VerificationRequirement
