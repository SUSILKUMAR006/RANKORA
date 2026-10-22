import { motion } from 'framer-motion'
import { AlertTriangle, Terminal } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Modal from '../components/common/Modal.jsx'
import { ErrorState } from '../components/common/States.jsx'
import SystemMessage from '../components/common/SystemMessage.jsx'
import CompleteQuestModal from '../components/quests/CompleteQuestModal.jsx'
import FailureHistory from '../components/quests/FailureHistory.jsx'
import FailureResult from '../components/quests/FailureResult.jsx'
import QuestCompletionSuccess from '../components/quests/QuestCompletionSuccess.jsx'
import QuestFailureModal from '../components/quests/QuestFailureModal.jsx'
import QuestVerificationModal from '../components/quests/QuestVerificationModal.jsx'
import VerificationPending from '../components/quests/VerificationPending.jsx'
import XPRewardAnimation from '../components/quests/XPRewardAnimation.jsx'
import FailureSummary from '../components/quests/details/FailureSummary.jsx'
import QuestDetailsHeader from '../components/quests/details/QuestDetailsHeader.jsx'
import QuestHistory from '../components/quests/details/QuestHistory.jsx'
import QuestInformation from '../components/quests/details/QuestInformation.jsx'
import QuestMissionBrief from '../components/quests/details/QuestMissionBrief.jsx'
import QuestObjective from '../components/quests/details/QuestObjective.jsx'
import QuestProgress from '../components/quests/details/QuestProgress.jsx'
import QuestReward from '../components/quests/details/QuestReward.jsx'
import RelatedQuests from '../components/quests/details/RelatedQuests.jsx'
import VerificationRequirement from '../components/quests/details/VerificationRequirement.jsx'
import { mockQuests } from '../data/mockQuests.js'
import { useQuestCompletion } from '../hooks/useQuestCompletion.js'
import { useQuestVerification } from '../hooks/useQuestVerification.js'
import { questService } from '../services/questService.js'

function QuestDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { quest, refresh } = useQuestCompletion(id)
  const { submit: submitVerification } = useQuestVerification(id)
  const [actionState, setActionState] = useState('idle')
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [failureOpen, setFailureOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [failureProcessing, setFailureProcessing] = useState(false)
  const [rewardVisible, setRewardVisible] = useState(false)
  const [levelUp, setLevelUp] = useState(null)
  const [failureRecorded, setFailureRecorded] = useState(false)
  const [syncError, setSyncError] = useState('')

  if (!quest)
    return (
      <div className="mx-auto max-w-xl py-16">
        <ErrorState
          title="QUEST NOT FOUND"
          description="The requested objective does not exist."
        />
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="secondary" onClick={() => navigate('/quests')}>
            Return to quests
          </Button>
        </div>
      </div>
    )

  const isGym =
    quest.id === 'gym-workout' || quest.title?.toLowerCase().includes('gym')
  const requiresVerification =
    isGym || (quest.verification && String(quest.verification).toLowerCase() !== 'none')

  const related = mockQuests
    .filter((item) => item.id !== quest.id && item.category === quest.category)
    .slice(0, 3)

  const handleAction = () => {
    if (
      quest.status === 'completed' ||
      quest.status === 'failed' ||
      quest.status === 'pending_verification'
    )
      return
    if (requiresVerification) setVerificationOpen(true)
    else setConfirmationOpen(true)
  }

  const confirmCompletion = () => {
    setProcessing(true)
    setSyncError('')
    window.setTimeout(async () => {
      try {
        const result = await questService.completeQuest(quest.id || quest._id)
        setProcessing(false)
        setConfirmationOpen(false)
        if (result.alreadyCompleted || result.requiresVerification) return
        setRewardVisible(true)
        window.setTimeout(() => setRewardVisible(false), 1200)
        if (result.leveledUp)
          setLevelUp({
            previousLevel: result.previousLevel,
            newLevel: result.newLevel,
            gainedXp: result.gainedXp,
            statReward: result.reward,
          })
      } catch (error) {
        setProcessing(false)
        setConfirmationOpen(false)
        setActionState('error')
        setSyncError(error?.message || 'Failed to save quest completion.')
      }
    }, 300)
  }

  const confirmFailure = (payload) => {
    setFailureProcessing(true)
    setSyncError('')
    window.setTimeout(async () => {
      try {
        await questService.failQuest(quest.id || quest._id, payload)
        setFailureProcessing(false)
        refresh()
        setFailureRecorded(true)
      } catch (error) {
        setFailureProcessing(false)
        setActionState('error')
        setSyncError(error?.message || 'Failed to save quest failure.')
      }
    }, 300)
  }

  const handleVerificationSubmitted = async (payload) => {
    setSyncError('')
    try {
      const result = await questService.verifyQuest(quest.id || quest._id, payload)
      if (result && !result.error) {
        setRewardVisible(true)
        window.setTimeout(() => setRewardVisible(false), 1200)
        if (result.leveledUp) {
          setLevelUp({
            previousLevel: result.previousLevel,
            newLevel: result.newLevel,
            gainedXp: result.gainedXp,
            statReward: result.reward,
          })
        }
      }
    } catch (error) {
      setActionState('error')
      setSyncError(error?.message || 'Failed to save quest completion.')
    }
    refresh()
  }

  return (
    <div className="space-y-6 pb-10">
      <XPRewardAnimation amount={quest.xp} visible={rewardVisible} />
      <QuestDetailsHeader
        quest={quest}
        onBack={() => navigate('/quests')}
        onAction={handleAction}
        onFailure={() => setFailureOpen(true)}
      />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.3 }}
          className="min-w-0 space-y-6"
        >
          {quest.status === 'completed' && (
            <QuestCompletionSuccess quest={quest} levelUp={Boolean(levelUp)} />
          )}
          {quest.status === 'failed' && <FailureResult quest={quest} />}
          {quest.status === 'pending_verification' && <VerificationPending />}
          {actionState === 'error' && (
            <Card tone="penalty" className="flex gap-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-penalty-400" />
              <div className="min-w-0">
                <p className="label-caps text-penalty-300">System error</p>
                <p className="mt-1.5 text-sm text-frost-300">
                  {syncError || 'Quest data could not be located.'}
                </p>
              </div>
            </Card>
          )}
          {failureRecorded && quest.status === 'failed' && (
            <SystemMessage
              tone="penalty"
              eyebrow="RANKORA SYSTEM"
              title="MISSION FAILURE RECORDED"
              message="Failure data has been stored for future analysis."
            />
          )}
          <QuestMissionBrief description={quest.description} />
          <QuestObjective quest={quest} />
          <div className="grid min-w-0 gap-6 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <QuestReward quest={quest} />
            <VerificationRequirement required={Boolean(requiresVerification)} />
          </div>
          <SystemMessage
            eyebrow="RANKORA SYSTEM"
            tone={quest.status === 'failed' ? 'penalty' : quest.status === 'pending_verification' ? 'gold' : 'system'}
            title={
              quest.status === 'completed'
                ? 'MISSION COMPLETE'
                : quest.status === 'failed'
                ? 'DATA RECORDED'
                : quest.status === 'pending_verification'
                ? 'AWAITING VERIFICATION'
                : 'OBJECTIVE DETECTED'
            }
            message={
              quest.status === 'completed'
                ? 'Rewards have been added to your profile.'
                : quest.status === 'failed'
                ? 'Failure is feedback. Use the record to improve the next attempt.'
                : quest.status === 'pending_verification'
                ? 'Verification request transmitted.'
                : requiresVerification
                ? 'Gym workout proof photo required before completion.'
                : "Complete this quest before today's cycle ends."
            }
          />
          <FailureHistory history={quest.history} />
        </motion.div>
        <motion.aside
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.14, duration: 0.3 }}
          className="min-w-0 space-y-6"
        >
          <QuestProgress quest={quest} />
          {!requiresVerification &&
          quest.status !== 'failed' &&
          quest.status !== 'pending_verification' ? (
            <Card variant="highlighted" className="p-4">
              <p className="label-caps flex items-center gap-2 text-system-300">
                <span className="h-1.5 w-1.5 rotate-45 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" />
                Completion protocol
              </p>
              <p className="mt-2 text-sm leading-6 text-frost-300">
                Confirm this objective when your mission is complete.
              </p>
            </Card>
          ) : null}
          <QuestInformation quest={quest} />
          <QuestHistory history={quest.history} />
          <FailureSummary questId={quest.id} history={quest.history} />
          {related.length > 0 && <RelatedQuests quests={related} />}
          <Card variant="inset" className="hidden p-4 xl:block">
            <p className="label-caps flex items-center gap-2 text-frost-500">
              <Terminal size={14} />
              Mission protocol
            </p>
            <p className="mt-2 text-sm leading-6 text-frost-500">
              Review the objective parameters before beginning your run.
            </p>
          </Card>
        </motion.aside>
      </div>
      <CompleteQuestModal
        quest={quest}
        open={confirmationOpen}
        processing={processing}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={confirmCompletion}
      />
      <QuestVerificationModal
        key={verificationOpen ? 'verification-open' : 'verification-closed'}
        quest={quest}
        open={verificationOpen}
        onClose={() => {
          setVerificationOpen(false)
          refresh()
        }}
        onVerified={handleVerificationSubmitted}
        onSubmitted={handleVerificationSubmitted}
      />
      <QuestFailureModal
        key={failureOpen ? 'failure-open' : 'failure-closed'}
        quest={quest}
        open={failureOpen}
        processing={failureProcessing}
        submitted={failureRecorded}
        onClose={() => setFailureOpen(false)}
        onConfirm={confirmFailure}
      />
      {levelUp && (
        <Modal
          open
          tone="gold"
          title="LEVEL UP"
          eyebrow="RANKORA SYSTEM"
          onClose={() => setLevelUp(null)}
          footer={<Button onClick={() => setLevelUp(null)}>Continue</Button>}
        >
          <div className="text-center">
            <p className="label-caps text-gold-300">Level</p>
            <p className="mt-1 font-display text-6xl font-bold leading-none text-frost-50 sys-glow">
              {levelUp.newLevel}
            </p>
            <p className="mt-3 text-frost-300">Your power has increased.</p>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="sys-inset px-2 py-3">
                <p className="label-caps text-frost-500">Previous</p>
                <p className="mt-1 font-display text-2xl font-bold text-frost-300">
                  {levelUp.previousLevel}
                </p>
              </div>
              <div className="sys-inset px-2 py-3">
                <p className="label-caps text-frost-500">New level</p>
                <p className="mt-1 font-display text-2xl font-bold text-system-200 sys-glow">
                  {levelUp.newLevel}
                </p>
              </div>
              <div className="sys-inset px-2 py-3">
                <p className="label-caps text-frost-500">EXP gained</p>
                <p className="mt-1 font-mono text-xl font-bold text-gold-300">
                  +{levelUp.gainedXp}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default QuestDetailsPage
