import { Award, Zap } from 'lucide-react'
import Card from '../../common/Card.jsx'
function QuestReward({ quest }) { return <Card variant="highlighted" className="relative overflow-hidden"><div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-amber-300/10 blur-2xl" /><div className="relative"><p className="label-caps text-amber-200/70">QUEST REWARD</p><div className="mt-4 flex items-center gap-3"><Zap className="text-amber-200" size={22} /><span className="font-mono text-3xl text-white">+{quest.xp} XP</span></div><div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-slate-400"><Award size={16} className="text-violet-200" />STAT REWARD: <span className="text-violet-200">{quest.statReward}</span></div></div></Card> }
export default QuestReward
