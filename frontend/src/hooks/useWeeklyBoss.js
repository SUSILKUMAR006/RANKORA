import { useCallback, useEffect, useState } from 'react'
import {
  applyQuestDamageToBoss,
  getStoredWeeklyBoss,
  saveWeeklyBoss,
} from '../utils/bossUtils.js'
import { bossService } from '../services/bossService.js'

export function useWeeklyBoss() {
  const [data, setData] = useState(() => getStoredWeeklyBoss())
  const [victoryModalOpen, setVictoryModalOpen] = useState(false)
  const [justDefeatedBoss, setJustDefeatedBoss] = useState(null)

  const refreshBoss = useCallback(async () => {
    try {
      const boss = await bossService.getCurrentBoss()
      const history = await bossService.getBossHistory()
      if (boss) {
        setData({ currentBoss: boss, history: history || [] })
      }
    } catch {
      setData(getStoredWeeklyBoss())
    }
  }, [])

  useEffect(() => {
    refreshBoss()
    const handleStorage = (e) => {
      if (e.key === 'rankora_weekly_boss' || e.key === 'rankora_mock_quests') {
        refreshBoss()
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [refreshBoss])

  const strikeBossWithQuest = useCallback(async (quest) => {
    const result = await bossService.attackBoss(quest)
    await refreshBoss()
    if (result.justDefeated) {
      setJustDefeatedBoss(result.boss)
      setVictoryModalOpen(true)
    }
    return result
  }, [refreshBoss])

  const boss = data.currentBoss || {}
  const maxHp = boss?.maxHp || 500
  const currentHp = boss?.currentHp !== undefined ? boss.currentHp : maxHp
  const hpPercentage = Math.round((currentHp / maxHp) * 100)
  const damageDealt = Math.max(0, maxHp - currentHp)
  const damagePercentage = Math.round((damageDealt / maxHp) * 100)
  const isDefeated = boss?.status === 'DEFEATED' || currentHp <= 0

  return {
    boss,
    history: data.history || [],
    maxHp,
    currentHp,
    hpPercentage,
    damageDealt,
    damagePercentage,
    isDefeated,
    victoryModalOpen,
    setVictoryModalOpen,
    justDefeatedBoss,
    strikeBossWithQuest,
    refreshBoss,
  }
}
