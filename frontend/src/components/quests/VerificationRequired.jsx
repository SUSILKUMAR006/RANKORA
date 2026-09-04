import { Camera, ChevronRight } from 'lucide-react'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'

function VerificationRequired({ type, onProceed, feedback }) {
  return <Card variant="standard" className="border-amber-300/20 bg-amber-400/[0.04]"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-300/10 text-amber-200"><Camera size={18} /></span><div className="flex-1"><p className="label-caps text-amber-200/80">VERIFICATION REQUIRED</p><p className="mt-2 text-sm leading-6 text-slate-400">This mission requires verification before rewards can be issued.</p><p className="mt-3 font-mono text-xs text-amber-200">{type.toUpperCase()}</p><Button variant="secondary" className="mt-4" onClick={onProceed}>{feedback ? 'VERIFICATION MODULE NOT INITIALIZED' : 'PROCEED TO VERIFICATION'}{!feedback && <ChevronRight size={15} />}</Button></div></div></Card>
}
export default VerificationRequired
