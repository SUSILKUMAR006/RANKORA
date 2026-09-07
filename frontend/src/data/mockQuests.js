import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Droplets,
  Dumbbell,
  Flame,
  HeartPulse,
  Moon,
  Scale,
  Sun,
  Swords,
} from 'lucide-react'

export const questIconMap = {
  'wakeup-530': Sun,
  'drink-3l-water': Droplets,
  'no-junk-food': HeartPulse,
  'gym-workout': Dumbbell,
  'read-book-daily': BookOpen,
  'no-fap': Flame,
  'sleep-before-11pm': Moon,
}

export const categoryIconMap = {
  Fitness: Dumbbell,
  Habit: Flame,
  Knowledge: BookOpen,
  Health: HeartPulse,
  Mind: Brain,
  Career: BriefcaseBusiness,
  Discipline: Scale,
}

export function getQuestIcon(quest) {
  if (!quest) return Swords
  if (quest.icon && typeof quest.icon === 'function') return quest.icon
  if (quest.id && questIconMap[quest.id]) return questIconMap[quest.id]
  if (quest.category && categoryIconMap[quest.category]) return categoryIconMap[quest.category]
  return Swords
}

export const defaultRoutineQuests = [
  {
    id: 'wakeup-530',
    questKey: 'wakeup-530',
    title: 'WAKE UP AT 5:30 AM',
    shortDescription: 'Rise early at 05:30 AM without snooze to seize morning discipline.',
    description: 'Awaken promptly at 05:30 AM to establish unbroken morning momentum before the day begins.',
    objective: 'Wake up and get out of bed by 05:30 AM.',
    category: 'Mind',
    difficulty: 'Normal',
    xp: 25,
    statReward: '+1 DISC',
    type: 'Mandatory',
    verification: 'None',
    estimatedTime: '05:30 AM',
    status: 'pending',
    progress: 0,
    target: null,
    unit: '',
    icon: Sun,
    history: [],
  },
  {
    id: 'drink-3l-water',
    questKey: 'drink-3l-water',
    title: 'DRINK 3L WATER',
    shortDescription: 'Maintain peak cellular and neural hydration throughout the day.',
    description: 'Consume a minimum of 3 full liters of clean water distributed across the day.',
    objective: 'Drink 3000ml of water before bedtime.',
    category: 'Health',
    difficulty: 'Easy',
    xp: 15,
    statReward: '+1 VIT',
    type: 'Mandatory',
    verification: 'None',
    estimatedTime: 'All Day',
    status: 'pending',
    progress: 0,
    target: 3,
    unit: 'Liters',
    icon: Droplets,
    history: [],
  },
  {
    id: 'no-junk-food',
    questKey: 'no-junk-food',
    title: 'NO JUNK FOOD',
    shortDescription: 'Eliminate ultra-processed foods, refined sugar, and fast food.',
    description: 'Fuel the mind and physique with whole, nutritious foods. Strictly zero junk food or sugary snacks.',
    objective: 'Complete the entire 24h cycle with clean nutrition.',
    category: 'Health',
    difficulty: 'Normal',
    xp: 30,
    statReward: '+1 DISC',
    type: 'Mandatory',
    verification: 'None',
    estimatedTime: 'All Day',
    status: 'pending',
    progress: 0,
    target: null,
    unit: '',
    icon: HeartPulse,
    history: [],
  },
  {
    id: 'gym-workout',
    questKey: 'gym-workout',
    title: 'GYM WORKOUT',
    shortDescription: 'Execute a dedicated strength and physical training workout.',
    description: 'Complete a focused 45-60 minute resistance training or workout session with progressive overload.',
    objective: 'Execute full workout session (Sunday is designated rest day).',
    category: 'Fitness',
    difficulty: 'Hard',
    xp: 50,
    statReward: '+2 STR',
    type: 'Mandatory',
    verification: 'Photo Required',
    estimatedTime: '45-60 Mins',
    status: 'pending',
    progress: 0,
    target: null,
    unit: '',
    icon: Dumbbell,
    history: [],
  },
  {
    id: 'read-book-daily',
    questKey: 'read-book-daily',
    title: 'READ BOOK DAILY',
    shortDescription: 'Read at least 10 pages of a book for daily mental expansion.',
    description: 'Dedicate focused, uninterrupted time to expand knowledge, wisdom, and focus by reading a minimum of 10 pages daily.',
    objective: 'Read 10+ pages of a book.',
    category: 'Knowledge',
    difficulty: 'Normal',
    xp: 25,
    statReward: '+1 INT',
    type: 'Mandatory',
    verification: 'None',
    estimatedTime: '20-30 Mins',
    status: 'pending',
    progress: 0,
    target: 10,
    unit: 'Pages',
    icon: BookOpen,
    history: [],
  },
  {
    id: 'no-fap',
    questKey: 'no-fap',
    title: 'NO FAP (SELF-MASTERY)',
    shortDescription: 'Practice strict self-control, protect vital energy, and build mental clarity.',
    description: 'Preserve vital physical and mental energy through unbroken discipline and self-mastery.',
    objective: 'Maintain 100% self-control throughout the 24-hour cycle.',
    category: 'Mind',
    difficulty: 'Hard',
    xp: 40,
    statReward: '+2 DISC',
    type: 'Mandatory',
    verification: 'None',
    estimatedTime: 'All Day',
    status: 'pending',
    progress: 0,
    target: null,
    unit: '',
    icon: Flame,
    history: [],
  },
  {
    id: 'sleep-before-11pm',
    questKey: 'sleep-before-11pm',
    title: 'SLEEP BEFORE 11:00 PM',
    shortDescription: 'Protect restorative sleep by getting in bed before 23:00.',
    description: 'Power down devices and be in bed before 11:00 PM to ensure optimal neural recovery for the 5:30 AM wake up.',
    objective: 'Be asleep or resting by 23:00.',
    category: 'Health',
    difficulty: 'Normal',
    xp: 25,
    statReward: '+1 VIT',
    type: 'Mandatory',
    verification: 'None',
    estimatedTime: 'By 11:00 PM',
    status: 'pending',
    progress: 0,
    target: null,
    unit: '',
    icon: Moon,
    history: [],
  },
]

export const mockQuests = defaultRoutineQuests

export function getQuestById(id) {
  if (!id) return null
  const targetId = String(id).trim()
  try {
    const raw = localStorage.getItem('rankora_mock_quests')
    const quests = raw ? JSON.parse(raw) : defaultRoutineQuests
    if (Array.isArray(quests)) {
      const match = quests.find(
        (quest) =>
          (quest.id && quest.id === targetId) ||
          (quest._id && quest._id === targetId) ||
          (quest.questKey && quest.questKey === targetId)
      )
      if (match) {
        return { ...match, icon: getQuestIcon(match) }
      }
    }
    const defaultMatch =
      defaultRoutineQuests.find(
        (q) => q.id === targetId || q.questKey === targetId
      ) || null
    return defaultMatch ? { ...defaultMatch, icon: getQuestIcon(defaultMatch) } : null
  } catch {
    const defaultMatch =
      defaultRoutineQuests.find(
        (q) => q.id === targetId || q.questKey === targetId
      ) || null
    return defaultMatch ? { ...defaultMatch, icon: getQuestIcon(defaultMatch) } : null
  }
}

