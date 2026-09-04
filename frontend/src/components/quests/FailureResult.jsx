import { CheckCircle2 } from 'lucide-react'
import Card from '../common/Card.jsx'
function FailureResult({ quest }) { return <Card variant="standard" className="border-amber-300/25 bg-amber-400/[0.04]"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-amber-200" size={18} /><div><p className="label-caps text-amber-200/80">MISSION FAILURE RECORDED</p><p className="mt-2 text-sm leading-6 text-slate-400">Failure data has been stored for future analysis.</p><p className="mt-3 font-mono text-xs text-amber-200">{quest.failureReason} · DATA RECORDED</p></div></div></Card> }
export default FailureResult
