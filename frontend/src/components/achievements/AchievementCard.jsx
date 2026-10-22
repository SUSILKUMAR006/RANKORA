import { motion } from 'framer-motion'
import { Calendar, Check, Lock, Sparkles, Trophy } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import { formatUnlockDate } from '../../utils/achievementUtils.js'

// Rarity chip tone (Badge tones).
const rarityTones = {
  Common: 'category',
  Rare: 'status',
  Epic: 'shadow',
  Legendary: 'difficulty',
}

// Achievement `color` → progress gauge tone while locked.
const colorMap = {
  cyan: { barTone: 'xp' },
  amber: { barTone: 'gold' },
  rose: { barTone: 'boss' },
  violet: { barTone: 'statistics' },
  emerald: { barTone: 'quest' },
}

// Unlocked titles glow Shadow-Monarch purple; Legendary ones glow gold.
const unlockedStyles = {
  shadow: {
    icon: 'border-shadow-400 bg-shadow-500/15 text-shadow-100 shadow-[0_0_18px_-2px_rgba(155,107,255,0.75),inset_0_0_10px_rgba(155,107,255,0.35)]',
    badge: 'shadow',
    title: 'text-frost-50',
  },
  gold: {
    icon: 'border-gold-400 bg-gold-500/15 text-gold-100 shadow-[0_0_18px_-2px_rgba(255,194,51,0.75),inset_0_0_10px_rgba(255,194,51,0.3)]',
    badge: 'difficulty',
    title: 'text-gold-50',
  },
}

function AchievementCard({ achievement }) {
  const {
    name,
    description,
    category,
    icon: Icon = Trophy,
    target,
    current = 0,
    unit = '',
    points = 50,
    rarity = 'Common',
    color = 'cyan',
    isUnlocked = false,
    unlockedAt,
    percentage = 0,
  } = achievement

  const formattedDate = formatUnlockDate(unlockedAt)
  const styling = colorMap[color] || colorMap.cyan
  const tone = rarity === 'Legendary' ? 'gold' : 'shadow'
  const unlocked = unlockedStyles[tone]

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        tone={isUnlocked ? tone : 'system'}
        className={`flex h-full flex-col justify-between transition-opacity duration-200 ${
          isUnlocked ? '' : 'opacity-50 hover:opacity-80'
        }`}
      >
        <div>
          {/* Card Top Header */}
          <div className="flex items-start justify-between gap-3">
            {/* Icon Container */}
            <div
              className={`relative grid h-12 w-12 shrink-0 place-items-center border transition-shadow duration-300 ${
                isUnlocked ? unlocked.icon : 'border-edge bg-void-950 text-frost-600'
              }`}
            >
              <Icon size={22} strokeWidth={isUnlocked ? 2.2 : 1.5} />
              {!isUnlocked && (
                <span className="absolute -bottom-1.5 -right-1.5 grid h-5 w-5 place-items-center border border-edge-strong bg-void-900 text-frost-500">
                  <Lock size={10} />
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Badge tone={rarityTones[rarity] || rarityTones.Common}>{rarity}</Badge>

              {isUnlocked ? (
                <Badge tone={unlocked.badge}>
                  <Check size={11} strokeWidth={3} /> Unlocked
                </Badge>
              ) : (
                <Badge tone="category">
                  <Lock size={10} /> Locked
                </Badge>
              )}
            </div>
          </div>

          {/* Title & Category */}
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="label-caps text-frost-500">{category}</p>
              <span className="font-mono text-xs font-bold text-gold-300">+{points} AP</span>
            </div>
            <h3
              className={`mt-1 font-display text-base font-bold uppercase tracking-[0.08em] ${
                isUnlocked ? `${unlocked.title} sys-glow` : 'text-frost-400'
              }`}
            >
              {name}
            </h3>
            <p className={`mt-1.5 text-sm leading-6 ${isUnlocked ? 'text-frost-300' : 'text-frost-500'}`}>
              {description}
            </p>
          </div>
        </div>

        {/* Card Footer: Progress or Unlock Date */}
        <div className="mt-6 border-t border-(--panel-edge,var(--color-edge)) pt-4">
          {isUnlocked ? (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-mono text-clear-300">
                <Sparkles size={13} className="text-clear-400" />
                Completed ({target} {unit})
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1 font-mono text-[0.68rem] text-frost-400">
                  <Calendar size={12} className="text-frost-500" />
                  {formattedDate}
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="label-caps text-frost-600">Progress</span>
                <span className="text-frost-300">
                  [{Math.min(target, current).toLocaleString()}/{target.toLocaleString()}]{' '}
                  <span className="text-[0.68rem] text-frost-500">{unit}</span>
                </span>
              </div>
              <ProgressBar value={percentage} max={100} tone={styling.barTone} size="sm" className="w-full" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default AchievementCard
