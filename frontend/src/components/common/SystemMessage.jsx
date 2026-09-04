import { Terminal } from 'lucide-react'
import Card from './Card.jsx'
import { motion } from './motion.js'

function SystemMessage({ title = 'DAILY QUEST UPDATED', message = 'Your next objective awaits.', eyebrow = 'RANKORA SYSTEM' }) {
  return <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><Card variant="highlighted" className="relative overflow-hidden"><div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-300/10 blur-2xl" /><div className="relative flex gap-3"><Terminal className="mt-0.5 shrink-0 text-cyan-300" size={18} /><div><p className="label-caps text-cyan-300/70">{eyebrow}</p><h3 className="mt-2 font-mono text-sm font-medium tracking-wide text-white">{title}</h3><p className="mt-2 text-sm text-slate-400">{message}</p></div></div></Card></motion.div>
}

export default SystemMessage
