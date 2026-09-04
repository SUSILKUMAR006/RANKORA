import { useCallback, useEffect, useState } from 'react'
import { evaluateAchievements } from '../utils/achievementUtils.js'

export function useAchievements() {
  const [data, setData] = useState(() => evaluateAchievements())
  const [modalQueue, setModalQueue] = useState([])
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'unlocked' | 'locked'
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const refresh = useCallback((shouldTriggerModal = true) => {
    const result = evaluateAchievements()
    setData(result)
    if (shouldTriggerModal && result.newlyUnlocked.length > 0) {
      setModalQueue((prev) => [...prev, ...result.newlyUnlocked])
    }
    return result
  }, [])

  useEffect(() => {
    // Check on mount and detect any new unlocks
    const result = evaluateAchievements()
    setData(result)
    if (result.newlyUnlocked.length > 0) {
      setModalQueue(result.newlyUnlocked)
    }

    // Listen for storage events across tabs or components
    const handleStorage = (e) => {
      if (
        e.key === 'rankora_player' ||
        e.key === 'rankora_mock_quests' ||
        e.key === 'rankora_achievements' ||
        e.key === 'rankora_boss'
      ) {
        refresh(false)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [refresh])

  const dismissModal = useCallback(() => {
    setModalQueue((prev) => prev.slice(1))
  }, [])

  const currentModalAchievement = modalQueue[0] || null

  const filteredAchievements = data.achievements.filter((item) => {
    // Status filter
    if (activeFilter === 'unlocked' && !item.isUnlocked) return false
    if (activeFilter === 'locked' && item.isUnlocked) return false

    // Category filter
    if (activeCategory !== 'All' && item.category !== activeCategory) return false

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    }

    return true
  })

  const categories = ['All', ...new Set(data.achievements.map((a) => a.category))]

  return {
    achievements: filteredAchievements,
    allAchievements: data.achievements,
    unlockedCount: data.unlockedCount,
    totalCount: data.totalCount,
    completionPercentage: data.completionPercentage,
    totalPoints: data.totalPoints,
    maxPoints: data.maxPoints,
    activeFilter,
    setActiveFilter,
    activeCategory,
    setActiveCategory,
    categories,
    searchQuery,
    setSearchQuery,
    currentModalAchievement,
    dismissModal,
    hasModalOpen: Boolean(currentModalAchievement),
    refresh,
  }
}
