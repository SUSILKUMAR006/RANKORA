import { Activity, Brain, Check, Flame, HeartPulse, Shield, Skull, Sparkles, Swords, Trophy } from 'lucide-react'
import { useState } from 'react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Modal from '../components/common/Modal.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import QuestCard from '../components/quests/QuestCard.jsx'
import SectionHeader, { PageHeader } from '../components/common/SectionHeader.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/common/States.jsx'
import SystemWindow from '../components/common/SystemWindow.jsx'
import StatCard from '../components/player/StatCard.jsx'
import XPDisplay from '../components/player/XPDisplay.jsx'
import RankBadge from '../components/player/RankBadge.jsx'
import SystemMessage from '../components/common/SystemMessage.jsx'
import { palette } from '../theme/palette.js'

const ranks = ['E', 'D', 'C', 'B', 'A', 'S']
const rankSizes = ['sm', 'md', 'lg', 'xl']

const windowTones = [
  { tone: 'system', title: 'Status', icon: Sparkles, note: 'Default UI, EXP, active state, primary actions.' },
  { tone: 'penalty', title: 'Penalty Zone', icon: Skull, note: 'Failure, boss HP, warnings, destructive actions.' },
  { tone: 'shadow', title: 'Shadow Extraction', icon: Trophy, note: 'Achievements, rare and special, profile.' },
  { tone: 'gold', title: 'Reward', icon: Sparkles, note: 'Rewards, EXP gains, S-rank, victory.' },
  { tone: 'clear', title: 'Quest Cleared', icon: Check, note: 'Completed and cleared objectives.' },
]

const cardVariants = [
  { variant: 'standard', note: 'Default untitled window.' },
  { variant: 'highlighted', note: 'Stronger frame and glow for the focal module.' },
  { variant: 'interactive', note: 'Hover brightens the frame. For clickable windows.' },
  { variant: 'inset', note: 'Nested block inside a window (sys-inset).' },
]

const progressTones = [
  { tone: 'xp', label: 'EXP', value: 72 },
  { tone: 'quest', label: 'Quest progress', value: 58 },
  { tone: 'boss', label: 'Boss HP', value: 42 },
  { tone: 'statistics', label: 'Statistics', value: 64 },
  { tone: 'gold', label: 'Reward', value: 86 },
]

const messageTones = [
  { tone: 'system', eyebrow: 'Notification', title: 'Daily quest updated', message: 'Your next objective awaits.' },
  { tone: 'penalty', eyebrow: 'Warning', title: 'Penalty quest issued', message: 'Failure to complete the daily quest will result in a penalty.' },
  { tone: 'shadow', eyebrow: 'Achievement', title: 'Shadow extracted', message: 'A new honor has been added to your codex.' },
  { tone: 'gold', eyebrow: 'Reward', title: 'Level up', message: '+40 EXP. Your stats have increased.' },
]

const typeScale = [
  { name: 'Page title', classes: 'sys-title text-3xl sm:text-4xl', sample: 'System Settings' },
  { name: 'Window title', classes: 'sys-title text-sm sm:text-base', sample: '[ Quest Info ]' },
  { name: 'Item title', classes: 'font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50', sample: 'Push-ups 100 reps' },
  { name: 'Hero number', classes: 'font-display text-5xl font-bold text-frost-50 sys-glow', sample: '17' },
  { name: 'Stat number', classes: 'font-display text-2xl font-bold text-frost-50', sample: '42' },
  { name: 'Label', classes: 'label-caps text-frost-500', sample: 'Strength' },
  { name: 'Body', classes: 'text-sm leading-6 text-frost-300', sample: 'Turn daily actions into quests and climb from E-Rank to S.' },
  { name: 'Inline number', classes: 'font-mono text-sm text-gold-300', sample: '+40 EXP  [3/7]' },
]

// Literal class names so Tailwind generates every swatch.
const colorGroups = [
  { name: 'void', role: 'Surfaces', swatches: [['bg-void-950', '950', palette.void950], ['bg-void-900', '900', palette.void900], ['bg-void-850', '850', palette.void850], ['bg-void-800', '800', palette.void800], ['bg-void-700', '700', palette.void700], ['bg-void-600', '600']] },
  { name: 'edge', role: 'Frames', swatches: [['bg-edge', 'edge', palette.edge], ['bg-edge-strong', 'strong', palette.edgeStrong]] },
  { name: 'frost', role: 'Text', swatches: [['bg-frost-50', '50', palette.frost50], ['bg-frost-200', '200', palette.frost200], ['bg-frost-300', '300'], ['bg-frost-400', '400', palette.frost400], ['bg-frost-500', '500', palette.frost500], ['bg-frost-600', '600', palette.frost600], ['bg-frost-700', '700']] },
  { name: 'system', role: 'Primary / EXP', swatches: [['bg-system-100', '100'], ['bg-system-200', '200'], ['bg-system-300', '300', palette.systemSoft], ['bg-system-400', '400', palette.system], ['bg-system-500', '500', palette.systemDeep], ['bg-system-600', '600'], ['bg-system-700', '700'], ['bg-system-800', '800'], ['bg-system-900', '900']] },
  { name: 'shadow', role: 'Achievement / rare', swatches: [['bg-shadow-200', '200'], ['bg-shadow-300', '300'], ['bg-shadow-400', '400', palette.shadow], ['bg-shadow-500', '500'], ['bg-shadow-600', '600'], ['bg-shadow-800', '800'], ['bg-shadow-950', '950']] },
  { name: 'penalty', role: 'Failure / boss', swatches: [['bg-penalty-200', '200'], ['bg-penalty-300', '300'], ['bg-penalty-400', '400', palette.penalty], ['bg-penalty-500', '500'], ['bg-penalty-600', '600'], ['bg-penalty-800', '800'], ['bg-penalty-950', '950']] },
  { name: 'clear', role: 'Completed', swatches: [['bg-clear-200', '200'], ['bg-clear-300', '300'], ['bg-clear-400', '400', palette.clear], ['bg-clear-500', '500'], ['bg-clear-600', '600'], ['bg-clear-800', '800'], ['bg-clear-950', '950']] },
  { name: 'gold', role: 'Reward / S-rank', swatches: [['bg-gold-200', '200'], ['bg-gold-300', '300'], ['bg-gold-400', '400', palette.gold], ['bg-gold-500', '500'], ['bg-gold-600', '600'], ['bg-gold-800', '800'], ['bg-gold-950', '950']] },
  { name: 'ember', role: 'Streak / A-rank', swatches: [['bg-ember-300', '300'], ['bg-ember-400', '400', palette.ember], ['bg-ember-500', '500']] },
]

function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-12 pb-12">
      <PageHeader
        eyebrow="Rankora / visual language"
        title="Design System"
        description="The System from Solo Leveling, as a reusable foundation for progression, quests, and personal momentum."
      />

      {/* Foundations */}
      <section>
        <SectionHeader title="Signals and hierarchy" eyebrow="Foundations" />
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <XPDisplay current={720} required={1000} level={12} />
            <SystemMessage title="DAILY QUEST UPDATED" message="Your next objective awaits." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Brain} name="Focus" value="84" change="+12%" progress={84} />
            <StatCard icon={HeartPulse} name="Vitality" value="67" progress={67} tone="quest" />
            <StatCard icon={Flame} name="Streak" value="14 days" change="Active" tone="xp" />
            <StatCard icon={Shield} name="Discipline" value="72" progress={72} tone="statistics" />
          </div>
        </div>
      </section>

      {/* System windows */}
      <section>
        <SectionHeader title="System windows" eyebrow="SystemWindow tones" description="Colour means something: every tone maps to one kind of message." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {windowTones.map(({ tone, title, icon: Icon, note }) => (
            <SystemWindow key={tone} title={title} tone={tone} icon={<Icon size={13} />} actions={<span className="label-caps text-frost-600">{tone}</span>}>
              <p className="text-sm leading-6 text-frost-300">{note}</p>
              <p className="mt-3 font-mono text-xs text-frost-500">tone=&quot;{tone}&quot;</p>
            </SystemWindow>
          ))}
          <SystemWindow title="Quest Info" align="center" icon={<Swords size={13} />}>
            <p className="text-center text-sm leading-6 text-frost-300">Centred title bar, as used by the Status window.</p>
            <p className="mt-3 text-center font-mono text-xs text-frost-500">align=&quot;center&quot;</p>
          </SystemWindow>
        </div>
      </section>

      {/* Card variants */}
      <section>
        <SectionHeader title="Card variants" eyebrow="Untitled windows" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cardVariants.map(({ variant, note }) => (
            <Card key={variant} variant={variant}>
              <p className="font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">{variant}</p>
              <p className="mt-2 text-sm leading-6 text-frost-400">{note}</p>
            </Card>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['penalty', 'shadow', 'gold', 'clear'].map((tone) => (
            <Card key={tone} tone={tone}>
              <p className="label-caps text-frost-500">Card tone</p>
              <p className="mt-1 font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">{tone}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Actions and status */}
      <section>
        <SectionHeader title="Actions and status" eyebrow="Components" />
        <SystemWindow title="Controls" icon={<Activity size={13} />} bodyClassName="space-y-7">
          <div>
            <p className="label-caps mb-3 text-frost-500">Buttons</p>
            <div className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost action</Button>
              <Button variant="success">
                <Check size={15} /> Success
              </Button>
              <Button variant="danger">Danger</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <div>
            <p className="label-caps mb-3 text-frost-500">Badges</p>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="category">Mind</Badge>
              <Badge tone="status">In progress</Badge>
              <Badge tone="success">Complete</Badge>
              <Badge tone="danger">Failed</Badge>
              <Badge tone="difficulty">Elite</Badge>
              <Badge tone="rank">Rank</Badge>
              <Badge tone="shadow">Shadow</Badge>
            </div>
          </div>

          <div>
            <p className="label-caps mb-3 text-frost-500">Gauges</p>
            <div className="grid gap-5 md:grid-cols-2">
              <ProgressBar value={72} max={100} label="XP progression" showValue tone="xp" />
              <ProgressBar value={42} max={100} label="Boss HP" showValue tone="boss" />
              {progressTones.map(({ tone, label, value }) => (
                <ProgressBar key={tone} value={value} max={100} label={`${label} · ${tone}`} showValue tone={tone} />
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {['sm', 'md', 'lg'].map((size) => (
                <ProgressBar key={size} value={64} max={100} label={`Size ${size}`} size={size} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-edge/60 pt-5">
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <span className="text-sm text-frost-500">System pop-up that unfolds from a line of light.</span>
          </div>
        </SystemWindow>
      </section>

      {/* Hunter ranks */}
      <section>
        <SectionHeader title="Hunter rank insignia" eyebrow="RankBadge E–S" />
        <SystemWindow title="Hunter Ranks" icon={<Shield size={13} />} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <div className="grid min-w-120 grid-cols-[4rem_repeat(6,minmax(0,1fr))]">
              <div className="contents">
                <span className="label-caps px-4 py-3 text-frost-600">Size</span>
                {ranks.map((rank) => (
                  <span key={rank} className="label-caps px-2 py-3 text-center text-frost-500">
                    {rank}-Rank
                  </span>
                ))}
              </div>
              {rankSizes.map((size) => (
                <div key={size} className="contents">
                  <span className="flex items-center border-t border-edge/50 px-4 py-4 font-mono text-xs text-frost-500">{size}</span>
                  {ranks.map((rank) => (
                    <span key={rank} className="grid place-items-center border-t border-edge/50 px-2 py-4">
                      <RankBadge rank={rank} size={size} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </SystemWindow>
      </section>

      {/* System messages */}
      <section>
        <SectionHeader title="System messages" eyebrow="[!] Notification tones" />
        <div className="grid gap-4 md:grid-cols-2">
          {messageTones.map((message) => (
            <SystemMessage key={message.tone} {...message} />
          ))}
        </div>
      </section>

      {/* Type */}
      <section>
        <SectionHeader title="Type scale" eyebrow="Rajdhani · Inter · JetBrains Mono" />
        <SystemWindow title="Typography" bodyClassName="p-0">
          <div className="divide-y divide-edge/60">
            {typeScale.map(({ name, classes, sample }) => (
              <div key={name} className="grid gap-2 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6">
                <div>
                  <p className="label-caps text-frost-400">{name}</p>
                  <p className="mt-1 break-all font-mono text-[0.62rem] leading-4 text-frost-600">{classes}</p>
                </div>
                <p className={`min-w-0 wrap-break-word ${classes}`}>{sample}</p>
              </div>
            ))}
          </div>
        </SystemWindow>
      </section>

      {/* Colour tokens */}
      <section>
        <SectionHeader title="Colour tokens" eyebrow="index.css @theme" description="Use only these. Raw hex values live in theme/palette.js for charts and inline styles." />
        <div className="grid gap-4 lg:grid-cols-2">
          {colorGroups.map((group) => (
            <div key={group.name} className="sys-inset p-4">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <p className="font-display text-base font-bold uppercase tracking-[0.12em] text-frost-50">{group.name}</p>
                <p className="label-caps text-frost-500">{group.role}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.swatches.map(([className, step, hex]) => (
                  <div key={className} className="w-14">
                    <div className={`h-10 border border-edge-strong ${className}`} />
                    <p className="mt-1 font-mono text-[0.62rem] text-frost-300">{step}</p>
                    {hex && <p className="font-mono text-[0.55rem] text-frost-600">{hex}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Composition */}
      <section>
        <SectionHeader title="Quest surface" eyebrow="Composition" />
        <div className="grid gap-4 lg:grid-cols-2">
          <QuestCard icon={Swords} title="Move through resistance" description="Complete a focused 25-minute session and record the result." difficulty="Rare" xp={120} />
          <QuestCard icon={Activity} title="Close the loop" description="Review one open thread and decide its next action." status="completed" xp={80} />
        </div>
      </section>

      {/* States */}
      <section>
        <SectionHeader title="Module states" eyebrow="Loading · Empty · Error" />
        <div className="grid gap-4 md:grid-cols-3">
          <Card variant="standard">
            <LoadingState />
          </Card>
          <EmptyState title="No achievements yet" description="Milestones will appear here as you progress." />
          <ErrorState />
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Inspect component"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Continue</Button>
          </>
        }
      >
        <p>This modal demonstrates the shared backdrop, entrance animation, header, content, and footer treatment.</p>
        <div className="mt-4 flex items-center gap-2 font-mono text-xs text-system-200">
          <Sparkles size={14} /> No product action is connected.
        </div>
      </Modal>
    </div>
  )
}

export default DesignSystemPage
