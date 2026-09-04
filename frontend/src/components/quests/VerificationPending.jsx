import { Clock3 } from 'lucide-react'
import Card from '../common/Card.jsx'
function VerificationPending() { return <Card variant="standard" className="border-amber-300/25 bg-amber-400/[0.04]"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-300/10 text-amber-200"><Clock3 size={18} /></span><div><p className="label-caps text-amber-200/80">VERIFICATION PENDING</p><p className="mt-2 text-sm leading-6 text-slate-400">Evidence submitted. Awaiting system verification.</p></div></div></Card> }
export default VerificationPending
