import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../common/Card.jsx'

function QuickActions({ actions }) {
  return <section><div className="mb-5"><p className="label-caps text-cyan-300/70">Shortcuts</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">QUICK ACTIONS</h2></div><div className="grid grid-cols-2 gap-3">{actions.map(({ label, detail, icon: Icon, path }) => <motion.div key={label} whileHover={{ y: -3 }}><Link to={path}><Card variant="glass" className="h-full p-4 transition hover:border-cyan-300/30"><Icon size={19} className="text-cyan-200" /><p className="mt-4 text-sm font-semibold text-white">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p><ChevronRight size={14} className="mt-4 text-slate-600" /></Card></Link></motion.div>)}</div></section>
}
export default QuickActions
