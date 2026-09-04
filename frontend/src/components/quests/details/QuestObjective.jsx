import { Target } from 'lucide-react'
import Card from '../../common/Card.jsx'
function QuestObjective({ quest }) { return <Card variant="glass"><div className="flex items-start gap-3"><Target className="mt-0.5 text-cyan-200" size={19} /><div><p className="label-caps text-cyan-300/70">OBJECTIVE</p><p className="mt-3 font-display text-lg text-white">{quest.objective}</p>{quest.target && <p className="mt-3 font-mono text-xs text-cyan-200">TARGET: {quest.target} {quest.unit.toUpperCase()}</p>}</div></div></Card> }
export default QuestObjective
