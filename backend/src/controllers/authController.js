import jwt from 'jsonwebtoken'
import Boss from '../models/Boss.js'
import Notification from '../models/Notification.js'
import Quest from '../models/Quest.js'
import User from '../models/User.js'

function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'rankora_jwt_secret_key_2026_super_secure_telemetry'
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d'
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    secret,
    { expiresIn }
  )
}

export const DEFAULT_ROUTINE_QUESTS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
]

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A player with this email already exists.' })
    }

    const passwordHash = await User.hashPassword(password)
    const user = await User.create({
      name: name?.trim() || 'PLAYER',
      email: email.toLowerCase(),
      passwordHash,
      level: 1,
      xp: 0,
      rank: 'E',
      stats: { str: 0, vit: 0, int: 0, agi: 0, disc: 0 },
      currentStreak: 0,
      bestStreak: 0,
      onboardingCompleted: false,
    })

    // Seed the 7 Default Routine Quests in MongoDB for this User
    const todayKey = new Date().toISOString().slice(0, 10)
    const questsToInsert = DEFAULT_ROUTINE_QUESTS.map((q) => ({
      ...q,
      userId: user._id,
      dayKey: todayKey,
    }))
    await Quest.insertMany(questsToInsert)

    // Seed Active Weekly Boss with Full HP (0 damage taken)
    const currentWeekKey = `week-${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`
    await Boss.create({
      userId: user._id,
      weekKey: currentWeekKey,
      name: 'The Procrastinator',
      title: 'Lord of Tomorrow',
      description: 'A towering phantom that feeds on delayed intent and unfinished daily objectives.',
      maxHp: 500,
      currentHp: 500,
      status: 'ACTIVE',
      xpReward: 1000,
      rewardClaimed: false,
    })

    // Seed Welcome Notification in MongoDB
    await Notification.create({
      userId: user._id,
      type: 'system',
      eventKey: `welcome-${user._id}`,
      title: 'SYSTEM AWAKENING INITIATED',
      message: `Welcome to RANKORA, ${user.name}. Your 6 core daily routine missions are now initialized.`,
      tone: 'cyan',
      iconName: 'Sparkles',
      link: '/quests',
    })

    const token = generateToken(user)
    const userObj = user.toObject()
    delete userObj.passwordHash

    res.status(201).json({
      success: true,
      token,
      user: userObj,
    })
  } catch (error) {
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const token = generateToken(user)
    const userObj = user.toObject()
    delete userObj.passwordHash

    res.json({
      success: true,
      token,
      user: userObj,
    })
  } catch (error) {
    next(error)
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}
