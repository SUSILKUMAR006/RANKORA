import { Activity, Brain, Check, Flame, HeartPulse, Shield, Sparkles, Swords } from 'lucide-react'
import { useState } from 'react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Modal from '../components/common/Modal.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import QuestCard from '../components/quests/QuestCard.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/common/States.jsx'
import StatCard from '../components/player/StatCard.jsx'
import XPDisplay from '../components/player/XPDisplay.jsx'
import RankBadge from '../components/player/RankBadge.jsx'
import SystemMessage from '../components/common/SystemMessage.jsx'

function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return <div className="space-y-12 pb-12">
    <header className="max-w-3xl"><p className="label-caps text-cyan-300/70">RANKORA / visual language</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">Design system</h1><p className="mt-4 text-base leading-7 text-slate-400">A reusable foundation for progression, quests, and personal momentum.</p></header>

    <section className="space-y-5"><div><p className="label-caps text-slate-500">Foundations</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">Signals and hierarchy</h2></div><div className="grid gap-4 md:grid-cols-2"><XPDisplay current={720} required={1000} level={12} /><SystemMessage title="DAILY QUEST UPDATED" message="Your next objective awaits." /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatCard icon={Brain} name="Focus" value="84" change="+12%" progress={84} /><StatCard icon={HeartPulse} name="Vitality" value="67" progress={67} tone="quest" /><StatCard icon={Flame} name="Streak" value="14 days" change="Active" tone="xp" /><StatCard icon={Shield} name="Discipline" value="72" progress={72} tone="statistics" /></div></section>

    <section className="space-y-5"><div><p className="label-caps text-slate-500">Components</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">Actions and status</h2></div><Card variant="glass" className="space-y-6"><div className="flex flex-wrap gap-3"><Button>Primary action</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost action</Button><Button variant="success"><Check size={15} /> Success</Button><Button variant="danger">Danger</Button></div><div className="flex flex-wrap items-center gap-3"><RankBadge rank="S" size="lg" /><RankBadge rank="A" /><Badge tone="difficulty">Elite</Badge><Badge tone="status">In progress</Badge><Badge tone="category">Mind</Badge><Badge tone="success">Complete</Badge></div><div className="grid gap-5 md:grid-cols-2"><ProgressBar value={72} max={100} label="XP progression" showValue tone="xp" /><ProgressBar value={42} max={100} label="Boss HP" showValue tone="boss" /></div><Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button></Card></section>

    <section className="space-y-5"><div><p className="label-caps text-slate-500">Composition</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">Quest surface</h2></div><div className="grid gap-4 lg:grid-cols-2"><QuestCard icon={Swords} title="Move through resistance" description="Complete a focused 25-minute session and record the result." difficulty="Rare" xp={120} /><QuestCard icon={Activity} title="Close the loop" description="Review one open thread and decide its next action." status="completed" xp={80} /></div></section>

    <section className="grid gap-4 md:grid-cols-3"><Card variant="standard"><LoadingState /></Card><EmptyState title="No achievements yet" description="Milestones will appear here as you progress." /><ErrorState /></section>

    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Inspect component" footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Continue</Button></>}><p>This modal demonstrates the shared backdrop, entrance animation, header, content, and footer treatment.</p><div className="mt-4 flex items-center gap-2 font-mono text-xs text-cyan-200"><Sparkles size={14} /> No product action is connected.</div></Modal>
  </div>
}

export default DesignSystemPage
